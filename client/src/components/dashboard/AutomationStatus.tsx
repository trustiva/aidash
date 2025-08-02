import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface AutomationTask {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'completed' | 'error';
  progress: number;
  lastRun: string;
}

const AutomationStatus: React.FC = () => {
  const automationTasks: AutomationTask[] = [
    {
      id: '1',
      name: 'Client Outreach',
      status: 'running',
      progress: 75,
      lastRun: '2 minutes ago'
    },
    {
      id: '2',
      name: 'Proposal Generation',
      status: 'completed',
      progress: 100,
      lastRun: '1 hour ago'
    },
    {
      id: '3',
      name: 'Invoice Reminders',
      status: 'paused',
      progress: 45,
      lastRun: '3 hours ago'
    },
    {
      id: '4',
      name: 'Lead Qualification',
      status: 'error',
      progress: 20,
      lastRun: '5 hours ago'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="w-4 h-4 text-green-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-600';
      case 'paused':
        return 'text-yellow-600';
      case 'completed':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">AI Automation</h2>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Efficiency</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">+34%</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">Tasks Done</span>
          </div>
          <p className="text-2xl font-bold text-green-900">127</p>
        </div>
      </div>

      {/* Automation Tasks */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 text-sm">Active Automations</h3>
        {automationTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(task.status)}
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{task.name}</h4>
                  <p className="text-xs text-gray-500">Last run: {task.lastRun}</p>
                </div>
              </div>
              <span className={`text-xs font-medium capitalize ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${task.progress}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className={`h-2 rounded-full ${getProgressColor(task.status)}`}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">{task.progress}% complete</span>
              <div className="flex space-x-1">
                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <Play className="w-3 h-3 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <Pause className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
        >
          Manage Automations
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AutomationStatus;