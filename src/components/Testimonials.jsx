"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FiStar } from "react-icons/fi";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai, India",
    text: "The career guidance was incredibly accurate. The timing predictions for my job change came true within weeks!",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    location: "Toronto, Canada",
    text: "As an NRI, I wanted authentic Vedic astrology. Mastroify delivered exactly that - detailed, professional, and insightful.",
    rating: 5,
  },
  {
    name: "Anjali Mehta",
    location: "Bangalore, India",
    text: "The birth chart analysis helped me understand my life patterns. The remedies suggested were practical and easy to follow.",
    rating: 5,
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-deep-space/30"
      id="testimonials"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-heading inline-block">What Clients Say</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-4">
            Real experiences from real people
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card-cosmic p-6"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar
                    key={i}
                    className="w-5 h-5 text-gold-primary"
                    fill="currentColor"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="border-t border-gray-700 pt-4">
                <div className="font-bold text-gold-primary">
                  {testimonial.name}
                </div>
                <div className="text-sm text-gray-500">
                  {testimonial.location}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
