import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: '📊',
    title: 'Smart Loan Tracking',
    desc: 'Keep track of all your loan applications in one place with real-time updates and instant notifications.',
  },
  {
    icon: '🔒',
    title: 'Secure & Encrypted',
    desc: 'All transactions and sensitive data are fully encrypted with bank-grade security to ensure your safety.',
  },
  {
    icon: '📈',
    title: 'Analytics & Reports',
    desc: 'Generate detailed reports and gain deep insights to make smarter, data-driven lending decisions.',
  },
  {
    icon: '🖥️',
    title: 'User-Friendly Dashboard',
    desc: 'Intuitive dashboard designed for seamless navigation and productivity across all your devices.',
  },
  {
    icon: '⚡',
    title: 'Fast Approvals',
    desc: 'AI-powered review system ensures lightning-fast loan approvals without compromising accuracy.',
  },
  {
    icon: '🌐',
    title: '24/7 Availability',
    desc: 'Access your financial data anytime, anywhere with 99.9% uptime guaranteed on our platform.',
  },
];

const About = () => {
  return (
    <section className="w-11/12 mx-auto py-20 relative">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-info/10 text-info text-sm font-semibold mb-4 border border-info/20">
          Why QuickLoan?
        </span>
        <h2 className="text-4xl sm:text-5xl font-black text-primary leading-tight mb-5">
          Empower Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-info">
            Financial Journey
          </span>
        </h2>
        <p className="text-gray-700 dark:text-gray-400 text-lg leading-relaxed">
          QuickLoan is your complete loan management solution. Track applications, manage approvals,
          and make informed decisions — all in one secure and intuitive platform.
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-16"
      >
        {[
          { value: '50K+', label: 'Active Users' },
          { value: '৳2B+', label: 'Loans Processed' },
          { value: '99.9%', label: 'Uptime' },
        ].map((stat, i) => (
          <div
            key={i}
            className="text-center p-5 rounded-2xl bg-white dark:bg-card-dark shadow-md border border-info/10"
          >
            <p className="text-3xl font-black text-primary">{stat.value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Feature Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="group p-7 rounded-2xl bg-white dark:bg-card-dark shadow-lg hover:shadow-2xl border border-transparent hover:border-info/30 transition-all duration-300 cursor-default"
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 group-hover:text-primary transition-colors duration-300">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {feature.desc}
            </p>

            {/* Bottom accent line on hover */}
            <div className="mt-5 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary to-info transition-all duration-500 rounded-full"></div>
          </motion.div>
        ))}
      </div>

      {/* Background Accent Shapes */}
      <motion.div
        className="absolute top-0 left-0 w-48 h-48 bg-info/20 rounded-full blur-3xl animate-pulse"
        initial={{ scale: 0 }}
        animate={{ scale: 1.2 }}
        transition={{ repeat: Infinity, duration: 12, yoyo: true }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-60 h-60 bg-info/30 rounded-full blur-3xl animate-pulse"
        initial={{ scale: 0 }}
        animate={{ scale: 1.3 }}
        transition={{ repeat: Infinity, duration: 15, yoyo: true }}
      />

    </section>
  );
};

export default About;