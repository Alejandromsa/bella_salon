import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    let connection;
    try {
        const { id } = await params;
        const data = await request.json();

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Get current appointment state to check if status is actually changing to 'Completada'
        const [currentRows]: any = await connection.execute('SELECT status, client_id, service_id FROM appointments WHERE id = ?', [id]);
        if (currentRows.length === 0) {
            await connection.rollback();
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }

        const oldStatus = currentRows[0].status;
        const newStatus = data.status;
        const clientId = data.clientId || data.client_id || currentRows[0].client_id;
        const serviceId = data.serviceId || data.service_id || currentRows[0].service_id;

        // Helper to format date for MySQL
        const formatDateForMySQL = (d: string, t?: string) => {
            if (!d) return new Date().toISOString().slice(0, 19).replace('T', ' ');
            if (t) return `${d} ${t.length === 5 ? t + ':00' : t}`;
            if (d.includes('T')) return d.slice(0, 19).replace('T', ' ');
            return d;
        };

        const finalDate = formatDateForMySQL(data.date, data.time);

        // 2. Update the appointment
        const query = 'UPDATE appointments SET client_id = ?, client_name = ?, phone = ?, service_id = ?, service_name = ?, staff_id = ?, staff_name = ?, date = ?, status = ?, notes = ? WHERE id = ?';
        const values = [
            clientId || null,
            data.clientName || data.client_name || null,
            data.phone || null,
            serviceId || null,
            data.serviceName || data.service_name || data.service || null,
            data.staffId || data.staff_id || null,
            data.staffName || data.staff_name || data.staff || null,
            finalDate,
            newStatus || 'Pendiente',
            data.notes || null,
            id
        ];
        // console.log("Executing Update:", query, values); 
        await connection.execute(query, values);

        // 3. Logic for Loyalty Automation
        if (newStatus === 'Completada' && oldStatus !== 'Completada' && clientId) {
            const [serviceRows]: any = await connection.execute('SELECT price FROM services WHERE id = ?', [serviceId]);
            const price = serviceRows.length > 0 ? parseFloat(serviceRows[0].price) : 0;

            const [configRows]: any = await connection.execute('SELECT points_per_sole FROM loyalty_config WHERE id = 1');
            const pointsPerSole = configRows.length > 0 ? parseFloat(configRows[0].points_per_sole) : 1;

            const earnedPoints = Math.floor(price * pointsPerSole);

            await connection.execute(
                `UPDATE clients SET 
                     total_visits = total_visits + 1, 
                     total_spent = total_spent + ?, 
                     loyalty_points = loyalty_points + ?,
                     last_visit = CURDATE()
                 WHERE id = ?`,
                [price, earnedPoints, clientId]
            );
        }

        await connection.commit();
        return NextResponse.json({ success: true });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error updating appointment with loyalty:", error);
        return NextResponse.json({ error: 'Error updating appointment', details: (error as any).message }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await pool.query('DELETE FROM appointments WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting appointment' }, { status: 500 });
    }
}
