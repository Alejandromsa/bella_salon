import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const [rows] = await pool.query('SELECT * FROM promotions');
        const [config]: any = await pool.query('SELECT * FROM loyalty_config WHERE id = 1');
        return NextResponse.json({
            promotions: rows,
            config: config[0]
        });
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching promotions' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const [result]: any = await pool.query(
            'INSERT INTO promotions (name, type, `trigger`, threshold, period, reward, active, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [data.name, data.type, data.trigger, data.threshold, data.period, data.reward, true, data.description]
        );
        return NextResponse.json({ id: result.insertId, ...data });
    } catch (error) {
        return NextResponse.json({ error: 'Error creating promotion' }, { status: 500 });
    }
}
