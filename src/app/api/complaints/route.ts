import { NextResponse } from 'next/server';
// Force recompile
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Extract fields matching the DB schema
        const {
            fullName,
            documentType,
            documentNumber,
            address,
            phone,
            email,
            guardianName,
            type, // bien_type
            amountClaimed,
            description, // bien_description
            complaintType,
            detail,
            request: complaintRequest
        } = body;

        const [result] = await pool.query(
            `INSERT INTO complaints (
                full_name, doc_type, doc_number, address, phone, email, 
                guardian_name, bien_type, amount_claimed, bien_description, 
                complaint_type, detail, request, status, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente', NOW())`,
            [
                fullName, documentType, documentNumber, address, phone, email,
                guardianName || null, type, amountClaimed, description,
                complaintType, detail, complaintRequest
            ]
        );

        return NextResponse.json({ success: true, id: (result as any).insertId });
    } catch (error) {
        console.error('Error saving complaint to DB:', error);
        return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const [rows] = await pool.query('SELECT * FROM complaints ORDER BY timestamp DESC');
        return NextResponse.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
    }
}
