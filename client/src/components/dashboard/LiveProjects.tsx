import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  ExternalLink, 
  Clock, 
  DollarSign, 
  Star,
  Users,
  Briefcase,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface LiveProject {
  id: string;
  title: string;
  description: string;
  platform: string;
  budget: string;
  skills: string[];
  link: string;
  postedAt: string;
  deadline: string;
  clientRating: number;
  proposals: number;
}

const LiveProjects: React.FC = () => {
  const { data: liveProjectsData, isLoading } = useQuery({
    queryKey: ['/api/projects/live'],
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Live Projects from Platforms</h3>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg animate-pulse">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const liveProjects: LiveProject[] = (liveProjectsData as any)?.data || [];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just posted';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Upwork':
        return 'bg-green-100 text-green-800';
      case 'Freelancer.com':
        return 'bg-blue-100 text-blue-800';
      case 'Fiverr':
        return 'bg-orange-100 text-orange-800';
      case 'Guru.com':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Live Projects</h2>
            <p className="text-sm text-gray-500">Fresh opportunities from top platforms</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Live</span>
        </div>
      </div>

      <div className="space-y-4">
        {liveProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">{project.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(project.platform)}`}>
                    {project.platform}
                  </span>
                </div>
                <p className="text-gray-600 text-xs mb-3 line-clamp-2">{project.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-3 h-3" />
                  <span>{project.budget}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{project.proposals} proposals</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-current text-yellow-400" />
                  <span>{project.clientRating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(project.postedAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {project.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
                {project.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    +{project.skills.length - 3} more
                  </span>
                )}
              </div>
              
              <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:shadow-lg transition-all duration-200"
              >
                <span>Apply Now</span>
                <ExternalLink className="w-3 h-3" />
              </motion.a>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {liveProjects.length} live opportunities
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All Platforms →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveProjects;