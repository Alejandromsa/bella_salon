import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const [rows]: any = await pool.query('SELECT * FROM settings');
        const settings: any = {};
        rows.forEach((row: any) => {
            try {
                settings[row.key] = JSON.parse(row.value);
            } catch (e) {
                settings[row.key] = row.value;
            }
        });
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        // data will be an object of key-value pairs
        for (const [key, value] of Object.entries(data)) {
            await pool.query(
                'INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
                [key, JSON.stringify(value), JSON.stringify(value)]
            );
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error updating settings' }, { status: 500 });
    }
}
