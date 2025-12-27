import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        // Obtener los valores ENUM del campo status de la tabla appointments
        const [rows]: any = await pool.query(`
            SELECT COLUMN_TYPE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'appointments'
            AND COLUMN_NAME = 'status'
        `);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'No se encontró la columna status' }, { status: 404 });
        }

        // El resultado viene como "enum('Pendiente','Confirmada','Cancelada','Completada')"
        const enumString = rows[0].COLUMN_TYPE;

        // Extraer los valores del ENUM
        const match = enumString.match(/enum\((.*)\)/i);
        if (!match) {
            return NextResponse.json({ error: 'Formato ENUM inválido' }, { status: 500 });
        }

        // Parsear los valores y quitar las comillas
        const statuses = match[1]
            .split(',')
            .map((s: string) => s.trim().replace(/'/g, ''));

        // Mapeo de estados a colores e iconos
        const statusConfig: any = {
            'Pendiente': { color: 'yellow', icon: '⏱', label: 'Pendientes' },
            'Confirmada': { color: 'blue', icon: '📅', label: 'Confirmadas' },
            'Cancelada': { color: 'red', icon: '✗', label: 'Canceladas' },
            'Completada': { color: 'green', icon: '✓', label: 'Completadas' }
        };

        const result = statuses.map((status: string) => ({
            value: status,
            label: statusConfig[status]?.label || status,
            color: statusConfig[status]?.color || 'gray',
            icon: statusConfig[status]?.icon || '📋'
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching appointment statuses:', error);
        return NextResponse.json({ error: 'Error al obtener estados' }, { status: 500 });
    }
}
