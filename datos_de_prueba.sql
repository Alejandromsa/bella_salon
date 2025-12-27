-- ============================================================================
-- BELLA SALON - SCRIPT DE DATOS SINTÉTICOS
-- 2 MESES DE OPERACIONES: Noviembre - Diciembre 2025
-- ============================================================================

USE bella_salon;

-- Limpiar datos existentes
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE redemptions;
TRUNCATE TABLE appointments;
TRUNCATE TABLE complaints;
TRUNCATE TABLE clients;
TRUNCATE TABLE services;
TRUNCATE TABLE staff;
TRUNCATE TABLE promotions;
TRUNCATE TABLE holidays;
TRUNCATE TABLE loyalty_config;
TRUNCATE TABLE settings;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- CONFIGURACIÓN DEL SISTEMA
-- ============================================================================

-- Loyalty Config
INSERT INTO loyalty_config (id, points_per_sole, vip_threshold) 
VALUES (1, 1.50, 1200.00);

-- Settings
INSERT INTO settings (`key`, `value`) VALUES
('salon_name', 'Bella Salon & Spa'),
('address', 'Av. Arequipa 2450, Lince, Lima'),
('phone', '+51 987 654 321'),
('email', 'info@bellasalon.pe'),
('opening_hours', '{"lunes": "09:00-20:00", "martes": "09:00-20:00", "miercoles": "09:00-20:00", "jueves": "09:00-20:00", "viernes": "09:00-21:00", "sabado": "09:00-21:00", "domingo": "10:00-18:00"}'),
('currency', 'PEN'),
('timezone', 'America/Lima'),
('max_advance_booking_days', '60'),
('cancellation_hours', '24');

-- Feriados
INSERT INTO holidays (date) VALUES
('2025-11-01'),  -- Todos los Santos
('2025-12-08'),  -- Inmaculada Concepción
('2025-12-25'),  -- Navidad
('2025-01-01');  -- Año Nuevo

-- ============================================================================
-- STAFF (Personal del Salón)
-- ============================================================================

INSERT INTO staff (name, role, email, phone, bio, specialties, active, schedule, works_holidays) VALUES
('María Fernández', 'Estilista Senior', 'maria.fernandez@bellasalon.pe', '+51 987 111 001', 'Estilista con 12 años de experiencia especializada en cortes modernos y tratamientos capilares.', 'Cortes, Coloración, Tratamientos Capilares', 1, '{"lunes": {"start": "09:00", "end": "18:00"}, "martes": {"start": "09:00", "end": "18:00"}, "miercoles": {"start": "09:00", "end": "18:00"}, "jueves": {"start": "09:00", "end": "18:00"}, "viernes": {"start": "09:00", "end": "18:00"}, "sabado": {"start": "09:00", "end": "17:00"}}', 0),
('Carlos Ramos', 'Barbero Profesional', 'carlos.ramos@bellasalon.pe', '+51 987 111 002', 'Barbero especializado en cortes masculinos clásicos y modernos.', 'Cortes de Caballero, Afeitado Clásico, Barba', 1, '{"lunes": {"start": "10:00", "end": "19:00"}, "martes": {"start": "10:00", "end": "19:00"}, "miercoles": {"start": "10:00", "end": "19:00"}, "jueves": {"start": "10:00", "end": "19:00"}, "viernes": {"start": "10:00", "end": "20:00"}, "sabado": {"start": "10:00", "end": "20:00"}}', 1),
('Ana Gutiérrez', 'Manicurista', 'ana.gutierrez@bellasalon.pe', '+51 987 111 003', 'Experta en nail art y cuidado de manos y pies.', 'Manicure, Pedicure, Nail Art, Uñas Gel', 1, '{"lunes": {"start": "09:00", "end": "17:00"}, "martes": {"start": "09:00", "end": "17:00"}, "miercoles": {"start": "09:00", "end": "17:00"}, "jueves": {"start": "09:00", "end": "17:00"}, "viernes": {"start": "09:00", "end": "18:00"}, "sabado": {"start": "09:00", "end": "18:00"}, "domingo": {"start": "10:00", "end": "16:00"}}', 0),
('Patricia López', 'Cosmetóloga', 'patricia.lopez@bellasalon.pe', '+51 987 111 004', 'Especialista en tratamientos faciales y corporales.', 'Limpieza Facial, Tratamientos Anti-edad, Masajes', 1, '{"martes": {"start": "10:00", "end": "19:00"}, "miercoles": {"start": "10:00", "end": "19:00"}, "jueves": {"start": "10:00", "end": "19:00"}, "viernes": {"start": "10:00", "end": "19:00"}, "sabado": {"start": "10:00", "end": "18:00"}}', 0),
('Roberto Silva', 'Estilista', 'roberto.silva@bellasalon.pe', '+51 987 111 005', 'Estilista creativo con enfoque en tendencias actuales.', 'Cortes, Peinados, Mechas', 1, '{"lunes": {"start": "11:00", "end": "20:00"}, "martes": {"start": "11:00", "end": "20:00"}, "miercoles": {"start": "11:00", "end": "20:00"}, "jueves": {"start": "11:00", "end": "20:00"}, "viernes": {"start": "11:00", "end": "21:00"}, "sabado": {"start": "09:00", "end": "21:00"}}', 1),
('Lucía Torres', 'Maquilladora', 'lucia.torres@bellasalon.pe', '+51 987 111 006', 'Maquilladora profesional para eventos sociales y novias.', 'Maquillaje Social, Maquillaje de Novias, Peinados', 1, '{"miercoles": {"start": "10:00", "end": "18:00"}, "jueves": {"start": "10:00", "end": "18:00"}, "viernes": {"start": "10:00", "end": "20:00"}, "sabado": {"start": "08:00", "end": "20:00"}, "domingo": {"start": "08:00", "end": "18:00"}}', 0);

-- ============================================================================
-- SERVICIOS
-- ============================================================================

INSERT INTO services (name, category, price, duration, active, staff_ids, description, featured) VALUES
-- Servicios de Cabello
('Corte de Cabello Dama', 'Cabello', 45.00, '45 minutos', 1, '[1, 5]', 'Corte profesional adaptado a tu estilo y tipo de cabello', 1),
('Corte de Cabello Caballero', 'Cabello', 35.00, '30 minutos', 1, '[2, 5]', 'Corte masculino clásico o moderno', 1),
('Tinte Completo', 'Cabello', 120.00, '2 horas', 1, '[1]', 'Coloración completa con productos de alta calidad', 1),
('Mechas Balayage', 'Cabello', 180.00, '3 horas', 1, '[1, 5]', 'Técnica de mechas naturales efecto degradado', 1),
('Keratina Brasileña', 'Cabello', 250.00, '4 horas', 1, '[1]', 'Tratamiento alisador con keratina de larga duración', 1),
('Tratamiento Capilar Intensivo', 'Cabello', 80.00, '1 hora', 1, '[1, 5]', 'Hidratación profunda para cabello maltratado', 0),
('Peinado para Evento', 'Cabello', 70.00, '1 hora', 1, '[1, 5, 6]', 'Peinado profesional para fiestas o eventos especiales', 0),
('Alisado Progresivo', 'Cabello', 200.00, '3.5 horas', 1, '[1]', 'Tratamiento alisador progresivo sin formol', 0),

-- Servicios de Barbería
('Afeitado Clásico', 'Barbería', 40.00, '30 minutos', 1, '[2]', 'Afeitado tradicional con toalla caliente', 0),
('Arreglo de Barba', 'Barbería', 30.00, '20 minutos', 1, '[2]', 'Perfilado y arreglo profesional de barba', 0),

-- Servicios de Uñas
('Manicure Clásico', 'Uñas', 35.00, '45 minutos', 1, '[3]', 'Cuidado completo de manos con esmaltado', 1),
('Manicure Gel', 'Uñas', 55.00, '1 hora', 1, '[3]', 'Manicure con esmaltado en gel de larga duración', 1),
('Pedicure Spa', 'Uñas', 60.00, '1 hora', 1, '[3]', 'Tratamiento completo de pies con exfoliación y masaje', 1),
('Uñas Acrílicas', 'Uñas', 90.00, '1.5 horas', 1, '[3]', 'Aplicación de uñas acrílicas con diseño', 0),
('Nail Art Premium', 'Uñas', 25.00, '30 minutos', 1, '[3]', 'Diseño artístico en uñas (adicional al servicio base)', 0),

-- Servicios de Estética
('Limpieza Facial Profunda', 'Estética', 85.00, '1 hora', 1, '[4]', 'Limpieza profunda con extracción y mascarilla', 1),
('Tratamiento Anti-edad', 'Estética', 150.00, '1.5 horas', 1, '[4]', 'Tratamiento facial rejuvenecedor con productos premium', 0),
('Masaje Relajante', 'Estética', 110.00, '1 hora', 1, '[4]', 'Masaje corporal con aceites esenciales', 1),
('Depilación Cejas', 'Estética', 15.00, '15 minutos', 1, '[3, 4]', 'Perfilado profesional de cejas', 0),
('Depilación Facial Completa', 'Estética', 35.00, '30 minutos', 1, '[4]', 'Depilación de rostro con cera', 0),

-- Servicios de Maquillaje
('Maquillaje Social', 'Maquillaje', 80.00, '1 hora', 1, '[6]', 'Maquillaje para eventos diurnos o nocturnos', 1),
('Maquillaje de Novia', 'Maquillaje', 200.00, '2 horas', 1, '[6]', 'Maquillaje completo para novias con prueba previa', 1),

-- Paquetes
('Paquete Novia Completo', 'Paquetes', 450.00, '5 horas', 1, '[1, 6]', 'Incluye: peinado, maquillaje y manicure para el día especial', 1),
('Paquete Spa Relax', 'Paquetes', 220.00, '3 horas', 1, '[3, 4]', 'Incluye: limpieza facial, masaje y pedicure spa', 1),
('Paquete Renovación Total', 'Paquetes', 180.00, '3 horas', 1, '[1, 3]', 'Incluye: corte, tratamiento capilar y manicure gel', 0);

