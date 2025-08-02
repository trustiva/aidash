import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Clock, 
  DollarSign,
  Filter,
  Globe,
  TrendingUp,
  Users,
  Calendar,
  Star,
  Target,
  Briefcase
} from 'lucide-react';

interface LiveProject {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  skills: string[];
  platform: 'guru' | 'upwork' | 'freelancer' | 'fiverr' | 'jobicy';
  url: string;
  postedTime: string;
  clientRating?: number;
  proposalsCount?: number;
  verified?: boolean;
  urgent?: boolean;
  category: string;
}

const EnhancedLiveProjects: React.FC = () => {
  const [projects, setProjects] = useState<LiveProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveProjects = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      const response = await fetch('/api/live-projects');
      if (response.ok) {
        const data = await response.json();
        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects);
          setLastUpdated(new Date());
        } else {
          setError('No live projects available at the moment');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch live projects');
      }
    } catch (error) {
      console.error('Failed to fetch live projects:', error);
      setError('Unable to connect to project feeds');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveProjects();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLiveProjects, 30000);
    return () => clearInterval(interval);
  }, [fetchLiveProjects]);

  const filteredProjects = projects.filter((project) => {
    const matchesPlatform = selectedPlatform === 'all' || project.platform === selectedPlatform;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesPlatform && matchesSearch && matchesCategory;
  });

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'guru':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'upwork':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'freelancer':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'fiverr':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'jobicy':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlatformLogo = (platform: string) => {
    switch (platform) {
      case 'guru':
        return '🎯';
      case 'upwork':
        return '⬆️';
      case 'freelancer':
        return '💼';
      case 'fiverr':
        return '🔥';
      case 'jobicy':
        return '🌐';
      default:
        return '💼';
    }
  };

  const categories = [...new Set(projects.map(p => p.category))];
  const platforms = ['all', 'guru', 'upwork', 'freelancer', 'fiverr', 'jobicy'];

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchLiveProjects}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Live Project Feed</h2>
            <p className="text-gray-600">Real-time projects from top freelance platforms</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchLiveProjects}
            disabled={isRefreshing}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search projects..."
          />
        </div>
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {platforms.map(platform => (
            <option key={platform} value={platform}>
              {platform === 'all' ? 'All Platforms' : platform.charAt(0).toUpperCase() + platform.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Total Projects</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-1">{projects.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Filtered</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mt-1">{filteredProjects.length}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-purple-600" />
            <span className="text-purple-800 font-medium">Platforms</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 mt-1">{platforms.length - 1}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800 font-medium">Updated</span>
          </div>
          <p className="text-xl font-bold text-yellow-900 mt-1">Live</p>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="animate-pulse border border-gray-200 rounded-lg p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.slice(0, 20).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getPlatformLogo(project.platform)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPlatformColor(project.platform)}`}>
                      {project.platform.toUpperCase()}
                    </span>
                    {project.urgent && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        URGENT
                      </span>
                    )}
                    {project.verified && (
                      <span className="flex items-center space-x-1 text-green-600">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs">Verified Client</span>
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.skills.slice(0, 5).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        {skill}
                      </span>
                    ))}
                    {project.skills.length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                        +{project.skills.length - 5} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium">{project.budget}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{project.deadline}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{project.postedTime}</span>
                    </div>
                    {project.proposalsCount && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{project.proposalsCount} proposals</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <motion.a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2 ml-4"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
      
      {filteredProjects.length > 20 && (
        <div className="mt-6 text-center">
          <p className="text-gray-600">Showing 20 of {filteredProjects.length} projects</p>
        </div>
      )}
    </motion.div>
  );
};

export default EnhancedLiveProjects;