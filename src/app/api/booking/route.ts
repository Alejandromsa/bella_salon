import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    let connection;
    try {
        const body = await request.json();

        if (!body.name || !body.date || !body.phone || !body.service) {
            return NextResponse.json(
                { success: false, message: "Faltan datos requeridos." },
                { status: 400 }
            );
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Search for or create client
            let clientId: number | null = null;
            const docTypeMapped = body.docType === 'PASAPORTE' ? 'Pasaporte' : body.docType || 'DNI';

            const [existingClients]: any = await connection.execute(
                'SELECT id FROM clients WHERE phone = ? OR (doc_number = ? AND doc_number IS NOT NULL AND doc_number != "") LIMIT 1',
                [body.phone, body.docNumber || '']
            );

            // Format birth_date for MySQL (DATE type expects YYYY-MM-DD)
            let birthDate = body.birthDate;
            if (birthDate) {
                // If it's in ISO format (contains T or Z), extract just the date part
                if (birthDate.includes('T') || birthDate.includes('Z')) {
                    birthDate = birthDate.split('T')[0];
                }
            }

            if (existingClients.length > 0) {
                clientId = existingClients[0].id;
                // Update client info if provided (only update fields that are provided)
                await connection.execute(
                    'UPDATE clients SET name = ?, email = ?, doc_type = ?, doc_number = ?, birth_date = COALESCE(?, birth_date), address = COALESCE(?, address) WHERE id = ?',
                    [body.name, body.email || null, docTypeMapped, body.docNumber || null, birthDate || null, body.address || null, clientId]
                );
            } else {
                // Create new client with all available information
                const [newClient]: any = await connection.execute(
                    'INSERT INTO clients (name, email, phone, doc_type, doc_number, birth_date, address, registration_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [body.name, body.email || null, body.phone, docTypeMapped, body.docNumber || null, birthDate || null, body.address || null, new Date().toISOString().split('T')[0]]
                );
                clientId = newClient.insertId;
            }

            // 2. Check Availability (Prevent double-booking)
            const serviceId = parseInt(body.service) || null;
            const staffId = body.staffId && body.staffId !== '0' ? parseInt(body.staffId) : null;
            const appointmentDateTime = `${body.date} ${body.time}:00`;

            if (staffId) {
                // Get duration of the new service
                const [newSvcRows]: any = await connection.execute('SELECT duration FROM services WHERE id = ?', [serviceId]);
                const newDuration = newSvcRows.length > 0 ? parseInt(newSvcRows[0].duration) || 60 : 60;

                const requestedStart = new Date(appointmentDateTime).getTime();
                const requestedEnd = requestedStart + (newDuration * 60000);

                // Get existing appointments for this staff on this day
                const [existingAppts]: any = await connection.execute(
                    'SELECT date, service_id FROM appointments WHERE staff_id = ? AND DATE(date) = ? AND status != "Cancelada"',
                    [staffId, body.date]
                );

                for (const appt of existingAppts) {
                    const [svcRows]: any = await connection.execute('SELECT duration FROM services WHERE id = ?', [appt.service_id]);
                    const duration = svcRows.length > 0 ? parseInt(svcRows[0].duration) || 60 : 60;

                    const existingStart = new Date(appt.date).getTime();
                    const existingEnd = existingStart + (duration * 60000);

                    // Overlap check
                    if (requestedStart < existingEnd && requestedEnd > existingStart) {
                        await connection.rollback();
                        return NextResponse.json({
                            success: false,
                            message: "El especialista ya tiene una reserva en este horario. Por favor elige otra hora u otro especialista."
                        }, { status: 409 });
                    }
                }
            }

            // 3. Create the appointment
            const query = 'INSERT INTO appointments (client_id, client_name, phone, service_id, service_name, staff_id, staff_name, date, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

            const values = [
                clientId,
                body.name,
                body.phone,
                serviceId,
                body.serviceName || body.service,
                staffId,
                body.staff || 'Cualquiera',
                appointmentDateTime,
                'Pendiente',
                body.preferredContactTime ? `Contacto preferido: ${body.preferredContactTime}` : null
            ];

            const [appointmentResult]: any = await connection.execute(query, values);

            await connection.commit();

            return NextResponse.json({
                success: true,
                message: "Reserva confirmada correctamente.",
                bookingId: appointmentResult.insertId
            }, { status: 201 });

        } catch (dbError) {
            await connection.rollback();
            console.error("Database Error:", dbError);
            return NextResponse.json({ success: false, message: "Error al guardar en la base de datos." }, { status: 500 });
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { success: false, message: "Error al procesar la reserva." },
            { status: 500 }
        );
    }
}
