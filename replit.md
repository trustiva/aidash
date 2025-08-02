# Overview

This is a modern full-stack web application built as a freelancer productivity platform called "LazyLancer". The application provides an AI-powered dashboard for freelancers to manage their business operations, including automated proposal generation, client outreach, project management, and invoicing. The project features a React-based frontend with TypeScript, an Express.js backend API, and PostgreSQL database integration using Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **Component System**: Radix UI primitives for accessible, unstyled components
- **Animations**: Framer Motion for smooth animations and transitions
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Form Handling**: React Hook Form with Zod validation resolvers

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with /api prefix for all endpoints
- **Middleware**: Express middleware for request logging, JSON parsing, and error handling
- **Session Management**: Express sessions with Passport.js for authentication
- **Password Security**: bcrypt for password hashing

## Database Architecture
- **Database**: PostgreSQL as the primary database
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Connection**: Neon Database serverless driver for PostgreSQL connections
- **Data Validation**: Zod schemas for runtime type validation

## Authentication & Authorization
- **Strategy**: Passport.js with local strategy for username/password authentication
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Session Management**: Express sessions with secure configuration

## Project Structure
- **Monorepo Layout**: Shared schema and types between client and server
- **Client Directory**: React frontend application with component-based architecture
- **Server Directory**: Express backend with modular route organization
- **Shared Directory**: Common TypeScript types and database schemas

# External Dependencies

## Database & ORM
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon Database
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **drizzle-kit**: Schema management and migration tool
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## UI & Styling
- **@radix-ui/***: Complete set of accessible UI primitives (accordion, dialog, dropdown, etc.)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for managing component variants
- **clsx**: Conditional className utility
- **cmdk**: Command palette component

## Development & Build Tools
- **vite**: Frontend build tool and development server
- **@vitejs/plugin-react**: React plugin for Vite
- **typescript**: Static type checking
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds

## Authentication & Security
- **passport**: Authentication middleware for Express
- **bcrypt**: Password hashing library
- **express-session**: Session middleware for Express

## Data & API
- **@tanstack/react-query**: Server state management for React
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Runtime type validation and parsing
- **date-fns**: Date utility library

## Development Environment
- **@replit/vite-plugin-runtime-error-modal**: Replit-specific development tools
- **@replit/vite-plugin-cartographer**: Replit development enhancements
- **nanoid**: Unique ID generation utility