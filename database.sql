-- ============================================================================
-- BELLA SALON - DDL COMPLETO PARA REPLICACIÓN
-- MySQL 8.0+
-- Generado: 2024-12-27
-- Base de datos: Sistema de Gestión de Salón de Belleza
-- ============================================================================
-- 
-- CARACTERÍSTICAS:
-- - 10 tablas (clients, staff, services, appointments, promotions, 
--   redemptions, complaints, holidays, loyalty_config, settings)
-- - Relaciones: 5 Foreign Keys
-- - Soporte JSON para datos flexibles
-- - ENUM para datos categóricos
-- - Timestamps automáticos
-- - Integridad referencial completa
-- ============================================================================

-- Configuración inicial
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+00:00';

-- ============================================================================
-- CREACIÓN DE BASE DE DATOS
-- ============================================================================

DROP DATABASE IF EXISTS bella_salon;
CREATE DATABASE bella_salon 
    DEFAULT CHARACTER SET utf8mb4 
    COLLATE utf8mb4_0900_ai_ci;

USE bella_salon;

-- ============================================================================
-- TABLA: clients
-- Descripción: Gestión de clientes del salón con sistema de lealtad
-- ============================================================================

DROP TABLE IF EXISTS `clients`;
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID único del cliente',
  `name` varchar(255) NOT NULL COMMENT 'Nombre completo del cliente',
  `email` varchar(255) DEFAULT NULL COMMENT 'Email del cliente (opcional)',
  `phone` varchar(50) NOT NULL COMMENT 'Teléfono de contacto',
  `doc_type` enum('DNI','CE','Pasaporte') DEFAULT 'DNI' COMMENT 'Tipo de documento de identidad',
  `doc_number` varchar(50) DEFAULT NULL COMMENT 'Número de documento',
  `birth_date` date DEFAULT NULL COMMENT 'Fecha de nacimiento',
  `address` text COMMENT 'Dirección del cliente',
  `registration_date` date DEFAULT NULL COMMENT 'Fecha de registro en el sistema',
  `total_visits` int DEFAULT 0 COMMENT 'Total de visitas realizadas',
  `total_spent` decimal(12,2) DEFAULT 0.00 COMMENT 'Total gastado en soles',
  `last_visit` date DEFAULT NULL COMMENT 'Fecha de última visita',
  `preferred_services` json DEFAULT NULL COMMENT 'Array JSON de servicios preferidos',
  `notes` text COMMENT 'Notas adicionales sobre el cliente',
  `loyalty_points` int DEFAULT 0 COMMENT 'Puntos de lealtad acumulados',
  `vip_status` tinyint(1) DEFAULT 0 COMMENT 'Estado VIP (1=VIP, 0=Regular)',
  `tags` json DEFAULT NULL COMMENT 'Array JSON de etiquetas/categorías',
  `redeemed_promotions` json DEFAULT NULL COMMENT 'Array JSON de promociones canjeadas',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_phone` (`phone`),
  KEY `idx_doc_number` (`doc_number`),
  KEY `idx_vip_status` (`vip_status`),
  KEY `idx_registration_date` (`registration_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Tabla de clientes del salón';

-- ============================================================================
-- TABLA: staff
-- Descripción: Personal del salón con horarios y especialidades
-- ============================================================================

DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID único del staff',
  `name` varchar(255) NOT NULL COMMENT 'Nombre completo del empleado',
  `role` varchar(255) NOT NULL COMMENT 'Rol/Cargo (Estilista, Barbero, etc.)',
  `email` varchar(255) DEFAULT NULL COMMENT 'Email del empleado',
  `phone` varchar(50) DEFAULT NULL COMMENT 'Teléfono de contacto',
  `bio` text COMMENT 'Biografía/Descripción del empleado',
  `specialties` text COMMENT 'Especialidades del empleado',
  `image` longtext COMMENT 'URL o base64 de imagen del empleado',
  `active` tinyint(1) DEFAULT 1 COMMENT 'Estado activo (1=Activo, 0=Inactivo)',
  `schedule` json DEFAULT NULL COMMENT 'Horario semanal en formato JSON',
  `vacation_days` json DEFAULT NULL COMMENT 'Días de vacaciones en formato JSON',
  `exceptions` json DEFAULT NULL COMMENT 'Excepciones de horario en formato JSON',
  `works_holidays` tinyint(1) DEFAULT 0 COMMENT 'Trabaja en feriados (1=Sí, 0=No)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
  PRIMARY KEY (`id`),
  KEY `idx_active` (`active`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Personal del salón';

-- ============================================================================
-- TABLA: services
-- Descripción: Catálogo de servicios ofrecidos
-- ============================================================================

DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID único del servicio',
  `name` varchar(255) NOT NULL COMMENT 'Nombre del servicio',
  `category` varchar(100) NOT NULL COMMENT 'Categoría (Cabello, Uñas, Estética, etc.)',
  `price` decimal(10,2) NOT NULL COMMENT 'Precio en soles',
  `duration` varchar(50) NOT NULL COMMENT 'Duración estimada (ej: "1 hora", "30 minutos")',
  `active` tinyint(1) DEFAULT 1 COMMENT 'Servicio activo (1=Activo, 0=Inactivo)',
  `image` longtext COMMENT 'URL o base64 de imagen del servicio',
  `staff_ids` json DEFAULT NULL COMMENT 'Array JSON de IDs de staff que pueden realizar el servicio',
  `description` text COMMENT 'Descripción detallada del servicio',
  `featured` tinyint(1) DEFAULT 0 COMMENT 'Servicio destacado (1=Sí, 0=No)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_active` (`active`),
  KEY `idx_featured` (`featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Catálogo de servicios';

-- ============================================================================
-- TABLA: appointments
-- Descripción: Citas agendadas
-- ============================================================================

DROP TABLE IF EXISTS `appointments`;
CREATE TABLE `appointments` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID único de la cita',
  `client_id` int DEFAULT NULL COMMENT 'ID del cliente (FK a clients)',
  `client_name` varchar(255) DEFAULT NULL COMMENT 'Nombre del cliente (desnormalizado)',
  `phone` varchar(50) DEFAULT NULL COMMENT 'Teléfono del cliente',
  `service_id` int DEFAULT NULL COMMENT 'ID del servicio (FK a services)',
  `service_name` varchar(255) DEFAULT NULL COMMENT 'Nombre del servicio (desnormalizado)',
  `staff_id` int DEFAULT NULL COMMENT 'ID del staff asignado (FK a staff)',
  `staff_name` varchar(255) DEFAULT NULL COMMENT 'Nombre del staff (desnormalizado)',
  `date` datetime NOT NULL COMMENT 'Fecha y hora de la cita',
  `status` enum('Pendiente','Confirmada','Cancelada','Completada') DEFAULT 'Pendiente' COMMENT 'Estado de la cita',
  `notes` text COMMENT 'Notas adicionales de la cita',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación de la cita',
  PRIMARY KEY (`id`),
  KEY `idx_client_id` (`client_id`),
  KEY `idx_service_id` (`service_id`),
  KEY `idx_staff_id` (`staff_id`),
  KEY `idx_date` (`date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL,
  CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL,
  CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Citas agendadas';

-- ============================================================================
-- TABLA: promotions
-- Descripción: Promociones y programa de lealtad
-- ============================================================================

DROP TABLE IF EXISTS `promotions`;
CREATE TABLE `promotions` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID único de la promoción',
  `name` varchar(255) NOT NULL COMMENT 'Nombre de la promoción',
  `type` enum('discount','free_service') NOT NULL COMMENT 'Tipo de promoción (descuento o servicio gratis)',
  `trigger` enum('visits','points') NOT NULL COMMENT 'Trigger de activación (visitas o puntos)',
  `threshold` int NOT NULL COMMENT 'Umbral para activar la promoción',
  `period` enum('month','total') DEFAULT 'total' COMMENT 'Período de evaluación (mensual o total)',
  `reward` varchar(255) NOT NULL COMMENT 'Recompensa ofrecida',
  `active` tinyint(1) DEFAULT 1 COMMENT 'Promoción activa (1=Activa, 0=Inactiva)',
  `description` text COMMENT 'Descripción detallada de la promoción',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
  PRIMARY KEY (`id`),
  KEY `idx_active` (`active`),
  KEY `idx_trigger` (`trigger`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Promociones y programa de lealtad';

-- ============================================================================
-- TABLA: redemptions
-- Descripción: Redenciones de promociones
-- ============================================================================

DROP TABLE IF EXISTS `redemptions`;
CREATE TABLE `redemptions` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID único de la redención',
  `client_id` int NOT NULL COMMENT 'ID del cliente (FK a clients)',
  `promotion_id` int NOT NULL COMMENT 'ID de la promoción (FK a promotions)',
  `promotion_name` varchar(255) DEFAULT NULL COMMENT 'Nombre de la promoción (desnormalizado)',
  `points_used` int NOT NULL COMMENT 'Puntos utilizados en la redención',
  `date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de la redención',
  PRIMARY KEY (`id`),
  KEY `idx_client_id` (`client_id`),
  KEY `idx_promotion_id` (`promotion_id`),
  KEY `idx_date` (`date`),
  CONSTRAINT `redemptions_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `redemptions_ibfk_2` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Registro de redenciones de promociones';

-- ============================================================================
-- TABLA: complaints
-- Descripción: Libro de reclamaciones (Requisito legal en Perú)
-- ============================================================================

DROP TABLE IF EXISTS `complaints`;
CREATE TABLE `complaints` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID único de la queja/reclamo',
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora del registro',
  `full_name` varchar(255) NOT NULL COMMENT 'Nombre completo del reclamante',
  `doc_type` varchar(50) NOT NULL COMMENT 'Tipo de documento',
  `doc_number` varchar(50) NOT NULL COMMENT 'Número de documento',
  `address` text NOT NULL COMMENT 'Dirección del reclamante',
  `phone` varchar(50) NOT NULL COMMENT 'Teléfono de contacto',
  `email` varchar(255) NOT NULL COMMENT 'Email del reclamante',
  `guardian_name` varchar(255) DEFAULT NULL COMMENT 'Nombre del tutor (si es menor de edad)',
  `bien_type` enum('Producto','Servicio') NOT NULL COMMENT 'Tipo de bien reclamado',
  `amount_claimed` decimal(10,2) NOT NULL COMMENT 'Monto reclamado',
  `bien_description` text COMMENT 'Descripción del bien',
  `complaint_type` enum('Reclamación','Queja') NOT NULL COMMENT 'Tipo de reclamo',
  `detail` text NOT NULL COMMENT 'Detalle del reclamo',
  `request` text NOT NULL COMMENT 'Pedido del reclamante',
  `response_text` text COMMENT 'Respuesta del salón',
  `response_date` datetime DEFAULT NULL COMMENT 'Fecha de respuesta',
  `status` enum('Pendiente','En Proceso','Resuelto') DEFAULT 'Pendiente' COMMENT 'Estado del reclamo',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_timestamp` (`timestamp`),
  KEY `idx_complaint_type` (`complaint_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Libro de reclamaciones';

-- ============================================================================
-- TABLA: holidays
-- Descripción: Feriados y días no laborables
-- ============================================================================

DROP TABLE IF EXISTS `holidays`;
CREATE TABLE `holidays` (
  `date` date NOT NULL COMMENT 'Fecha del feriado',
  PRIMARY KEY (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Calendario de feriados';

-- ============================================================================
-- TABLA: loyalty_config
-- Descripción: Configuración del programa de lealtad (Singleton)
-- ============================================================================

DROP TABLE IF EXISTS `loyalty_config`;
CREATE TABLE `loyalty_config` (
  `id` int NOT NULL DEFAULT 1 COMMENT 'ID fijo en 1 (singleton)',
  `points_per_sole` decimal(5,2) DEFAULT 1.00 COMMENT 'Puntos otorgados por cada sol gastado',
  `vip_threshold` decimal(10,2) DEFAULT 1000.00 COMMENT 'Umbral de gasto para categoría VIP',
  PRIMARY KEY (`id`),
  CONSTRAINT `loyalty_config_chk_1` CHECK ((`id` = 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Configuración del programa de lealtad (singleton)';

-- ============================================================================
-- TABLA: settings
-- Descripción: Configuración general del sistema (Key-Value Store)
-- ============================================================================

DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `key` varchar(100) NOT NULL COMMENT 'Clave de configuración',
  `value` text COMMENT 'Valor de configuración',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Configuración general del sistema';

-- ============================================================================
-- RESTAURAR CONFIGURACIÓN
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- COMENTARIOS Y DOCUMENTACIÓN ADICIONAL
-- ============================================================================

-- RELACIONES (Foreign Keys):
-- 1. appointments.client_id → clients.id (ON DELETE SET NULL)
-- 2. appointments.service_id → services.id (ON DELETE SET NULL)
-- 3. appointments.staff_id → staff.id (ON DELETE SET NULL)
-- 4. redemptions.client_id → clients.id (ON DELETE CASCADE)
-- 5. redemptions.promotion_id → promotions.id (ON DELETE CASCADE)

-- ÍNDICES ADICIONALES RECOMENDADOS PARA PERFORMANCE:
-- ALTER TABLE clients ADD INDEX idx_last_visit (last_visit);
-- ALTER TABLE clients ADD INDEX idx_loyalty_points (loyalty_points);
-- ALTER TABLE appointments ADD INDEX idx_date_status (date, status);
-- ALTER TABLE services ADD INDEX idx_category_active (category, active);

-- CONSIDERACIONES DE SEGURIDAD:
-- 1. Implementar vistas para acceso limitado a datos sensibles
-- 2. Encriptar columnas sensibles (doc_number, email) a nivel aplicación
-- 3. Implementar triggers para auditoría de cambios en tablas críticas
-- 4. Configurar usuarios de BD con privilegios mínimos necesarios

-- MANTENIMIENTO:
-- 1. OPTIMIZE TABLE clients, appointments; (mensual)
-- 2. ANALYZE TABLE clients, appointments; (semanal)
-- 3. Backup diario de toda la base de datos
-- 4. Retención de 30 días para appointments completadas

-- ============================================================================
-- FIN DEL DDL
-- ============================================================================
