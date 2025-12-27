
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const results = [];

        // Seed Services
        const services = [
            { name: 'Corte y Estilo', category: 'Cabello', price: 40, duration: '60', image: '✂️' },
            { name: 'Coloración', category: 'Cabello', price: 80, duration: '120', image: '🎨' },
            { name: 'Manicura Spa', category: 'Uñas', price: 35, duration: '45', image: '💅' },
            { name: 'Facial Glow', category: 'Rostro', price: 75, duration: '60', image: '✨' }
        ];

        for (const svc of services) {
            const [rows]: any = await pool.query('SELECT id FROM services WHERE name = ?', [svc.name]);
            if (rows.length === 0) {
                await pool.query(
                    'INSERT INTO services (name, category, price, duration, image, active) VALUES (?, ?, ?, ?, ?, ?)',
                    [svc.name, svc.category, svc.price, svc.duration, svc.image, true]
                );
                results.push(`Inserted Service: ${svc.name}`);
            }
        }

        // Seed Staff
        const staff = [
            { name: 'Ana García', role: 'Master Stylist', bio: 'Experta en cortes modernos.' },
            { name: 'Carlos Ruiz', role: 'Colorista', bio: 'Especialista en balayage.' },
            { name: 'Elena Torres', role: 'Esteticista', bio: 'Cuidado de la piel.' }
        ];

        for (const member of staff) {
            const [rows]: any = await pool.query('SELECT id FROM staff WHERE name = ?', [member.name]);
            if (rows.length === 0) {
                await pool.query(
                    'INSERT INTO staff (name, role, active, bio) VALUES (?, ?, ?, ?)',
                    [member.name, member.role, true, member.bio]
                );
                results.push(`Inserted Staff: ${member.name}`);
            }
        }

        // Link services to staff (optional, purely for completeness if needed)
        // For now, let's assume they can do all services or skip logic. 
        // Logic in route.ts doesn't enforce staff-service capability check, just overlap.

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
