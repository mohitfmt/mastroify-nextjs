"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const zodiacSigns = [
  { name: "Aries", symbol: "♈", dates: "Mar 21 - Apr 19", element: "Fire" },
  { name: "Taurus", symbol: "♉", dates: "Apr 20 - May 20", element: "Earth" },
  { name: "Gemini", symbol: "♊", dates: "May 21 - Jun 20", element: "Air" },
  { name: "Cancer", symbol: "♋", dates: "Jun 21 - Jul 22", element: "Water" },
  { name: "Leo", symbol: "♌", dates: "Jul 23 - Aug 22", element: "Fire" },
  { name: "Virgo", symbol: "♍", dates: "Aug 23 - Sep 22", element: "Earth" },
  { name: "Libra", symbol: "♎", dates: "Sep 23 - Oct 22", element: "Air" },
  { name: "Scorpio", symbol: "♏", dates: "Oct 23 - Nov 21", element: "Water" },
  {
    name: "Sagittarius",
    symbol: "♐",
    dates: "Nov 22 - Dec 21",
    element: "Fire",
  },
  {
    name: "Capricorn",
    symbol: "♑",
    dates: "Dec 22 - Jan 19",
    element: "Earth",
  },
  { name: "Aquarius", symbol: "♒", dates: "Jan 20 - Feb 18", element: "Air" },
  { name: "Pisces", symbol: "♓", dates: "Feb 19 - Mar 20", element: "Water" },
];

export default function ZodiacSelector() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [selectedSign, setSelectedSign] = useState(null);

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8" id="zodiac">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-heading inline-block">Explore Your Zodiac</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-4">
            Select your sun sign to learn about your astrological traits
          </p>
        </motion.div>

        {/* Zodiac Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {zodiacSigns.map((sign, index) => (
            <motion.button
              key={sign.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => setSelectedSign(sign)}
              className={`
                p-6 rounded-xl border-2 transition-all duration-300
                ${
                  selectedSign?.name === sign.name
                    ? "border-gold-primary bg-gold-primary/10"
                    : "border-transparent bg-deep-space hover:border-gold-primary/50"
                }
              `}
            >
              <div className="text-5xl mb-2">{sign.symbol}</div>
              <div className="font-bold text-gold-primary">{sign.name}</div>
              <div className="text-xs text-gray-500 mt-1">{sign.dates}</div>
            </motion.button>
          ))}
        </div>

        {/* Selected Sign Details */}
        {selectedSign && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 card-cosmic p-8 text-center max-w-2xl mx-auto"
          >
            <div className="text-6xl mb-4">{selectedSign.symbol}</div>
            <h3 className="text-3xl font-bold text-gold-primary mb-2">
              {selectedSign.name}
            </h3>
            <p className="text-gray-400 mb-4">{selectedSign.dates}</p>
            <div className="inline-block px-4 py-2 bg-gradient-cosmic rounded-full text-sm font-philosopher">
              {selectedSign.element} Sign
            </div>
            <div className="mt-6">
              <button className="btn-secondary">
                Get Your Full Chart Reading
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
