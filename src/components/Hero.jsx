"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FiStar, FiCalendar } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export default function Hero() {
  const [stars, setStars] = useState([]);

  // Generate stars only on client-side to avoid hydration mismatch
  useEffect(() => {
    const generatedStars = [...Array(50)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-24 md:pt-32">
      {/* Animated Background Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-gold-light rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Image
            src="/logo.svg"
            alt="Mastroify Logo"
            width={400}
            height={160}
            className="mx-auto w-64 sm:w-80 md:w-96"
            priority
          />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
        >
          <span className="text-gradient-cosmic">Discover Your Future</span>
          <br />
          <span className="text-gold-primary">To Shape Better You</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed px-4"
        >
          Authentic Vedic Astrology consultations by an expert with{" "}
          <span className="text-gold-light font-semibold">6+ years</span> of
          classical Jyotish study
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12 px-4"
        >
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-deep-space/50 border border-gold-primary/30 rounded-full text-xs sm:text-sm">
            <HiSparkles className="w-3 h-3 sm:w-4 sm:h-4 text-gold-primary" />
            <span>Expert Analysis</span>
          </div>
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-deep-space/50 border border-gold-primary/30 rounded-full text-xs sm:text-sm">
            <FiStar className="w-3 h-3 sm:w-4 sm:h-4 text-gold-primary" />
            <span>Personalized Reports</span>
          </div>
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-deep-space/50 border border-gold-primary/30 rounded-full text-xs sm:text-sm">
            <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4 text-gold-primary" />
            <span>Delivered in 3-5 Days</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
        >
          <button className="btn-primary w-full sm:w-auto">
            Book Consultation
          </button>
          <button className="btn-secondary w-full sm:w-auto">
            Explore Services
          </button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 sm:mt-16 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-400 px-4"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Serving clients globally since 2021</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-gray-700" />
          <div className="flex items-center gap-2">
            <FiStar className="w-4 h-4 text-gold-primary fill-gold-primary" />
            <span>82+ consultations delivered</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gold-primary rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-gold-primary rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
