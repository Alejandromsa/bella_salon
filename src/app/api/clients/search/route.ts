import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const docType = searchParams.get('docType');
        const docNumber = searchParams.get('docNumber');

        if (!docNumber) {
            return NextResponse.json({ error: 'Document number is required' }, { status: 400 });
        }

        const [rows]: any = await pool.query(
            'SELECT * FROM clients WHERE doc_type = ? AND doc_number = ? LIMIT 1',
            [docType || 'DNI', docNumber]
        );

        if (rows.length === 0) {
            return NextResponse.json({ exists: false }, { status: 404 });
        }

        const client = rows[0];

        // Format dates to YYYY-MM-DD
        const formatDate = (date: any) => {
            if (!date) return null;
            if (date instanceof Date) {
                return date.toISOString().split('T')[0];
            }
            if (typeof date === 'string' && (date.includes('T') || date.includes('Z'))) {
                return date.split('T')[0];
            }
            return date;
        };

        return NextResponse.json({
            exists: true,
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone,
            docType: client.doc_type,
            docNumber: client.doc_number,
            birthDate: formatDate(client.birth_date),
            address: client.address
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error searching client' }, { status: 500 });
    }
}
