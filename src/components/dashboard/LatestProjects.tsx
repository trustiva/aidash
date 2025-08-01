import React from 'react';
import { motion } from 'framer-motion';
import { 
  Folder, 
  Calendar, 
  DollarSign, 
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  client: string;
  status: 'in-progress' | 'completed' | 'overdue' | 'pending';
  budget: string;
  deadline: string;
  progress: number;
  description: string;
}

const LatestProjects: React.FC = () => {
  const projects: Project[] = [
    {
      id: '1',
      title: 'E-commerce Platform',
      client: 'TechStart Inc.',
      status: 'in-progress',
      budget: '$2,500',
      deadline: '2024-02-15',
      progress: 75,
      description: 'Full-stack e-commerce solution with React and Node.js'
    },
    {
      id: '2',
      title: 'Mobile App Design',
      client: 'Creative Agency',
      status: 'completed',
      budget: '$1,800',
      deadline: '2024-01-30',
      progress: 100,
      description: 'UI/UX design for fitness tracking mobile application'
    },
    {
      id: '3',
      title: 'WordPress Blog',
      client: 'Personal Brand',
      status: 'overdue',
      budget: '$650',
      deadline: '2024-01-25',
      progress: 60,
      description: 'Custom WordPress theme and blog setup'
    },
    {
      id: '4',
      title: 'Brand Identity',
      client: 'Startup Co.',
      status: 'pending',
      budget: '$950',
      deadline: '2024-02-20',
      progress: 0,
      description: 'Complete branding package with logo and guidelines'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'overdue':
        return 'bg-red-500';
      case 'in-progress':
        return 'bg-blue-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Folder className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Latest Projects</h2>
        </div>
        <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ x: 4 }}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{project.title}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(project.status)}`}>
                    {getStatusIcon(project.status)}
                    <span className="capitalize">{project.status.replace('-', ' ')}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{project.client}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(project.deadline)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{project.budget}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className={`h-2 rounded-full ${getProgressColor(project.status)}`}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{project.progress}% complete</span>
                </div>
              </div>
              
              <button className="p-1 hover:bg-gray-100 rounded transition-colors ml-4">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
        >
          Create New Project
        </motion.button>
      </div>
    </motion.div>
  );
};

export default LatestProjects;