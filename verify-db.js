// Script para verificar el esquema de la base de datos
require('dotenv').config();
const mysql = require('mysql2/promise');

async function verifyDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'bella_salon'
    });

    try {
        console.log('✓ Conectado a la base de datos');

        // Verificar tabla staff
        const [columns] = await connection.query(
            'SHOW COLUMNS FROM staff'
        );

        console.log('\n📋 Columnas de la tabla staff:');
        columns.forEach(col => {
            console.log(`  - ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
        });

        // Intentar un INSERT de prueba (sin ejecutar)
        const testData = {
            name: 'Test',
            role: 'Test Role',
            email: null,
            phone: null,
            bio: null,
            specialties: JSON.stringify(['Test']),
            image: null,
            active: true,
            schedule: JSON.stringify({ weeklySchedule: {} }),
            vacation_days: JSON.stringify([]),
            exceptions: JSON.stringify([]),
            works_holidays: false
        };

        console.log('\n✓ Test data preparado correctamente');
        console.log('\n📝 Para probar la inserción, ejecuta:');
        console.log('   node verify-db.js --test-insert');

        if (process.argv.includes('--test-insert')) {
            const [result] = await connection.query(
                'INSERT INTO staff (name, role, email, phone, bio, specialties, image, active, schedule, vacation_days, exceptions, works_holidays) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    testData.name,
                    testData.role,
                    testData.email,
                    testData.phone,
                    testData.bio,
                    testData.specialties,
                    testData.image,
                    testData.active,
                    testData.schedule,
                    testData.vacation_days,
                    testData.exceptions,
                    testData.works_holidays
                ]
            );
            console.log('\n✅ INSERT de prueba exitoso! ID:', result.insertId);

            // Eliminar el registro de prueba
            await connection.query('DELETE FROM staff WHERE id = ?', [result.insertId]);
            console.log('✓ Registro de prueba eliminado');
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.code === 'ER_NO_SUCH_TABLE') {
            console.log('\n💡 La tabla "staff" no existe. Ejecuta el script database.sql:');
            console.log('   mysql -u root -p bella_salon < database.sql');
        }
        process.exit(1);
    } finally {
        await connection.end();
    }
}

verifyDatabase();
