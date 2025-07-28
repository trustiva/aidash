import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Zap, Menu, X } from 'lucide-react';
import { NAVIGATION_ITEMS } from '../utils/constants';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
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
            {NAVIGATION_ITEMS.map((item) => (
              <ScrollLink 
                key={item.href}
                to={item.href} 
                smooth={true} 
                duration={500} 
                className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                {item.label}
              </ScrollLink>
            ))}
            <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Start Free Trial
            </button>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-2 space-y-2">
            {NAVIGATION_ITEMS.map((item) => (
              <ScrollLink 
                key={item.href}
                to={item.href} 
                smooth={true} 
                duration={500} 
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 cursor-pointer" 
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </ScrollLink>
            ))}
            <button className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-lg mt-2">
              Start Free Trial
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;