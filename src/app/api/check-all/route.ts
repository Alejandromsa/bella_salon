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

        // 1. Clients Table - redeemed_promotions
        results.push(await checkAndAddColumn('clients', 'redeemed_promotions', 'JSON AFTER tags'));

        // 2. Promotions Table - Verify consistency
        // Promotions already looked okay but let's be sure.

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
