import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { 
  insertUserSchema, insertProjectSchema, insertProposalSchema, 
  insertClientSchema, insertInvoiceSchema, insertTaskSchema,
  type User 
} from "@shared/schema";
import { z } from "zod";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      email: string;
    }
  }
}

// Authentication middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Authentication required" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key-for-lazylancer-platform-2025',
    resave: false,
    saveUninitialized: false,
    // Use default memory store for now
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      sameSite: 'lax'
    },
    name: 'lazylancer.sid',
    rolling: true // Reset expiration on activity
  }));

  // Passport configuration
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport local strategy
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email: string, password: string, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, { id: user.id, username: user.username, email: user.email });
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (user) {
        done(null, { id: user.id, username: user.username, email: user.email });
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error);
    }
  });

  // Auth routes
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const newUser = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      res.status(201).json({ 
        message: 'User created successfully',
        user: { id: newUser.id, username: newUser.username, email: newUser.email }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  app.post('/api/auth/login', (req: Request, res: Response, next: NextFunction) => {
    console.log('Login attempt for:', req.body.email);
    passport.authenticate('local', (err: any, user: Express.User | false, info: any) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (!user) {
        console.log('Login failed:', info?.message);
        return res.status(401).json({ error: info?.message || "Authentication failed" });
      }
      
      req.logIn(user, (err) => {
        if (err) {
          console.error('Session creation error:', err);
          return res.status(500).json({ error: "Login failed" });
        }
        console.log('Login successful for user:', user.id);
        res.json({ message: "Login successful", user });
      });
    })(req, res, next);
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.json({ message: 'Logout successful' });
    });
  });

  app.get('/api/auth/me', requireAuth, (req: Request, res: Response) => {
    res.json({ user: req.user });
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', requireAuth, async (req: Request, res: Response) => {
    try {
      const stats = await storage.getDashboardStats(req.user!.id);
      res.json({ data: stats });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  });

  // Project routes
  app.get('/api/projects', requireAuth, async (req: Request, res: Response) => {
    try {
      const projects = await storage.getProjects(req.user!.id);
      res.json({ data: projects });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  app.get('/api/projects/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const project = await storage.getProject(parseInt(req.params.id));
      if (!project || project.userId !== req.user!.id) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json({ data: project });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  });

  app.post('/api/projects', requireAuth, async (req: Request, res: Response) => {
    try {
      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const project = await storage.createProject(projectData);
      res.status(201).json({ data: project });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  app.patch('/api/projects/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const project = await storage.getProject(parseInt(req.params.id));
      if (!project || project.userId !== req.user!.id) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      const updatedProject = await storage.updateProject(parseInt(req.params.id), req.body);
      res.json({ data: updatedProject });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update project' });
    }
  });

  app.delete('/api/projects/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const project = await storage.getProject(parseInt(req.params.id));
      if (!project || project.userId !== req.user!.id) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      await storage.deleteProject(parseInt(req.params.id));
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  // Proposal routes
  app.get('/api/proposals', requireAuth, async (req: Request, res: Response) => {
    try {
      const proposals = await storage.getProposals(req.user!.id);
      res.json({ data: proposals });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch proposals' });
    }
  });

  app.get('/api/proposals/recent', requireAuth, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const proposals = await storage.getRecentProposals(req.user!.id, limit);
      res.json({ data: proposals });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch recent proposals' });
    }
  });

  app.post('/api/proposals', requireAuth, async (req: Request, res: Response) => {
    try {
      const proposalData = insertProposalSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const proposal = await storage.createProposal(proposalData);
      res.status(201).json({ data: proposal });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create proposal' });
    }
  });

  app.patch('/api/proposals/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const proposal = await storage.getProposal(parseInt(req.params.id));
      if (!proposal || proposal.userId !== req.user!.id) {
        return res.status(404).json({ error: 'Proposal not found' });
      }
      
      const updatedProposal = await storage.updateProposal(parseInt(req.params.id), req.body);
      res.json({ data: updatedProposal });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update proposal' });
    }
  });

  // Client routes
  app.get('/api/clients', requireAuth, async (req: Request, res: Response) => {
    try {
      const clients = await storage.getClients(req.user!.id);
      res.json({ data: clients });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch clients' });
    }
  });

  app.post('/api/clients', requireAuth, async (req: Request, res: Response) => {
    try {
      const clientData = insertClientSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const client = await storage.createClient(clientData);
      res.status(201).json({ data: client });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create client' });
    }
  });

  // Invoice routes
  app.get('/api/invoices', requireAuth, async (req: Request, res: Response) => {
    try {
      const invoices = await storage.getInvoices(req.user!.id);
      res.json({ data: invoices });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch invoices' });
    }
  });

  app.post('/api/invoices', requireAuth, async (req: Request, res: Response) => {
    try {
      const invoiceData = insertInvoiceSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const invoice = await storage.createInvoice(invoiceData);
      res.status(201).json({ data: invoice });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create invoice' });
    }
  });

  // Task routes
  app.get('/api/tasks', requireAuth, async (req: Request, res: Response) => {
    try {
      const tasks = await storage.getTasks(req.user!.id);
      res.json({ data: tasks });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });

  app.post('/api/tasks', requireAuth, async (req: Request, res: Response) => {
    try {
      const taskData = insertTaskSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const task = await storage.createTask(taskData);
      res.status(201).json({ data: task });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create task' });
    }
  });

  app.patch('/api/tasks/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const task = await storage.getTask(parseInt(req.params.id));
      if (!task || task.userId !== req.user!.id) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      const updatedTask = await storage.updateTask(parseInt(req.params.id), req.body);
      res.json({ data: updatedTask });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task' });
    }
  });

  // Automation settings routes
  app.get('/api/automation', requireAuth, async (req: Request, res: Response) => {
    try {
      const settings = await storage.getAutomationSettings(req.user!.id);
      res.json({ data: settings });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch automation settings' });
    }
  });

  app.patch('/api/automation', requireAuth, async (req: Request, res: Response) => {
    try {
      const settings = await storage.updateAutomationSettings(req.user!.id, req.body);
      res.json({ data: settings });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update automation settings' });
    }
  });

  // AI routes for proposal generation
  app.post('/api/ai/generate-proposal', requireAuth, async (req: Request, res: Response) => {
    try {
      const { jobDescription, clientInfo } = req.body;
      
      // Simulate AI proposal generation
      const generatedProposal = {
        title: `Proposal for ${clientInfo?.name || 'Client'} Project`,
        content: `Dear ${clientInfo?.name || 'Client'},

I am excited to submit my proposal for your project. Based on your requirements:

${jobDescription}

I propose to deliver a comprehensive solution that includes:
- Modern, responsive design
- Clean, maintainable code
- Regular progress updates
- Post-delivery support

Timeline: 2-4 weeks
Budget: Competitive pricing based on project scope

I look forward to discussing this opportunity further.

Best regards,
${req.user!.username}`,
        budget: "2500.00"
      };

      res.json({ data: generatedProposal });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate proposal' });
    }
  });

  // Latest projects endpoint
  app.get('/api/projects/latest', requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const projects = await storage.getProjectsByUserId(userId);
      
      // Sort by creation date and limit to 5 latest
      const latestProjects = projects
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      res.json({ data: latestProjects });
    } catch (error) {
      console.error('Latest projects error:', error);
      res.status(500).json({ error: "Failed to fetch latest projects" });
    }
  });

  // Live projects from freelance platforms endpoint
  app.get('/api/live-projects', async (req: Request, res: Response) => {
    try {
      // Mock data representing live projects from various platforms
      // In production, this would integrate with freelance platform APIs
      const liveProjects = [
        // Guru.com projects
        {
          id: `guru-${Date.now()}-1`,
          title: 'React Developer for SaaS Dashboard',
          description: 'Looking for an experienced React developer to build a comprehensive SaaS dashboard with real-time analytics, user management, and subscription handling. Must have experience with modern React patterns and state management.',
          budget: '$3,500 - $7,000',
          deadline: '3-4 weeks',
          skills: ['React', 'TypeScript', 'Node.js', 'Redux', 'Dashboard Development'],
          platform: 'guru',
          url: 'https://www.guru.com/d/jobs/c/web-programming/',
          postedTime: `${Math.floor(Math.random() * 6) + 1} hours ago`,
          category: 'Web Development',
          clientRating: 4.8,
          proposalsCount: Math.floor(Math.random() * 15) + 8,
          verified: true,
          urgent: Math.random() > 0.7
        },
        {
          id: `guru-${Date.now()}-2`,
          title: 'Full Stack MERN Developer',
          description: 'Need a skilled full-stack developer for a social media platform. Features include user profiles, real-time messaging, content sharing, and advanced search functionality.',
          budget: '$4,000 - $8,000',
          deadline: '4-6 weeks',
          skills: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Socket.io', 'AWS'],
          platform: 'guru',
          url: 'https://www.guru.com/d/jobs/c/web-programming/',
          postedTime: `${Math.floor(Math.random() * 12) + 1} hours ago`,
          category: 'Web Development',
          clientRating: 4.9,
          proposalsCount: Math.floor(Math.random() * 20) + 10,
          verified: true
        },
        {
          id: `guru-${Date.now()}-3`,
          title: 'E-commerce Platform Development',
          description: 'Build a modern e-commerce platform with advanced features like multi-vendor support, inventory management, payment processing, and order tracking.',
          budget: '$5,000 - $10,000',
          deadline: '6-8 weeks',
          skills: ['WordPress', 'WooCommerce', 'PHP', 'MySQL', 'Payment Gateway'],
          platform: 'guru',
          url: 'https://www.guru.com/d/jobs/c/ecommerce/',
          postedTime: `${Math.floor(Math.random() * 8) + 1} hours ago`,
          category: 'E-commerce',
          clientRating: 4.7,
          proposalsCount: Math.floor(Math.random() * 25) + 15,
          verified: true,
          urgent: true
        },
        // Upwork projects
        {
          id: `upwork-${Date.now()}-1`,
          title: 'Mobile App Development - Flutter',
          description: 'Seeking Flutter developer to create a cross-platform mobile app for fitness tracking. Includes user authentication, workout plans, progress tracking, and social features.',
          budget: '$3,000 - $6,000',
          deadline: '5-7 weeks',
          skills: ['Flutter', 'Dart', 'Firebase', 'Mobile Development', 'API Integration'],
          platform: 'upwork',
          url: 'https://www.upwork.com/jobs/mobile-app-development',
          postedTime: `${Math.floor(Math.random() * 10) + 1} hours ago`,
          category: 'Mobile Development',
          clientRating: 4.6,
          proposalsCount: Math.floor(Math.random() * 18) + 12,
          verified: true
        },
        {
          id: `upwork-${Date.now()}-2`,
          title: 'Python Data Science Project',
          description: 'Looking for Python expert to analyze customer data, build predictive models, and create interactive dashboards. Experience with ML libraries required.',
          budget: '$2,500 - $5,000',
          deadline: '2-3 weeks',
          skills: ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow', 'Data Visualization'],
          platform: 'upwork',
          url: 'https://www.upwork.com/jobs/python-data-science',
          postedTime: `${Math.floor(Math.random() * 5) + 1} hours ago`,
          category: 'Data Science',
          clientRating: 4.8,
          proposalsCount: Math.floor(Math.random() * 22) + 8,
          verified: true
        },
        // Freelancer projects
        {
          id: `freelancer-${Date.now()}-1`,
          title: 'UI/UX Design for Web Application',
          description: 'Need a creative UI/UX designer to design a modern web application interface. Should include wireframes, prototypes, and final designs with a focus on user experience.',
          budget: '$1,500 - $3,500',
          deadline: '2-3 weeks',
          skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping', 'User Research'],
          platform: 'freelancer',
          url: 'https://www.freelancer.com/projects/graphic-design',
          postedTime: `${Math.floor(Math.random() * 7) + 1} hours ago`,
          category: 'Design',
          clientRating: 4.5,
          proposalsCount: Math.floor(Math.random() * 16) + 6,
          verified: true
        },
        {
          id: `freelancer-${Date.now()}-2`,
          title: 'WordPress Website Development',
          description: 'Build a professional WordPress website for a consulting firm. Includes custom theme development, content management, SEO optimization, and contact forms.',
          budget: '$1,200 - $2,800',
          deadline: '2-4 weeks',
          skills: ['WordPress', 'PHP', 'Custom Themes', 'SEO', 'Responsive Design'],
          platform: 'freelancer',
          url: 'https://www.freelancer.com/projects/wordpress',
          postedTime: `${Math.floor(Math.random() * 14) + 1} hours ago`,
          category: 'Web Development',
          clientRating: 4.4,
          proposalsCount: Math.floor(Math.random() * 20) + 10,
          verified: false
        },
        // Additional projects from various platforms
        {
          id: `fiverr-${Date.now()}-1`,
          title: 'Shopify Store Setup and Customization',
          description: 'Set up and customize a Shopify store for dropshipping business. Includes theme customization, product imports, payment setup, and app integrations.',
          budget: '$800 - $2,000',
          deadline: '1-2 weeks',
          skills: ['Shopify', 'E-commerce', 'Liquid', 'Theme Customization', 'App Integration'],
          platform: 'fiverr',
          url: 'https://www.fiverr.com/gigs/shopify-store',
          postedTime: `${Math.floor(Math.random() * 9) + 1} hours ago`,
          category: 'E-commerce',
          clientRating: 4.3,
          proposalsCount: Math.floor(Math.random() * 12) + 5,
          verified: false,
          urgent: Math.random() > 0.8
        }
      ];
      
      res.json({ 
        projects: liveProjects,
        timestamp: new Date().toISOString(),
        totalCount: liveProjects.length,
        sources: ['guru', 'upwork', 'freelancer', 'fiverr', 'remote'],
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Live projects error:', error);
      res.status(500).json({ error: "Failed to fetch live projects" });
    }
  });

  // Dashboard statistics endpoint
  app.get('/api/dashboard/stats', requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      
      // Fetch user's data for statistics
      const [projects, proposals, invoices, tasks] = await Promise.all([
        storage.getProjectsByUserId(userId),
        storage.getProposals(userId),
        storage.getInvoices(userId),
        storage.getTasks(userId)
      ]);

      // Calculate statistics
      const totalRevenue = invoices
        .filter(invoice => invoice.status === 'paid')
        .reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);

      const activeProjects = projects.filter(project => 
        project.status === 'active' || project.status === 'in_progress'
      ).length;

      const pendingTasks = tasks.filter(task => 
        task.status === 'todo' || task.status === 'in_progress'
      ).length;

      const completedProjects = projects.filter(project => 
        project.status === 'completed'
      ).length;

      const totalProjects = projects.length;
      const successRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

      const totalProposals = proposals.length;
      const acceptedProposals = proposals.filter(proposal => 
        proposal.status === 'accepted'
      ).length;
      
      const proposalSuccessRate = totalProposals > 0 ? Math.round((acceptedProposals / totalProposals) * 100) : 0;

      // Monthly revenue calculation (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = invoices
        .filter(invoice => {
          const invoiceDate = new Date(invoice.createdAt);
          return invoice.status === 'paid' && 
                 invoiceDate.getMonth() === currentMonth && 
                 invoiceDate.getFullYear() === currentYear;
        })
        .reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);

      const stats = {
        totalRevenue,
        monthlyRevenue,
        activeProjects,
        pendingTasks,
        successRate,
        proposalSuccessRate,
        totalProposals,
        acceptedProposals,
        completedProjects,
        totalProjects
      };

      res.json({ data: stats });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
  });

  // Task endpoints
  app.get('/api/tasks', requireAuth, async (req: Request, res: Response) => {
    try {
      const tasks = await storage.getTasks(req.user!.id);
      res.json({ data: tasks });
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post('/api/tasks', requireAuth, async (req: Request, res: Response) => {
    try {
      const taskData = insertTaskSchema.omit({ userId: true, id: true, createdAt: true, completedAt: true }).parse(req.body);
      const task = await storage.createTask(req.user!.id, taskData);
      res.status(201).json({ data: task });
    } catch (error) {
      console.error('Create task error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  app.patch('/api/tasks/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      const updateData = req.body;
      const task = await storage.updateTask(taskId, req.user!.id, updateData);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json({ data: task });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete('/api/tasks/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      await storage.deleteTask(taskId, req.user!.id);
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // WebSocket setup for real-time features - temporarily commented out to avoid conflicts
  // const wss = new WebSocketServer({ noServer: true });

  // wss.on('connection', (ws, request) => {
  //   console.log('WebSocket client connected');

  //   ws.on('message', (message) => {
  //     try {
  //       const data = JSON.parse(message.toString());
  //       console.log('Received WebSocket message:', data);

  //       // Broadcast updates to all connected clients
  //       wss.clients.forEach((client) => {
  //         if (client.readyState === client.OPEN) {
  //           client.send(JSON.stringify({
  //             type: 'update',
  //             data: data
  //           }));
  //         }
  //       });
  //     } catch (error) {
  //       console.error('Error handling WebSocket message:', error);
  //     }
  //   });

  //   ws.on('close', () => {
  //     console.log('WebSocket client disconnected');
  //   });

  //   // Send welcome message
  //   ws.send(JSON.stringify({
  //     type: 'connected',
  //     message: 'WebSocket connection established'
  //   }));
  // });

  // Handle WebSocket upgrade
  // httpServer.on('upgrade', (request, socket, head) => {
  //   wss.handleUpgrade(request, socket, head, (ws) => {
  //     wss.emit('connection', ws, request);
  //   });
  // });

  return httpServer;
}
