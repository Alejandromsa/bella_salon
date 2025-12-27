# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BellaSalón is a modern beauty salon web application built with Next.js 16, TypeScript, and MySQL. The app provides a public-facing website for clients and a comprehensive admin panel for managing appointments, staff, services, clients, and loyalty programs. The application is fully internationalized in Spanish and features a premium "Nude" color palette with elegant typography.

## Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion for animations
- **Database**: MySQL 2 (mysql2/promise with connection pooling)
- **PWA**: @ducanh2912/next-pwa for Progressive Web App capabilities
- **Testing**: Jest with React Testing Library
- **PDF/Excel**: jspdf, jspdf-autotable, xlsx for exports

## Common Development Commands

```bash
# Install dependencies
npm install

# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## Database Setup

1. Ensure MySQL is running locally
2. Create database and tables: `mysql -u your_user -p < database.sql`
3. Configure environment variables in `.env` (see `.env.example` for template)
4. Required env vars: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

## Architecture Overview

### Database Layer (`src/lib/db.ts`)

All database access goes through a centralized MySQL connection pool with these settings:
- Connection limit: 10
- Auto-reconnect enabled
- Environment-based configuration

### API Routes (`src/app/api/`)

All API endpoints follow Next.js 13+ App Router conventions with route handlers:

- **Appointments**: `/api/appointments` - CRUD operations with pagination and search
- **Staff**: `/api/staff` - Manage salon staff with complex schedule data
- **Services**: `/api/services` - Service catalog management
- **Clients**: `/api/clients` - Client management with loyalty tracking
- **Promotions**: `/api/promotions` - Loyalty program and promotion management
- **Complaints**: `/api/complaints` - Libro de Reclamaciones (legal requirement in Peru)
- **Settings**: `/api/settings` - Key-value store for salon configuration
- **Booking**: `/api/booking` - Public booking endpoint for website visitors

### State Management Pattern

The admin panel (`src/app/administracion/page.tsx`) uses React state for all data management:
- Initial data load via `loadAllData()` which fetches from all API endpoints in parallel
- Appointments use separate pagination with `fetchAppointments(page, search)`
- All mutations (add/edit/delete) immediately call `loadAllData()` to refresh state
- Authentication state persists in localStorage with simple password check (`admin123`)

### Type System (`src/app/administracion/components/types.ts`)

All shared TypeScript interfaces are centralized in types.ts:
- `Staff` - includes complex schedule object with weekly patterns, vacations, exceptions
- `Service` - with assignedStaff array and featured flag
- `Appointment` - links clients, services, and staff
- `Client` - with loyalty points, VIP status, tags, and redemption history
- `Promotion` - triggers by visits or points, various reward types
- `Complaint` - for legal compliance (Libro de Reclamaciones)

### Component Structure

**Admin Panel Tabs** (`src/app/administracion/components/`):
- Each major feature is a separate tab component (AppointmentsTab, StaffTab, etc.)
- Shared modals: StaffScheduleModal, ClientProfileModal
- All tabs receive data and callbacks as props (no direct API calls in tabs)

**Public Components** (`src/components/`):
- `Navbar.tsx` - Global navigation
- `Footer.tsx` - Footer with legal links
- `WhatsAppButton.tsx` - Floating WhatsApp contact button
- `CustomCursor.tsx` - Premium custom cursor effect
- `DevToolsBlocker.tsx` - Prevents right-click and dev tools
- `ClientLayout.tsx` - Wraps pages with Framer Motion transitions

### Layout & Routing

- Root layout (`src/app/layout.tsx`) configures fonts, metadata, and global structure
- Uses Playfair Display (serif) for headings and Inter (sans-serif) for body text
- All pages use Spanish language (`<html lang="es">`)
- PWA manifest configured at `/manifest.json`

## Key Business Logic

### Staff Scheduling System

Staff have complex schedules stored in JSON with this structure:
```typescript
{
  weeklySchedule: {
    'Lun': { active: true, start: '09:00', end: '18:00', breaks: [] },
    // ... other days
  },
  vacations: ['2024-12-25', ...], // Array of YYYY-MM-DD strings
  exceptions: [{ date: '2024-12-24', start: '09:00', end: '14:00', reason: 'Holiday' }],
  worksHolidays: false
}
```

### Loyalty Program

- Clients earn points per sole spent (configurable in `loyalty_config` table)
- VIP status automatically assigned when `total_spent >= vip_threshold`
- Promotions trigger by either:
  - `visits` - Total or monthly visit count
  - `points` - Accumulated loyalty points
- Redemptions tracked in separate `redemptions` table
- Points deducted when promotions are redeemed

### Legal Compliance (Peru)

The app includes required legal features for Peruvian businesses:
- **Libro de Reclamaciones**: `/libro-de-reclamaciones` - complaint form
- **Privacy Policy**: `/privacidad`
- **Terms & Conditions**: `/terminos`
- All settings stored in `settings` table and editable via admin panel

## Working with This Codebase

### Adding a New Service

1. Use `/api/services` POST endpoint
2. Include `assignedStaff` array with staff names
3. Set `featured: true` to show on homepage
4. Image can be base64 data URI or Unsplash URL

### Adding API Endpoints

1. Create route handler in `src/app/api/[resource]/route.ts`
2. Export `GET`, `POST`, `PUT`, `DELETE` as needed
3. Use `pool.query()` from `@/lib/db` for database access
4. Always wrap in try-catch and return proper NextResponse
5. For dynamic routes use `[id]/route.ts` pattern

### Database Schema Changes

1. Update `database.sql` with new schema
2. Consider creating migration script in `src/scripts/migrate.ts`
3. Update TypeScript interfaces in `src/app/administracion/components/types.ts`
4. Update relevant API routes and admin panel tabs

### Styling Conventions

- Uses Tailwind CSS 4 with custom theme in `src/app/globals.css`
- Color palette based on CSS custom properties: `--nude-*` variables
- Primary: `#D4A574` (warm beige)
- Secondary: `#F5F0EB` (light nude)
- Background: `#FFFBF7` (off-white)
- Use semantic classes like `bg-primary`, `text-secondary`

### Testing

Tests are in `__tests__/` directory. Run with `npm test`. Jest configured with jsdom environment for React component testing.

## Important Notes

- Admin password is hardcoded as `admin123` in `src/app/administracion/page.tsx:213`
- Database connection pool is singleton - imported as needed across API routes
- All dates stored in MySQL DATETIME format
- Phone numbers support international format (e.g., `+51 999 999 999`)
- Images can be base64-encoded or URLs (primarily Unsplash images used)
- Dev tools blocker is active in production - remove if debugging needed
