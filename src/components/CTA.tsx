import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';

const CTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl font-bold mb-6"
          >
            Ready to Transform Your Freelance Business?
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-xl mb-8 opacity-90"
          >
            Join thousands of freelancers who are already working smarter with LazyLancer's AI-powered tools.
          </motion.p>
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300"
            >
              Start Your Free Trial
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Schedule a Demo
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;