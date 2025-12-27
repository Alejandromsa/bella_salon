import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limitStr = searchParams.get('limit') || '10';
        const search = searchParams.get('search') || '';

        let query = 'SELECT * FROM appointments';
        let countQuery = 'SELECT COUNT(*) as total FROM appointments';
        const queryParams: any[] = [];

        if (search) {
            // Check if search is numeric (for ID lookup)
            if (!isNaN(Number(search))) {
                query += ' WHERE id = ?';
                countQuery += ' WHERE id = ?';
                queryParams.push(search);
            } else {
                const searchPattern = `%${search}%`;
                query += ' WHERE client_name LIKE ? OR phone LIKE ? OR service_name LIKE ? OR staff_name LIKE ?';
                countQuery += ' WHERE client_name LIKE ? OR phone LIKE ? OR service_name LIKE ? OR staff_name LIKE ?';
                queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
            }
        }

        query += ' ORDER BY date DESC';

        if (limitStr !== '-1') {
            const limit = parseInt(limitStr);
            const offset = (page - 1) * limit;
            query += ' LIMIT ? OFFSET ?';
            queryParams.push(limit, offset);
        }

        const [rows]: any = await pool.query(query, queryParams);

        // Adjust slice for count query based on search type
        let countParams = queryParams;
        if (search) {
            const isIdSearch = !isNaN(Number(search));
            // If ID search, we just used 1 param. If text, we used 4.
            // If no search, 0.
            // Since we append LIMIT/OFFSET at the end of queryParams:
            const paramsCount = isIdSearch ? 1 : 4;
            countParams = queryParams.slice(0, paramsCount);
        } else {
            countParams = [];
        }

        const [totalRows]: any = await pool.query(countQuery, countParams);
        const total = totalRows[0].total;
        const currentLimit = limitStr === '-1' ? total : parseInt(limitStr);

        const mappedRows = rows.map((row: any) => {
            const dateObj = new Date(row.date);
            return {
                id: row.id,
                clientId: row.client_id,
                clientName: row.client_name,
                service: row.service_name,
                staff: row.staff_name,
                date: dateObj.toISOString().split('T')[0],
                time: dateObj.toTimeString().substring(0, 5),
                status: row.status,
                phone: row.phone || 'N/A',
                notes: row.notes
            };
        });

        return NextResponse.json({
            data: mappedRows,
            pagination: {
                total,
                page,
                limit: currentLimit,
                totalPages: Math.ceil(total / currentLimit) || 1
            }
        });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return NextResponse.json({ error: 'Error fetching appointments' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Format date properly for MySQL
        let finalDate = data.date;

        // If date contains 'T' it's already in ISO format, just replace T with space and remove Z
        if (data.date && data.date.includes('T')) {
            finalDate = data.date.replace('T', ' ').replace('Z', '').split('.')[0];
        }
        // If we have separate date and time, combine them
        else if (data.time) {
            const timeFormatted = data.time.length === 5 ? `${data.time}:00` : data.time;
            finalDate = `${data.date} ${timeFormatted}`;
        }

        const [result]: any = await pool.query(
            'INSERT INTO appointments (client_id, client_name, phone, service_id, service_name, staff_id, staff_name, date, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                data.clientId || data.client_id || null,
                data.clientName || data.client_name,
                data.phone,
                data.serviceId || data.service_id || null,
                data.serviceName || data.service_name || data.service,
                data.staffId || data.staff_id || null,
                data.staffName || data.staff_name || data.staff,
                finalDate,
                data.status || 'Pendiente',
                data.notes || null
            ]
        );
        return NextResponse.json({ id: result.insertId, ...data });
    } catch (error) {
        console.error("Error creating appointment:", error);
        return NextResponse.json({ error: 'Error creating appointment' }, { status: 500 });
    }
}
