import React from 'react';
import { motion } from 'framer-motion';
import { VIP_FEATURES } from '../utils/constants';
import { fadeInUp, staggerContainer } from '../utils/animations';

const VIPSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-500 to-green-500 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl font-bold mb-6"
          >
            Upgrade to VIP for Advanced AI Features
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-xl mb-8 opacity-90"
          >
            Unlock powerful features like advanced proposal customizations, smarter client matching, 
            priority support, and exclusive AI tools that take your freelancing to the next level.
          </motion.p>
          <motion.div 
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 mb-8"
          >
            {VIP_FEATURES.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-xl"
                >
                  <IconComponent className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm opacity-90">{item.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
          <motion.button 
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300"
          >
            Upgrade to VIP
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default VIPSection;