-- ============================================================================
-- PROMOCIONES
-- ============================================================================

INSERT INTO promotions (name, type, `trigger`, threshold, period, reward, active, description) VALUES
('Cliente Frecuente Oro', 'discount', 'visits', 5, 'month', '20% descuento en próxima visita', 1, 'Obtén 20% de descuento al alcanzar 5 visitas en el mes'),
('Acumulador de Puntos Premium', 'free_service', 'points', 500, 'total', 'Manicure Clásico Gratis', 1, 'Canjea 500 puntos por un manicure clásico gratis'),
('VIP Spa Experience', 'free_service', 'points', 1000, 'total', 'Masaje Relajante Gratis', 1, 'Canjea 1000 puntos por un masaje relajante gratis'),
('Cliente Elite', 'discount', 'visits', 10, 'total', '30% descuento en servicios premium', 1, 'Al completar 10 visitas totales obtén descuento en servicios premium');

-- ============================================================================
-- CLIENTES (80 clientes para 2 meses)
-- ============================================================================

INSERT INTO clients (name, email, phone, doc_type, doc_number, birth_date, address, registration_date, preferred_services, notes, tags) VALUES
-- Clientes registrados en Octubre (30 clientes)
('Ana María Pérez García', 'ana.perez@gmail.com', '+51 987 234 001', 'DNI', '45678901', '1985-03-15', 'Av. Javier Prado 1250, San Isidro', '2025-10-15', '["Corte de Cabello Dama", "Tinte Completo"]', 'Prefiere tono rubio ceniza', '["Regular"]'),
('Carlos Eduardo Mendoza', 'carlos.mendoza@outlook.com', '+51 987 234 002', 'DNI', '41234567', '1990-07-22', 'Calle Los Olivos 456, Miraflores', '2025-10-18', '["Corte de Cabello Caballero", "Afeitado Clásico"]', 'Cliente puntual', '["Regular"]'),
('María Fernanda Castro', 'mafe.castro@gmail.com', '+51 987 234 003', 'DNI', '47891234', '1995-11-08', 'Jr. Las Begonias 789, San Borja', '2025-10-20', '["Manicure Gel", "Pedicure Spa"]', 'Alérgica a ciertos esmaltes', '["Regular", "Alergias"]'),
('Roberto Alonso Díaz', 'roberto.diaz@hotmail.com', '+51 987 234 004', 'DNI', '42567890', '1988-05-30', 'Av. Arequipa 3450, Lince', '2025-10-22', '["Corte de Cabello Caballero", "Arreglo de Barba"]', NULL, '["Regular"]'),
('Patricia Sofía Rojas', 'paty.rojas@yahoo.com', '+51 987 234 005', 'DNI', '46123789', '1992-09-12', 'Calle San Martín 234, Pueblo Libre', '2025-10-25', '["Limpieza Facial Profunda", "Masaje Relajante"]', 'Piel sensible', '["Regular", "Piel Sensible"]'),
('Jorge Luis Vargas', 'jvargas@gmail.com', '+51 987 234 006', 'DNI', '43678912', '1987-01-25', 'Av. La Marina 2890, San Miguel', '2025-10-28', '["Corte de Cabello Caballero"]', NULL, '["Regular"]'),
('Lucía Valentina Sánchez', 'lucia.sanchez@gmail.com', '+51 987 234 007', 'DNI', '48234567', '1993-06-18', 'Jr. Sucre 567, Barranco', '2025-10-30', '["Mechas Balayage", "Tratamiento Capilar Intensivo"]', 'Cabello teñido', '["Premium"]'),
('Miguel Ángel Torres', 'miguel.torres@outlook.com', '+51 987 234 008', 'CE', 'CE001234', '1991-04-10', 'Av. Aviación 1890, San Borja', '2025-10-10', '["Corte de Cabello Caballero"]', 'Cliente venezolano', '["Regular", "Extranjero"]'),
('Gabriela Ximena Flores', 'gaby.flores@gmail.com', '+51 987 234 009', 'DNI', '44567123', '1989-12-03', 'Calle Los Rosales 345, Surco', '2025-10-12', '["Manicure Clásico", "Pedicure Spa", "Depilación Cejas"]', NULL, '["Regular"]'),
('Fernando José Ramírez', 'fj.ramirez@hotmail.com', '+51 987 234 010', 'DNI', '41789456', '1986-08-27', 'Av. República de Panamá 4567, Surquillo', '2025-10-14', '["Corte de Cabello Caballero", "Arreglo de Barba"]', 'Prefiere corte fade', '["Regular"]'),
('Carla Melissa Guzmán', 'carla.guzman@gmail.com', '+51 987 234 011', 'DNI', '46789234', '1994-02-14', 'Jr. Comandante Espinar 890, Miraflores', '2025-10-16', '["Tinte Completo", "Corte de Cabello Dama"]', 'Tono caoba rojizo', '["Regular"]'),
('Diego Sebastián Paredes', 'diego.paredes@yahoo.com', '+51 987 234 012', 'DNI', '42345678', '1990-10-19', 'Av. Conquistadores 2345, San Isidro', '2025-10-17', '["Corte de Cabello Caballero", "Afeitado Clásico"]', NULL, '["Regular"]'),
('Valeria Daniela Quispe', 'vale.quispe@gmail.com', '+51 987 234 013', 'DNI', '47234890', '1996-07-05', 'Calle Porta 123, La Molina', '2025-10-19', '["Uñas Acrílicas", "Nail Art Premium", "Manicure Gel"]', 'Le gusta diseños florales', '["Regular", "Nail Art"]'),
('Andrés Martín Salazar', 'andres.salazar@outlook.com', '+51 987 234 014', 'DNI', '43567234', '1988-03-28', 'Av. Primavera 5678, Surco', '2025-10-21', '["Corte de Cabello Caballero"]', NULL, '["Regular"]'),
('Daniela Stephanie Morales', 'dani.morales@gmail.com', '+51 987 234 015', 'DNI', '45891267', '1992-11-16', 'Jr. Schell 456, Miraflores', '2025-10-23', '["Keratina Brasileña", "Corte de Cabello Dama"]', 'Cabello muy rizado', '["Premium", "Tratamientos"]'),
('Ricardo Enrique Núñez', 'ricardo.nunez@hotmail.com', '+51 987 234 016', 'DNI', '41456789', '1987-06-09', 'Av. Angamos 3456, Surquillo', '2025-10-24', '["Corte de Cabello Caballero", "Arreglo de Barba"]', NULL, '["Regular"]'),
('Natalia Isabel Herrera', 'natalia.herrera@gmail.com', '+51 987 234 017', 'DNI', '48567123', '1995-01-20', 'Calle Libertad 789, San Isidro', '2025-10-26', '["Limpieza Facial Profunda", "Maquillaje Social"]', 'Piel grasa', '["Regular"]'),
('Oscar Javier Medina', 'oscar.medina@yahoo.com', '+51 987 234 018', 'DNI', '42678345', '1989-09-14', 'Av. Salaverry 2890, Jesús María', '2025-10-27', '["Corte de Cabello Caballero"]', 'Cliente corporativo', '["Regular", "Corporativo"]'),
('Camila Andrea Vega', 'camila.vega@gmail.com', '+51 987 234 019', 'DNI', '46234567', '1993-04-07', 'Jr. Moore 234, Barranco', '2025-10-29', '["Pedicure Spa", "Manicure Gel", "Depilación Facial Completa"]', NULL, '["Regular"]'),
('Javier Antonio Cruz', 'javier.cruz@outlook.com', '+51 987 234 020', 'DNI', '43789123', '1991-12-25', 'Av. El Derby 4567, Surco', '2025-10-31', '["Corte de Cabello Caballero", "Afeitado Clásico"]', NULL, '["Regular"]'),
('Sandra Beatriz Ramos', 'sandra.ramos@gmail.com', '+51 987 234 021', 'DNI', '44123678', '1988-05-11', 'Av. Pardo 1234, Miraflores', '2025-10-05', '["Mechas Balayage", "Tratamiento Anti-edad"]', 'Cliente frecuente, prefiere sábados', '["Premium", "Sábados"]'),
('Luis Fernando Castillo', 'luis.castillo@hotmail.com', '+51 987 234 022', 'DNI', '42890123', '1990-02-28', 'Calle Las Flores 567, San Borja', '2025-10-08', '["Corte de Cabello Caballero"]', NULL, '["Regular"]'),
('Monica Elizabeth Silva', 'monica.silva@yahoo.com', '+51 987 234 023', 'DNI', '47345612', '1994-08-19', 'Jr. Carabaya 890, Cercado de Lima', '2025-10-11', '["Manicure Gel", "Pedicure Spa"]', NULL, '["Regular"]'),
('Eduardo Miguel Vargas', 'eduardo.vargas@gmail.com', '+51 987 234 024', 'DNI', '41567234', '1986-11-03', 'Av. Colonial 2345, Callao', '2025-10-13', '["Corte de Cabello Caballero"]', NULL, '["Regular"]'),
('Isabella Fernanda León', 'isa.leon@outlook.com', '+51 987 234 025', 'DNI', '48123456', '1997-03-15', 'Calle Alcanfores 456, Miraflores', '2025-10-15', '["Tinte Completo", "Corte de Cabello Dama"]', 'Tono balayage caramelo', '["Regular"]'),
('Martín Alejandro Reyes', 'martin.reyes@gmail.com', '+51 987 234 026', 'DNI', '43234789', '1989-07-22', 'Av. Universitaria 5678, Los Olivos', '2025-10-17', '["Corte de Cabello Caballero", "Arreglo de Barba"]', NULL, '["Regular"]'),
('Sofía Carolina Campos', 'sofia.campos@gmail.com', '+51 987 234 027', 'DNI', '46456789', '1992-12-08', 'Jr. Manco Cápac 123, La Victoria', '2025-10-19', '["Keratina Brasileña", "Tratamiento Capilar Intensivo"]', 'Cabello muy dañado por químicos', '["Premium", "Tratamientos"]'),
('Alberto José Paredes', 'alberto.paredes@hotmail.com', '+51 987 234 028', 'CE', 'CE005678', '1985-04-30', 'Av. Brasil 3456, Breña', '2025-10-21', '["Corte de Cabello Caballero"]', 'Cliente colombiano', '["Regular", "Extranjero"]'),
('Adriana Melissa Torres', 'adriana.torres@yahoo.com', '+51 987 234 029', 'DNI', '45678234', '1991-09-17', 'Calle Bolognesi 789, Barranco', '2025-10-23', '["Uñas Acrílicas", "Nail Art Premium"]', 'Diseños geométricos', '["Regular", "Nail Art"]'),
('Francisco Daniel Paz', 'francisco.paz@gmail.com', '+51 987 234 030', 'DNI', '42123890', '1987-01-12', 'Av. Venezuela 2890, Cercado de Lima', '2025-10-25', '["Corte de Cabello Caballero", "Afeitado Clásico"]', NULL, '["Regular"]'),

