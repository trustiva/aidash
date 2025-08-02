import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  DollarSign, 
  FileText, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

const StatsCards: React.FC = () => {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const stats = (statsData as any)?.data;
  const successRate = stats ? Math.round((stats.acceptedProposals / Math.max(stats.totalProposals, 1)) * 100) : 0;

  const statCards: StatCard[] = [
    {
      title: 'Total Revenue',
      value: `$${stats?.totalRevenue?.toLocaleString() || '0'}`,
      change: '+15.3%',
      changeType: 'positive',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Active Projects',
      value: stats?.activeProjects?.toString() || '0',
      change: `${stats?.totalProjects || 0} total`,
      changeType: 'neutral',
      icon: <FileText className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Total Invoices',
      value: stats?.totalInvoices?.toString() || '0',
      change: `${stats?.paidInvoices || 0} paid`,
      changeType: 'positive',
      icon: <Users className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Proposals Sent',
      value: stats?.totalProposals?.toString() || '0',
      change: `${stats?.acceptedProposals || 0} accepted`,
      changeType: 'positive',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Pending Tasks',
      value: stats?.pendingTasks?.toString() || '0',
      change: 'Active',
      changeType: 'neutral',
      icon: <Clock className="w-6 h-6" />,
      color: 'from-indigo-500 to-blue-500'
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      change: '+5.2%',
      changeType: 'positive',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'from-teal-500 to-green-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-white`}>
              {stat.icon}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              stat.changeType === 'positive' 
                ? 'bg-green-100 text-green-800' 
                : stat.changeType === 'negative'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {stat.change}
            </div>
          </div>
          
          <div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;