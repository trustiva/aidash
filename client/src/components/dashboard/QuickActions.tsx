import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  FileText, 
  Users, 
  CreditCard, 
  Bot,
  Zap
} from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

const QuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    {
      title: 'Generate Proposal',
      description: 'AI-powered proposal creation',
      icon: <FileText className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      action: () => console.log('Generate proposal')
    },
    {
      title: 'Add New Client',
      description: 'Register a new client',
      icon: <Users className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      action: () => console.log('Add client')
    },
    {
      title: 'Create Invoice',
      description: 'Generate and send invoice',
      icon: <CreditCard className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      action: () => console.log('Create invoice')
    },
    {
      title: 'AI Assistant',
      description: 'Chat with your AI helper',
      icon: <Bot className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
      action: () => console.log('Open AI assistant')
    },
    {
      title: 'Start Automation',
      description: 'Begin client outreach',
      icon: <Zap className="w-5 h-5" />,
      color: 'from-indigo-500 to-blue-500',
      action: () => console.log('Start automation')
    },
    {
      title: 'New Project',
      description: 'Create a new project',
      icon: <Plus className="w-5 h-5" />,
      color: 'from-teal-500 to-green-500',
      action: () => console.log('New project')
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.action}
            className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all duration-200 text-left"
          >
            <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
              {action.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm">{action.title}</h3>
              <p className="text-gray-500 text-xs truncate">{action.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
        >
          View All Actions
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuickActions;