import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const results = [];

        const checkAndAddColumn = async (table: string, column: string, definition: string) => {
            const [columns]: any = await pool.query(`SHOW COLUMNS FROM ${table} LIKE '${column}'`);
            if (columns.length === 0) {
                await pool.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
                return `Added ${column} to ${table}`;
            }
            return `${column} already exists in ${table}`;
        };

        results.push(await checkAndAddColumn('appointments', 'phone', 'VARCHAR(50) AFTER client_name'));
        results.push(await checkAndAddColumn('services', 'description', 'TEXT AFTER staff_ids'));
        results.push(await checkAndAddColumn('services', 'featured', 'BOOLEAN DEFAULT FALSE AFTER description'));

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
