import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import Dashboard from './pages/Dashboard';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import { useAuth } from './hooks/useAuth';
import { queryClient } from './lib/queryClient';
import { 
  Zap, 
  Bot, 
  FileText, 
  Users, 
  CreditCard, 
  CheckCircle, 
  Star,
  Menu,
  X,
  ArrowRight,
  Play,
  Clock,
  Target,
  TrendingUp,
  Shield,
  LogOut
} from 'lucide-react';

// Main App component with authentication logic
const AppContent: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  const { user, isLoading, isAuthenticated } = useAuth();
  
  // Debug authentication state
  console.log('Auth state:', { user, isLoading, isAuthenticated });

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading LazyLancer...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if authenticated
  if (isAuthenticated) {
    return <Dashboard />;
  }

  // Show auth forms if requested
  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        {isLogin ? (
          <LoginForm
            onSuccess={() => {
              setShowAuth(false);
              setShowDashboard(true);
            }}
            onSwitchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm
            onSuccess={() => {
              setShowAuth(false);
              setIsLogin(true);
            }}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
        <button
          onClick={() => setShowAuth(false)}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    );
  }

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Automated Proposal Generator",
      description: "AI drafts personalized proposals based on job descriptions, saving you hours of work while maintaining professional quality."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Client Outreach Automation",
      description: "The AI finds and contacts clients, scaling your outreach without additional effort. Never miss an opportunity again."
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Invoicing & Payments",
      description: "Forget chasing invoices; the AI handles payment reminders and generates invoices automatically."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "AI-Powered Task Manager",
      description: "Organize your projects, set deadlines, and track progress effortlessly with intelligent task prioritization."
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "24/7 AI Assistant",
      description: "Your virtual assistant answers client queries, negotiates rates, and manages communications around the clock."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Smart Analytics Dashboard",
      description: "Get insights into your productivity, earnings trends, and client satisfaction with AI-powered analytics."
    }
  ];

  const testimonials = [
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

  const faqs = [
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

  // This check is now redundant since we handle it above
  // if (isAuthenticated) {
  //   return <Dashboard />;
  // }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">LazyLancer</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <ScrollLink to="features" smooth={true} duration={500} className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">Features</ScrollLink>
              <ScrollLink to="pricing" smooth={true} duration={500} className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">Pricing</ScrollLink>
              <ScrollLink to="testimonials" smooth={true} duration={500} className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">Reviews</ScrollLink>
              <ScrollLink to="faq" smooth={true} duration={500} className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">FAQ</ScrollLink>
              
              {isAuthenticated ? (
                <>
                  <span className="text-gray-600">Welcome, {user?.username}</span>
                  <button 
                    onClick={() => setShowDashboard(true)}
                    className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200"
                  >
                    Dashboard
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setIsLogin(true);
                      setShowAuth(true);
                    }}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => {
                      setIsLogin(false);
                      setShowAuth(true);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Start Free Trial
                  </button>
                </>
              )}
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-2 space-y-2">
              <ScrollLink to="features" smooth={true} duration={500} className="block px-3 py-2 text-gray-600 hover:text-gray-900 cursor-pointer" onClick={() => setIsMenuOpen(false)}>Features</ScrollLink>
              <ScrollLink to="pricing" smooth={true} duration={500} className="block px-3 py-2 text-gray-600 hover:text-gray-900 cursor-pointer" onClick={() => setIsMenuOpen(false)}>Pricing</ScrollLink>
              <ScrollLink to="testimonials" smooth={true} duration={500} className="block px-3 py-2 text-gray-600 hover:text-gray-900 cursor-pointer" onClick={() => setIsMenuOpen(false)}>Reviews</ScrollLink>
              <ScrollLink to="faq" smooth={true} duration={500} className="block px-3 py-2 text-gray-600 hover:text-gray-900 cursor-pointer" onClick={() => setIsMenuOpen(false)}>FAQ</ScrollLink>
              <button 
                onClick={() => setShowDashboard(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-lg mt-2"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-green-500/5"></div>
        <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-green-200 rounded-full opacity-20"></div>
          <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-blue-400 rounded-full opacity-30"></div>
        </motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Work Smarter, Not Harder with{" "}
              <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                AI for Freelancers
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            >
              Automate your tasks, streamline your workflow, and boost your productivity with LazyLancer's AI-powered dashboard. 
              Spend less time on administrative work and more time on what you do best.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDashboard(true)}
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors group"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                  <Play className="w-5 h-5 text-blue-500 ml-0.5" />
                </div>
                <span className="font-medium">Watch Demo</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Freelance Smarter
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered tools handle the heavy lifting so you can focus on delivering exceptional work to your clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VIP Tier Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-green-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-6"
            >
              Upgrade to VIP for Advanced AI Features
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl mb-8 opacity-90"
            >
              Unlock powerful features like advanced proposal customizations, smarter client matching, 
              priority support, and exclusive AI tools that take your freelancing to the next level.
            </motion.p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: Shield, title: "Priority Support", desc: "Get instant help when you need it most" },
                { icon: Target, title: "Smart Client Matching", desc: "AI finds your perfect clients automatically" },
                { icon: TrendingUp, title: "Advanced Analytics", desc: "Deep insights into your business performance" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-xl"
                >
                  <item.icon className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm opacity-90">{item.desc}</p>
                </motion.div>
              ))}
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300"
            >
              Upgrade to VIP
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by Freelancers Worldwide</h2>
            <p className="text-xl text-gray-600">See how LazyLancer is transforming freelance careers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple Pricing. No Hidden Fees.</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your freelancing needs</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic Plan</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$50</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-6">Get access to essential AI tools to work smarter</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>AI Proposal Generator</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Basic Task Management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Invoice Automation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>5 Projects</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Email Support</span>
                </li>
              </ul>
              <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                Start Free Trial
              </button>
            </motion.div>

            {/* VIP Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gradient-to-r from-blue-500 to-green-500 p-8 rounded-2xl shadow-lg text-white hover:shadow-xl transition-all duration-300 relative"
            >
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">VIP Plan</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$100</span>
                <span className="opacity-90">/month</span>
              </div>
              <p className="opacity-90 mb-6">Unlock advanced features for the next level of productivity</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-3" />
                  <span>Everything in Basic</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-3" />
                  <span>Advanced Client Matching</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-3" />
                  <span>24/7 AI Assistant</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-3" />
                  <span>Unlimited Projects</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-3" />
                  <span>Priority Support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-3" />
                  <span>Advanced Analytics</span>
                </li>
              </ul>
              <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                Upgrade to VIP
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about LazyLancer</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setActiveTab(activeTab === index ? -1 : index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <div className={`transform transition-transform duration-200 ${activeTab === index ? 'rotate-45' : ''}`}>
                    <div className="w-6 h-6 flex items-center justify-center">
                      <div className="w-4 h-0.5 bg-gray-600"></div>
                      <div className="w-0.5 h-4 bg-gray-600 absolute"></div>
                    </div>
                  </div>
                </div>
                {activeTab === index && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-6"
          >
            Ready to Transform Your Freelance Business?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl mb-8 opacity-90"
          >
            Join thousands of freelancers who are already working smarter with LazyLancer's AI-powered tools.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDashboard(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300"
            >
              Start Your Free Trial
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Schedule a Demo
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">LazyLancer</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering freelancers worldwide with AI-powered productivity tools.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 LazyLancer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main App component with QueryClient provider
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;