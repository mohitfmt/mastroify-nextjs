"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FiBookOpen, FiAward, FiUsers, FiHeart } from "react-icons/fi";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      id="about"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-cosmic-purple rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-celestial-pink rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-heading inline-block">
            Why Choose Mastroify?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-4">
            Authentic Vedic astrology guided by classical wisdom and modern
            convenience
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card-cosmic p-6 text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-cosmic rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FiBookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gold-primary mb-2">
              Expert Analysis
            </h3>
            <p className="text-gray-400">
              Every chart personally reviewed by an astrologer with 6+ years of
              dedicated Jyotish study
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card-cosmic p-6 text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-cosmic rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FiAward className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gold-primary mb-2">
              Quality Over Speed
            </h3>
            <p className="text-gray-400">
              Delivered in 3-5 days for thorough, contemplative analysis - not
              automated reports
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card-cosmic p-6 text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-cosmic rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FiUsers className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gold-primary mb-2">
              Bilingual Service
            </h3>
            <p className="text-gray-400">
              Reports and consultations available in both English and Hindi
              (देवनागरी)
            </p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card-cosmic p-6 text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-cosmic rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FiHeart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gold-primary mb-2">
              Ethical Practice
            </h3>
            <p className="text-gray-400">
              No fear-mongering, no pressure sales - honest, empowering guidance
              for your journey
            </p>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="p-6">
            <div className="text-4xl font-bold text-gradient-gold mb-2">6+</div>
            <div className="text-gray-400">Years of Jyotish Study</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-gradient-gold mb-2">
              82+
            </div>
            <div className="text-gray-400">Consultations Delivered</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-gradient-gold mb-2">
              2021
            </div>
            <div className="text-gray-400">Serving Clients Since</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
