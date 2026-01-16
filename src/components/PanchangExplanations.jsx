"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiInfo, FiX } from "react-icons/fi";

const explanations = {
  tithi: {
    title: "Tithi (Lunar Day)",
    short: "Lunar phase determining auspiciousness",
    detailed: `Tithi represents the angular relationship between Sun and Moon, dividing the lunar month into 30 tithis (15 in Shukla Paksha - waxing, 15 in Krishna Paksha - waning). Each tithi has unique qualities affecting daily activities.`,
    classical: "Brihat Parashara Hora Shastra, Chapter 97",
    usage:
      "Choose tithis aligned with your activity: New beginnings on Pratipada, spiritual practices on Ekadashi, completion on Purnima/Amavasya.",
    importance:
      "Determines favorable timing for ceremonies, rituals, and major life events.",
  },
  nakshatra: {
    title: "Nakshatra (Lunar Mansion)",
    short: "Moon's constellation position",
    detailed: `The 27 Nakshatras divide the zodiac into segments of 13°20' each. Each nakshatra has a ruling deity, planetary lord, and specific qualities influencing personality, events, and muhurta selection.`,
    classical: "Vedanga Jyotisha, Nakshatra Prakarana",
    usage:
      "Nakshatra at birth shapes personality; nakshatra of the day influences activity outcomes. Avoid Mula, Jyeshtha for auspicious beginnings.",
    importance:
      "Critical for birth chart analysis, marriage matching, and muhurta (auspicious timing) calculations.",
  },
  yoga: {
    title: "Yoga (Auspicious Combination)",
    short: "Sun-Moon angular combination",
    detailed: `27 Yogas formed by the combined longitudinal movement of Sun and Moon. Each yoga completes in approximately 13°20' of combined motion. Some yogas are highly auspicious (Siddhi, Shubha), others inauspicious (Vyatipata, Vaidhriti).`,
    classical: "Muhurta Chintamani, Yoga Prakarana",
    usage:
      "Avoid starting important work during inauspicious yogas like Vyaghata, Vajra. Prefer Siddhi, Shubha for new ventures.",
    importance: "Enhances or diminishes the quality of time for activities.",
  },
  karana: {
    title: "Karana (Half-Tithi)",
    short: "Sub-division of lunar day",
    detailed: `Each tithi is divided into two Karanas. There are 11 Karanas total: 4 fixed (Shakuni, Chatushpada, Naga, Kimstughna) and 7 movable (Bava, Balava, Kaulava, Taitila, Garaja, Vanija, Vishti). Vishti (Bhadra) is considered inauspicious.`,
    classical: "Brihat Samhita, Karana Adhyaya",
    usage:
      "Avoid Vishti Karana for important activities. Movable karanas are generally favorable.",
    importance:
      "Refines timing within a tithi, especially for short-duration activities.",
  },
  rahuKaal: {
    title: "Rahu Kaal (Rahu Period)",
    short: "Most inauspicious time of day",
    detailed: `A 90-minute period ruled by Rahu (the North Node), considered highly inauspicious for starting new activities, travel, or important decisions. Position varies by weekday. No remedial measures can neutralize this period.`,
    classical: "Traditional Hindu almanac calculations",
    usage:
      "Strictly avoid: new ventures, travel, purchases, signing documents, marriage ceremonies.",
    importance: "The most feared inauspicious period in Vedic timekeeping.",
  },
  gulikaKaal: {
    title: "Gulika Kaal (Gulika Period)",
    short: "Son of Saturn's inauspicious time",
    detailed: `Gulika (son of Saturn) rules this 90-minute period, bringing obstacles and delays. Less severe than Rahu Kaal but still unfavorable for auspicious activities. Good only for black magic or dealing with enemies in classical texts.`,
    classical: "Prasna Marga, Gulika Prakarana",
    usage:
      "Avoid important beginnings. Can be used for dealing with chronic issues or confronting obstacles.",
    importance: "Second most important inauspicious period to avoid.",
  },
  yamaGhanta: {
    title: "Yama Ghanta (Death Period)",
    short: "Lord Yama's inauspicious hour",
    detailed: `A 90-minute period ruled by Yama (god of death), considered unlucky for all auspicious activities. Position varies by weekday. Modern astrologers debate its severity compared to Rahu Kaal.`,
    classical: "Traditional muhurta texts",
    usage:
      "Avoid ceremonies, travel, and important decisions. Some use for ancestor rituals.",
    importance: "Third major inauspicious period in daily panchang.",
  },
  abhijitMuhurta: {
    title: "Abhijit Muhurta (Victory Time)",
    short: "Most auspicious 48-minute window",
    detailed: `The 8th muhurta (48 minutes centered around apparent noon), considered the most powerful auspicious time. Abhijit means "victorious" - activities begun in this period tend toward success. Nullifies most doshas.`,
    classical: "Muhurta Chintamani, Abhijit Prakarana",
    usage:
      "Ideal for: Starting new ventures, exams, interviews, signing contracts, purchasing vehicles/property, marriage ceremonies in emergencies.",
    importance: "The single most universally auspicious time of day.",
  },
  amritKaal: {
    title: "Amrit Kaal (Nectar Time)",
    short: "Auspicious time for remedies",
    detailed: `"Amrit" means nectar or elixir of immortality. This period is considered favorable for spiritual practices, remedial measures, and healing activities. Particularly good for mantra recitation and donations.`,
    classical: "Various Jyotish muhurta texts",
    usage:
      "Best for: Mantra chanting, pujas, charitable donations, starting medication, spiritual practices.",
    importance: "Enhances effectiveness of remedial measures.",
  },
  durMuhurtam: {
    title: "Dur Muhurtam (Inauspicious Period)",
    short: "Two daily inauspicious windows",
    detailed: `Two 48-minute periods each day that are unfavorable for auspicious activities. Timing varies by weekday. Slightly less severe than Rahu Kaal but still best avoided for important work.`,
    classical: "Traditional panchang calculations",
    usage: "Avoid starting new activities, travel, important meetings.",
    importance:
      "Helps in detailed muhurta planning by eliminating unfavorable windows.",
  },
  varjyam: {
    title: "Varjyam (Prohibited Period)",
    short: "Time to be strictly avoided",
    detailed: `A 72-minute (3 ghatis) period considered highly inauspicious, calculated based on tithi and nakshatra. Different texts give slightly different calculation methods. Strict observance in traditional muhurta selection.`,
    classical: "Muhurta Chintamani, Varjya Prakarana",
    usage: "Completely avoid all auspicious activities during this period.",
    importance:
      "Important for precise muhurta calculations in traditional astrology.",
  },
  rashi: {
    title: "Rashi (Zodiac Sign)",
    short: "Zodiac position of celestial bodies",
    detailed: `The 12 Rashis (zodiac signs) are 30° divisions of the ecliptic. Moon's rashi changes every 2.25 days, Sun's every 30 days. Rashi indicates the sign occupied by a planet, affecting its expression and strength.`,
    classical: "Brihat Parashara Hora Shastra",
    usage:
      "Moon rashi determines daily emotional tone and favorable activities. Sun rashi indicates solar month.",
    importance: "Foundation of Vedic astrological analysis.",
  },
  samvat: {
    title: "Samvat (Hindu Calendar Year)",
    short: "Traditional Indian year counting",
    detailed: `Vikram Samvat starts from 57 BCE (King Vikramaditya), 57 years ahead of Common Era. Shaka Samvat starts from 78 CE (King Shalivahana), used as India's national calendar. Both start in Chaitra month (March-April).`,
    classical: "Historical Hindu calendar systems",
    usage: "Used in traditional almanacs and festival calculations.",
    importance: "Maintains connection to ancient Hindu timekeeping traditions.",
  },
  hinduMonth: {
    title: "Hindu Month (Lunar Month)",
    short: "Traditional lunar month names",
    detailed: `12 lunar months named Chaitra, Vaishakha, Jyeshtha, etc. Amanta system (South India) ends month at new moon; Purnimanta system (North India) ends at full moon. Month determined by Sun's zodiac position at full moon.`,
    classical: "Surya Siddhanta, Month Calculations",
    usage: "Determines festival dates and seasonal religious observances.",
    importance: "Essential for Hindu festival calendar and ritual timing.",
  },
};

