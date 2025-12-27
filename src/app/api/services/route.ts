import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const [rows]: any = await pool.query('SELECT * FROM services ORDER BY category, name');
        const mappedRows = rows.map((row: any) => ({
            ...row,
            price: parseFloat(row.price) || 0,
            assignedStaff: typeof row.staff_ids === 'string' ? JSON.parse(row.staff_ids) : (row.staff_ids || [])
        }));
        return NextResponse.json(mappedRows);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching services' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const [result]: any = await pool.query(
            'INSERT INTO services (name, category, price, duration, active, image, staff_ids, description, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                data.name,
                data.category,
                data.price,
                data.duration,
                true,
                data.image,
                JSON.stringify(data.staffIds || data.assignedStaff || []),
                data.description || '',
                data.featured || false
            ]
        );
        return NextResponse.json({ id: result.insertId, ...data });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error creating service' }, { status: 500 });
    }
}
