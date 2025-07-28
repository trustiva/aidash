import { 
  FileText, 
  Users, 
  CreditCard, 
  Target, 
  Bot, 
  TrendingUp,
  Shield
} from 'lucide-react';
import { Feature, Testimonial, FAQ, PricingPlan, VIPFeature } from '../types';

export const FEATURES: Feature[] = [
  {
    icon: FileText,
    title: "Automated Proposal Generator",
    description: "AI drafts personalized proposals based on job descriptions, saving you hours of work while maintaining professional quality."
  },
  {
    icon: Users,
    title: "Client Outreach Automation",
    description: "The AI finds and contacts clients, scaling your outreach without additional effort. Never miss an opportunity again."
  },
  {
    icon: CreditCard,
    title: "Invoicing & Payments",
    description: "Forget chasing invoices; the AI handles payment reminders and generates invoices automatically."
  },
  {
    icon: Target,
    title: "AI-Powered Task Manager",
    description: "Organize your projects, set deadlines, and track progress effortlessly with intelligent task prioritization."
  },
  {
    icon: Bot,
    title: "24/7 AI Assistant",
    description: "Your virtual assistant answers client queries, negotiates rates, and manages communications around the clock."
  },
  {
    icon: TrendingUp,
    title: "Smart Analytics Dashboard",
    description: "Get insights into your productivity, earnings trends, and client satisfaction with AI-powered analytics."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "Web Developer",
    content: "LazyLancer saved me 15+ hours per week. The AI proposal generator alone has increased my win rate by 60%!",
    rating: 5,
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    name: "Marcus Rodriguez",
    role: "Graphic Designer",
    content: "The client outreach automation is incredible. I'm landing more projects than ever while working fewer hours.",
    rating: 5,
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    name: "Emily Thompson",
    role: "Content Writer",
    content: "Finally, a tool that understands freelancers! The AI assistant handles all my client communications professionally.",
    rating: 5,
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  }
];

export const FAQS: FAQ[] = [
  {
    question: "How does the AI proposal generator work?",
    answer: "Our AI analyzes job descriptions, your portfolio, and successful proposal patterns to create personalized, compelling proposals that match client needs and showcase your expertise."
  },
  {
    question: "Can I integrate LazyLancer with other freelance platforms?",
    answer: "Yes! LazyLancer integrates seamlessly with Upwork, Fiverr, Freelancer.com, and other major platforms. You can manage all your projects from one unified dashboard."
  },
  {
    question: "How secure is my data with LazyLancer?",
    answer: "We use enterprise-grade encryption and follow strict data protection protocols. Your client information and project data are completely secure and never shared with third parties."
  },
  {
    question: "What's included in the VIP tier?",
    answer: "VIP members get advanced proposal customizations, priority AI processing, smart client matching, unlimited projects, advanced analytics, and dedicated support."
  },
  {
    question: "Do I need technical skills to use LazyLancer?",
    answer: "Not at all! LazyLancer is designed for freelancers of all technical levels. Our intuitive interface and AI assistance make it easy to get started in minutes."
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Basic Plan",
    price: 50,
    description: "Get access to essential AI tools to work smarter",
    features: [
      "AI Proposal Generator",
      "Basic Task Management",
      "Invoice Automation",
      "5 Projects",
      "Email Support"
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "secondary"
  },
  {
    name: "VIP Plan",
    price: 100,
    description: "Unlock advanced features for the next level of productivity",
    features: [
      "Everything in Basic",
      "Advanced Client Matching",
      "24/7 AI Assistant",
      "Unlimited Projects",
      "Priority Support",
      "Advanced Analytics"
    ],
    isPopular: true,
    buttonText: "Upgrade to VIP",
    buttonVariant: "primary"
  }
];

export const VIP_FEATURES: VIPFeature[] = [
  { 
    icon: Shield, 
    title: "Priority Support", 
    desc: "Get instant help when you need it most" 
  },
  { 
    icon: Target, 
    title: "Smart Client Matching", 
    desc: "AI finds your perfect clients automatically" 
  },
  { 
    icon: TrendingUp, 
    title: "Advanced Analytics", 
    desc: "Deep insights into your business performance" 
  }
];

export const NAVIGATION_ITEMS = [
  { label: "Features", href: "features" },
  { label: "Pricing", href: "pricing" },
  { label: "Reviews", href: "testimonials" },
  { label: "FAQ", href: "faq" }
];

export const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Integrations", href: "#integrations" },
    { label: "API", href: "#api" }
  ],
  support: [
    { label: "Help Center", href: "#help" },
    { label: "Contact Us", href: "#contact" },
    { label: "Community", href: "#community" },
    { label: "Status", href: "#status" }
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "Blog", href: "#blog" },
    { label: "Careers", href: "#careers" },
    { label: "Privacy", href: "#privacy" }
  ]
};