-- Clientes registrados en Noviembre (25 clientes)
('Renata Ximena Chávez', 'renata.chavez@outlook.com', '+51 987 234 031', 'DNI', '47890456', '1995-06-25', 'Jr. Huallaga 345, Rímac', '2025-11-02', '["Limpieza Facial Profunda", "Depilación Facial Completa"]', NULL, '["Nuevo"]'),
('Sergio Raúl Mendoza', 'sergio.mendoza@gmail.com', '+51 987 234 032', 'DNI', '43345678', '1988-10-08', 'Av. Túpac Amaru 4567, Independencia', '2025-11-04', '["Corte de Cabello Caballero", "Arreglo de Barba"]', NULL, '["Nuevo"]'),
('Pamela Vanessa Rojas', 'pamela.rojas@gmail.com', '+51 987 234 033', 'DNI', '46567123', '1993-03-20', 'Calle 28 de Julio 678, Miraflores', '2025-11-06', '["Maquillaje Social", "Peinado para Evento"]', 'Asiste a eventos frecuentemente', '["Regular", "Eventos"]'),
('Gabriel Arturo Maldonado', 'gabriel.maldonado@hotmail.com', '+51 987 234 034', 'DNI', '41234890', '1990-08-14', 'Av. Petit Thouars 3456, San Isidro', '2025-11-08', '["Corte de Cabello Caballero"]', NULL, '["Nuevo"]'),
('Lorena Patricia Suárez', 'lorena.suarez@yahoo.com', '+51 987 234 035', 'DNI', '48234678', '1996-11-29', 'Jr. Washington 234, Cercado de Lima', '2025-11-10', '["Manicure Clásico", "Pedicure Spa"]', NULL, '["Nuevo"]'),
('Héctor Luis Guerrero', 'hector.guerrero@gmail.com', '+51 987 234 036', 'DNI', '42456123', '1989-02-05', 'Av. Grau 5678, Barranco', '2025-11-12', '["Corte de Cabello Caballero", "Afeitado Clásico"]', NULL, '["Nuevo"]'),
('Cecilia Andrea Bustamante', 'cecilia.bustamante@outlook.com', '+51 987 234 037', 'DNI', '45123789', '1992-07-18', 'Calle Independencia 890, Miraflores', '2025-11-14', '["Mechas Balayage", "Corte de Cabello Dama"]', 'Prefiere tonos fríos', '["Regular"]'),
('Antonio César Villalobos', 'antonio.villalobos@gmail.com', '+51 987 234 038', 'DNI', '43678234', '1987-12-12', 'Av. Alfonso Ugarte 2345, Cercado de Lima', '2025-11-16', '["Corte de Cabello Caballero"]', NULL, '["Nuevo"]'),
('Mariana Lucía Espinoza', 'mariana.espinoza@gmail.com', '+51 987 234 039', 'DNI', '47456890', '1994-05-06', 'Jr. Cusco 456, Cercado de Lima', '2025-11-18', '["Tinte Completo", "Tratamiento Capilar Intensivo"]', NULL, '["Regular"]'),
('Raúl Ernesto Delgado', 'raul.delgado@hotmail.com', '+51 987 234 040', 'DNI', '41789234', '1986-09-23', 'Av. Abancay 3456, Cercado de Lima', '2025-11-20', '["Corte de Cabello Caballero", "Arreglo de Barba"]', 'Prefiere estilo clásico', '["Regular"]'),
('Verónica Isabel Zamora', 'veronica.zamora@yahoo.com', '+51 987 234 041', 'DNI', '46789123', '1991-04-15', 'Calle Tacna 678, Miraflores', '2025-11-22', '["Limpieza Facial Profunda", "Masaje Relajante"]', 'Piel mixta', '["Regular"]'),
('Pablo Andrés Cortez', 'pablo.cortez@gmail.com', '+51 987 234 042', 'DNI', '42890567', '1988-01-28', 'Av. Larco 4567, Miraflores', '2025-11-24', '["Corte de Cabello Caballero"]', NULL, '["Nuevo"]'),
('Claudia Stefanie Mora', 'claudia.mora@outlook.com', '+51 987 234 043', 'DNI', '48345612', '1995-10-11', 'Jr. Lampa 234, Cercado de Lima', '2025-11-26', '["Manicure Gel", "Uñas Acrílicas"]', NULL, '["Regular"]'),
('Gonzalo Martín Ibarra', 'gonzalo.ibarra@gmail.com', '+51 987 234 044', 'DNI', '43123456', '1990-06-07', 'Av. Arenales 5678, Lince', '2025-11-28', '["Corte de Cabello Caballero"]', NULL, '["Nuevo"]'),
('Jimena Carolina Rivas', 'jimena.rivas@gmail.com', '+51 987 234 045', 'DNI', '46234890', '1993-11-19', 'Calle Belén 890, Barranco', '2025-11-05', '["Keratina Brasileña", "Mechas Balayage", "Tratamiento Anti-edad"]', 'Cliente premium, prefiere productos orgánicos', '["Premium", "Orgánico"]'),
('Iván Roberto Cardenas', 'ivan.cardenas@hotmail.com', '+51 987 234 046', 'DNI', '41456234', '1987-03-02', 'Av. Wilson 2345, Cercado de Lima', '2025-11-07', '["Corte de Cabello Caballero", "Arreglo de Barba"]', NULL, '["Nuevo"]'),
('Alejandra Milagros Castro', 'ale.castro@yahoo.com', '+51 987 234 047', 'DNI', '47567345', '1996-08-24', 'Jr. Quilca 456, Cercado de Lima', '2025-11-09', '["Manicure Clásico", "Pedicure Spa", "Depilación Cejas"]', NULL, '["Regular"]'),
('Gustavo Enrique Montalvo', 'gustavo.montalvo@gmail.com', '+51 987 234 048', 'DNI', '42678901', '1989-12-16', 'Av. Garcilaso de la Vega 3456, Cercado de Lima', '2025-11-11', '["Corte de Cabello Caballero", "Afeitado Clásico"]', NULL, '["Nuevo"]'),
('Melissa Gabriela Vargas', 'melissa.vargas@outlook.com', '+51 987 234 049', 'DNI', '45890123', '1992-05-30', 'Calle Ocoña 678, Barranco', '2025-11-13', '["Tinte Completo", "Corte de Cabello Dama"]', 'Tono chocolate', '["Regular"]'),
('Rodrigo Javier Linares', 'rodrigo.linares@gmail.com', '+51 987 234 050', 'DNI', '43234567', '1988-07-09', 'Av. La Paz 4567, Miraflores', '2025-11-15', '["Corte de Cabello Caballero"]', 'Cliente corporativo, agenda viernes', '["Regular", "Corporativo", "Viernes"]'),
('Elena Victoria Medina', 'elena.medina@gmail.com', '+51 987 234 051', 'DNI', '44890123', '1994-10-22', 'Av. Larco 890, Miraflores', '2025-11-17', '["Manicure Gel", "Pedicure Spa"]', NULL, '["Nuevo"]'),
('Tomás Alejandro Ríos', 'tomas.rios@outlook.com', '+51 987 234 052', 'DNI', '41567890', '1989-03-14', 'Calle Schell 234, Miraflores', '2025-11-19', '["Corte de Cabello Caballero"]', NULL, '["Nuevo"]'),
('Daniela Patricia Campos', 'dani.campos@gmail.com', '+51 987 234 053', 'DNI', '47123890', '1995-12-05', 'Jr. Camaná 567, Cercado de Lima', '2025-11-21', '["Limpieza Facial Profunda"]', NULL, '["Nuevo"]'),
('Nicolás Martín Soto', 'nicolas.soto@yahoo.com', '+51 987 234 054', 'DNI', '42345789', '1986-08-18', 'Av. Arequipa 1234, Miraflores', '2025-11-23', '["Corte de Cabello Caballero", "Arreglo de Barba"]', NULL, '["Nuevo"]'),
('Valentina Isabel Cruz', 'valentina.cruz@gmail.com', '+51 987 234 055', 'DNI', '46890234', '1993-05-27', 'Calle Porta 345, San Borja', '2025-11-25', '["Tinte Completo", "Corte de Cabello Dama"]', 'Tono castaño claro', '["Regular"]'),

