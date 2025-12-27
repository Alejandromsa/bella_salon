import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await request.json();

        // If active is not provided, don't update it
        const query = data.active !== undefined
            ? 'UPDATE promotions SET name = ?, type = ?, `trigger` = ?, threshold = ?, period = ?, reward = ?, active = ?, description = ? WHERE id = ?'
            : 'UPDATE promotions SET name = ?, type = ?, `trigger` = ?, threshold = ?, period = ?, reward = ?, description = ? WHERE id = ?';

        const values = data.active !== undefined
            ? [data.name, data.type, data.trigger, data.threshold, data.period, data.reward, data.active, data.description, id]
            : [data.name, data.type, data.trigger, data.threshold, data.period, data.reward, data.description, id];

        await pool.query(query, values);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error updating promotion' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await pool.query('DELETE FROM promotions WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting promotion' }, { status: 500 });
    }
}
