import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StatsCards from '../components/dashboard/StatsCards';
import RecentProposals from '../components/dashboard/RecentProposals';
import QuickActions from '../components/dashboard/QuickActions';
import AutomationStatus from '../components/dashboard/AutomationStatus';
import LatestProjects from '../components/dashboard/LatestProjects';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import EnhancedLiveProjects from '../components/dashboard/EnhancedLiveProjects';
import ProposalGenerator from '../components/dashboard/ProposalGenerator';
import ProjectForm from '../components/forms/ProjectForm';
import ClientForm from '../components/forms/ClientForm';
import InvoiceForm from '../components/forms/InvoiceForm';
import ClientManagement from '../components/dashboard/ClientManagement';
import ProjectsManagement from '../components/dashboard/ProjectsManagement';
import InvoiceManagement from '../components/dashboard/InvoiceManagement';
import TaskManagement from '../components/dashboard/TaskManagement';
import { 
  BarChart3, 
  FileText, 
  Users, 
  Settings,
  Bell,
  Search,
  Briefcase,
  CreditCard,
  CheckSquare
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('overview');
  const [showProposalGenerator, setShowProposalGenerator] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'live-projects', label: 'Live Projects', icon: Search },
    { id: 'projects', label: 'My Projects', icon: Briefcase },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'proposals', label: 'Proposals', icon: FileText },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'invoices', label: 'Invoices', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LL</span>
            </div>
            <span className="text-xl font-bold text-gray-900">LazyLancer</span>
          </div>
        </div>
        
        <nav className="mt-8">
          {sidebarItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeView === item.id
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">JD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeView === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <DashboardHeader />
              <StatsCards />
              
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <RecentProposals />
                  <LatestProjects />
                </div>
                <div className="space-y-6">
                  <QuickActions 
                    onOpenProposalGenerator={() => setShowProposalGenerator(true)}
                    onOpenClientForm={() => setShowClientForm(true)}
                    onOpenInvoiceForm={() => setShowInvoiceForm(true)}
                    onOpenProjectForm={() => setShowProjectForm(true)}
                  />
                  <AutomationStatus />
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'live-projects' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <EnhancedLiveProjects />
            </motion.div>
          )}

          {activeView === 'projects' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProjectsManagement />
            </motion.div>
          )}

          {activeView === 'tasks' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TaskManagement />
            </motion.div>
          )}

          {activeView === 'proposals' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RecentProposals showAll={true} />
            </motion.div>
          )}

          {activeView === 'clients' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ClientManagement />
            </motion.div>
          )}

          {activeView === 'invoices' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <InvoiceManagement />
            </motion.div>
          )}

          {activeView === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </motion.div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showProposalGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <ProposalGenerator onClose={() => setShowProposalGenerator(false)} />
          </div>
        </div>
      )}

      {showProjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ProjectForm onClose={() => setShowProjectForm(false)} />
          </div>
        </div>
      )}

      {showClientForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ClientForm onClose={() => setShowClientForm(false)} />
          </div>
        </div>
      )}

      {showInvoiceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <InvoiceForm onClose={() => setShowInvoiceForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;