-- Clientes registrados en Diciembre (25 clientes)
('Emilio Rafael Torres', 'emilio.torres@gmail.com', '+51 987 234 056', 'DNI', '43567123', '1990-11-30', 'Av. Javier Prado 2345, San Isidro', '2025-12-02', '["Corte de Cabello Caballero"]', NULL, '["Nuevo"]'),
('Carolina Sofía Paredes', 'carolina.paredes@outlook.com', '+51 987 234 057', 'DNI', '48123789', '1997-02-11', 'Jr. Ucayali 456, Cercado de Lima', '2025-12-04', '["Manicure Clásico", "Depilación Cejas"]', NULL, '["Nuevo"]'),
('Sebastián David Moreno', 'sebastian.moreno@gmail.com', '+51 987 234 058', 'DNI', '41678234', '1988-09-04', 'Av. Colonial 3456, Callao', '2025-12-06', '["Corte de Cabello Caballero", "Afeitado Clásico"]', NULL, '["Nuevo"]'),
('Andrea Fernanda Lagos', 'andrea.lagos@yahoo.com', '+51 987 234 059', 'DNI', '47234567', '1994-04-16', 'Calle Libertad 678, San Isidro', '2025-12-08', '["Pedicure Spa", "Manicure Gel"]', NULL, '["Nuevo"]'),
('Maximiliano José Rosas', 'max.rosas@gmail.com', '+51 987 234 060', 'DNI', '44567890', '1992-01-23', 'Av. Aviación 4567, San Borja', '2025-12-10', '["Corte de Cabello Caballero"]', NULL, '["Nuevo"]'),
('Francisca Elena Navarro', 'francisca.navarro@gmail.com', '+51 987 234 061', 'DNI', '42789123', '1991-06-08', 'Jr. Ica 890, Cercado de Lima', '2025-12-12', '["Limpieza Facial Profunda", "Masaje Relajante"]', NULL, '["Nuevo"]'),
('Leonardo Gabriel Fuentes', 'leonardo.fuentes@outlook.com', '+51 987 234 062', 'DNI', '46123456', '1987-12-19', 'Av. República 1234, San Isidro', '2025-12-14', '["Corte de Cabello Caballero", "Arreglo de Barba"]', NULL, '["Nuevo"]'),
('Constanza María Herrera', 'constanza.herrera@gmail.com', '+51 987 234 063', 'DNI', '48456789', '1996-07-31', 'Calle Los Pinos 567, Surco', '2025-12-16', '["Tinte Completo", "Tratamiento Capilar Intensivo"]', NULL, '["Nuevo"]'),
('Ignacio Andrés Salinas', 'ignacio.salinas@gmail.com', '+51 987 234 064', 'DNI', '43890234', '1989-10-25', 'Av. Angamos 2345, Surquillo', '2025-12-18', '["Corte de Cabello Caballero"]', NULL, '["Nuevo"]'),
('Beatriz Alejandra Vásquez', 'beatriz.vasquez@yahoo.com', '+51 987 234 065', 'DNI', '45234678', '1993-03-12', 'Jr. Quilca 123, Cercado de Lima', '2025-12-20', '["Manicure Gel", "Uñas Acrílicas"]', NULL, '["Nuevo"]'),
('Matías Fernando Rojas', 'matias.rojas@gmail.com', '+51 987 234 066', 'DNI', '41345789', '1986-05-06', 'Av. Salaverry 3456, Jesús María', '2025-12-01', '["Corte de Cabello Caballero"]', NULL, '["Nuevo"]'),
('Isidora Catalina Muñoz', 'isidora.munoz@outlook.com', '+51 987 234 067', 'DNI', '47678123', '1995-08-17', 'Calle Moore 234, Barranco', '2025-12-03', '["Limpieza Facial Profunda"]', NULL, '["Nuevo"]'),
('Benjamín Esteban Ponce', 'benjamin.ponce@gmail.com', '+51 987 234 068', 'DNI', '42901234', '1990-11-09', 'Av. La Marina 4567, San Miguel', '2025-12-05', '["Corte de Cabello Caballero", "Afeitado Clásico"]', NULL, '["Nuevo"]'),
('Macarena Sofía Figueroa', 'macarena.figueroa@gmail.com', '+51 987 234 069', 'DNI', '46567890', '1994-02-21', 'Jr. Huancavelica 678, Cercado de Lima', '2025-12-07', '["Pedicure Spa", "Depilación Facial Completa"]', NULL, '["Nuevo"]'),
('Augusto Ricardo Peña', 'augusto.pena@yahoo.com', '+51 987 234 070', 'DNI', '48890123', '1988-07-03', 'Av. Brasil 5678, Breña', '2025-12-09', '["Corte de Cabello Caballero"]', NULL, '["Nuevo"]'),
('Florencia Andrea Molina', 'florencia.molina@gmail.com', '+51 987 234 071', 'DNI', '44123567', '1992-09-15', 'Calle San Martín 890, Pueblo Libre', '2025-12-11', '["Mechas Balayage", "Corte de Cabello Dama"]', NULL, '["Nuevo"]'),
('Joaquín Sebastián Ortiz', 'joaquin.ortiz@outlook.com', '+51 987 234 072', 'DNI', '41789567', '1987-04-28', 'Av. Venezuela 1234, Cercado de Lima', '2025-12-13', '["Corte de Cabello Caballero", "Arreglo de Barba"]', NULL, '["Nuevo"]'),
('Antonella Victoria Sandoval', 'antonella.sandoval@gmail.com', '+51 987 234 073', 'DNI', '47345890', '1996-01-10', 'Jr. Lampa 345, Cercado de Lima', '2025-12-15', '["Manicure Clásico", "Nail Art Premium"]', NULL, '["Nuevo"]'),
('Facundo Martín Espinoza', 'facundo.espinoza@gmail.com', '+51 987 234 074', 'DNI', '43234901', '1991-06-22', 'Av. Primavera 2345, Surco', '2025-12-17', '["Corte de Cabello Caballero"]', NULL, '["Nuevo"]'),
('Renata Camila Aguirre', 'renata.aguirre@yahoo.com', '+51 987 234 075', 'DNI', '46678234', '1993-11-04', 'Calle Alcanfores 567, Miraflores', '2025-12-19', '["Limpieza Facial Profunda", "Tratamiento Anti-edad"]', NULL, '["Nuevo"]'),
('Agustín Felipe Romero', 'agustin.romero@gmail.com', '+51 987 234 076', 'DNI', '42456890', '1989-08-16', 'Av. Conquistadores 3456, San Isidro', '2025-12-21', '["Corte de Cabello Caballero"]', NULL, '["Nuevo"]'),
('Catalina Juliana Bravo', 'catalina.bravo@outlook.com', '+51 987 234 077', 'DNI', '48567234', '1995-03-28', 'Jr. Carabaya 123, Cercado de Lima', '2025-12-23', '["Tinte Completo", "Peinado para Evento"]', NULL, '["Nuevo"]'),
('Mateo Ignacio Castro', 'mateo.castro@gmail.com', '+51 987 234 078', 'DNI', '45123678', '1990-10-10', 'Av. Universitaria 4567, Los Olivos', '2025-12-02', '["Corte de Cabello Caballero"]', NULL, '["Nuevo"]'),
('Josefina Martina León', 'josefina.leon@gmail.com', '+51 987 234 079', 'DNI', '41890234', '1994-05-14', 'Calle Los Rosales 678, Surco', '2025-12-04', '["Manicure Gel", "Pedicure Spa"]', NULL, '["Nuevo"]'),
('Santiago Rafael Núñez', 'santiago.nunez@yahoo.com', '+51 987 234 080', 'DNI', '47234123', '1986-12-26', 'Av. El Derby 5678, Surco', '2025-12-06', '["Corte de Cabello Caballero", "Afeitado Clásico"]', NULL, '["Nuevo"]');

-- Nota: Los totales de clientes se actualizarán después de insertar las citas

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
-- ============================================================================
-- BELLA SALON - CITAS (2 MESES)
-- Noviembre - Diciembre 2025
-- ============================================================================

USE bella_salon;

-- ============================================================================
-- CITAS DE NOVIEMBRE 2025
-- ============================================================================

