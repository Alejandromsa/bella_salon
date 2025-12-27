import pool from '@/lib/db';

async function migrate() {
    try {
        console.log("Starting migration...");

        // Add phone to appointments
        await pool.query('ALTER TABLE appointments ADD COLUMN IF NOT EXISTS phone VARCHAR(50) AFTER client_name');
        console.log("Added phone to appointments");

        // Add description to services
        await pool.query('ALTER TABLE services ADD COLUMN IF NOT EXISTS description TEXT AFTER staff_ids');
        console.log("Added description to services");

        // Add featured to services
        await pool.query('ALTER TABLE services ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE AFTER description');
        console.log("Added featured to services");

        console.log("Migration finished successfully!");
    } catch (error) {
        console.error("Migration failed:", error);
    }
}

migrate();
