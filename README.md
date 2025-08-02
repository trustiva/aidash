
# REST Express Application

A modern full-stack web application built with React, Express, TypeScript, and Tailwind CSS. This project features a dashboard interface with real-time data visualization and a robust backend API.

## Project Overview

This application provides:
- **Frontend**: React-based dashboard with modern UI components using Radix UI and Tailwind CSS
- **Backend**: Express.js REST API with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session management
- **Real-time Communication**: WebSocket support
- **UI Components**: Comprehensive component library with shadcn/ui

### Key Features
- Dashboard with statistics cards, recent proposals, and project management
- Automated status monitoring
- Quick actions interface
- Responsive design with dark/light theme support
- Type-safe API with Zod validation

## Setup Instructions

### Prerequisites
This project runs on Replit and requires no local installation. All dependencies are automatically managed.

### Getting Started

1. **Fork or Import**: Fork this Repl or import it into your Replit workspace

2. **Environment Setup**: Configure your environment variables using Replit's Secrets tool:
   - Database connection string (if using external database)
   - Session secret
   - Any API keys required

3. **Database Setup**: Run the database migration:
   ```bash
   npm run db:push
   ```

4. **Start Development**: Click the "Run" button or use:
   ```bash
   npm run dev
   ```

The application will be available at the provided Replit URL (typically on port 5000).

### Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking with TypeScript
- `npm run db:push` - Push database schema changes

## Usage Examples

### API Endpoints

The backend provides RESTful API endpoints. Here are some example interactions:

#### Dashboard Data
```bash
# Get dashboard statistics
curl https://your-repl-url.replit.dev/api/dashboard/stats

# Get recent proposals
curl https://your-repl-url.replit.dev/api/proposals/recent

# Get latest projects
curl https://your-repl-url.replit.dev/api/projects/latest
```

#### Authentication
```bash
# Login
curl -X POST https://your-repl-url.replit.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "password"}'

# Logout
curl -X POST https://your-repl-url.replit.dev/api/auth/logout
```

### Frontend Components

The application includes reusable React components:

```tsx
// Using dashboard components
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentProposals } from '@/components/dashboard/RecentProposals';

function MyDashboard() {
  return (
    <div>
      <StatsCards />
      <RecentProposals />
    </div>
  );
}
```

### Database Operations

Using Drizzle ORM for type-safe database operations:

```typescript
// Example query
import { db } from './server/storage';
import { users } from './shared/schema';

// Get all users
const allUsers = await db.select().from(users);

// Insert new user
await db.insert(users).values({
  name: 'John Doe',
  email: 'john@example.com'
});
```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main application component
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   └── storage.ts        # Database configuration
├── shared/               # Shared TypeScript types and schemas
└── package.json         # Dependencies and scripts
```

## Contributing Guidelines

We welcome contributions to this project! Here's how you can help:

### Getting Started with Contributions

1. **Fork the Repl**: Create your own copy of this project in Replit
2. **Make Changes**: Implement your feature or bug fix
3. **Test**: Ensure your changes work by running `npm run dev`
4. **Type Check**: Run `npm run check` to verify TypeScript compliance

### Code Standards

- **TypeScript**: All code should be properly typed
- **ESLint**: Follow the established linting rules
- **Components**: Use the existing component patterns and Radix UI primitives
- **Styling**: Use Tailwind CSS classes and follow the design system

### Types of Contributions

- **Bug Fixes**: Report and fix issues
- **Features**: Add new dashboard components or API endpoints
- **Documentation**: Improve README, comments, or add examples
- **Performance**: Optimize queries, components, or build process
- **Testing**: Add test coverage for components and API routes

### Pull Request Process

1. **Branch Naming**: Use descriptive branch names like `feature/user-management` or `fix/dashboard-loading`
2. **Commit Messages**: Write clear, descriptive commit messages
3. **Documentation**: Update relevant documentation
4. **Testing**: Ensure all functionality works as expected

### Code Review Guidelines

- Keep changes focused and atomic
- Include screenshots for UI changes
- Explain the reasoning behind significant changes
- Ensure backward compatibility when possible

### Development Tips

- Use the React Query dev tools for debugging API calls
- Leverage TypeScript for catching errors early
- Test responsive design across different screen sizes
- Use the browser dev tools for debugging WebSocket connections

## Deployment

This project is configured for automatic deployment on Replit:

1. **Build Process**: Runs `npm run build` automatically
2. **Production Server**: Starts with `npm run start`
3. **Environment**: Production environment variables are managed through Replit's Secrets

To deploy your changes, simply use Replit's deployment features through the Deployments tab.

## Support

If you encounter issues or have questions:

1. Check the console logs in your Repl
2. Review the network tab for API call issues
3. Ensure all environment variables are properly configured
4. Check that the database connection is working

For additional help, refer to Replit's documentation or community forums.