-- Semana 1 de Noviembre (4-9, saltando el 1 que es feriado)
INSERT INTO appointments (client_id, client_name, phone, service_id, service_name, staff_id, staff_name, date, status, notes, created_at) VALUES
(2, 'Carlos Eduardo Mendoza', '+51 987 234 002', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-11-04 10:30:00', 'Completada', NULL, '2025-10-28 14:20:00'),
(5, 'Patricia Sofía Rojas', '+51 987 234 005', 15, 'Limpieza Facial Profunda', 4, 'Patricia López', '2025-11-04 15:00:00', 'Completada', 'Piel sensible', '2025-10-29 09:15:00'),
(9, 'Gabriela Ximena Flores', '+51 987 234 009', 10, 'Manicure Clásico', 3, 'Ana Gutiérrez', '2025-11-05 11:00:00', 'Completada', NULL, '2025-10-30 10:30:00'),
(4, 'Roberto Alonso Díaz', '+51 987 234 004', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-11-05 14:00:00', 'Completada', NULL, '2025-10-31 11:45:00'),
(7, 'Lucía Valentina Sánchez', '+51 987 234 007', 4, 'Mechas Balayage', 1, 'María Fernández', '2025-11-06 09:00:00', 'Completada', 'Cabello teñido', '2025-11-01 08:30:00'),
(1, 'Ana María Pérez García', '+51 987 234 001', 3, 'Tinte Completo', 1, 'María Fernández', '2025-11-06 14:00:00', 'Completada', 'Tono rubio ceniza', '2025-11-02 13:20:00'),
(12, 'Diego Sebastián Paredes', '+51 987 234 012', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-11-07 11:30:00', 'Completada', NULL, '2025-11-03 09:15:00'),
(11, 'Carla Melissa Guzmán', '+51 987 234 011', 1, 'Corte de Cabello Dama', 1, 'María Fernández', '2025-11-07 15:00:00', 'Completada', NULL, '2025-11-04 10:40:00'),
(5, 'Patricia Sofía Rojas', '+51 987 234 005', 17, 'Masaje Relajante', 4, 'Patricia López', '2025-11-08 10:00:00', 'Completada', NULL, '2025-11-05 14:25:00'),
(13, 'Valeria Daniela Quispe', '+51 987 234 013', 13, 'Uñas Acrílicas', 3, 'Ana Gutiérrez', '2025-11-08 14:30:00', 'Completada', 'Diseño floral', '2025-11-06 11:50:00'),
(10, 'Fernando José Ramírez', '+51 987 234 010', 9, 'Arreglo de Barba', 2, 'Carlos Ramos', '2025-11-09 10:00:00', 'Completada', NULL, '2025-11-07 09:30:00'),
(17, 'Natalia Isabel Herrera', '+51 987 234 017', 15, 'Limpieza Facial Profunda', 4, 'Patricia López', '2025-11-09 15:30:00', 'Completada', 'Piel grasa', '2025-11-08 12:15:00'),

-- Semana 2 de Noviembre (11-16)
(8, 'Miguel Ángel Torres', '+51 987 234 008', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-11-11 11:00:00', 'Completada', NULL, '2025-11-09 10:20:00'),
(23, 'Monica Elizabeth Silva', '+51 987 234 023', 11, 'Manicure Gel', 3, 'Ana Gutiérrez', '2025-11-11 14:00:00', 'Completada', NULL, '2025-11-09 15:30:00'),
(2, 'Carlos Eduardo Mendoza', '+51 987 234 002', 8, 'Afeitado Clásico', 2, 'Carlos Ramos', '2025-11-12 10:00:00', 'Completada', NULL, '2025-11-10 09:15:00'),
(6, 'Jorge Luis Vargas', '+51 987 234 006', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-11-12 15:30:00', 'Completada', NULL, '2025-11-10 11:40:00'),
(9, 'Gabriela Ximena Flores', '+51 987 234 009', 12, 'Pedicure Spa', 3, 'Ana Gutiérrez', '2025-11-13 10:30:00', 'Completada', NULL, '2025-11-11 13:25:00'),
(22, 'Luis Fernando Castillo', '+51 987 234 022', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-11-13 14:00:00', 'Completada', NULL, '2025-11-11 16:10:00'),
(31, 'Renata Ximena Chávez', '+51 987 234 031', 15, 'Limpieza Facial Profunda', 4, 'Patricia López', '2025-11-14 11:00:00', 'Completada', NULL, '2025-11-12 10:30:00'),
(14, 'Andrés Martín Salazar', '+51 987 234 014', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-11-14 16:00:00', 'Completada', NULL, '2025-11-12 14:15:00'),
(21, 'Sandra Beatriz Ramos', '+51 987 234 021', 4, 'Mechas Balayage', 1, 'María Fernández', '2025-11-15 09:00:00', 'Completada', 'Prefiere sábados', '2025-11-13 08:30:00'),
(34, 'Gabriel Arturo Maldonado', '+51 987 234 034', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-11-15 10:30:00', 'Completada', NULL, '2025-11-13 09:40:00'),
(12, 'Diego Sebastián Paredes', '+51 987 234 012', 8, 'Afeitado Clásico', 2, 'Carlos Ramos', '2025-11-15 13:00:00', 'Completada', NULL, '2025-11-13 11:20:00'),
(3, 'María Fernanda Castro', '+51 987 234 003', 11, 'Manicure Gel', 3, 'Ana Gutiérrez', '2025-11-16 10:00:00', 'Completada', 'Esmaltes hipoalergénicos', '2025-11-14 09:15:00'),
(38, 'Antonio César Villalobos', '+51 987 234 038', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-11-16 17:00:00', 'Completada', NULL, '2025-11-14 15:30:00'),

-- Semana 3 de Noviembre (18-23)
(10, 'Fernando José Ramírez', '+51 987 234 010', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-11-18 10:00:00', 'Completada', NULL, '2025-11-16 08:45:00'),
(4, 'Roberto Alonso Díaz', '+51 987 234 004', 9, 'Arreglo de Barba', 2, 'Carlos Ramos', '2025-11-18 14:30:00', 'Completada', NULL, '2025-11-16 13:10:00'),
(24, 'Eduardo Miguel Vargas', '+51 987 234 024', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-11-18 16:00:00', 'Completada', NULL, '2025-11-16 14:55:00'),
(2, 'Carlos Eduardo Mendoza', '+51 987 234 002', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-11-19 11:00:00', 'Completada', NULL, '2025-11-17 10:15:00'),
(26, 'Martín Alejandro Reyes', '+51 987 234 026', 9, 'Arreglo de Barba', 2, 'Carlos Ramos', '2025-11-19 14:00:00', 'Completada', NULL, '2025-11-17 12:30:00'),
(40, 'Raúl Ernesto Delgado', '+51 987 234 040', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-11-19 16:30:00', 'Completada', 'Estilo clásico', '2025-11-17 15:45:00'),
(16, 'Ricardo Enrique Núñez', '+51 987 234 016', 9, 'Arreglo de Barba', 2, 'Carlos Ramos', '2025-11-20 10:00:00', 'Completada', NULL, '2025-11-18 09:20:00'),
(30, 'Francisco Daniel Paz', '+51 987 234 030', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-11-20 13:30:00', 'Completada', NULL, '2025-11-18 11:35:00'),
(32, 'Sergio Raúl Mendoza', '+51 987 234 032', 9, 'Arreglo de Barba', 2, 'Carlos Ramos', '2025-11-20 15:00:00', 'Completada', NULL, '2025-11-18 13:50:00'),
(9, 'Gabriela Ximena Flores', '+51 987 234 009', 18, 'Depilación Cejas', 3, 'Ana Gutiérrez', '2025-11-21 10:00:00', 'Completada', NULL, '2025-11-19 08:40:00'),
(25, 'Isabella Fernanda León', '+51 987 234 025', 3, 'Tinte Completo', 1, 'María Fernández', '2025-11-21 14:00:00', 'Completada', 'Balayage caramelo', '2025-11-19 10:15:00'),
(45, 'Jimena Carolina Rivas', '+51 987 234 045', 5, 'Keratina Brasileña', 1, 'María Fernández', '2025-11-22 09:00:00', 'Completada', 'Productos orgánicos', '2025-11-20 08:30:00'),
(1, 'Ana María Pérez García', '+51 987 234 001', 1, 'Corte de Cabello Dama', 1, 'María Fernández', '2025-11-22 14:00:00', 'Completada', NULL, '2025-11-20 11:10:00'),
(18, 'Oscar Javier Medina', '+51 987 234 018', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-11-22 15:00:00', 'Completada', 'Cliente corporativo', '2025-11-20 13:45:00'),
(21, 'Sandra Beatriz Ramos', '+51 987 234 021', 16, 'Tratamiento Anti-edad', 4, 'Patricia López', '2025-11-23 10:00:00', 'Completada', NULL, '2025-11-21 09:15:00'),
(33, 'Pamela Vanessa Rojas', '+51 987 234 033', 7, 'Peinado para Evento', 6, 'Lucía Torres', '2025-11-23 15:00:00', 'Completada', 'Evento corporativo', '2025-11-21 13:20:00'),
(13, 'Valeria Daniela Quispe', '+51 987 234 013', 14, 'Nail Art Premium', 3, 'Ana Gutiérrez', '2025-11-23 17:00:00', 'Completada', 'Diseños florales', '2025-11-21 15:40:00'),

-- Semana 4 de Noviembre (25-30)
(17, 'Natalia Isabel Herrera', '+51 987 234 017', 20, 'Maquillaje Social', 6, 'Lucía Torres', '2025-11-25 11:00:00', 'Completada', 'Evento nocturno', '2025-11-23 09:30:00'),
(31, 'Renata Ximena Chávez', '+51 987 234 031', 19, 'Depilación Facial Completa', 4, 'Patricia López', '2025-11-25 14:00:00', 'Completada', NULL, '2025-11-23 12:15:00'),
(36, 'Héctor Luis Guerrero', '+51 987 234 036', 8, 'Afeitado Clásico', 2, 'Carlos Ramos', '2025-11-25 16:00:00', 'Completada', NULL, '2025-11-23 14:40:00'),
(5, 'Patricia Sofía Rojas', '+51 987 234 005', 15, 'Limpieza Facial Profunda', 4, 'Patricia López', '2025-11-26 10:00:00', 'Completada', 'Piel sensible', '2025-11-24 08:50:00'),
(19, 'Camila Andrea Vega', '+51 987 234 019', 11, 'Manicure Gel', 3, 'Ana Gutiérrez', '2025-11-26 13:00:00', 'Completada', NULL, '2025-11-24 11:25:00'),
(37, 'Cecilia Andrea Bustamante', '+51 987 234 037', 4, 'Mechas Balayage', 1, 'María Fernández', '2025-11-26 15:00:00', 'Completada', 'Tonos fríos', '2025-11-24 13:35:00'),
(27, 'Sofía Carolina Campos', '+51 987 234 027', 6, 'Tratamiento Capilar Intensivo', 1, 'María Fernández', '2025-11-27 09:00:00', 'Completada', 'Cabello muy dañado', '2025-11-25 10:15:00'),
(29, 'Adriana Melissa Torres', '+51 987 234 029', 13, 'Uñas Acrílicas', 3, 'Ana Gutiérrez', '2025-11-27 11:00:00', 'Completada', 'Diseños geométricos', '2025-11-25 13:20:00'),
(39, 'Mariana Lucía Espinoza', '+51 987 234 039', 3, 'Tinte Completo', 1, 'María Fernández', '2025-11-27 14:00:00', 'Completada', NULL, '2025-11-25 15:40:00'),
(41, 'Verónica Isabel Zamora', '+51 987 234 041', 17, 'Masaje Relajante', 4, 'Patricia López', '2025-11-27 16:00:00', 'Completada', 'Piel mixta', '2025-11-25 17:10:00'),
(7, 'Lucía Valentina Sánchez', '+51 987 234 007', 6, 'Tratamiento Capilar Intensivo', 1, 'María Fernández', '2025-11-28 10:00:00', 'Completada', 'Cabello teñido', '2025-11-26 09:15:00'),
(11, 'Carla Melissa Guzmán', '+51 987 234 011', 3, 'Tinte Completo', 1, 'María Fernández', '2025-11-28 14:00:00', 'Completada', 'Tono caoba rojizo', '2025-11-26 11:30:00'),
(42, 'Pablo Andrés Cortez', '+51 987 234 042', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-11-28 16:00:00', 'Completada', NULL, '2025-11-26 14:20:00'),
(15, 'Daniela Stephanie Morales', '+51 987 234 015', 5, 'Keratina Brasileña', 1, 'María Fernández', '2025-11-29 09:00:00', 'Completada', 'Cabello muy rizado', '2025-11-27 08:30:00'),
(43, 'Claudia Stefanie Mora', '+51 987 234 043', 11, 'Manicure Gel', 3, 'Ana Gutiérrez', '2025-11-29 14:00:00', 'Completada', NULL, '2025-11-27 12:15:00'),
(44, 'Gonzalo Martín Ibarra', '+51 987 234 044', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-11-29 16:00:00', 'Completada', NULL, '2025-11-27 14:45:00'),
(3, 'María Fernanda Castro', '+51 987 234 003', 12, 'Pedicure Spa', 3, 'Ana Gutiérrez', '2025-11-30 10:00:00', 'Completada', NULL, '2025-11-28 09:20:00'),
(20, 'Javier Antonio Cruz', '+51 987 234 020', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-11-30 13:00:00', 'Completada', NULL, '2025-11-28 11:40:00'),
(46, 'Iván Roberto Cardenas', '+51 987 234 046', 9, 'Arreglo de Barba', 2, 'Carlos Ramos', '2025-11-30 15:00:00', 'Completada', NULL, '2025-11-28 13:55:00');

-- ============================================================================
-- CITAS DE DICIEMBRE 2025
-- ============================================================================

-- Semana 1 de Diciembre (2-7, saltando el 1)
INSERT INTO appointments (client_id, client_name, phone, service_id, service_name, staff_id, staff_name, date, status, notes, created_at) VALUES
(2, 'Carlos Eduardo Mendoza', '+51 987 234 002', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-12-02 10:30:00', 'Completada', NULL, '2025-11-25 14:20:00'),
(5, 'Patricia Sofía Rojas', '+51 987 234 005', 15, 'Limpieza Facial Profunda', 4, 'Patricia López', '2025-12-02 15:00:00', 'Completada', 'Piel sensible', '2025-11-26 09:15:00'),
(56, 'Emilio Rafael Torres', '+51 987 234 056', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-12-02 17:00:00', 'Completada', NULL, '2025-11-26 15:30:00'),
(9, 'Gabriela Ximena Flores', '+51 987 234 009', 10, 'Manicure Clásico', 3, 'Ana Gutiérrez', '2025-12-03 11:00:00', 'Completada', NULL, '2025-11-27 10:30:00'),
(4, 'Roberto Alonso Díaz', '+51 987 234 004', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-12-03 14:00:00', 'Completada', NULL, '2025-11-28 11:45:00'),
(57, 'Carolina Sofía Paredes', '+51 987 234 057', 10, 'Manicure Clásico', 3, 'Ana Gutiérrez', '2025-12-03 16:00:00', 'Completada', NULL, '2025-11-28 14:20:00'),
(7, 'Lucía Valentina Sánchez', '+51 987 234 007', 4, 'Mechas Balayage', 1, 'María Fernández', '2025-12-04 09:00:00', 'Completada', 'Cabello teñido', '2025-11-29 08:30:00'),
(1, 'Ana María Pérez García', '+51 987 234 001', 3, 'Tinte Completo', 1, 'María Fernández', '2025-12-04 14:00:00', 'Completada', 'Tono rubio ceniza', '2025-11-30 13:20:00'),
(58, 'Sebastián David Moreno', '+51 987 234 058', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-12-04 16:00:00', 'Completada', NULL, '2025-11-30 15:45:00'),
(12, 'Diego Sebastián Paredes', '+51 987 234 012', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-12-05 11:30:00', 'Completada', NULL, '2025-12-01 09:15:00'),
(11, 'Carla Melissa Guzmán', '+51 987 234 011', 1, 'Corte de Cabello Dama', 1, 'María Fernández', '2025-12-05 15:00:00', 'Completada', NULL, '2025-12-02 10:40:00'),
(59, 'Andrea Fernanda Lagos', '+51 987 234 059', 12, 'Pedicure Spa', 3, 'Ana Gutiérrez', '2025-12-05 17:00:00', 'Completada', NULL, '2025-12-02 14:15:00'),
(5, 'Patricia Sofía Rojas', '+51 987 234 005', 17, 'Masaje Relajante', 4, 'Patricia López', '2025-12-06 10:00:00', 'Completada', NULL, '2025-12-03 14:25:00'),
(13, 'Valeria Daniela Quispe', '+51 987 234 013', 13, 'Uñas Acrílicas', 3, 'Ana Gutiérrez', '2025-12-06 14:30:00', 'Completada', 'Diseño floral', '2025-12-04 11:50:00'),
(60, 'Maximiliano José Rosas', '+51 987 234 060', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-12-06 16:30:00', 'Completada', NULL, '2025-12-04 15:20:00'),
(10, 'Fernando José Ramírez', '+51 987 234 010', 9, 'Arreglo de Barba', 2, 'Carlos Ramos', '2025-12-07 10:00:00', 'Completada', NULL, '2025-12-05 09:30:00'),
(17, 'Natalia Isabel Herrera', '+51 987 234 017', 15, 'Limpieza Facial Profunda', 4, 'Patricia López', '2025-12-07 15:30:00', 'Completada', 'Piel grasa', '2025-12-06 12:15:00'),
(61, 'Francisca Elena Navarro', '+51 987 234 061', 17, 'Masaje Relajante', 4, 'Patricia López', '2025-12-07 17:30:00', 'Completada', NULL, '2025-12-06 16:40:00');

-- Semana 2 de Diciembre (9-14, saltando el 8 que es feriado)
INSERT INTO appointments (client_id, client_name, phone, service_id, service_name, staff_id, staff_name, date, status, notes, created_at) VALUES
(8, 'Miguel Ángel Torres', '+51 987 234 008', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-12-09 11:00:00', 'Completada', NULL, '2025-12-07 10:20:00'),
(23, 'Monica Elizabeth Silva', '+51 987 234 023', 11, 'Manicure Gel', 3, 'Ana Gutiérrez', '2025-12-09 14:00:00', 'Completada', NULL, '2025-12-07 15:30:00'),
(62, 'Leonardo Gabriel Fuentes', '+51 987 234 062', 9, 'Arreglo de Barba', 2, 'Carlos Ramos', '2025-12-09 16:00:00', 'Completada', NULL, '2025-12-07 17:15:00'),
(2, 'Carlos Eduardo Mendoza', '+51 987 234 002', 8, 'Afeitado Clásico', 2, 'Carlos Ramos', '2025-12-10 10:00:00', 'Completada', NULL, '2025-12-08 09:15:00'),
(6, 'Jorge Luis Vargas', '+51 987 234 006', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-12-10 15:30:00', 'Completada', NULL, '2025-12-08 11:40:00'),
(63, 'Constanza María Herrera', '+51 987 234 063', 3, 'Tinte Completo', 1, 'María Fernández', '2025-12-10 17:00:00', 'Completada', NULL, '2025-12-08 15:25:00'),
(9, 'Gabriela Ximena Flores', '+51 987 234 009', 12, 'Pedicure Spa', 3, 'Ana Gutiérrez', '2025-12-11 10:30:00', 'Completada', NULL, '2025-12-09 13:25:00'),
(22, 'Luis Fernando Castillo', '+51 987 234 022', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-12-11 14:00:00', 'Completada', NULL, '2025-12-09 16:10:00'),
(64, 'Ignacio Andrés Salinas', '+51 987 234 064', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-12-11 16:30:00', 'Completada', NULL, '2025-12-09 17:45:00'),
(31, 'Renata Ximena Chávez', '+51 987 234 031', 15, 'Limpieza Facial Profunda', 4, 'Patricia López', '2025-12-12 11:00:00', 'Completada', NULL, '2025-12-10 10:30:00'),
(14, 'Andrés Martín Salazar', '+51 987 234 014', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-12-12 16:00:00', 'Completada', NULL, '2025-12-10 14:15:00'),
(65, 'Beatriz Alejandra Vásquez', '+51 987 234 065', 11, 'Manicure Gel', 3, 'Ana Gutiérrez', '2025-12-12 17:30:00', 'Completada', NULL, '2025-12-10 16:50:00'),
(34, 'Gabriel Arturo Maldonado', '+51 987 234 034', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-12-13 10:30:00', 'Completada', NULL, '2025-12-11 09:40:00'),
(12, 'Diego Sebastián Paredes', '+51 987 234 012', 8, 'Afeitado Clásico', 2, 'Carlos Ramos', '2025-12-13 13:00:00', 'Completada', NULL, '2025-12-11 11:20:00'),
(66, 'Matías Fernando Rojas', '+51 987 234 066', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-12-13 15:30:00', 'Completada', NULL, '2025-12-11 14:35:00'),
(38, 'Antonio César Villalobos', '+51 987 234 038', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-12-13 17:00:00', 'Completada', NULL, '2025-12-11 15:30:00'),
(10, 'Fernando José Ramírez', '+51 987 234 010', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-12-14 10:00:00', 'Completada', NULL, '2025-12-12 08:45:00'),
(4, 'Roberto Alonso Díaz', '+51 987 234 004', 9, 'Arreglo de Barba', 2, 'Carlos Ramos', '2025-12-14 14:30:00', 'Completada', NULL, '2025-12-12 13:10:00'),
(24, 'Eduardo Miguel Vargas', '+51 987 234 024', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-12-14 16:00:00', 'Completada', NULL, '2025-12-12 14:55:00'),
(67, 'Isidora Catalina Muñoz', '+51 987 234 067', 15, 'Limpieza Facial Profunda', 4, 'Patricia López', '2025-12-14 17:30:00', 'Completada', NULL, '2025-12-12 16:20:00');

-- ============================================================================
-- BELLA SALON - CITAS DICIEMBRE (Continuación) + CIERRE
-- ============================================================================

USE bella_salon;

-- Semana 3 de Diciembre (15-21)
INSERT INTO appointments (client_id, client_name, phone, service_id, service_name, staff_id, staff_name, date, status, notes, created_at) VALUES
(2, 'Carlos Eduardo Mendoza', '+51 987 234 002', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-12-15 11:00:00', 'Completada', NULL, '2025-12-13 10:15:00'),
(26, 'Martín Alejandro Reyes', '+51 987 234 026', 9, 'Arreglo de Barba', 2, 'Carlos Ramos', '2025-12-15 14:00:00', 'Completada', NULL, '2025-12-13 12:30:00'),
(40, 'Raúl Ernesto Delgado', '+51 987 234 040', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-12-15 16:30:00', 'Completada', 'Estilo clásico', '2025-12-13 15:45:00'),
(68, 'Benjamín Esteban Ponce', '+51 987 234 068', 8, 'Afeitado Clásico', 2, 'Carlos Ramos', '2025-12-15 18:00:00', 'Completada', NULL, '2025-12-13 17:20:00'),
(16, 'Ricardo Enrique Núñez', '+51 987 234 016', 9, 'Arreglo de Barba', 2, 'Carlos Ramos', '2025-12-16 10:00:00', 'Completada', NULL, '2025-12-14 09:20:00'),
(30, 'Francisco Daniel Paz', '+51 987 234 030', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-12-16 13:30:00', 'Completada', NULL, '2025-12-14 11:35:00'),
(32, 'Sergio Raúl Mendoza', '+51 987 234 032', 9, 'Arreglo de Barba', 2, 'Carlos Ramos', '2025-12-16 15:00:00', 'Completada', NULL, '2025-12-14 13:50:00'),
(69, 'Macarena Sofía Figueroa', '+51 987 234 069', 12, 'Pedicure Spa', 3, 'Ana Gutiérrez', '2025-12-16 17:00:00', 'Completada', NULL, '2025-12-14 16:10:00'),
(9, 'Gabriela Ximena Flores', '+51 987 234 009', 18, 'Depilación Cejas', 3, 'Ana Gutiérrez', '2025-12-17 10:00:00', 'Completada', NULL, '2025-12-15 08:40:00'),
(25, 'Isabella Fernanda León', '+51 987 234 025', 3, 'Tinte Completo', 1, 'María Fernández', '2025-12-17 14:00:00', 'Completada', 'Balayage caramelo', '2025-12-15 10:15:00'),
(34, 'Gabriel Arturo Maldonado', '+51 987 234 034', 8, 'Afeitado Clásico', 2, 'Carlos Ramos', '2025-12-17 16:30:00', 'Completada', NULL, '2025-12-15 14:25:00'),
(70, 'Augusto Ricardo Peña', '+51 987 234 070', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-12-17 18:00:00', 'Completada', NULL, '2025-12-15 16:45:00'),
(1, 'Ana María Pérez García', '+51 987 234 001', 1, 'Corte de Cabello Dama', 1, 'María Fernández', '2025-12-18 09:30:00', 'Completada', NULL, '2025-12-16 11:10:00'),
(18, 'Oscar Javier Medina', '+51 987 234 018', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-12-18 15:00:00', 'Completada', 'Cliente corporativo', '2025-12-16 13:45:00'),
(10, 'Fernando José Ramírez', '+51 987 234 010', 9, 'Arreglo de Barba', 2, 'Carlos Ramos', '2025-12-18 17:00:00', 'Completada', NULL, '2025-12-16 16:20:00'),
(71, 'Florencia Andrea Molina', '+51 987 234 071', 4, 'Mechas Balayage', 1, 'María Fernández', '2025-12-18 18:30:00', 'Completada', NULL, '2025-12-16 17:55:00'),
(17, 'Natalia Isabel Herrera', '+51 987 234 017', 20, 'Maquillaje Social', 6, 'Lucía Torres', '2025-12-19 11:00:00', 'Completada', 'Evento nocturno', '2025-12-17 09:30:00'),
(31, 'Renata Ximena Chávez', '+51 987 234 031', 19, 'Depilación Facial Completa', 4, 'Patricia López', '2025-12-19 14:00:00', 'Completada', NULL, '2025-12-17 12:15:00'),
(36, 'Héctor Luis Guerrero', '+51 987 234 036', 8, 'Afeitado Clásico', 2, 'Carlos Ramos', '2025-12-19 16:00:00', 'Completada', NULL, '2025-12-17 14:40:00'),
(72, 'Joaquín Sebastián Ortiz', '+51 987 234 072', 9, 'Arreglo de Barba', 2, 'Carlos Ramos', '2025-12-19 18:00:00', 'Completada', NULL, '2025-12-17 17:05:00'),
(5, 'Patricia Sofía Rojas', '+51 987 234 005', 15, 'Limpieza Facial Profunda', 4, 'Patricia López', '2025-12-20 10:00:00', 'Completada', 'Piel sensible', '2025-12-18 08:50:00'),
(19, 'Camila Andrea Vega', '+51 987 234 019', 11, 'Manicure Gel', 3, 'Ana Gutiérrez', '2025-12-20 13:00:00', 'Completada', NULL, '2025-12-18 11:25:00'),
(37, 'Cecilia Andrea Bustamante', '+51 987 234 037', 4, 'Mechas Balayage', 1, 'María Fernández', '2025-12-20 15:00:00', 'Completada', 'Tonos fríos', '2025-12-18 13:35:00'),
(73, 'Antonella Victoria Sandoval', '+51 987 234 073', 11, 'Manicure Gel', 3, 'Ana Gutiérrez', '2025-12-20 17:00:00', 'Completada', NULL, '2025-12-18 16:20:00'),
(27, 'Sofía Carolina Campos', '+51 987 234 027', 6, 'Tratamiento Capilar Intensivo', 1, 'María Fernández', '2025-12-21 09:00:00', 'Completada', 'Cabello muy dañado', '2025-12-19 10:15:00'),
(29, 'Adriana Melissa Torres', '+51 987 234 029', 14, 'Nail Art Premium', 3, 'Ana Gutiérrez', '2025-12-21 11:00:00', 'Completada', 'Diseños geométricos', '2025-12-19 13:20:00'),
(39, 'Mariana Lucía Espinoza', '+51 987 234 039', 3, 'Tinte Completo', 1, 'María Fernández', '2025-12-21 14:00:00', 'Completada', NULL, '2025-12-19 15:40:00'),
(41, 'Verónica Isabel Zamora', '+51 987 234 041', 17, 'Masaje Relajante', 4, 'Patricia López', '2025-12-21 16:00:00', 'Completada', 'Piel mixta', '2025-12-19 17:10:00'),
(74, 'Facundo Martín Espinoza', '+51 987 234 074', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-12-21 18:00:00', 'Completada', NULL, '2025-12-19 18:35:00');

-- Semana 4 de Diciembre (22-28)
INSERT INTO appointments (client_id, client_name, phone, service_id, service_name, staff_id, staff_name, date, status, notes, created_at) VALUES
(7, 'Lucía Valentina Sánchez', '+51 987 234 007', 6, 'Tratamiento Capilar Intensivo', 1, 'María Fernández', '2025-12-22 10:00:00', 'Completada', 'Cabello teñido', '2025-12-20 09:15:00'),
(11, 'Carla Melissa Guzmán', '+51 987 234 011', 3, 'Tinte Completo', 1, 'María Fernández', '2025-12-22 14:00:00', 'Completada', 'Tono caoba rojizo', '2025-12-20 11:30:00'),
(21, 'Sandra Beatriz Ramos', '+51 987 234 021', 16, 'Tratamiento Anti-edad', 4, 'Patricia López', '2025-12-22 15:30:00', 'Completada', 'Prefiere sábados', '2025-12-20 14:20:00'),
(33, 'Pamela Vanessa Rojas', '+51 987 234 033', 7, 'Peinado para Evento', 6, 'Lucía Torres', '2025-12-22 17:00:00', 'Completada', 'Evento de gala', '2025-12-20 16:45:00'),
(75, 'Renata Camila Aguirre', '+51 987 234 075', 15, 'Limpieza Facial Profunda', 4, 'Patricia López', '2025-12-22 18:30:00', 'Completada', NULL, '2025-12-20 18:10:00'),
(13, 'Valeria Daniela Quispe', '+51 987 234 013', 11, 'Manicure Gel', 3, 'Ana Gutiérrez', '2025-12-23 10:00:00', 'Completada', NULL, '2025-12-21 08:30:00'),
(15, 'Daniela Stephanie Morales', '+51 987 234 015', 1, 'Corte de Cabello Dama', 1, 'María Fernández', '2025-12-23 11:30:00', 'Completada', NULL, '2025-12-21 10:15:00'),
(41, 'Verónica Isabel Zamora', '+51 987 234 041', 15, 'Limpieza Facial Profunda', 4, 'Patricia López', '2025-12-23 14:00:00', 'Completada', NULL, '2025-12-21 12:40:00'),
(45, 'Jimena Carolina Rivas', '+51 987 234 045', 4, 'Mechas Balayage', 1, 'María Fernández', '2025-12-23 16:00:00', 'Completada', 'Productos orgánicos', '2025-12-21 15:20:00'),
(50, 'Rodrigo Javier Linares', '+51 987 234 050', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-12-23 18:00:00', 'Completada', 'Cliente corporativo', '2025-12-21 17:05:00'),
(76, 'Agustín Felipe Romero', '+51 987 234 076', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-12-23 19:00:00', 'Completada', NULL, '2025-12-21 18:30:00'),
(3, 'María Fernanda Castro', '+51 987 234 003', 11, 'Manicure Gel', 3, 'Ana Gutiérrez', '2025-12-24 10:00:00', 'Completada', 'Confirmar esmaltes hipoalergénicos', '2025-12-22 09:30:00'),
(20, 'Javier Antonio Cruz', '+51 987 234 020', 8, 'Afeitado Clásico', 2, 'Carlos Ramos', '2025-12-24 11:30:00', 'Completada', NULL, '2025-12-22 11:15:00'),
(35, 'Lorena Patricia Suárez', '+51 987 234 035', 12, 'Pedicure Spa', 3, 'Ana Gutiérrez', '2025-12-24 13:00:00', 'Completada', NULL, '2025-12-22 13:45:00'),
(42, 'Pablo Andrés Cortez', '+51 987 234 042', 2, 'Corte de Cabello Caballero', 5, 'Roberto Silva', '2025-12-24 15:00:00', 'Completada', NULL, '2025-12-22 15:20:00'),
(77, 'Catalina Juliana Bravo', '+51 987 234 077', 3, 'Tinte Completo', 1, 'María Fernández', '2025-12-24 16:30:00', 'Completada', NULL, '2025-12-22 17:00:00'),
(7, 'Lucía Valentina Sánchez', '+51 987 234 007', 1, 'Corte de Cabello Dama', 1, 'María Fernández', '2025-12-26 10:00:00', 'Confirmada', NULL, '2025-12-23 14:30:00'),
(21, 'Sandra Beatriz Ramos', '+51 987 234 021', 11, 'Manicure Gel', 3, 'Ana Gutiérrez', '2025-12-26 14:00:00', 'Confirmada', NULL, '2025-12-23 16:10:00'),
(78, 'Mateo Ignacio Castro', '+51 987 234 078', 2, 'Corte de Cabello Caballero', 2, 'Carlos Ramos', '2025-12-26 16:00:00', 'Confirmada', NULL, '2025-12-23 17:45:00'),
(43, 'Claudia Stefanie Mora', '+51 987 234 043', 13, 'Uñas Acrílicas', 3, 'Ana Gutiérrez', '2025-12-27 11:00:00', 'Pendiente', NULL, '2025-12-24 09:45:00'),
(46, 'Iván Roberto Cardenas', '+51 987 234 046', 9, 'Arreglo de Barba', 2, 'Carlos Ramos', '2025-12-27 15:00:00', 'Pendiente', NULL, '2025-12-24 12:20:00'),
(79, 'Josefina Martina León', '+51 987 234 079', 11, 'Manicure Gel', 3, 'Ana Gutiérrez', '2025-12-27 17:00:00', 'Pendiente', NULL, '2025-12-24 15:35:00'),
(49, 'Melissa Gabriela Vargas', '+51 987 234 049', 3, 'Tinte Completo', 5, 'Roberto Silva', '2025-12-28 10:00:00', 'Pendiente', 'Tono chocolate', '2025-12-24 14:35:00'),
(80, 'Santiago Rafael Núñez', '+51 987 234 080', 8, 'Afeitado Clásico', 2, 'Carlos Ramos', '2025-12-28 14:00:00', 'Pendiente', NULL, '2025-12-24 16:50:00'),
(51, 'Elena Victoria Medina', '+51 987 234 051', 12, 'Pedicure Spa', 3, 'Ana Gutiérrez', '2025-12-28 16:00:00', 'Pendiente', NULL, '2025-12-24 18:15:00');

-- ============================================================================
-- QUEJAS Y RECLAMOS
-- ============================================================================

INSERT INTO complaints (timestamp, full_name, doc_type, doc_number, address, phone, email, bien_type, amount_claimed, bien_description, complaint_type, detail, request, response_text, response_date, status) VALUES
('2025-11-08 14:30:00', 'Jorge Luis Vargas', 'DNI', '43678912', 'Av. La Marina 2890, San Miguel', '+51 987 234 006', 'jvargas@gmail.com', 'Servicio', 35.00, 'Corte de cabello caballero', 'Queja', 'El corte no quedó como lo solicité, me cortaron más de lo indicado', 'Solicito un nuevo corte correctivo sin costo adicional', 'Estimado señor Vargas, lamentamos la situación. Hemos coordinado con usted un corte correctivo sin costo. Le agradecemos su comprensión.', '2025-11-09 10:00:00', 'Resuelto'),
('2025-11-19 16:20:00', 'Monica Elizabeth Silva', 'DNI', '47345612', 'Jr. Carabaya 890, Cercado de Lima', '+51 987 234 023', 'monica.silva@yahoo.com', 'Servicio', 55.00, 'Manicure gel', 'Reclamación', 'El esmalte gel se levantó a los 3 días de la aplicación, no duró lo prometido', 'Exijo reembolso o reaplicación del servicio', 'Señora Silva, ofrecemos disculpas. La invitamos a una reaplicación gratuita con productos de mejor calidad. Cita agendada para el 22/11.', '2025-11-20 09:30:00', 'Resuelto'),
('2025-12-05 14:30:00', 'Eduardo Miguel Vargas', 'DNI', '41567234', 'Av. Colonial 2345, Callao', '+51 987 234 024', 'eduardo.vargas@gmail.com', 'Servicio', 35.00, 'Corte de cabello caballero', 'Queja', 'Tuve que esperar 40 minutos adicionales a mi hora de cita programada', 'Solicito compensación por el tiempo perdido', 'Estimado señor Vargas, pedimos disculpas por la demora. Le ofrecemos 20% de descuento en su próxima visita.', '2025-12-06 10:00:00', 'Resuelto'),
('2025-12-17 11:45:00', 'Lorena Patricia Suárez', 'DNI', '48234678', 'Jr. Washington 234, Cercado de Lima', '+51 987 234 035', 'lorena.suarez@yahoo.com', 'Servicio', 60.00, 'Pedicure spa', 'Queja', 'La atención fue apresurada y no aplicaron el masaje completo del servicio', 'Solicito que el servicio sea más cuidadoso en el futuro', NULL, NULL, 'Pendiente'),
('2025-12-22 15:10:00', 'Constanza María Herrera', 'DNI', '48456789', 'Calle Los Pinos 567, Surco', '+51 987 234 063', 'constanza.herrera@gmail.com', 'Servicio', 120.00, 'Tinte completo', 'Reclamación', 'El tono aplicado no corresponde con el solicitado, quedó demasiado oscuro', 'Solicito corrección del color sin costo adicional', 'Señora Herrera, lamentamos mucho el inconveniente. Coordinamos una corrección del color con nuestra estilista senior sin costo. Cita: 27/12.', '2025-12-23 09:00:00', 'En Proceso'),
('2025-12-24 10:20:00', 'Benjamín Esteban Ponce', 'DNI', '42901234', 'Av. La Marina 4567, San Miguel', '+51 987 234 068', 'benjamin.ponce@gmail.com', 'Servicio', 40.00, 'Afeitado clásico', 'Queja', 'El afeitado causó irritación en mi piel sensible', 'Solicito mayor cuidado y uso de productos hipoalergénicos', NULL, NULL, 'Pendiente');

-- ============================================================================
-- REDENCIONES DE PUNTOS
-- ============================================================================

INSERT INTO redemptions (client_id, promotion_id, promotion_name, points_used, date) VALUES
(1, 2, 'Acumulador de Puntos Premium', 500, '2025-11-10 11:30:00'),
(7, 3, 'VIP Spa Experience', 1000, '2025-11-18 14:20:00'),
(15, 2, 'Acumulador de Puntos Premium', 500, '2025-11-25 10:45:00'),
(21, 3, 'VIP Spa Experience', 1000, '2025-12-05 16:00:00'),
(45, 2, 'Acumulador de Puntos Premium', 500, '2025-12-15 13:15:00'),
(5, 2, 'Acumulador de Puntos Premium', 500, '2025-12-20 11:00:00'),
(27, 3, 'VIP Spa Experience', 1000, '2025-12-22 15:30:00');

-- ============================================================================
-- ACTUALIZACIÓN DE ESTADÍSTICAS DE CLIENTES
-- ============================================================================

-- Actualizar totales basados en citas completadas
UPDATE clients c
SET 
    total_visits = (
        SELECT COUNT(*) 
        FROM appointments a 
        WHERE a.client_id = c.id AND a.status = 'Completada'
    ),
    total_spent = (
        SELECT COALESCE(SUM(s.price), 0)
        FROM appointments a
        JOIN services s ON a.service_id = s.id
        WHERE a.client_id = c.id AND a.status = 'Completada'
    ),
    last_visit = (
        SELECT MAX(DATE(a.date))
        FROM appointments a
        WHERE a.client_id = c.id AND a.status = 'Completada'
    ),
    loyalty_points = FLOOR((
        SELECT COALESCE(SUM(s.price), 0)
        FROM appointments a
        JOIN services s ON a.service_id = s.id
        WHERE a.client_id = c.id AND a.status = 'Completada'
    ) * 1.5);

-- Ajustar puntos por redenciones
UPDATE clients c
JOIN (
    SELECT client_id, SUM(points_used) as total_redeemed
    FROM redemptions
    GROUP BY client_id
) r ON c.id = r.client_id
SET c.loyalty_points = c.loyalty_points - r.total_redeemed;

-- Actualizar VIP status basado en umbral
UPDATE clients 
SET vip_status = 1 
WHERE total_spent >= 1200.00;

-- ============================================================================
-- RESUMEN DE DATOS GENERADOS
-- ============================================================================

SELECT 'RESUMEN DE DATOS - 2 MESES DE OPERACIONES' as Info;
SELECT '=' as Separador;
SELECT CONCAT('Clientes registrados: ', COUNT(*)) as Estadistica FROM clients;
SELECT CONCAT('Citas totales: ', COUNT(*)) as Estadistica FROM appointments;
SELECT CONCAT('Citas completadas: ', COUNT(*)) as Estadistica FROM appointments WHERE status = 'Completada';
SELECT CONCAT('Citas confirmadas: ', COUNT(*)) as Estadistica FROM appointments WHERE status = 'Confirmada';
SELECT CONCAT('Citas pendientes: ', COUNT(*)) as Estadistica FROM appointments WHERE status = 'Pendiente';
SELECT CONCAT('Quejas/Reclamos: ', COUNT(*)) as Estadistica FROM complaints;
SELECT CONCAT('Redenciones: ', COUNT(*)) as Estadistica FROM redemptions;
SELECT CONCAT('Clientes VIP: ', COUNT(*)) as Estadistica FROM clients WHERE vip_status = 1;
SELECT CONCAT('Ingresos totales: S/ ', FORMAT(SUM(s.price), 2)) as Estadistica 
FROM appointments a 
JOIN services s ON a.service_id = s.id 
WHERE a.status = 'Completada';

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================