"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiMapPin,
  FiStar,
  FiAlertTriangle,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
  FiSunrise,
  FiSunset,
} from "react-icons/fi";
import { WiSunrise, WiSunset, WiMoonrise, WiMoonset } from "react-icons/wi";
import { HiSparkles } from "react-icons/hi2";
import Navigation from "./Navigation";
import Footer from "./Footer";
import WhatsAppFloat from "./WhatsAppFloat";
import LiveClock from "./LiveClock";

// ============================================
// ENHANCED TIMELINE WITH MORE VISUAL INFO
// ============================================
function DayTimeline({ panchang, currentTime }) {
  if (!panchang?.sunMoon) return null;

  const sunrise = new Date(panchang.sunMoon.sunrise);
  const sunset = new Date(panchang.sunMoon.sunset);
  const dayDuration = sunset - sunrise;

  // Calculate current position on timeline (0-100%)
  const currentPosition = Math.min(
    Math.max(((currentTime - sunrise) / dayDuration) * 100, 0),
    100
  );

  // Helper to convert time to position on timeline
  const timeToPosition = (time) => {
    const t = new Date(time);
    const pos = ((t - sunrise) / dayDuration) * 100;
    return Math.max(0, Math.min(100, pos)); // Clamp to 0-100
  };

  // Collect all auspicious periods
  const auspiciousPeriods = [];
  const auspiciousTimes = panchang.auspiciousTimes || {};

  Object.entries(auspiciousTimes).forEach(([key, period]) => {
    if (period?.start && period?.end) {
      const start = timeToPosition(period.start);
      const end = timeToPosition(period.end);

      // Only show if within day bounds
      if (end > 0 && start < 100) {
        auspiciousPeriods.push({
          name: key,
          start: Math.max(0, start),
          end: Math.min(100, end),
        });
      }
    }
  });

  // Collect all inauspicious periods
  const inauspiciousPeriods = [];
  const inauspiciousTimes = panchang.inauspiciousTimes || {};

  ["rahuKaal", "gulikaKaal", "yamaGhanta"].forEach((key) => {
    const period = inauspiciousTimes[key];
    if (period?.start && period?.end) {
      const start = timeToPosition(period.start);
      const end = timeToPosition(period.end);

      if (end > 0 && start < 100) {
        inauspiciousPeriods.push({
          name: key,
          start: Math.max(0, start),
          end: Math.min(100, end),
        });
      }
    }
  });

  // Add dur muhurtam periods
  if (inauspiciousTimes.durMuhurtam) {
    inauspiciousTimes.durMuhurtam.forEach((dm, idx) => {
      const start = timeToPosition(dm.start);
      const end = timeToPosition(dm.end);

      if (end > 0 && start < 100) {
        inauspiciousPeriods.push({
          name: `durMuhurtam${idx}`,
          start: Math.max(0, start),
          end: Math.min(100, end),
        });
      }
    });
  }

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold text-gold-primary mb-6 text-center flex items-center justify-center gap-2">
        <FiSunrise className="w-6 h-6" />
        Today's Timeline
        <FiSunset className="w-6 h-6" />
      </h3>

      {/* Timeline Container */}
      <div className="relative">
        <div className="h-32 bg-deep-space/50 rounded-xl overflow-visible relative border border-gold-primary/20">
          {/* Base gradient (day to night) */}
          <div className="absolute inset-0 bg-gradient-to-r from-dawn-gold/20 via-gold-light/30 to-celestial-pink/20" />

          {/* Auspicious periods (Green) */}
          {auspiciousPeriods.map((period, idx) => (
            <motion.div
              key={`auspicious-${idx}`}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="absolute h-full bg-green-500/40 border-t-4 border-green-500"
              style={{
                left: `${period.start}%`,
                width: `${period.end - period.start}%`,
              }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-green-400 font-semibold whitespace-nowrap">
                ✨ Good
              </div>
            </motion.div>
          ))}

          {/* Inauspicious periods (Red) */}
          {inauspiciousPeriods.map((period, idx) => (
            <motion.div
              key={`inauspicious-${idx}`}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
              className="absolute h-full bg-red-500/40 border-t-4 border-red-500"
              style={{
                left: `${period.start}%`,
                width: `${period.end - period.start}%`,
              }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-red-400 font-semibold whitespace-nowrap">
                ⚠️ Avoid
              </div>
            </motion.div>
          ))}

          {/* Current time marker (ANIMATED) */}
          {currentPosition >= 0 && currentPosition <= 100 && (
            <motion.div
              animate={{ scaleY: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-gold-primary via-gold-light to-gold-primary shadow-lg shadow-gold-primary/50 z-10"
              style={{ left: `${currentPosition}%` }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gold-primary rounded-full border-2 border-white animate-pulse" />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gold-primary rounded-full border-2 border-white animate-pulse" />

              {/* Current time label */}
              <div className="absolute top-1/2 -translate-y-1/2 left-4 bg-gold-primary/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-night-sky whitespace-nowrap">
                NOW • {format(currentTime, "h:mm a")}
              </div>
            </motion.div>
          )}

          {/* Sunrise marker */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
            <WiSunrise className="w-12 h-12 text-dawn-gold drop-shadow-lg" />
          </div>

          {/* Sunset marker */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
            <WiSunset className="w-12 h-12 text-celestial-pink drop-shadow-lg" />
          </div>
        </div>

        {/* Time labels */}
        <div className="flex justify-between mt-4 text-sm">
          <div className="text-gray-400">
            <div className="font-semibold text-dawn-gold mb-1">Sunrise</div>
            <div>{format(sunrise, "h:mm a")}</div>
          </div>
          <div className="text-gray-400">
            <div className="font-semibold text-celestial-pink mb-1">Sunset</div>
            <div>{format(sunset, "h:mm a")}</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500/40 border-2 border-green-500 rounded" />
          <span className="text-gray-300">Auspicious Time</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500/40 border-2 border-red-500 rounded" />
          <span className="text-gray-300">Inauspicious Time</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-b from-gold-primary via-gold-light to-gold-primary rounded" />
          <span className="text-gray-300">Current Time</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function PanchangDetails() {
  const [panchang, setPanchang] = useState(null);
  const [location, setLocation] = useState(null);
  const [coords, setCoords] = useState({ lat: 28.6139, lon: 77.209 });
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [locationSearch, setLocationSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Panchang data
  const fetchPanchang = async (lat, lon, date) => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔍 Fetching Panchang for:", { lat, lon, date });

      const response = await fetch(
        `/api/panchang?lat=${lat}&lon=${lon}&date=${date}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Panchang data");
      }

      const data = await response.json();

      console.log("✅ Panchang Data Received:", {
        tithi: data.tithi?.name,
        tithiProgress: data.tithi?.progress,
        nakshatra: data.nakshatra?.name,
        sunrise: data.sunMoon?.sunrise,
        sunset: data.sunMoon?.sunset,
      });

      setPanchang(data);
    } catch (err) {
      console.error("❌ Panchang Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lon: longitude });
          fetchPanchang(latitude, longitude, selectedDate);

          // Reverse geocode
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((res) => res.json())
            .then((data) =>
              setLocation({
                city:
                  data.address.city ||
                  data.address.town ||
                  data.address.village ||
                  "Your Location",
                country: data.address.country,
              })
            )
            .catch(() => setLocation({ city: "Your Location", country: "" }));
        },
        () => {
          // Default to Delhi
          fetchPanchang(28.6139, 77.209, selectedDate);
          setLocation({ city: "New Delhi", country: "India" });
        }
      );
    } else {
      fetchPanchang(28.6139, 77.209, selectedDate);
      setLocation({ city: "New Delhi", country: "India" });
    }
  }, []);

  // Handle date change
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    fetchPanchang(coords.lat, coords.lon, newDate);
  };

  // Handle location search
  const handleLocationSearch = async (query) => {
    if (query.length < 3) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=1`
      );
      const results = await response.json();

      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];
        setCoords({ lat: parseFloat(lat), lon: parseFloat(lon) });
        setLocation({
          city: display_name.split(",")[0],
          country: display_name.split(",").pop().trim(),
        });
        fetchPanchang(parseFloat(lat), parseFloat(lon), selectedDate);
        setLocationSearch("");
      }
    } catch (err) {
      console.error("Location search failed:", err);
    }
  };

  // Format time helper
  const formatTime = (dateString) => {
    if (!dateString) return "--:--";
    return format(new Date(dateString), "h:mm a");
  };

  // Check if next day
  const isNextDay = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const selected = new Date(selectedDate);
    return date.getDate() !== selected.getDate();
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-night-sky">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-gold-primary border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-400 text-lg">Loading Panchang...</p>
            <p className="text-gray-600 text-sm mt-2">
              Calculating cosmic timings
            </p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-night-sky">
          <div className="text-center max-w-md">
            <FiAlertTriangle className="w-20 h-20 text-red-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Unable to Load Panchang
            </h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() =>
                fetchPanchang(coords.lat, coords.lon, selectedDate)
              }
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!panchang) return null;

  const sunMoonData = [
    {
      icon: WiSunrise,
      label: "Sunrise",
      time: panchang.sunMoon?.sunrise,
      color: "text-dawn-gold",
    },
    {
      icon: WiSunset,
      label: "Sunset",
      time: panchang.sunMoon?.sunset,
      color: "text-celestial-pink",
    },
    {
      icon: WiMoonrise,
      label: "Moonrise",
      time: panchang.sunMoon?.moonrise,
      color: "text-gold-light",
      nextDay: isNextDay(panchang.sunMoon?.moonrise),
    },
    {
      icon: WiMoonset,
      label: "Moonset",
      time: panchang.sunMoon?.moonset,
      color: "text-cosmic-purple",
      nextDay: isNextDay(panchang.sunMoon?.moonset),
    },
  ];

  return (
    <>
      <Navigation />

      {/* HERO SECTION - GORGEOUS PANCHANG DASHBOARD */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-24 pb-12 bg-gradient-to-b from-night-sky via-deep-space to-night-sky">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Cosmic glow effects */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 left-20 w-96 h-96 bg-cosmic-purple/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-20 right-20 w-96 h-96 bg-celestial-pink/30 rounded-full blur-3xl"
          />

          {/* Floating stars */}
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold-light rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          {/* Header Controls */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12"
          >
            {/* Date Picker */}
            <div className="flex items-center gap-3 bg-deep-space/80 backdrop-blur-lg px-6 py-4 rounded-xl border-2 border-gold-primary/40 shadow-xl">
              <FiCalendar className="w-6 h-6 text-gold-primary" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="bg-transparent border-none text-gray-200 text-lg focus:outline-none font-semibold"
              />
            </div>

            {/* Location */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 bg-deep-space/80 backdrop-blur-lg px-6 py-4 rounded-xl border-2 border-gold-primary/40 shadow-xl">
                <FiMapPin className="w-6 h-6 text-gold-primary" />
                <span className="text-gray-200 font-semibold text-lg">
                  {location?.city}, {location?.country}
                </span>
              </div>
              <input
                type="text"
                placeholder="Change location..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleLocationSearch(locationSearch)
                }
                className="px-6 py-4 bg-deep-space/80 backdrop-blur-lg border-2 border-gold-primary/40 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-primary shadow-xl text-lg"
              />
            </div>
          </motion.div>

          {/* Live Clock with Period Detection */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-16"
          >
            <LiveClock panchang={panchang} size="large" />
          </motion.div>

          {/* Current Vedic Elements - GORGEOUS CARDS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {/* Tithi Card - WITH WORKING PROGRESS BAR */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-cosmic-purple/40 via-deep-space to-deep-space border-2 border-cosmic-purple/50 shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cosmic-purple/20 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <HiSparkles className="w-4 h-4" />
                  Tithi (Lunar Day)
                </div>
                <div className="text-3xl font-bold text-gold-primary mb-1">
                  {panchang.tithi?.name || "N/A"}
                </div>
                <div className="text-sm text-gray-400 mb-4">
                  {panchang.tithi?.hindi} • {panchang.tithi?.paksha} Paksha
                </div>

                {/* FIXED PROGRESS BAR */}
                <div className="mt-4 bg-deep-space/80 rounded-full h-3 overflow-hidden border border-cosmic-purple/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${panchang.tithi?.progress || 0}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-cosmic-purple via-celestial-pink to-gold-primary rounded-full"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{panchang.tithi?.progress || 0}% complete</span>
                  <span>Ends {formatTime(panchang.tithi?.endsAt)}</span>
                </div>
              </div>
            </motion.div>

            {/* Nakshatra Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-celestial-pink/40 via-deep-space to-deep-space border-2 border-celestial-pink/50 shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-celestial-pink/20 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="text-sm text-gray-400 mb-2">Nakshatra</div>
                <div className="text-3xl font-bold text-gold-primary mb-1">
                  {panchang.nakshatra?.name || "N/A"}
                </div>
                <div className="text-sm text-gray-400 mb-3">
                  {panchang.nakshatra?.hindi}
                </div>
                <div className="space-y-1 text-xs text-gray-500">
                  <div>
                    Lord:{" "}
                    <span className="text-gold-light">
                      {panchang.nakshatra?.lord}
                    </span>
                  </div>
                  <div>
                    Deity:{" "}
                    <span className="text-gray-300">
                      {panchang.nakshatra?.deity}
                    </span>
                  </div>
                  <div>
                    Ends:{" "}
                    <span className="text-gray-300">
                      {formatTime(panchang.nakshatra?.endsAt)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Yoga Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-gold-primary/40 via-deep-space to-deep-space border-2 border-gold-primary/50 shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-primary/20 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="text-sm text-gray-400 mb-2">Yoga</div>
                <div className="text-3xl font-bold text-gold-primary mb-1">
                  {panchang.yoga?.name || "N/A"}
                </div>
                <div className="text-sm text-gray-400 mb-3">
                  {panchang.yoga?.hindi}
                </div>
                <div className="text-xs text-gray-500">
                  Ends:{" "}
                  <span className="text-gray-300">
                    {formatTime(panchang.yoga?.endsAt)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Day Type Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className={`relative overflow-hidden rounded-2xl p-6 shadow-2xl ${
                panchang.summary?.dayType === "Auspicious"
                  ? "bg-gradient-to-br from-green-500/40 via-deep-space to-deep-space border-2 border-green-500/50"
                  : panchang.summary?.dayType === "Inauspicious"
                  ? "bg-gradient-to-br from-red-500/40 via-deep-space to-deep-space border-2 border-red-500/50"
                  : "bg-gradient-to-br from-gray-500/40 via-deep-space to-deep-space border-2 border-gray-500/50"
              }`}
            >
              <div className="relative z-10">
                <div className="text-sm text-gray-400 mb-2">Day Type</div>
                <div
                  className={`text-3xl font-bold mb-1 ${
                    panchang.summary?.dayType === "Auspicious"
                      ? "text-green-400"
                      : panchang.summary?.dayType === "Inauspicious"
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  {panchang.summary?.dayType || "Mixed"}
                </div>
                <div className="text-sm text-gray-400">
                  {panchang.summary?.dayTypeHindi}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card-cosmic p-8 mb-8 border-2 border-gold-primary/30 shadow-2xl"
          >
            <DayTimeline panchang={panchang} currentTime={currentTime} />
          </motion.div>
        </div>
      </section>

      {/* REST OF THE PAGE - DETAILED SECTIONS */}
      <div className="bg-gradient-to-b from-night-sky to-deep-space">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Celestial Timings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-cosmic p-8 mb-8 border-2 border-gold-primary/20 shadow-xl"
          >
            <h3 className="text-3xl font-bold text-gold-primary mb-6 flex items-center gap-3">
              <HiSparkles className="w-8 h-8" />
              Celestial Timings
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {sunMoonData.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-6 bg-deep-space/50 rounded-xl border border-gray-800 hover:border-gold-primary/50 transition-all"
                  >
                    <Icon className={`w-16 h-16 mx-auto mb-3 ${item.color}`} />
                    <div className="text-sm text-gray-500 mb-2">
                      {item.label}
                    </div>
                    <div className="text-2xl font-bold text-gold-light">
                      {formatTime(item.time)}
                    </div>
                    {item.nextDay && (
                      <div className="text-xs text-gray-600 mt-2 bg-gray-800 px-2 py-1 rounded-full inline-block">
                        Next Day
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Day/Night Duration */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-800">
              <div className="text-center p-6 bg-gradient-to-br from-dawn-gold/20 to-deep-space rounded-xl">
                <FiSunrise className="w-12 h-12 mx-auto mb-3 text-dawn-gold" />
                <div className="text-sm text-gray-400 mb-2">Day Duration</div>
                <div className="text-3xl font-bold text-gold-primary">
                  {panchang.dayNight?.dinamana?.formatted || "N/A"}
                </div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-cosmic-purple/20 to-deep-space rounded-xl">
                <FiSunset className="w-12 h-12 mx-auto mb-3 text-cosmic-purple" />
                <div className="text-sm text-gray-400 mb-2">Night Duration</div>
                <div className="text-3xl font-bold text-cosmic-purple">
                  {panchang.dayNight?.ratrimana?.formatted || "N/A"}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Auspicious & Inauspicious Times - SIDE BY SIDE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Auspicious Times */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-cosmic p-8 bg-gradient-to-br from-green-900/20 to-deep-space border-2 border-green-500/40 shadow-xl"
            >
              <h3 className="text-3xl font-bold text-green-400 mb-6 flex items-center gap-3">
                <FiStar className="w-8 h-8" />
                Auspicious Times
              </h3>

              <div className="space-y-4">
                {panchang.auspiciousTimes &&
                  Object.entries(panchang.auspiciousTimes).map(
                    ([key, time]) => {
                      const names = {
                        brahmaMuhurta: {
                          name: "Brahma Muhurta",
                          emoji: "🌅",
                          desc: "Best for meditation & yoga",
                        },
                        pratahSandhya: {
                          name: "Pratah Sandhya",
                          emoji: "🙏",
                          desc: "Morning prayers",
                        },
                        abhijitMuhurta: {
                          name: "Abhijit Muhurta",
                          emoji: "⭐",
                          desc: "Most auspicious - start anything!",
                        },
                        vijayaMuhurta: {
                          name: "Vijaya Muhurta",
                          emoji: "🏆",
                          desc: "Victory time",
                        },
                        godhuliMuhurta: {
                          name: "Godhuli Muhurta",
                          emoji: "🌇",
                          desc: "Evening auspicious time",
                        },
                        sayanhnaSandhya: {
                          name: "Sayahna Sandhya",
                          emoji: "🌆",
                          desc: "Evening prayers",
                        },
                        amritKaal: {
                          name: "Amrit Kaal",
                          emoji: "✨",
                          desc: "Nectar time - remedies work best",
                        },
                        nishitaMuhurta: {
                          name: "Nishita Muhurta",
                          emoji: "🌙",
                          desc: "Midnight tantric practices",
                        },
                      };

                      const info = names[key] || {
                        name: key,
                        emoji: "⭐",
                        desc: "",
                      };

                      return (
                        <motion.div
                          key={key}
                          whileHover={{ x: 5 }}
                          className="p-4 bg-green-500/10 rounded-lg border-l-4 border-green-500 hover:bg-green-500/20 transition-all"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{info.emoji}</span>
                              <div>
                                <div className="font-bold text-lg text-green-300">
                                  {info.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {info.desc}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-xl font-bold text-white mt-2">
                            {formatTime(time.start)} - {formatTime(time.end)}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Duration: {time.duration} minutes
                          </div>
                        </motion.div>
                      );
                    }
                  )}
              </div>
            </motion.div>

            {/* Inauspicious Times */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-cosmic p-8 bg-gradient-to-br from-red-900/20 to-deep-space border-2 border-red-500/40 shadow-xl"
            >
              <h3 className="text-3xl font-bold text-red-400 mb-6 flex items-center gap-3">
                <FiAlertTriangle className="w-8 h-8" />
                Inauspicious Times (Avoid)
              </h3>

              <div className="space-y-4">
                {/* Rahu Kaal */}
                <motion.div
                  whileHover={{ x: 5 }}
                  className="p-4 bg-red-500/10 rounded-lg border-l-4 border-red-500 hover:bg-red-500/20 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">⚠️</span>
                    <div>
                      <div className="font-bold text-lg text-red-300">
                        Rahu Kaal
                      </div>
                      <div className="text-xs text-gray-500">
                        Most inauspicious - avoid all important work
                      </div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-white">
                    {formatTime(panchang.inauspiciousTimes?.rahuKaal?.start)} -{" "}
                    {formatTime(panchang.inauspiciousTimes?.rahuKaal?.end)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Duration: {panchang.inauspiciousTimes?.rahuKaal?.duration}{" "}
                    min
                  </div>
                </motion.div>

                {/* Gulika Kaal */}
                <motion.div
                  whileHover={{ x: 5 }}
                  className="p-4 bg-orange-500/10 rounded-lg border-l-4 border-orange-500 hover:bg-orange-500/20 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🚫</span>
                    <div>
                      <div className="font-bold text-lg text-orange-300">
                        Gulika Kaal
                      </div>
                      <div className="text-xs text-gray-500">
                        Avoid new beginnings
                      </div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-white">
                    {formatTime(panchang.inauspiciousTimes?.gulikaKaal?.start)}{" "}
                    - {formatTime(panchang.inauspiciousTimes?.gulikaKaal?.end)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Duration: {panchang.inauspiciousTimes?.gulikaKaal?.duration}{" "}
                    min
                  </div>
                </motion.div>

                {/* Yama Ghanta */}
                <motion.div
                  whileHover={{ x: 5 }}
                  className="p-4 bg-yellow-500/10 rounded-lg border-l-4 border-yellow-500 hover:bg-yellow-500/20 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">⛔</span>
                    <div>
                      <div className="font-bold text-lg text-yellow-300">
                        Yama Ghanta
                      </div>
                      <div className="text-xs text-gray-500">
                        Inauspicious hour
                      </div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-white">
                    {formatTime(panchang.inauspiciousTimes?.yamaGhanta?.start)}{" "}
                    - {formatTime(panchang.inauspiciousTimes?.yamaGhanta?.end)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Duration: {panchang.inauspiciousTimes?.yamaGhanta?.duration}{" "}
                    min
                  </div>
                </motion.div>

                {/* Dur Muhurtam */}
                {panchang.inauspiciousTimes?.durMuhurtam?.length > 0 && (
                  <div className="p-4 bg-red-500/5 rounded-lg">
                    <div className="font-bold text-red-300 mb-3 flex items-center gap-2">
                      <span>⚠️</span> Dur Muhurtam
                    </div>
                    <div className="space-y-2">
                      {panchang.inauspiciousTimes.durMuhurtam.map((dm, idx) => (
                        <div
                          key={idx}
                          className="text-sm text-gray-300 bg-deep-space/50 p-2 rounded"
                        >
                          Period {idx + 1}: {formatTime(dm.start)} -{" "}
                          {formatTime(dm.end)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Varjyam */}
                {panchang.inauspiciousTimes?.varjyam?.length > 0 && (
                  <div className="p-4 bg-red-500/5 rounded-lg">
                    <div className="font-bold text-red-300 mb-3 flex items-center gap-2">
                      <span>🔴</span> Varjyam
                    </div>
                    <div className="space-y-2">
                      {panchang.inauspiciousTimes.varjyam.map((v, idx) => (
                        <div
                          key={idx}
                          className="text-sm text-gray-300 bg-deep-space/50 p-2 rounded"
                        >
                          Period {idx + 1}: {formatTime(v.start)} -{" "}
                          {formatTime(v.end)}
                          {isNextDay(v.start) && (
                            <span className="text-gray-600 ml-2">
                              (Next Day)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Activity Recommendations */}
          {panchang.recommendations && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-cosmic p-8 mb-8 border-2 border-gold-primary/20 shadow-xl"
            >
              <h3 className="text-3xl font-bold text-gold-primary mb-6">
                Activity Recommendations
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(panchang.recommendations).map(([key, rec]) => {
                  const names = {
                    propertyAndHome: "Property & Home",
                    religiousAndSpiritual: "Religious & Spiritual",
                    generalActivities: "General Activities",
                  };

                  return (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.03, y: -5 }}
                      className={`p-6 rounded-xl border-2 ${
                        rec.suitable
                          ? "bg-gradient-to-br from-green-900/30 to-deep-space border-green-500/40"
                          : "bg-gradient-to-br from-red-900/30 to-deep-space border-red-500/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-xl text-white">
                          {names[key]}
                        </h4>
                        <div
                          className={`text-4xl font-bold ${
                            rec.suitable ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {rec.score}
                        </div>
                      </div>

                      <div
                        className={`text-lg mb-3 font-semibold ${
                          rec.suitable ? "text-green-300" : "text-red-300"
                        }`}
                      >
                        {rec.suitable ? "✓ Suitable" : "✗ Not Suitable"}
                      </div>

                      <div className="text-sm text-gray-400 mb-4">
                        {rec.reason}
                      </div>

                      {rec.bestTime && (
                        <div className="text-xs text-gray-500 bg-deep-space/50 p-3 rounded">
                          Best Time: {formatTime(rec.bestTime.start)} -{" "}
                          {formatTime(rec.bestTime.end)}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Advanced Section (Collapsible) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full card-cosmic p-6 flex items-center justify-between hover:border-gold-primary/50 transition-all mb-4 border-2 border-gold-primary/20"
            >
              <span className="text-2xl font-semibold text-gold-primary flex items-center gap-3">
                <FiInfo className="w-6 h-6" />
                Additional Information & Details
              </span>
              {showAdvanced ? (
                <FiChevronUp className="w-6 h-6 text-gold-primary" />
              ) : (
                <FiChevronDown className="w-6 h-6 text-gold-primary" />
              )}
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="card-cosmic p-8 border-2 border-gold-primary/20"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Rashis */}
                    <div className="bg-gradient-to-br from-cosmic-purple/20 to-deep-space p-6 rounded-xl">
                      <div className="text-sm text-gray-500 mb-2">
                        Moon Rashi (Sign)
                      </div>
                      <div className="text-2xl font-bold text-gold-light">
                        {panchang.rashis?.moon?.name}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {panchang.rashis?.moon?.hindi}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-dawn-gold/20 to-deep-space p-6 rounded-xl">
                      <div className="text-sm text-gray-500 mb-2">
                        Sun Rashi (Sign)
                      </div>
                      <div className="text-2xl font-bold text-gold-light">
                        {panchang.rashis?.sun?.name}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {panchang.rashis?.sun?.hindi}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/20 to-deep-space p-6 rounded-xl">
                      <div className="text-sm text-gray-500 mb-2">
                        Season (Ritu)
                      </div>
                      <div className="text-2xl font-bold text-gold-light">
                        {panchang.rituAyana?.ritu}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {panchang.rituAyana?.season}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-celestial-pink/20 to-deep-space p-6 rounded-xl">
                      <div className="text-sm text-gray-500 mb-2">Ayana</div>
                      <div className="text-2xl font-bold text-gold-light">
                        {panchang.rituAyana?.ayana}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {panchang.rituAyana?.ayanaHindi}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-gold-primary/20 to-deep-space p-6 rounded-xl">
                      <div className="text-sm text-gray-500 mb-2">
                        Hindu Month (Amanta)
                      </div>
                      <div className="text-2xl font-bold text-gold-light">
                        {panchang.months?.amanta}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {panchang.months?.amantaHindi}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-cosmic-purple/20 to-deep-space p-6 rounded-xl">
                      <div className="text-sm text-gray-500 mb-2">
                        Hindu Month (Purnimanta)
                      </div>
                      <div className="text-2xl font-bold text-gold-light">
                        {panchang.months?.purnimanta}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {panchang.months?.purnimantagHindi}
                      </div>
                    </div>
                  </div>

                  {/* Festivals */}
                  {panchang.festivals && panchang.festivals.length > 0 && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-gold-primary/20 to-deep-space rounded-xl border-2 border-gold-primary/40">
                      <h4 className="text-2xl font-bold text-gold-primary mb-4 flex items-center gap-2">
                        <HiSparkles className="w-6 h-6" />
                        Festivals & Observances Today
                      </h4>
                      <div className="space-y-3">
                        {panchang.festivals.map((festival, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-3 p-4 bg-deep-space/50 rounded-lg"
                          >
                            <HiSparkles className="w-6 h-6 text-gold-primary shrink-0" />
                            <div>
                              <div className="text-white font-bold text-lg">
                                {festival.name}
                              </div>
                              <div className="text-gray-400 text-sm">
                                ({festival.hindi})
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Day Summary - FINAL CARD */}
          {panchang.summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-cosmic p-8 text-center mt-8 border-2 border-gold-primary/30 shadow-2xl"
            >
              <h3 className="text-3xl font-bold text-gold-primary mb-6">
                Day Summary
              </h3>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-block px-8 py-4 bg-gradient-cosmic rounded-full text-2xl font-bold mb-6"
              >
                {panchang.summary.dayType} Day
              </motion.div>

              <div className="text-gray-400 text-lg mb-8">
                {panchang.summary.dayTypeHindi} दिन
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {panchang.summary.goodFor &&
                  panchang.summary.goodFor.length > 0 && (
                    <div className="text-left p-6 bg-green-500/10 rounded-xl border-2 border-green-500/30">
                      <h4 className="text-green-400 font-bold text-xl mb-4 flex items-center gap-2">
                        <FiStar className="w-6 h-6" />
                        Good For:
                      </h4>
                      <ul className="space-y-3">
                        {panchang.summary.goodFor.map((item, idx) => (
                          <li
                            key={idx}
                            className="text-gray-200 text-lg flex items-start gap-2"
                          >
                            <span className="text-green-400 shrink-0">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {panchang.summary.avoidFor &&
                  panchang.summary.avoidFor.length > 0 && (
                    <div className="text-left p-6 bg-red-500/10 rounded-xl border-2 border-red-500/30">
                      <h4 className="text-red-400 font-bold text-xl mb-4 flex items-center gap-2">
                        <FiAlertTriangle className="w-6 h-6" />
                        Avoid:
                      </h4>
                      <ul className="space-y-3">
                        {panchang.summary.avoidFor.map((item, idx) => (
                          <li
                            key={idx}
                            className="text-gray-200 text-lg flex items-start gap-2"
                          >
                            <span className="text-red-400 shrink-0">✗</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </motion.div>
          )}

          {/* Info Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-cosmic p-6 mt-8 bg-gradient-to-br from-gold-primary/10 to-deep-space border-2 border-gold-primary/30"
          >
            <div className="flex gap-4">
              <FiInfo className="w-6 h-6 text-gold-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gold-primary mb-3 text-xl">
                  About This Panchang
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed mb-3">
                  All timings are calculated based on your selected location and
                  date using authentic Vedic astronomy principles. The
                  calculations include precise solar and lunar positions,
                  considering observer parallax for maximum accuracy.
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Auspicious and inauspicious times are derived from classical
                  Jyotish texts including Brihat Parashara Hora Shastra, Muhurta
                  Chintamani, and other traditional sources.
                </p>
                <p className="text-xs text-gray-500 mt-4 border-t border-gray-800 pt-4">
                  Calculated at:{" "}
                  {new Date(panchang.calculatedAt).toLocaleString()} • Location:{" "}
                  {coords.lat.toFixed(4)}°N, {coords.lon.toFixed(4)}°E
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
