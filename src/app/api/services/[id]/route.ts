import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await request.json();

        const query = 'UPDATE services SET name = ?, category = ?, price = ?, duration = ?, active = ?, image = ?, staff_ids = ?, description = ?, featured = ? WHERE id = ?';
        const values = [
            data.name,
            data.category,
            data.price,
            data.duration,
            data.active === undefined ? true : data.active,
            data.image,
            JSON.stringify(data.staffIds || data.assignedStaff || []),
            data.description || '',
            data.featured || false,
            id
        ];

        await pool.query(query, values);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error updating service' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await pool.query('DELETE FROM services WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting service' }, { status: 500 });
    }
}
