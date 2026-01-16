"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FiStar,
  FiHome,
  FiHeart,
  FiBriefcase,
  FiBookOpen,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

const services = [
  {
    icon: FiStar,
    title: "Birth Chart Reading",
    description:
      "Comprehensive Kundali analysis covering all 12 houses, planetary positions, Dashas, and yogas.",
    features: [
      "D-1 through D-60 charts",
      "Nakshatra analysis",
      "Dasha timeline",
    ],
  },
  {
    icon: FiHome,
    title: "Vastu Consultation",
    description:
      "Traditional Vastu Shastra guidance for homes, offices, and commercial spaces.",
    features: [
      "Directional analysis",
      "Remedial solutions",
      "No demolition needed",
    ],
  },
  {
    icon: HiSparkles,
    title: "Remedies & Solutions",
    description:
      "Personalized gemstone recommendations, mantras, and practical remedies.",
    features: [
      "Gemstone guidance",
      "Mantra suggestions",
      "Lifestyle adjustments",
    ],
  },
  {
    icon: FiBriefcase,
    title: "Career Guidance",
    description:
      "Detailed career analysis examining 10th house, D-10 chart, and timing for job changes.",
    features: [
      "Career path analysis",
      "Promotion timing",
      "Business vs. job suitability",
    ],
  },
  {
    icon: FiHeart,
    title: "Relationship Compatibility",
    description:
      "Kundali matching and relationship analysis using Ashtakoota Guna Milan.",
    features: [
      "8-fold compatibility",
      "Mangal Dosha analysis",
      "Marriage timing",
    ],
  },
  {
    icon: FiBookOpen,
    title: "Educational Approach",
    description:
      "Reports explain astrological concepts in simple language - learn as you discover.",
    features: [
      "Empowerment focus",
      "Classical techniques",
      "Modern interpretation",
    ],
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-deep-space/30"
      id="services"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-heading inline-block">Our Services</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-4">
            Comprehensive Vedic astrology services tailored to your life's
            questions
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-cosmic p-6 group cursor-pointer"
              >
                {/* Icon */}
                <div className="w-14 h-14 mb-4 bg-gradient-cosmic rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gold-primary mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center text-sm text-gray-500"
                    >
                      <div className="w-1.5 h-1.5 bg-gold-primary rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Hover Arrow */}
                <div className="mt-6 flex items-center text-gold-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-philosopher font-bold">
                    Learn More
                  </span>
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <button className="btn-primary">View All Services</button>
        </motion.div>
      </div>
    </section>
  );
}
