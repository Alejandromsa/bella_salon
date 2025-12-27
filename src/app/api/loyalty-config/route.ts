import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const [rows]: any = await pool.query('SELECT * FROM loyalty_config WHERE id = 1');

        if (rows.length === 0) {
            // Return default values if not found
            return NextResponse.json({
                pointsPerSole: 1.0,
                vipThreshold: 1000.0
            });
        }

        const config = rows[0];
        return NextResponse.json({
            pointsPerSole: parseFloat(config.points_per_sole),
            vipThreshold: parseFloat(config.vip_threshold)
        });
    } catch (error) {
        console.error('Error fetching loyalty config:', error);
        return NextResponse.json({ error: 'Error fetching loyalty config' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const { pointsPerSole, vipThreshold } = data;

        // Validate input
        if (pointsPerSole !== undefined && (isNaN(pointsPerSole) || pointsPerSole < 0)) {
            return NextResponse.json({ error: 'Invalid pointsPerSole value' }, { status: 400 });
        }

        if (vipThreshold !== undefined && (isNaN(vipThreshold) || vipThreshold < 0)) {
            return NextResponse.json({ error: 'Invalid vipThreshold value' }, { status: 400 });
        }

        // Build dynamic update query
        const updates: string[] = [];
        const values: any[] = [];

        if (pointsPerSole !== undefined) {
            updates.push('points_per_sole = ?');
            values.push(pointsPerSole);
        }

        if (vipThreshold !== undefined) {
            updates.push('vip_threshold = ?');
            values.push(vipThreshold);
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        values.push(1); // id = 1

        const query = `UPDATE loyalty_config SET ${updates.join(', ')} WHERE id = ?`;
        await pool.query(query, values);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating loyalty config:', error);
        return NextResponse.json({
            error: 'Error updating loyalty config',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
