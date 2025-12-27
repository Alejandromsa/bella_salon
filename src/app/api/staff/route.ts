import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const [rows]: any = await pool.query('SELECT * FROM staff ORDER BY name ASC');
        const mappedRows = rows.map((row: any) => {
            // Parse specialties - puede ser TEXT (string separado por comas) o JSON array
            let specialties = [];
            if (row.specialties) {
                if (typeof row.specialties === 'string') {
                    try {
                        // Intentar parsear como JSON primero
                        specialties = JSON.parse(row.specialties);
                    } catch {
                        // Si falla, asumir que es un string separado por comas
                        specialties = row.specialties.split(',').map((s: string) => s.trim()).filter((s: string) => s);
                    }
                } else {
                    specialties = row.specialties;
                }
            }

            // Parse schedule JSON
            let schedule: any = {};
            if (row.schedule) {
                if (typeof row.schedule === 'string') {
                    try {
                        schedule = JSON.parse(row.schedule);
                    } catch {
                        schedule = {};
                    }
                } else {
                    schedule = row.schedule;
                }
            }

            // Parse vacation_days JSON
            let vacation_days = [];
            if (row.vacation_days) {
                if (typeof row.vacation_days === 'string') {
                    try {
                        vacation_days = JSON.parse(row.vacation_days);
                    } catch {
                        vacation_days = [];
                    }
                } else {
                    vacation_days = row.vacation_days;
                }
            }

            // Parse exceptions JSON
            let exceptions = [];
            if (row.exceptions) {
                if (typeof row.exceptions === 'string') {
                    try {
                        exceptions = JSON.parse(row.exceptions);
                    } catch {
                        exceptions = [];
                    }
                } else {
                    exceptions = row.exceptions;
                }
            }

            return {
                id: row.id,
                name: row.name,
                role: row.role,
                email: row.email || '',
                phone: row.phone || '',
                bio: row.bio || '',
                specialties,
                image: row.image || '',
                active: Boolean(row.active),
                schedule: {
                    weeklySchedule: schedule.weeklySchedule || {},
                    vacations: vacation_days,
                    exceptions: exceptions,
                    worksHolidays: Boolean(row.works_holidays)
                }
            };
        });
        return NextResponse.json(mappedRows);
    } catch (error) {
        console.error('Error fetching staff:', error);
        return NextResponse.json({ error: 'Error fetching staff', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        console.log('Creating staff with data:', {
            name: data.name,
            role: data.role,
            email: data.email,
            phone: data.phone,
            hasSchedule: !!data.schedule
        });

        // Extraer los campos del objeto schedule si existe
        const weeklySchedule = data.schedule?.weeklySchedule || {};
        const vacations = data.schedule?.vacations || [];
        const exceptions = data.schedule?.exceptions || [];
        const worksHolidays = data.schedule?.worksHolidays || false;

        const [result]: any = await pool.query(
            'INSERT INTO staff (name, role, email, phone, bio, specialties, image, active, schedule, vacation_days, exceptions, works_holidays) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                data.name,
                data.role,
                data.email || null,
                data.phone || null,
                data.bio || null,
                JSON.stringify(data.specialties || []),
                data.image || null,
                true,
                JSON.stringify({ weeklySchedule }),
                JSON.stringify(vacations),
                JSON.stringify(exceptions),
                worksHolidays ? 1 : 0
            ]
        );
        return NextResponse.json({ id: result.insertId, ...data });
    } catch (error) {
        console.error('Error creating staff:', error);
        return NextResponse.json({
            error: 'Error creating staff',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
