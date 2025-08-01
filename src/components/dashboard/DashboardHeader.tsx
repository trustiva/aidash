import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Clock } from 'lucide-react';

const DashboardHeader: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-6 text-white"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
          <div className="flex items-center space-x-4 text-blue-100">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{currentDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Last login: 2 hours ago</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-lg font-semibold">+23% this week</span>
          </div>
          <p className="text-blue-100">Your productivity is trending up!</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;