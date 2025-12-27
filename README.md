# 💇‍♀️ BellaSalón - Sistema de Gestión para Salones de Belleza

Una aplicación web completa y moderna para la gestión integral de salones de belleza, construida con Next.js 16, TypeScript y MySQL. Sistema profesional con panel de administración avanzado, sistema de reservas online, programa de lealtad y cumplimiento legal para Perú.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-2.0-orange?style=flat-square&logo=mysql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades Detalladas](#-funcionalidades-detalladas)
- [Panel de Administración](#-panel-de-administración)
- [API Endpoints](#-api-endpoints)
- [Base de Datos](#-base-de-datos)
- [Seguridad](#-seguridad)
- [Personalización](#-personalización)
- [Despliegue](#-despliegue)
- [Licencia](#-licencia)

---

## ✨ Características Principales

### 🌐 **Sitio Web Público**
- ✅ Diseño premium con paleta de colores "Nude" elegante
- ✅ Página de inicio moderna con secciones de servicios destacados
- ✅ Sistema de reservas online con validación en tiempo real
- ✅ Integración con WhatsApp para contacto directo
- ✅ Libro de Reclamaciones digital (cumplimiento legal Perú)
- ✅ Políticas de privacidad y términos y condiciones
- ✅ PWA (Progressive Web App) - instalable en dispositivos móviles
- ✅ Animaciones suaves con Framer Motion
- ✅ Cursor personalizado premium
- ✅ Botón flotante de WhatsApp
- ✅ Bloqueo de herramientas de desarrollo en producción

### 🎯 **Sistema de Reservas**
- ✅ Formulario multipaso intuitivo (servicio → especialista → fecha/hora → datos)
- ✅ Selección de servicios por categorías
- ✅ Calendario interactivo con días disponibles/no disponibles
- ✅ Validación de disponibilidad en tiempo real
- ✅ Detección automática de clientes existentes por DNI/documento
- ✅ Auto-llenado de datos para clientes recurrentes
- ✅ Prevención de doble reserva de horarios
- ✅ Sistema de restricción de tiempo configurable (anti-spam)
- ✅ Manejo de horarios de especialistas con vacaciones y excepciones
- ✅ Visualización de especialistas disponibles por servicio y fecha
- ✅ Notificación de hora pico

### 🏢 **Panel de Administración**
- ✅ Dashboard completo con autenticación
- ✅ Gestión de citas con paginación y búsqueda
- ✅ Gestión completa de personal (staff)
- ✅ Gestión de servicios por categorías
- ✅ Base de datos de clientes con historial
- ✅ Sistema de lealtad y puntos configurable
- ✅ Gestión de promociones automáticas
- ✅ Panel de estadísticas avanzado con múltiples períodos
- ✅ Gestión de días festivos
- ✅ Configuración global del salón
- ✅ Libro de reclamaciones (gestión y respuesta)
- ✅ Exportación de datos a PDF y Excel

### 📊 **Panel de Estadísticas Avanzado**
- ✅ Selector de períodos: Hoy, Semana, Mes, Año, Histórico
- ✅ KPIs principales con indicadores de crecimiento vs período anterior
- ✅ Análisis de ingresos totales y proyectados
- ✅ Métricas de citas (total, completadas, pendientes, canceladas)
- ✅ Ticket promedio por servicio
- ✅ Tasas de finalización y cancelación
- ✅ Análisis de clientes (activos, VIP, nuevos)
- ✅ Top 5 servicios por demanda e ingresos
- ✅ Rendimiento por especialista con tasa de cancelación
- ✅ Top 5 clientes VIP por gasto total
- ✅ Distribución de citas por día de la semana
- ✅ Identificación de hora pico
- ✅ Visualizaciones con barras de progreso y gráficos

### 💎 **Sistema de Lealtad**
- ✅ Acumulación automática de puntos por soles gastados
- ✅ Status VIP automático al alcanzar umbral configurable
- ✅ Sistema de promociones basado en:
  - Visitas totales o mensuales
  - Puntos acumulados
- ✅ Tipos de recompensas:
  - Descuentos porcentuales
  - Servicios gratuitos
- ✅ Historial de canjes de promociones
- ✅ Perfil detallado de cliente con:
  - Visitas totales y última visita
  - Gasto total y puntos acumulados
  - Servicios preferidos
  - Tags personalizables
  - Notas privadas

### ⚙️ **Configuración Avanzada**
- ✅ Información legal y fiscal (RUC, razón social, dirección)
- ✅ Configuración de canales de contacto
- ✅ Habilitar/deshabilitar reservas online
- ✅ Redirección a WhatsApp cuando reservas están deshabilitadas
- ✅ **Sistema de restricción de tiempo para reservas configurable**:
  - Habilitar/deshabilitar restricción
  - Tiempo de espera configurable entre reservas (minutos)
  - Límite máximo de reservas por dispositivo
- ✅ Horario estándar de especialistas configurable
- ✅ Horarios personalizados por especialista
- ✅ Gestión de vacaciones y excepciones
- ✅ Días festivos del negocio

### 📱 **Características Técnicas**
- ✅ Server-Side Rendering (SSR) con Next.js 16
- ✅ TypeScript para type safety
- ✅ MySQL con connection pooling optimizado
- ✅ API RESTful bien estructurada
- ✅ Validación de datos en frontend y backend
- ✅ Manejo robusto de errores
- ✅ Parsing inteligente de fechas (múltiples formatos)
- ✅ Transacciones de base de datos para operaciones críticas
- ✅ Paginación eficiente para grandes volúmenes de datos
- ✅ Búsqueda en tiempo real

### 🇵🇪 **Cumplimiento Legal (Perú)**
- ✅ Libro de Reclamaciones Digital (Ley N° 29571)
- ✅ Política de Privacidad (Ley N° 29733)
- ✅ Términos y Condiciones
- ✅ Enlaces obligatorios visibles en footer
- ✅ Formulario completo de reclamaciones con todos los campos requeridos
- ✅ Sistema de gestión y respuesta de reclamaciones

---

## 🛠 Stack Tecnológico

### Frontend
- **Framework**: Next.js 16.0.10 (App Router)
- **UI Library**: React 19
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4
- **Animaciones**: Framer Motion
- **Formularios**: React Hook Form
- **Date Picker**: react-datepicker
- **PWA**: @ducanh2912/next-pwa

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Base de Datos**: MySQL 2 (mysql2/promise)
- **ORM**: SQL Directo (sin ORM, queries optimizadas)

### Librerías Adicionales
- **Exportación PDF**: jspdf, jspdf-autotable
- **Exportación Excel**: xlsx
- **Internacionalización**: date-fns/locale

---

## 📸 Capturas de Pantalla

*(Agrega capturas de pantalla de tu aplicación aquí)*

---

## 🚀 Instalación

### Requisitos Previos

- Node.js 18+
- MySQL 5.7+ o MySQL 8+
- npm o yarn

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/beauty-salon.git
cd beauty-salon
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Base de Datos

1. **Crear la base de datos**:
```bash
mysql -u root -p
```

```sql
CREATE DATABASE bella_salon;
EXIT;
```

2. **Ejecutar el schema**:
```bash
mysql -u root -p bella_salon < database.sql
```

3. **(Opcional) Cargar datos de prueba**:
```bash
mysql -u root -p bella_salon < insert_rate_limit_settings.sql
```

### Paso 4: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=bella_salon
```

### Paso 5: Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Paso 6: Acceder al Panel de Administración

1. Ir a [http://localhost:3000/administracion](http://localhost:3000/administracion)
2. Contraseña por defecto: `admin123`
3. **⚠️ IMPORTANTE**: Cambia la contraseña en producción (línea 213 de `src/app/administracion/page.tsx`)

---

## ⚙️ Configuración

### Configuración del Sistema de Reservas

Desde el panel de administración → Configuración:

1. **Habilitar/Deshabilitar Reservas Online**
2. **Configurar Restricción de Tiempo**:
   - Habilitar restricción
   - Tiempo de espera entre reservas (minutos)
   - Máximo de reservas por dispositivo

### Configuración de Información Legal

1. Ir a **Configuración** en el panel de administración
2. Completar:
   - Razón Social
   - RUC
   - Dirección Fiscal
   - Número de WhatsApp

### Configuración de Horarios

1. **Horario Estándar**: Configuración → Horario Estándar de Especialistas
2. **Horarios Personalizados**: Gestión de Personal → Editar Especialista → Horario Personalizado

### Configuración del Programa de Lealtad

1. Ir a **Promociones** → **Configuración de Lealtad**
2. Ajustar:
   - Puntos por sol gastado
   - Umbral para status VIP

---

## 📁 Estructura del Proyecto

```
beauty-salon/
├── public/                          # Archivos estáticos
│   ├── manifest.json               # PWA manifest
│   └── icons/                      # Iconos de la PWA
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── page.tsx               # Página de inicio
│   │   ├── layout.tsx             # Layout raíz
│   │   ├── globals.css            # Estilos globales + Tailwind
│   │   ├── administracion/        # Panel de administración
│   │   │   ├── page.tsx           # Página principal del panel
│   │   │   └── components/        # Componentes del panel
│   │   │       ├── AppointmentsTab.tsx
│   │   │       ├── StaffTab.tsx
│   │   │       ├── ServicesTab.tsx
│   │   │       ├── ClientsTab.tsx
│   │   │       ├── PromotionsTab.tsx
│   │   │       ├── StatsTab.tsx   # Panel de estadísticas avanzado
│   │   │       ├── SettingsTab.tsx
│   │   │       ├── ComplaintsTab.tsx
│   │   │       └── types.ts       # TypeScript interfaces
│   │   ├── reservar/              # Sistema de reservas
│   │   │   └── page.tsx
│   │   ├── libro-de-reclamaciones/
│   │   │   └── page.tsx
│   │   ├── privacidad/
│   │   │   └── page.tsx
│   │   ├── terminos/
│   │   │   └── page.tsx
│   │   └── api/                   # API Routes
│   │       ├── appointments/
│   │       ├── staff/
│   │       ├── services/
│   │       ├── clients/
│   │       ├── promotions/
│   │       ├── settings/
│   │       ├── holidays/
│   │       ├── complaints/
│   │       └── booking/
│   ├── components/                # Componentes compartidos
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── WhatsAppButton.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── DevToolsBlocker.tsx
│   │   └── ClientLayout.tsx
│   └── lib/
│       └── db.ts                  # Conexión MySQL
├── database.sql                    # Schema de base de datos
├── insert_rate_limit_settings.sql # Configuraciones iniciales
├── .env.example                    # Template de variables de entorno
├── next.config.mjs                # Configuración de Next.js
├── tailwind.config.ts             # Configuración de Tailwind
├── tsconfig.json                  # Configuración de TypeScript
└── package.json                   # Dependencias del proyecto
```

---

## 🎯 Funcionalidades Detalladas

### Sistema de Citas

**Características**:
- Estados: Pendiente, Confirmada, Completada, Cancelada
- Búsqueda por nombre, teléfono, servicio o especialista
- Paginación (10 citas por página)
- Cambio rápido de estado con un clic
- Validación de solapamiento de horarios
- Prevención de doble reserva

**Flujo de Reserva**:
1. Seleccionar servicio (filtrable por categoría)
2. Elegir especialista (o "Cualquiera")
3. Seleccionar fecha (valida días festivos, horarios del negocio, vacaciones de especialistas)
4. Elegir hora disponible (según horario del especialista, slots de 30 min)
5. Ingresar datos personales (auto-detecta clientes existentes por DNI)
6. Confirmación

### Gestión de Personal

**Datos del Especialista**:
- Información básica: nombre, rol, email, teléfono, bio, especialidades
- Foto de perfil
- Estado activo/inactivo

**Horarios**:
- **Horario Regular**: Usa el horario estándar configurado
- **Horario Personalizado**: Define horarios por día de la semana
  - Horario de inicio y fin
  - Descansos (breaks) configurables
  - Días activos/inactivos

**Vacaciones y Excepciones**:
- Vacaciones: Lista de fechas no disponibles
- Excepciones: Horarios especiales para fechas específicas (ej. día festivo con horario reducido)
- Configuración si trabaja en festivos

### Gestión de Servicios

**Categorías**:
Cabello, Coloración, Uñas, Facial, Corporal, Masajes, Depilación, Maquillaje, Cejas y Pestañas, Spa, Otros

**Datos del Servicio**:
- Nombre y descripción
- Precio y duración (minutos)
- Categoría
- Imagen
- Especialistas asignados
- Destacado (featured)
- Estado activo/inactivo

### Gestión de Clientes

**Perfil de Cliente**:
- Datos personales: nombre, email, teléfono, documento, fecha de nacimiento, dirección
- Métricas: visitas totales, gasto total, última visita
- Programa de lealtad: puntos acumulados, status VIP
- Servicios preferidos (calculado automáticamente)
- Tags personalizables
- Notas privadas

**Historial**:
- Citas del mes actual
- Historial de canjes de promociones

---

## 🔐 Panel de Administración

### Tabs Disponibles

1. **📝 Citas y Agenda**
   - Lista paginada de citas
   - Búsqueda en tiempo real
   - Cambio rápido de estado
   - Creación manual de citas
   - Eliminación de citas

2. **👥 Gestión de Personal**
   - Agregar/editar/eliminar especialistas
   - Modal de configuración de horarios avanzado
   - Gestión de vacaciones
   - Activar/desactivar especialistas

3. **💇 Gestión de Servicios**
   - CRUD completo de servicios
   - Asignación de especialistas
   - Filtro por categoría
   - Marcar como destacado

4. **👤 Gestión de Clientes**
   - Base de datos completa de clientes
   - Búsqueda avanzada
   - Perfil detallado con modal
   - Visualización de historial
   - Sistema de tags

5. **🎁 Promociones**
   - Crear promociones automáticas
   - Configuración de triggers (visitas/puntos)
   - Tipos de recompensa (descuento/servicio gratis)
   - Activar/desactivar promociones
   - Configuración global del programa de lealtad

6. **📊 Estadísticas**
   - Panel avanzado con múltiples períodos
   - 20+ métricas diferentes
   - Visualizaciones interactivas
   - Comparación vs período anterior
   - Exportación de datos

7. **⚙️ Configuración**
   - Información legal y fiscal
   - Configuración de reservas online
   - Sistema de restricción de tiempo
   - Horario estándar de especialistas
   - Días festivos

8. **📋 Libro de Reclamaciones**
   - Visualización de reclamos
   - Responder reclamos
   - Cambiar estado (Pendiente/Resuelto)
   - Cumplimiento legal

---

## 🔌 API Endpoints

### Appointments
- `GET /api/appointments?page=1&limit=10&search=query`
- `POST /api/appointments`
- `PUT /api/appointments/[id]`
- `DELETE /api/appointments/[id]`

### Staff
- `GET /api/staff`
- `POST /api/staff`
- `PUT /api/staff/[id]`
- `DELETE /api/staff/[id]`

### Services
- `GET /api/services`
- `POST /api/services`
- `PUT /api/services/[id]`
- `DELETE /api/services/[id]`

### Clients
- `GET /api/clients`
- `GET /api/clients/search?docType=DNI&docNumber=12345678`
- `POST /api/clients`
- `PUT /api/clients/[id]`
- `DELETE /api/clients/[id]`

### Promotions
- `GET /api/promotions`
- `POST /api/promotions`
- `PUT /api/promotions/[id]`
- `DELETE /api/promotions/[id]`

### Settings
- `GET /api/settings`
- `POST /api/settings`

### Holidays
- `GET /api/holidays`
- `POST /api/holidays`
- `DELETE /api/holidays`

### Complaints
- `GET /api/complaints`
- `POST /api/complaints`
- `PUT /api/complaints/[id]`

### Booking (Público)
- `POST /api/booking`

---

## 🗄️ Base de Datos

### Tablas Principales

#### `staff`
Información de especialistas con horarios JSON complejos.

#### `services`
Catálogo de servicios con precios y asignación de especialistas.

#### `clients`
Base de datos de clientes con programa de lealtad.

#### `appointments`
Sistema completo de citas con relaciones a clientes, servicios y especialistas.

#### `promotions`
Promociones automáticas basadas en visitas o puntos.

#### `redemptions`
Historial de canjes de promociones por cliente.

#### `loyalty_config`
Configuración singleton del programa de lealtad.

#### `complaints`
Libro de reclamaciones digital (cumplimiento legal).

#### `settings`
Tabla key-value para configuraciones globales.

#### `holidays`
Fechas de días festivos del negocio.

### Relaciones

```
clients (1) ─── (N) appointments
services (1) ─── (N) appointments
staff (1) ─── (N) appointments
clients (1) ─── (N) redemptions
promotions (1) ─── (N) redemptions
```

---

## 🔒 Seguridad

### Implementado

- ✅ Autenticación del panel de administración
- ✅ Validación de entrada en frontend y backend
- ✅ Prevención de SQL injection (prepared statements)
- ✅ Sanitización de datos
- ✅ Sistema anti-spam configurable para reservas
- ✅ Manejo seguro de errores (sin exposición de stack traces)
- ✅ Bloqueo de herramientas de desarrollo en producción
- ✅ Rate limiting en reservas

### Recomendaciones para Producción

⚠️ **IMPORTANTE**: Antes de desplegar en producción:

1. **Cambiar la contraseña de administración**
   - Editar `src/app/administracion/page.tsx:213`
   - Implementar hash de contraseñas (bcrypt)

2. **Implementar autenticación robusta**
   - JWT o NextAuth.js
   - Sesiones con cookies HTTP-only

3. **Variables de entorno**
   - No commitear `.env` al repositorio
   - Usar variables de entorno en el servidor

4. **HTTPS**
   - Obligatorio en producción
   - Configurar SSL/TLS

5. **Base de datos**
   - Usuario de DB con permisos limitados
   - Backup automático configurado

6. **CORS**
   - Configurar orígenes permitidos

---

## 🎨 Personalización

### Colores

Los colores se definen en `src/app/globals.css`:

```css
:root {
  --nude-50: #FFFBF7;
  --nude-100: #F5F0EB;
  --nude-200: #E8DED5;
  --nude-300: #D4C4B5;
  --nude-400: #C0AA95;
  --nude-500: #A88F75;
  --nude-600: #8B7359;
  --nude-700: #6E5A45;
  --nude-800: #4A3D2F;
  --nude-900: #2D251D;
  --primary: #D4A574;
  --secondary: #F5F0EB;
  --background: #FFFBF7;
  --foreground: #2D251D;
  --accent: #C0AA95;
}
```

### Tipografía

- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

Configurado en `src/app/layout.tsx`

### Logo y Branding

- Reemplazar el nombre "BellaSalón" en:
  - `src/components/Navbar.tsx`
  - `src/components/Footer.tsx`
  - `public/manifest.json`
  - Metadata en `src/app/layout.tsx`

---

## 🚀 Despliegue

### Vercel (Recomendado para Next.js)

1. **Conectar repositorio a Vercel**

2. **Configurar variables de entorno**:
   ```
   DB_HOST=tu-host-mysql
   DB_USER=tu-usuario
   DB_PASSWORD=tu-password
   DB_NAME=bella_salon
   ```

3. **Configurar base de datos**:
   - Usar PlanetScale, Railway, o cualquier MySQL en la nube
   - Ejecutar `database.sql` en la base de datos remota

4. **Deploy**

### Otras Plataformas

- **AWS**: EC2 + RDS (MySQL)
- **DigitalOcean**: App Platform + Managed MySQL
- **Heroku**: Heroku + ClearDB MySQL
- **Netlify**: Netlify + External MySQL

---

## 📚 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm start

# Linting
npm run lint

# Testing (si está configurado)
npm test
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Changelog

### v1.0.0 (Fecha actual)
- ✅ Sistema completo de gestión de salón de belleza
- ✅ Panel de administración con 8 módulos principales
- ✅ Sistema de reservas online con validación avanzada
- ✅ Programa de lealtad y promociones automáticas
- ✅ Panel de estadísticas avanzado con múltiples períodos
- ✅ Sistema de restricción de tiempo configurable
- ✅ Cumplimiento legal para Perú (Libro de Reclamaciones)
- ✅ PWA con soporte offline básico
- ✅ Exportación a PDF y Excel

---

## 🐛 Problemas Conocidos

Ninguno por el momento. Por favor reporta cualquier bug en [Issues](https://github.com/tu-usuario/beauty-salon/issues).

---

## 📧 Soporte

Para soporte o preguntas:
- **Email**: tu-email@ejemplo.com
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/beauty-salon/issues)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👏 Agradecimientos

- Next.js Team por el framework increíble
- Vercel por el hosting
- Comunidad de código abierto

---

## 🌟 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)

---

<div align="center">

**Hecho con ❤️ para la industria de la belleza**

⭐ **Si te gusta este proyecto, dale una estrella en GitHub!** ⭐

</div>
