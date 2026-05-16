import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
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
          Contact Us
        </span>
        <h2 className="text-4xl sm:text-5xl font-black text-primary leading-tight mb-5">
          Get in{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-info">
            Touch
          </span>
        </h2>
        <p className="text-gray-700 dark:text-gray-500 text-lg leading-relaxed">
          Have questions or need support? Fill out the form and our team will get back to you promptly.
        </p>
      </motion.div>

      {/* Main Content: Form Left + Info Right */}
      <div className="flex flex-col lg:flex-row gap-10 items-stretch">

        {/* Left: Form */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex-[1.3] bg-white dark:bg-card-dark rounded-3xl shadow-xl border border-info/10 p-10"
        >
          <h3 className="text-2xl font-black text-gray-800 dark:text-gray-500 mb-7">Send a Message</h3>
          <form className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-500 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-deep-navy text-gray-800 dark:text-text-primary placeholder-gray-400 dark:placeholder-text-secondary border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-info transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-500 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-deep-navy text-gray-800 dark:text-text-primary placeholder-gray-400 dark:placeholder-text-secondary border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-info transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-500 mb-2">Subject</label>
              <input
                type="text"
                placeholder="How can we help?"
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-deep-navy text-gray-800 dark:text-text-primary placeholder-gray-400 dark:placeholder-text-secondary border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-info transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-500 mb-2">Message</label>
              <textarea
                rows={5}
                placeholder="Write your message here..."
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-deep-navy text-gray-800 dark:text-text-primary placeholder-gray-400 dark:placeholder-text-secondary border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-info transition-all resize-none"
              ></textarea>
            </div>

            <motion.button
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-4 rounded-xl bg-info text-white font-bold hover:bg-info/90 shadow-lg transition-all"
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>

        {/* Right: Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex-1 flex flex-col gap-6 justify-between"
        >
          {/* Info Cards */}
          {[
            { icon: '📧', title: 'Email Us', desc: 'quickloan@support.com', sub: 'We reply within 24 hours' },
            { icon: '📞', title: 'Call Us', desc: '+880 1234-567890', sub: 'Mon–Fri, 9am to 6pm' },
            { icon: '📍', title: 'Our Office', desc: 'Dhaka, Bangladesh', sub: 'Visit us anytime' },
            { icon: '💬', title: 'Live Chat', desc: 'Available on dashboard', sub: 'Instant support' },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group flex items-start gap-5 p-6 rounded-2xl bg-white dark:bg-card-dark shadow-md border border-info/10 hover:border-info/40 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-500 mb-0.5">{item.title}</p>
                <p className="text-info font-semibold text-sm">{item.desc}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Background Accent Shapes */}
      <motion.div
        className="absolute top-0 left-0 w-48 h-48 bg-info/20 rounded-full blur-3xl pointer-events-none"
        initial={{ scale: 0 }}
        animate={{ scale: 1.2 }}
        transition={{ repeat: Infinity, duration: 12, repeatType: 'reverse' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-60 h-60 bg-info/30 rounded-full blur-3xl pointer-events-none"
        initial={{ scale: 0 }}
        animate={{ scale: 1.3 }}
        transition={{ repeat: Infinity, duration: 15, repeatType: 'reverse' }}
      />

    </section>
  );
};

export default Contact;