export default function PanchangExplanation({
  element,
  children,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const info = explanations[element];

  if (!info) return children;

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div
        className="inline-flex items-center gap-2 cursor-help"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {children}
        <FiInfo className="w-4 h-4 text-gold-primary/60 hover:text-gold-primary transition-colors shrink-0" />
      </div>

      {/* Tooltip Card */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Desktop Hover Card */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-full mt-2 w-80 md:w-96 z-50 hidden md:block"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <div className="card-cosmic p-6 bg-deep-space border-2 border-gold-primary/30 shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-gold-primary mb-1">
                      {info.title}
                    </h4>
                    <p className="text-sm text-gray-400 italic">{info.short}</p>
                  </div>
                </div>

                {/* Detailed Explanation */}
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-xs font-semibold text-gold-light uppercase tracking-wide mb-1">
                      What It Means
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {info.detailed}
                    </p>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-gold-light uppercase tracking-wide mb-1">
                      How To Use
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {info.usage}
                    </p>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-gold-light uppercase tracking-wide mb-1">
                      Importance
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {info.importance}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-700">
                    <div className="text-xs text-gray-500 italic">
                      Classical Reference: {info.classical}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mobile Modal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-end md:hidden"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full bg-deep-space rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2 bg-gold-primary/20 rounded-full hover:bg-gold-primary/30 transition-colors"
                >
                  <FiX className="w-5 h-5 text-gold-primary" />
                </button>

                {/* Content */}
                <div className="pr-12">
                  <h4 className="text-xl font-bold text-gold-primary mb-2">
                    {info.title}
                  </h4>
                  <p className="text-sm text-gray-400 italic mb-4">
                    {info.short}
                  </p>

                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="text-xs font-semibold text-gold-light uppercase tracking-wide mb-2">
                        What It Means
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        {info.detailed}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-gold-light uppercase tracking-wide mb-2">
                        How To Use
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        {info.usage}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-gold-light uppercase tracking-wide mb-2">
                        Importance
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        {info.importance}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-700">
                      <div className="text-xs text-gray-500 italic">
                        Classical Reference: {info.classical}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
