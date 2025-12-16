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
- **Primary Database**: MongoDB (MongoDB Atlas)
- **ODM**: Mongoose for schema definitions and queries
- **Schema Definition**: Mongoose models in `shared/schema.ts`
- **Connection**: Uses `MONGODB_URI` environment variable
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
  storage.ts      # Data access layer with MongoStorage implementation
  db.ts           # MongoDB connection setup
shared/           # Shared types/schemas
  schema.ts       # Mongoose model definitions
```

## External Dependencies

### Database
- **MongoDB**: MongoDB Atlas cloud database
- **Connection**: Configured via `MONGODB_URI` environment variable

### Environment Variables Required
- `MONGODB_URI`: MongoDB connection string (e.g., mongodb+srv://user:pass@cluster.mongodb.net/dbname)
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

## Deployment

### Vercel Deployment
The project is configured for Vercel deployment:
- **API**: Express routes run as serverless functions via `api/index.ts`
- **Frontend**: Vite builds static assets to `dist/public/`
- **Configuration**: See `vercel.json` for routing and build settings

#### Required Vercel Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `SESSION_SECRET`: Secret key for session encryption

#### Deployment Steps
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel project settings
3. Deploy - Vercel will auto-detect the Vite framework
