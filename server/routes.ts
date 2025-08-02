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
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
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

  app.post('/api/auth/login', passport.authenticate('local'), (req: Request, res: Response) => {
    res.json({ 
      message: 'Login successful',
      user: req.user
    });
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
