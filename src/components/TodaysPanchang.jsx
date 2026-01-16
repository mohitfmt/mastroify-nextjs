"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { format } from "date-fns";
import { WiSunrise, WiSunset, WiMoonrise, WiMoonset } from "react-icons/wi";
import {
  FiMapPin,
  FiClock,
  FiStar,
  FiAlertTriangle,
  FiChevronRight,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import Link from "next/link";

export default function TodaysPanchang() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const [panchang, setPanchang] = useState(null);
  const [location, setLocation] = useState(null);
  const [coords, setCoords] = useState({ lat: 28.6139, lon: 77.209 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Panchang data
  const fetchPanchang = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/panchang?lat=${lat}&lon=${lon}`);
      if (!response.ok) throw new Error("Failed to fetch Panchang data");
      const data = await response.json();
      setPanchang(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
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
          fetchPanchang(latitude, longitude);

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
          fetchPanchang(28.6139, 77.209);
          setLocation({ city: "New Delhi", country: "India" });
        }
      );
    } else {
      fetchPanchang(28.6139, 77.209);
      setLocation({ city: "New Delhi", country: "India" });
    }
  }, []);

  // Format time helper
  const formatTime = (dateString) => {
    if (!dateString) return "--:--";
    return format(new Date(dateString), "h:mm a");
  };

  // Check if next day
  const isNextDay = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() !== today.getDate();
  };

  // Loading state
  if (loading) {
    return (
      <section
        ref={ref}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-night-sky to-deep-space"
        id="panchang"
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gold-primary/20 rounded w-64 mx-auto"></div>
            <div className="h-4 bg-gray-700 rounded w-96 mx-auto"></div>
            <div className="grid grid-cols-4 gap-4 mt-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-deep-space rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section
        ref={ref}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-night-sky to-deep-space"
        id="panchang"
      >
        <div className="max-w-7xl mx-auto text-center">
          <FiAlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400">Unable to load Panchang data</p>
          <button
            onClick={() => fetchPanchang(coords.lat, coords.lon)}
            className="btn-secondary mt-4"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (!panchang) return null;

  const sunMoonData = [
    {
      icon: WiSunrise,
      label: "Sunrise",
      time: panchang.sunMoon.sunrise,
      color: "text-dawn-gold",
    },
    {
      icon: WiSunset,
      label: "Sunset",
      time: panchang.sunMoon.sunset,
      color: "text-celestial-pink",
    },
    {
      icon: WiMoonrise,
      label: "Moonrise",
      time: panchang.sunMoon.moonrise,
      color: "text-gold-light",
      nextDay: isNextDay(panchang.sunMoon.moonrise),
    },
    {
      icon: WiMoonset,
      label: "Moonset",
      time: panchang.sunMoon.moonset,
      color: "text-cosmic-purple",
      nextDay: isNextDay(panchang.sunMoon.moonset),
    },
  ];

  return (
    <section
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-night-sky to-deep-space relative overflow-hidden"
      id="panchang"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gold-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cosmic-purple rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-heading inline-block">Today's Panchang</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-4">
            Align your day with cosmic rhythms and auspicious timings
          </p>

          {/* Location & Date */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-gray-400">
              <FiMapPin className="w-4 h-4 text-gold-primary shrink-0" />
              <span className="font-medium">
                {location?.city}
                {location?.country && `, ${location.country}`}
              </span>
            </div>

            <div className="hidden sm:block w-px h-4 bg-gray-700" />

            <div className="flex items-center gap-2 text-gray-400">
              <FiClock className="w-4 h-4 text-gold-primary shrink-0" />
              <span>{format(new Date(), "EEEE, MMMM d, yyyy")}</span>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Sun & Moon Times + Vedic Elements */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Celestial Timings */}
            <div className="card-cosmic p-6">
              <h3 className="text-xl font-bold text-gold-primary mb-4 flex items-center gap-2">
                <HiSparkles className="w-5 h-5" />
                Celestial Timings
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sunMoonData.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="text-center"
                    >
                      <Icon
                        className={`w-12 h-12 mx-auto mb-2 ${item.color}`}
                      />
                      <div className="text-xs text-gray-500 mb-1">
                        {item.label}
                      </div>
                      <div className="text-lg font-bold text-gold-light">
                        {formatTime(item.time)}
                      </div>
                      {item.nextDay && (
                        <div className="text-xs text-gray-600 mt-1">
                          (Next Day)
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Tithi & Nakshatra */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tithi Card */}
              <div className="card-cosmic p-6 bg-linear-to-br from-cosmic-purple/20 to-deep-space">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm text-gray-500">
                      Tithi (Lunar Day)
                    </div>
                    <div className="text-2xl font-bold text-gold-primary mt-1">
                      {panchang.tithi.name}
                    </div>
                  </div>
                  <div className="text-xs bg-gold-primary/20 text-gold-primary px-2 py-1 rounded-full">
                    {panchang.tithi.paksha}
                  </div>
                </div>

                <div className="mt-4 bg-deep-space/80 rounded-full h-2 overflow-hidden w-full">
                  <div
                    className="h-full bg-linear-to-r from-cosmic-purple via-celestial-pink to-gold-primary rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.min(
                        Math.max(parseFloat(panchang.tithi.progress || 0), 0),
                        100
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{panchang.tithi.progress}% complete</span>
                  <span>Ends: {formatTime(panchang.tithi.endsAt)}</span>
                </div>
              </div>

              {/* Nakshatra Card */}
              <div className="card-cosmic p-6 bg-linear-to-br from-celestial-pink/20 to-deep-space">
                <div className="text-sm text-gray-500">Nakshatra</div>
                <div className="text-2xl font-bold text-gold-primary mt-1">
                  {panchang.nakshatra.name}
                </div>
                <div className="text-sm text-gray-400 mt-3 space-y-1">
                  <div>
                    Lord:{" "}
                    <span className="text-gold-light">
                      {panchang.nakshatra.lord}
                    </span>
                  </div>
                  <div>
                    Deity:{" "}
                    <span className="text-gray-300">
                      {panchang.nakshatra.deity}
                    </span>
                  </div>
                  <div>
                    Ends:{" "}
                    <span className="text-gray-300">
                      {formatTime(panchang.nakshatra.endsAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Yoga & Karana */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card-cosmic p-4">
                <div className="text-xs text-gray-500 mb-1">Yoga</div>
                <div className="text-xl font-bold text-gold-primary">
                  {panchang.yoga.name}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Ends: {formatTime(panchang.yoga.endsAt)}
                </div>
              </div>
              <div className="card-cosmic p-4">
                <div className="text-xs text-gray-500 mb-1">Karanas</div>
                {panchang.karanas.map((karana, idx) => (
                  <div
                    key={idx}
                    className="text-base font-bold text-gold-primary"
                  >
                    {karana.name}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Important Times */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Auspicious Time */}
            <div className="card-cosmic p-6 bg-linear-to-br from-green-900/20 to-deep-space border-green-500/30">
              <div className="flex items-start gap-3">
                <FiStar className="w-5 h-5 text-green-400 shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="text-xs text-green-400 font-semibold uppercase tracking-wide">
                    Most Auspicious
                  </div>
                  <div className="text-lg font-bold text-gold-primary mt-1">
                    Abhijit Muhurta
                  </div>
                  <div className="text-xl font-bold text-green-300 mt-2">
                    {formatTime(panchang.auspiciousTimes.abhijitMuhurta.start)}{" "}
                    - {formatTime(panchang.auspiciousTimes.abhijitMuhurta.end)}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Perfect for new beginnings
                  </div>
                </div>
              </div>
            </div>

            {/* Inauspicious Times */}
            <div className="card-cosmic p-6 bg-linear-to-br from-red-900/20 to-deep-space border-red-500/30">
              <div className="flex items-start gap-3 mb-4">
                <FiAlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="text-xs text-red-400 font-semibold uppercase tracking-wide">
                    Avoid These Times
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {/* Rahu Kaal */}
                <div className="border-l-2 border-red-500 pl-3">
                  <div className="text-sm font-semibold text-red-300">
                    Rahu Kaal
                  </div>
                  <div className="text-base font-bold text-gray-200">
                    {formatTime(panchang.inauspiciousTimes.rahuKaal.start)} -{" "}
                    {formatTime(panchang.inauspiciousTimes.rahuKaal.end)}
                  </div>
                </div>

                {/* Gulika Kaal */}
                <div className="border-l-2 border-orange-500 pl-3">
                  <div className="text-sm font-semibold text-orange-300">
                    Gulika Kaal
                  </div>
                  <div className="text-base font-bold text-gray-200">
                    {formatTime(panchang.inauspiciousTimes.gulikaKaal.start)} -{" "}
                    {formatTime(panchang.inauspiciousTimes.gulikaKaal.end)}
                  </div>
                </div>

                {/* Yama Ghanta */}
                <div className="border-l-2 border-yellow-600 pl-3">
                  <div className="text-sm font-semibold text-yellow-300">
                    Yama Ghanta
                  </div>
                  <div className="text-base font-bold text-gray-200">
                    {formatTime(panchang.inauspiciousTimes.yamaGhanta.start)} -{" "}
                    {formatTime(panchang.inauspiciousTimes.yamaGhanta.end)}
                  </div>
                </div>
              </div>
            </div>

            {/* Day Summary */}
            <div className="card-cosmic p-6 bg-linear-to-br from-gold-primary/10 to-deep-space">
              <h4 className="text-sm font-semibold text-gold-primary mb-3">
                Day Summary
              </h4>
              <div className="inline-block px-4 py-2 bg-gradient-cosmic rounded-full text-base font-bold mb-3">
                {panchang.summary.dayType} Day
              </div>
              <div className="text-xs text-gray-400 space-y-2">
                {panchang.summary.goodFor.length > 0 && (
                  <div>
                    <div className="text-green-400 font-semibold">
                      Good for:
                    </div>
                    <div>{panchang.summary.goodFor.slice(0, 2).join(", ")}</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-12"
        >
          <Link
            href="/panchang"
            className="btn-secondary inline-flex items-center gap-2"
          >
            View Complete Detailed Panchang
            <FiChevronRight className="w-4 h-4" />
          </Link>
          <p className="text-sm text-gray-500 mt-3">
            Access full calendar, festival dates, and activity recommendations
          </p>
        </motion.div>
      </div>
    </section>
  );
}
