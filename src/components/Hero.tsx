import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { fadeInUp, smoothTransition } from '../utils/animations';

const Hero: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-green-500/5"></div>
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-green-200 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-blue-400 rounded-full opacity-30"></div>
      </motion.div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ ...smoothTransition, duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Work Smarter, Not Harder with{" "}
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              AI for Freelancers
            </span>
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ ...smoothTransition, duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 leading-relaxed"
          >
            Automate your tasks, streamline your workflow, and boost your productivity with LazyLancer's AI-powered dashboard. 
            Spend less time on administrative work and more time on what you do best.
          </motion.p>
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ ...smoothTransition, duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors group"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <Play className="w-5 h-5 text-blue-500 ml-0.5" />
              </div>
              <span className="font-medium">Watch Demo</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;