import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  MoreHorizontal
} from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  client: string;
  amount: string;
  status: 'pending' | 'accepted' | 'rejected' | 'viewed';
  submittedAt: string;
  description: string;
}

interface RecentProposalsProps {
  showAll?: boolean;
}

const RecentProposals: React.FC<RecentProposalsProps> = ({ showAll = false }) => {
  const proposals: Proposal[] = [
    {
      id: '1',
      title: 'E-commerce Website Development',
      client: 'TechStart Inc.',
      amount: '$2,500',
      status: 'accepted',
      submittedAt: '2 hours ago',
      description: 'Full-stack e-commerce platform with React and Node.js'
    },
    {
      id: '2',
      title: 'Mobile App UI/UX Design',
      client: 'Creative Agency',
      amount: '$1,800',
      status: 'pending',
      submittedAt: '5 hours ago',
      description: 'Modern mobile app design for fitness tracking'
    },
    {
      id: '3',
      title: 'WordPress Blog Setup',
      client: 'Personal Brand',
      amount: '$650',
      status: 'viewed',
      submittedAt: '1 day ago',
      description: 'Custom WordPress theme and blog setup'
    },
    {
      id: '4',
      title: 'Logo Design & Branding',
      client: 'Startup Co.',
      amount: '$950',
      status: 'rejected',
      submittedAt: '2 days ago',
      description: 'Complete branding package with logo variations'
    },
    {
      id: '5',
      title: 'Database Optimization',
      client: 'Enterprise Corp',
      amount: '$3,200',
      status: 'pending',
      submittedAt: '3 days ago',
      description: 'MySQL database performance optimization'
    }
  ];

  const displayedProposals = showAll ? proposals : proposals.slice(0, 3);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'viewed':
        return <Eye className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'viewed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {showAll ? 'All Proposals' : 'Recent Proposals'}
          </h2>
        </div>
        {!showAll && (
          <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
            View All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {displayedProposals.map((proposal, index) => (
          <motion.div
            key={proposal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ x: 4 }}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{proposal.title}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(proposal.status)}`}>
                    {getStatusIcon(proposal.status)}
                    <span className="capitalize">{proposal.status}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">{proposal.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Client: {proposal.client}</span>
                  <span>{proposal.submittedAt}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 ml-4">
                <span className="text-lg font-bold text-gray-900">{proposal.amount}</span>
                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showAll && (
        <div className="mt-6 flex justify-center">
          <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
            Create New Proposal
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default RecentProposals;