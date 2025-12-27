import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const [rows]: any = await pool.query('SELECT * FROM clients ORDER BY name ASC');

        const mappedRows = rows.map((row: any) => {
            // Format dates to YYYY-MM-DD string to avoid ISO serialization
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

            return {
                ...row,
                tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || []),
                preferredServices: typeof row.preferred_services === 'string' ? JSON.parse(row.preferred_services) : (row.preferred_services || []),
                redeemedPromotions: typeof row.redeemed_promotions === 'string' ? JSON.parse(row.redeemed_promotions) : (row.redeemed_promotions || []),
                registrationDate: formatDate(row.registration_date),
                totalVisits: row.total_visits || 0,
                totalSpent: row.total_spent || 0,
                lastVisit: formatDate(row.last_visit),
                loyaltyPoints: row.loyalty_points || 0,
                vipStatus: row.vip_status || false,
                docType: row.doc_type,
                docNumber: row.doc_number,
                birthDate: formatDate(row.birth_date)
            };
        });

        return NextResponse.json(mappedRows);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching clients' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Format birth_date for MySQL (DATE type expects YYYY-MM-DD)
        let birthDate = data.birthDate;
        if (birthDate) {
            // If it's in ISO format (contains T or Z), extract just the date part
            if (birthDate.includes('T') || birthDate.includes('Z')) {
                birthDate = birthDate.split('T')[0];
            }
        }

        const [result]: any = await pool.query(
            'INSERT INTO clients (name, email, phone, doc_type, doc_number, birth_date, address, registration_date, notes, loyalty_points, vip_status, tags, preferred_services, redeemed_promotions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                data.name,
                data.email,
                data.phone,
                data.docType || 'DNI',
                data.docNumber,
                birthDate || null,
                data.address,
                new Date().toISOString().split('T')[0],
                data.notes,
                data.loyaltyPoints || 0,
                data.vipStatus || false,
                JSON.stringify(data.tags || []),
                JSON.stringify(data.preferredServices || []),
                JSON.stringify([])
            ]
        );
        return NextResponse.json({ id: result.insertId, ...data });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error creating client' }, { status: 500 });
    }
}
