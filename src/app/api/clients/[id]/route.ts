import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await request.json();

        // Format birth_date for MySQL (DATE type expects YYYY-MM-DD)
        let birthDate = data.birthDate;
        if (birthDate) {
            // If it's in ISO format (contains T or Z), extract just the date part
            if (birthDate.includes('T') || birthDate.includes('Z')) {
                birthDate = birthDate.split('T')[0];
            }
        }

        const query = 'UPDATE clients SET name = ?, email = ?, phone = ?, doc_type = ?, doc_number = ?, birth_date = ?, address = ?, notes = ?, loyalty_points = ?, vip_status = ?, tags = ?, preferred_services = ?, redeemed_promotions = ?, total_visits = ?, total_spent = ?, last_visit = ? WHERE id = ?';
        const values = [
            data.name,
            data.email,
            data.phone,
            data.docType,
            data.docNumber,
            birthDate || null,
            data.address,
            data.notes,
            data.loyaltyPoints || 0,
            data.vipStatus || false,
            JSON.stringify(data.tags || []),
            JSON.stringify(data.preferredServices || []),
            JSON.stringify(data.redeemedPromotions || []),
            data.totalVisits !== undefined ? data.totalVisits : 0,
            data.totalSpent !== undefined ? data.totalSpent : 0,
            data.lastVisit || null,
            id
        ];

        await pool.query(query, values);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error updating client' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await pool.query('DELETE FROM clients WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting client' }, { status: 500 });
    }
}
