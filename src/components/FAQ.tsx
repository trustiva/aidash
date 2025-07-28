import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FAQS } from '../utils/constants';
import { fadeInUp, staggerContainer } from '../utils/animations';

const FAQ: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(-1);

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600"
          >
            Everything you need to know about LazyLancer
          </motion.p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="space-y-6"
        >
          {FAQS.map((faq, index) => (
            <motion.div 
              key={index}
              variants={fadeInUp}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setActiveTab(activeTab === index ? -1 : index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                <div 
                  className={`transform transition-transform duration-200 ${
                    activeTab === index ? 'rotate-45' : ''
                  } flex-shrink-0`}
                  aria-label={activeTab === index ? 'Close answer' : 'Open answer'}
                >
                  <div className="w-6 h-6 flex items-center justify-center relative">
                    <div className="w-4 h-0.5 bg-gray-600 absolute"></div>
                    <div className="w-0.5 h-4 bg-gray-600 absolute"></div>
                  </div>
                </div>
              </div>
              <motion.div
                initial={false}
                animate={{
                  height: activeTab === index ? 'auto' : 0,
                  opacity: activeTab === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {activeTab === index && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;