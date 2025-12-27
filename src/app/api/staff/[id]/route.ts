import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await request.json();

        // Extraer los campos del objeto schedule si existe
        const weeklySchedule = data.schedule?.weeklySchedule || {};
        const vacations = data.schedule?.vacations || [];
        const exceptions = data.schedule?.exceptions || [];
        const worksHolidays = data.schedule?.worksHolidays || false;

        const query = 'UPDATE staff SET name = ?, role = ?, email = ?, phone = ?, bio = ?, specialties = ?, image = ?, active = ?, schedule = ?, vacation_days = ?, exceptions = ?, works_holidays = ? WHERE id = ?';
        const values = [
            data.name,
            data.role,
            data.email,
            data.phone,
            data.bio,
            typeof data.specialties === 'string' ? data.specialties : JSON.stringify(data.specialties),
            data.image,
            data.active ? 1 : 0,
            JSON.stringify({ weeklySchedule }),
            JSON.stringify(vacations),
            JSON.stringify(exceptions),
            worksHolidays ? 1 : 0,
            id
        ];

        await pool.query(query, values);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating staff:', error);
        return NextResponse.json({ error: 'Error updating staff', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await pool.query('DELETE FROM staff WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting staff' }, { status: 500 });
    }
}
