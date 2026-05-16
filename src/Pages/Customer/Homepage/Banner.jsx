import React from 'react';
import { motion } from 'framer-motion';
import bannerMainImg from '../../../assets/b1 (1).svg';

const Banner = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 }
    }
  };

  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">

      {/* Full-width Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900"></div>

      {/* Overlay pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.3)_0%,transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.4)_0%,transparent_60%)]"></div>

      {/* Grid dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]"></div>

      {/* Glowing orbs */}
      <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-100px] right-[-60px] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[140px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px]"></div>

      {/* Content */}
      <div className="relative z-10 w-11/12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 py-20 lg:py-0">

        {/* Left: Text */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 text-center lg:text-left max-w-2xl"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-purple-200 text-sm font-semibold mb-6 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
            Smart Automation & Enterprise Security
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.15]"
          >
            Take Control of Your Finances with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300">
              QuickLoan
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="text-blue-100/80 text-lg mb-8 leading-relaxed"
          >
            Experience effortless loan management in one unified space. We simplify complex financial workflows with intelligent tracking and seamless processing you can count on.
          </motion.p>

          {/* Stats row */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap gap-6 justify-center lg:justify-start mb-8"
          >
            {[
              { value: '50K+', label: 'Active Users' },
              { value: '৳2B+', label: 'Loans Processed' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-blue-200/70 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <motion.a
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.97 }}
              href="/all-loans"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold shadow-[0_4px_30px_rgba(139,92,246,0.5)] hover:shadow-[0_6px_40px_rgba(139,92,246,0.7)] transition-all text-center"
            >
              Get Started Now
            </motion.a>

            <motion.a
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.97 }}
              href="/contact"
              className="px-8 py-3.5 rounded-xl border border-white/25 bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white/20 hover:border-white/40 transition-all text-center"
            >
              Contact Specialist
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Right: Floating Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full max-w-lg lg:max-w-none flex justify-center lg:justify-end relative"
        >
          {/* Glow behind image */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/30 via-blue-400/20 to-transparent rounded-3xl blur-2xl transform rotate-3 scale-90"></div>

          {/* Glass card frame */}
          <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
            <motion.img
              src={bannerMainImg}
              alt="Financial Loan Dashboard Illustration"
              className="w-full max-h-[420px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Banner;