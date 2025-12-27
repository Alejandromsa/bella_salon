
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const updates = [
            {
                name: 'Corte y Estilo',
                image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80'
            },
            {
                name: 'Coloración',
                image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80'
            },
            {
                name: 'Manicura Spa',
                image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80'
            },
            {
                name: 'Facial Glow',
                image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80'
            }
        ];

        for (const up of updates) {
            await pool.query('UPDATE services SET image = ? WHERE name = ?', [up.image, up.name]);
        }

        return NextResponse.json({ success: true, message: "Images updated" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
