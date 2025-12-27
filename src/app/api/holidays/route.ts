import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const [rows]: any = await pool.query('SELECT date FROM holidays ORDER BY date ASC');
        const holidays = rows.map((row: any) => {
            // Format date to YYYY-MM-DD
            if (row.date instanceof Date) {
                return row.date.toISOString().split('T')[0];
            }
            return row.date;
        });
        return NextResponse.json(holidays);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error fetching holidays' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { holidays } = await request.json();

        // Clear existing holidays and insert new ones
        await pool.query('DELETE FROM holidays');

        if (holidays && holidays.length > 0) {
            const values = holidays.map((date: string) => [date]);
            await pool.query(
                'INSERT INTO holidays (date) VALUES ?',
                [values]
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error saving holidays' }, { status: 500 });
    }
}
