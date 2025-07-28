import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { PRICING_PLANS } from '../utils/constants';
import { fadeInUp, staggerContainer } from '../utils/animations';

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Simple Pricing. No Hidden Fees.
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600"
          >
            Choose the plan that fits your freelancing needs
          </motion.p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {PRICING_PLANS.map((plan, index) => (
            <motion.div 
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -5, scale: plan.isPopular ? 1.02 : 1 }}
              className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative ${
                plan.isPopular 
                  ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white' 
                  : 'bg-white border border-gray-200'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <h3 className={`text-2xl font-bold mb-2 ${plan.isPopular ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${plan.isPopular ? 'text-white' : 'text-gray-900'}`}>
                  ${plan.price}
                </span>
                <span className={plan.isPopular ? 'opacity-90' : 'text-gray-600'}>/month</span>
              </div>
              <p className={`mb-6 ${plan.isPopular ? 'opacity-90' : 'text-gray-600'}`}>
                {plan.description}
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckCircle className={`w-5 h-5 mr-3 ${plan.isPopular ? 'text-white' : 'text-green-500'}`} />
                    <span className={plan.isPopular ? 'text-white' : 'text-gray-700'}>{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.buttonVariant === 'primary'
                    ? 'bg-white text-blue-600 hover:shadow-lg'
                    : 'border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;