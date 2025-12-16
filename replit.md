# Job Tracker Pro

## Overview

Job Tracker Pro is a full-stack web application for tracking job applications, interviews, and offers. Users can register, log in, and manage their own personalized job search progress through an interactive table interface with inline editing, status filtering, and data export capabilities.

Each user has their own private data - job applications are associated with individual user accounts for complete data isolation.

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
- **Primary Database**: MongoDB (MongoDB Atlas or self-hosted)
- **ODM**: Mongoose for schema definitions and queries
- **Schema Definition**: Mongoose models in `shared/schema.ts`
- **Connection**: Uses `MONGODB_URI` environment variable
- **Data Isolation**: Each user's job applications are stored with their userId reference

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
    lib/          # Utilities, auth context, API helpers
    hooks/        # Custom React hooks
server/           # Express backend
  routes.ts       # API route definitions (auth + jobs CRUD)
  storage.ts      # Data access layer with MongoStorage implementation
  db.ts           # MongoDB connection setup
shared/           # Shared types/schemas
  schema.ts       # Mongoose model definitions (User, JobApplication)
```

## External Dependencies

### Database
- **MongoDB**: MongoDB Atlas cloud database or self-hosted MongoDB
- **Connection**: Configured via `MONGODB_URI` environment variable

### Environment Variables Required
- `MONGODB_URI`: MongoDB connection string (e.g., mongodb+srv://user:pass@cluster.mongodb.net/dbname)
- `SESSION_SECRET`: Secret key for session encryption (optional, defaults to dev secret)

### Key NPM Packages
- **UI**: @radix-ui/* primitives, @tanstack/react-table, lucide-react icons
- **Backend**: express, express-session, connect-mongo, mongoose, bcryptjs
- **Validation**: zod for request validation
- **Date Handling**: date-fns

### Replit-Specific Plugins
- `@replit/vite-plugin-runtime-error-modal`: Development error overlay
- `@replit/vite-plugin-cartographer`: Development mapping
- `@replit/vite-plugin-dev-banner`: Development banner

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout current session
- `GET /api/auth/me` - Get current user info

### Job Applications (Protected)
- `GET /api/jobs` - Get all jobs for current user
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs` - Create a new job application
- `PATCH /api/jobs/:id` - Update a job application
- `DELETE /api/jobs` - Delete multiple jobs by IDs

## Deployment

### Replit Deployment
The project runs natively on Replit:
- **Database**: Connect to MongoDB Atlas or external MongoDB
- **Environment**: Set MONGODB_URI in Replit Secrets
- **Publishing**: Use the Replit publish feature to deploy your application
