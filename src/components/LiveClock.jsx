"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { FiClock, FiStar, FiAlertTriangle } from "react-icons/fi";

// Helper to check if current time is within a period
function isWithinPeriod(currentTime, startTime, endTime) {
  const current = new Date(currentTime);
  const start = new Date(startTime);
  const end = new Date(endTime);
  return current >= start && current <= end;
}

export default function LiveClock({ panchang = null, size = "large" }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPeriod, setCurrentPeriod] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Detect current period from panchang data
      if (panchang) {
        let period = { name: "Normal Time", type: "neutral" };

        // Check auspicious times
        const auspiciousChecks = [
          {
            key: "brahmaMuhurta",
            name: "Brahma Muhurta",
            emoji: "🌅",
            type: "excellent",
          },
          {
            key: "abhijitMuhurta",
            name: "Abhijit Muhurta",
            emoji: "⭐",
            type: "excellent",
          },
          {
            key: "vijayaMuhurta",
            name: "Vijaya Muhurta",
            emoji: "🏆",
            type: "good",
          },
          {
            key: "godhuliMuhurta",
            name: "Godhuli Muhurta",
            emoji: "🌇",
            type: "good",
          },
          {
            key: "amritKaal",
            name: "Amrit Kaal",
            emoji: "✨",
            type: "good",
          },
        ];

        for (const check of auspiciousChecks) {
          const time = panchang.auspiciousTimes?.[check.key];
          if (time && isWithinPeriod(now, time.start, time.end)) {
            period = {
              name: check.name,
              emoji: check.emoji,
              type: check.type,
            };
            break;
          }
        }

        // Check inauspicious times (higher priority - overrides)
        const inauspiciousChecks = [
          { key: "rahuKaal", name: "Rahu Kaal", emoji: "⚠️", type: "bad" },
          { key: "gulikaKaal", name: "Gulika Kaal", emoji: "🚫", type: "bad" },
          { key: "yamaGhanta", name: "Yama Ghanta", emoji: "⛔", type: "bad" },
        ];

        for (const check of inauspiciousChecks) {
          const time = panchang.inauspiciousTimes?.[check.key];
          if (time && isWithinPeriod(now, time.start, time.end)) {
            period = {
              name: check.name,
              emoji: check.emoji,
              type: check.type,
            };
            break;
          }
        }

        // Check dur muhurtam
        if (panchang.inauspiciousTimes?.durMuhurtam) {
          for (const dm of panchang.inauspiciousTimes.durMuhurtam) {
            if (isWithinPeriod(now, dm.start, dm.end)) {
              period = {
                name: "Dur Muhurtam",
                emoji: "⚠️",
                type: "bad",
              };
              break;
            }
          }
        }

        setCurrentPeriod(period);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [panchang]);

  // Size configurations
  const sizes = {
    small: {
      time: "text-3xl md:text-4xl",
      icon: "w-6 h-6",
      period: "text-sm",
      date: "text-xs",
    },
    medium: {
      time: "text-5xl md:text-6xl",
      icon: "w-8 h-8",
      period: "text-base",
      date: "text-sm",
    },
    large: {
      time: "text-7xl md:text-9xl",
      icon: "w-12 h-12",
      period: "text-xl md:text-2xl",
      date: "text-base",
    },
  };

  const config = sizes[size] || sizes.large;

  // Period styling
  const periodColors = {
    excellent: "text-green-400 border-green-500 bg-green-500/10",
    good: "text-cyan-400 border-cyan-500 bg-cyan-500/10",
    neutral: "text-gray-400 border-gray-600 bg-gray-600/10",
    bad: "text-red-400 border-red-500 bg-red-500/10",
  };

  const periodColor = periodColors[currentPeriod?.type] || periodColors.neutral;

  return (
    <div className="flex flex-col items-center">
      {/* Digital Clock */}
      <div className="flex items-center gap-4 mb-4">
        <FiClock className={`${config.icon} text-gold-primary animate-pulse`} />
        <div
          className={`${config.time} font-bold text-gradient-gold font-philosopher tracking-wider`}
        >
          {format(currentTime, "HH:mm:ss")}
        </div>
      </div>

      {/* Current Period Badge */}
      {currentPeriod && (
        <div
          className={`mb-4 px-6 py-3 rounded-full border-2 ${periodColor} backdrop-blur-sm flex items-center gap-3`}
        >
          <span className="text-2xl">{currentPeriod.emoji}</span>
          <div className="text-left">
            <div className="text-xs opacity-70">Currently in:</div>
            <div className={`${config.period} font-bold`}>
              {currentPeriod.name}
            </div>
          </div>
          {currentPeriod.type === "excellent" && (
            <FiStar className="w-5 h-5 animate-pulse" />
          )}
          {currentPeriod.type === "bad" && (
            <FiAlertTriangle className="w-5 h-5 animate-pulse" />
          )}
        </div>
      )}

      {/* Day & Date */}
      <div className={`${config.period} text-gray-300 mb-2`}>
        {format(currentTime, "EEEE, MMMM d, yyyy")}
      </div>

      {/* AM/PM */}
      <div className="text-sm text-gray-500">{format(currentTime, "a")}</div>
    </div>
  );
}
