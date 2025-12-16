# Job Tracker Pro

## Overview

Job Tracker Pro is a full-stack web application for tracking job applications, interviews, and offers. Users can register, log in, and manage their job search progress through an interactive table interface with inline editing, status filtering, and data export capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React useState/useContext for local state
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Data Table**: TanStack React Table for the job applications grid with sorting, filtering, and pagination
- **Build Tool**: Vite

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with tsx for development execution
- **API Pattern**: RESTful JSON APIs under `/api` prefix
- **Session Management**: express-session with PostgreSQL store (connect-pg-simple)

### Authentication
- **Strategy**: Session-based authentication with cookies
- **Password Hashing**: bcryptjs
- **Session Storage**: PostgreSQL via connect-pg-simple
- **Protected Routes**: Custom `requireAuth` middleware checks `req.session.userId`

### Data Storage
- **Primary Database**: PostgreSQL (Replit-native database)
- **ORM**: Drizzle ORM for type-safe database queries
- **Schema Definition**: Drizzle schema in `shared/schema.ts`
- **Connection**: Uses `DATABASE_URL` environment variable (automatically provided by Replit)
- **Client-side Persistence**: localStorage for job application data (mock data approach currently)

### Build Configuration
- **Development**: `npm run dev` runs the Express server with Vite middleware for HMR
- **Production Build**: Custom build script using esbuild for server bundling and Vite for client
- **Output**: Server compiles to `dist/index.cjs`, client assets to `dist/public/`

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components including job-table, editable-cell
    pages/        # Route pages (home, login, register)
    lib/          # Utilities, auth context, storage helpers
    hooks/        # Custom React hooks
server/           # Express backend
  routes.ts       # API route definitions
  storage.ts      # Data access layer with PostgresStorage implementation
  db.ts           # PostgreSQL connection and Drizzle setup
shared/           # Shared types/schemas
  schema.ts       # Drizzle ORM schema definitions
```

## External Dependencies

### Database
- **PostgreSQL**: Replit-native PostgreSQL database (Neon-backed)
- **Connection**: Automatically provided via `DATABASE_URL` environment variable

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string (auto-provisioned by Replit)
- `SESSION_SECRET`: Secret key for session encryption
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`: Auto-provisioned database credentials

### Key NPM Packages
- **UI**: @radix-ui/* primitives, @tanstack/react-table, lucide-react icons
- **Backend**: express, express-session, connect-pg-simple, pg, drizzle-orm, bcryptjs
- **Validation**: zod for request validation
- **Date Handling**: date-fns
- **Database**: drizzle-orm with node-postgres driver

### Replit-Specific Plugins
- `@replit/vite-plugin-runtime-error-modal`: Development error overlay
- `@replit/vite-plugin-cartographer`: Development mapping
- `@replit/vite-plugin-dev-banner`: Development banner