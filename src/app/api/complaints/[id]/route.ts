import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, response_text } = body;

        await pool.query(
            'UPDATE complaints SET status = ?, response_text = ?, response_date = NOW() WHERE id = ?',
            [status, response_text, id]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating complaint:', error);
        return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
    }
}
