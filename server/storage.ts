import { 
  users, projects, proposals, clients, invoices, tasks, automationSettings,
  type User, type InsertUser, type Project, type InsertProject,
  type Proposal, type InsertProposal, type Client, type InsertClient,
  type Invoice, type InsertInvoice, type Task, type InsertTask,
  type AutomationSettings
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Project operations
  getProjects(userId: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Proposal operations
  getProposals(userId: number): Promise<Proposal[]>;
  getRecentProposals(userId: number, limit?: number): Promise<Proposal[]>;
  getProposal(id: number): Promise<Proposal | undefined>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: number, updates: Partial<Proposal>): Promise<Proposal | undefined>;
  deleteProposal(id: number): Promise<boolean>;

  // Client operations
  getClients(userId: number): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, updates: Partial<Client>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;

  // Invoice operations
  getInvoices(userId: number): Promise<Invoice[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, updates: Partial<Invoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: number): Promise<boolean>;

  // Task operations
  getTasks(userId: number): Promise<Task[]>;
  getTasksByProject(projectId: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // Automation settings
  getAutomationSettings(userId: number): Promise<AutomationSettings | undefined>;
  updateAutomationSettings(userId: number, settings: Partial<AutomationSettings>): Promise<AutomationSettings>;

  // Dashboard stats
  getDashboardStats(userId: number): Promise<{
    totalProjects: number;
    activeProjects: number;
    totalProposals: number;
    acceptedProposals: number;
    totalInvoices: number;
    paidInvoices: number;
    totalRevenue: number;
    pendingTasks: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private proposals: Map<number, Proposal>;
  private clients: Map<number, Client>;
  private invoices: Map<number, Invoice>;
  private tasks: Map<number, Task>;
  private automationSettings: Map<number, AutomationSettings>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.proposals = new Map();
    this.clients = new Map();
    this.invoices = new Map();
    this.tasks = new Map();
    this.automationSettings = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Create sample user with properly hashed password
    const sampleUser: User = {
      id: 1,
      username: "john_doe",
      email: "john@example.com",
      password: "$2b$10$CQC09V6z3BQqCOzgXlH/b.m5OhQJanzRi42W/35vF5r3WoVWBmHtC", // bcrypt hash for "password123"
      firstName: "John",
      lastName: "Doe",
      avatar: null,
      createdAt: new Date()
    };
    this.users.set(1, sampleUser);

    // Create sample projects
    const sampleProjects: Project[] = [
      {
        id: 1,
        userId: 1,
        title: "E-commerce Website Redesign",
        description: "Complete redesign of the client's e-commerce platform with modern UI/UX",
        status: "active",
        budget: "5000.00",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        clientName: "TechCorp Inc.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        userId: 1,
        title: "Mobile App Development",
        description: "React Native app for fitness tracking",
        status: "completed",
        budget: "8000.00",
        deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        clientName: "FitLife Solutions",
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ];
    sampleProjects.forEach(project => this.projects.set(project.id, project));

    // Create sample proposals
    const sampleProposals: Proposal[] = [
      {
        id: 1,
        userId: 1,
        projectId: 1,
        title: "E-commerce Redesign Proposal",
        content: "I propose to redesign your e-commerce platform with modern design principles...",
        status: "sent",
        budget: "5000.00",
        clientEmail: "client@techcorp.com",
        sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        userId: 1,
        projectId: null,
        title: "Brand Identity Package",
        content: "Complete brand identity design including logo, colors, and guidelines...",
        status: "draft",
        budget: "2500.00",
        clientEmail: "contact@startup.io",
        sentAt: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];
    sampleProposals.forEach(proposal => this.proposals.set(proposal.id, proposal));

    this.currentId = 10; // Start with ID 10 for new entries
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      id, 
      avatar: null,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Project operations
  async getProjects(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.userId === userId);
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const project: Project = {
      ...insertProject,
      status: insertProject.status || "active",
      description: insertProject.description || null,
      budget: insertProject.budget || null,
      deadline: insertProject.deadline || null,
      clientName: insertProject.clientName || null,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    const updatedProject = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Proposal operations
  async getProposals(userId: number): Promise<Proposal[]> {
    return Array.from(this.proposals.values()).filter(proposal => proposal.userId === userId);
  }

  async getRecentProposals(userId: number, limit = 5): Promise<Proposal[]> {
    return Array.from(this.proposals.values())
      .filter(proposal => proposal.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getProposal(id: number): Promise<Proposal | undefined> {
    return this.proposals.get(id);
  }

  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const id = this.currentId++;
    const proposal: Proposal = {
      ...insertProposal,
      status: insertProposal.status || "draft",
      budget: insertProposal.budget || null,
      projectId: insertProposal.projectId || null,
      clientEmail: insertProposal.clientEmail || null,
      id,
      sentAt: null,
      createdAt: new Date()
    };
    this.proposals.set(id, proposal);
    return proposal;
  }

  async updateProposal(id: number, updates: Partial<Proposal>): Promise<Proposal | undefined> {
    const proposal = this.proposals.get(id);
    if (!proposal) return undefined;
    const updatedProposal = { ...proposal, ...updates };
    this.proposals.set(id, updatedProposal);
    return updatedProposal;
  }

  async deleteProposal(id: number): Promise<boolean> {
    return this.proposals.delete(id);
  }

  // Client operations
  async getClients(userId: number): Promise<Client[]> {
    return Array.from(this.clients.values()).filter(client => client.userId === userId);
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = this.currentId++;
    const client: Client = {
      ...insertClient,
      company: insertClient.company || null,
      phone: insertClient.phone || null,
      notes: insertClient.notes || null,
      id,
      createdAt: new Date()
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: number, updates: Partial<Client>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    const updatedClient = { ...client, ...updates };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id: number): Promise<boolean> {
    return this.clients.delete(id);
  }

  // Invoice operations
  async getInvoices(userId: number): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(invoice => invoice.userId === userId);
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = this.currentId++;
    const invoice: Invoice = {
      ...insertInvoice,
      status: insertInvoice.status || "draft",
      projectId: insertInvoice.projectId || null,
      id,
      paidAt: null,
      createdAt: new Date()
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  async updateInvoice(id: number, updates: Partial<Invoice>): Promise<Invoice | undefined> {
    const invoice = this.invoices.get(id);
    if (!invoice) return undefined;
    const updatedInvoice = { ...invoice, ...updates };
    this.invoices.set(id, updatedInvoice);
    return updatedInvoice;
  }

  async deleteInvoice(id: number): Promise<boolean> {
    return this.invoices.delete(id);
  }

  // Task operations
  async getTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async getTasksByProject(projectId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.projectId === projectId);
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentId++;
    const task: Task = {
      ...insertTask,
      status: insertTask.status || "todo",
      description: insertTask.description || null,
      projectId: insertTask.projectId || null,
      dueDate: insertTask.dueDate || null,
      priority: insertTask.priority || "medium",
      id,
      completedAt: null,
      createdAt: new Date()
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    const updatedTask = { ...task, ...updates };
    if (updates.status === 'completed' && !updatedTask.completedAt) {
      updatedTask.completedAt = new Date();
    }
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Automation settings
  async getAutomationSettings(userId: number): Promise<AutomationSettings | undefined> {
    return Array.from(this.automationSettings.values()).find(settings => settings.userId === userId);
  }

  async updateAutomationSettings(userId: number, updates: Partial<AutomationSettings>): Promise<AutomationSettings> {
    let settings = await this.getAutomationSettings(userId);
    if (!settings) {
      const id = this.currentId++;
      settings = {
        id,
        userId,
        proposalGeneration: true,
        clientOutreach: false,
        invoiceReminders: true,
        taskManagement: true,
        settings: null,
        updatedAt: new Date()
      };
    }
    const updatedSettings = { ...settings, ...updates, updatedAt: new Date() };
    this.automationSettings.set(updatedSettings.id, updatedSettings);
    return updatedSettings;
  }

  // Dashboard stats
  async getDashboardStats(userId: number): Promise<{
    totalProjects: number;
    activeProjects: number;
    totalProposals: number;
    acceptedProposals: number;
    totalInvoices: number;
    paidInvoices: number;
    totalRevenue: number;
    pendingTasks: number;
  }> {
    const projects = await this.getProjects(userId);
    const proposals = await this.getProposals(userId);
    const invoices = await this.getInvoices(userId);
    const tasks = await this.getTasks(userId);

    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      totalProposals: proposals.length,
      acceptedProposals: proposals.filter(p => p.status === 'accepted').length,
      totalInvoices: invoices.length,
      paidInvoices: invoices.filter(i => i.status === 'paid').length,
      totalRevenue: invoices
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + parseFloat(i.amount), 0),
      pendingTasks: tasks.filter(t => t.status !== 'completed').length
    };
  }
}

export const storage = new MemStorage();
