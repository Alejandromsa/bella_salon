import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const [tables]: any = await pool.query('SHOW TABLES');
        const schema: any = {};

        for (const table of tables) {
            const tableName = Object.values(table)[0] as string;
            const [columns]: any = await pool.query(`SHOW COLUMNS FROM ${tableName}`);
            schema[tableName] = columns;
        }

        return NextResponse.json(schema);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
