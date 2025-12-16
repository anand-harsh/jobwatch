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
- **Session Management**: express-session with MongoDB store (connect-mongo)

### Authentication
- **Strategy**: Session-based authentication with cookies
- **Password Hashing**: bcryptjs
- **Session Storage**: MongoDB via connect-mongo
- **Protected Routes**: Custom `requireAuth` middleware checks `req.session.userId`

### Data Storage
- **Primary Database**: MongoDB via Mongoose ODM
- **Schema Definition**: Mongoose models in `server/models/`
- **Connection**: Requires `MONGODB_URI` environment variable
- **Client-side Persistence**: localStorage for job application data (mock data approach currently)

Note: The repository contains Drizzle ORM configuration for PostgreSQL (`drizzle.config.ts`, `shared/schema.ts`), but the actual implementation uses MongoDB. The Drizzle schema serves as a reference or future migration path.

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
  models/         # Mongoose models
  routes.ts       # API route definitions
  storage.ts      # Data access layer abstraction
  db.ts           # MongoDB connection
shared/           # Shared types/schemas (Drizzle schemas present but MongoDB used)
```

## External Dependencies

### Database
- **MongoDB**: Primary database, connection via `MONGODB_URI` environment variable

### Environment Variables Required
- `MONGODB_URI`: MongoDB connection string
- `SESSION_SECRET`: Secret key for session encryption

### Key NPM Packages
- **UI**: @radix-ui/* primitives, @tanstack/react-table, lucide-react icons
- **Backend**: express, express-session, connect-mongo, mongoose, bcryptjs
- **Validation**: zod for request validation
- **Date Handling**: date-fns

### Replit-Specific Plugins
- `@replit/vite-plugin-runtime-error-modal`: Development error overlay
- `@replit/vite-plugin-cartographer`: Development mapping
- `@replit/vite-plugin-dev-banner`: Development banner