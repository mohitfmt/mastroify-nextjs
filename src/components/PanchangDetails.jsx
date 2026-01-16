"use client";

import { useState, useEffect, useRef } from "react";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiMapPin,
  FiPrinter,
  FiShare2,
  FiDownload,
  FiClock,
  FiSun,
  FiMoon,
  FiAlertTriangle,
  FiStar,
  FiInfo,
} from "react-icons/fi";
import { WiSunrise, WiSunset, WiMoonrise, WiMoonset } from "react-icons/wi";
import { HiSparkles } from "react-icons/hi2";
import Link from "next/link";

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
  const printRef = useRef(null);

  // Fetch Panchang data
  const fetchPanchang = async (lat, lon, date) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/panchang?lat=${lat}&lon=${lon}&date=${date}`
      );
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
          fetchPanchang(latitude, longitude, selectedDate);

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

  // Print functionality
  const handlePrint = () => {
    window.print();
  };

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: `Panchang for ${format(parseISO(selectedDate), "MMMM d, yyyy")}`,
      text: `View detailed Vedic Panchang for ${
        location?.city || "your location"
      }`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "--:--";
    return format(new Date(dateString), "h:mm a");
  };

  // Check if next day
  const isNextDay = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const selected = parseISO(selectedDate);
    return date.getDate() !== selected.getDate();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night-sky">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gold-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Panchang...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night-sky">
        <div className="text-center">
          <FiAlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">Unable to load Panchang data</p>
          <button
            onClick={() => fetchPanchang(coords.lat, coords.lon, selectedDate)}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-night-sky to-deep-space">
      {/* Header */}
      <div className="bg-deep-space border-b border-gold-primary/20 sticky top-0 z-40 print:static">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left: Title */}
            <div>
              <Link
                href="/"
                className="text-gold-primary hover:text-gold-light transition-colors text-sm mb-2 inline-block"
              >
                ← Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-gold-primary font-playfair">
                Complete Vedic Panchang
              </h1>
              <p className="text-gray-400 mt-1">
                Detailed Hindu Calendar & Auspicious Timings
              </p>
            </div>

            {/* Right: Actions */}
            <div className="flex gap-2 print:hidden">
              <button
                onClick={handlePrint}
                className="btn-secondary py-2 px-4 text-sm flex items-center gap-2"
              >
                <FiPrinter className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button
                onClick={handleShare}
                className="btn-secondary py-2 px-4 text-sm flex items-center gap-2"
              >
                <FiShare2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-deep-space/50 border-b border-gold-primary/10 py-6 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <FiCalendar className="inline w-4 h-4 mr-2" />
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-4 py-3 bg-deep-space border border-gold-primary/30 rounded-lg text-gray-300 focus:outline-none focus:border-gold-primary"
              />
            </div>

            {/* Location Search */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <FiMapPin className="inline w-4 h-4 mr-2" />
                Current Location: {location?.city}, {location?.country}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search city..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleLocationSearch(locationSearch)
                  }
                  className="flex-1 px-4 py-3 bg-deep-space border border-gold-primary/30 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-gold-primary"
                />
                <button
                  onClick={() => handleLocationSearch(locationSearch)}
                  className="btn-primary py-3 px-6"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        ref={printRef}
      >
        {/* Date Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gold-primary font-playfair mb-2">
            {format(parseISO(selectedDate), "EEEE, MMMM d, yyyy")}
          </h2>
          <p className="text-gray-400">
            {location?.city}, {location?.country}
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
            <span>
              Weekday:{" "}
              <span className="text-gold-light">{panchang?.weekday}</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">
              Vikram Samvat:{" "}
              <span className="text-gold-light">
                {panchang?.samvats?.vikramSamvat}
              </span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">
              Shaka Samvat:{" "}
              <span className="text-gold-light">
                {panchang?.samvats?.shakaSamvat}
              </span>
            </span>
          </div>
        </motion.div>

        {/* Sun & Moon Times */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-cosmic p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-gold-primary mb-6 flex items-center gap-2">
            <HiSparkles className="w-6 h-6" />
            Celestial Timings
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <WiSunrise className="w-16 h-16 mx-auto text-dawn-gold mb-2" />
              <div className="text-sm text-gray-500 mb-1">Sunrise</div>
              <div className="text-2xl font-bold text-gold-light">
                {formatTime(panchang?.sunMoon?.sunrise)}
              </div>
            </div>
            <div className="text-center">
              <WiSunset className="w-16 h-16 mx-auto text-celestial-pink mb-2" />
              <div className="text-sm text-gray-500 mb-1">Sunset</div>
              <div className="text-2xl font-bold text-gold-light">
                {formatTime(panchang?.sunMoon?.sunset)}
              </div>
            </div>
            <div className="text-center">
              <WiMoonrise className="w-16 h-16 mx-auto text-gold-light mb-2" />
              <div className="text-sm text-gray-500 mb-1">Moonrise</div>
              <div className="text-2xl font-bold text-gold-light">
                {formatTime(panchang?.sunMoon?.moonrise)}
                {isNextDay(panchang?.sunMoon?.moonrise) && (
                  <span className="text-xs text-gray-600 block">
                    (Next Day)
                  </span>
                )}
              </div>
            </div>
            <div className="text-center">
              <WiMoonset className="w-16 h-16 mx-auto text-cosmic-purple mb-2" />
              <div className="text-sm text-gray-500 mb-1">Moonset</div>
              <div className="text-2xl font-bold text-gold-light">
                {formatTime(panchang?.sunMoon?.moonset)}
                {isNextDay(panchang?.sunMoon?.moonset) && (
                  <span className="text-xs text-gray-600 block">
                    (Next Day)
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Vedic Elements Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-cosmic p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-gold-primary mb-6">
            Vedic Panchang Elements
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    Element
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    Current
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    Details
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    Ends At
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Tithi */}
                <tr className="border-b border-gray-800 hover:bg-deep-space/50">
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gold-light">Tithi</div>
                    <div className="text-xs text-gray-500">Lunar Day</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-lg font-bold text-white">
                      {panchang?.tithi?.name}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-300">
                      Paksha: {panchang?.tithi?.paksha}
                    </div>
                    <div className="text-sm text-gray-300">
                      Progress: {panchang?.tithi?.progress}%
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300">
                    {formatTime(panchang?.tithi?.endsAt)}
                  </td>
                </tr>

                {/* Nakshatra */}
                <tr className="border-b border-gray-800 hover:bg-deep-space/50">
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gold-light">
                      Nakshatra
                    </div>
                    <div className="text-xs text-gray-500">Constellation</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-lg font-bold text-white">
                      {panchang?.nakshatra?.name}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-300">
                      Lord: {panchang?.nakshatra?.lord}
                    </div>
                    <div className="text-sm text-gray-300">
                      Deity: {panchang?.nakshatra?.deity}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300">
                    {formatTime(panchang?.nakshatra?.endsAt)}
                  </td>
                </tr>

                {/* Yoga */}
                <tr className="border-b border-gray-800 hover:bg-deep-space/50">
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gold-light">Yoga</div>
                    <div className="text-xs text-gray-500">Combination</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-lg font-bold text-white">
                      {panchang?.yoga?.name}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-300">-</div>
                  </td>
                  <td className="py-4 px-4 text-gray-300">
                    {formatTime(panchang?.yoga?.endsAt)}
                  </td>
                </tr>

                {/* Karana */}
                <tr className="hover:bg-deep-space/50">
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gold-light">Karana</div>
                    <div className="text-xs text-gray-500">Half Tithi</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-lg font-bold text-white">
                      {panchang?.karana?.name}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-300">-</div>
                  </td>
                  <td className="py-4 px-4 text-gray-300">
                    {formatTime(panchang?.karana?.endsAt)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Auspicious Times */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
        >
          {/* Auspicious */}
          <div className="card-cosmic p-8 bg-linear-to-br from-green-900/20 to-deep-space border-green-500/30">
            <h3 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-2">
              <FiStar className="w-6 h-6" />
              Auspicious Times
            </h3>

            <div className="space-y-4">
              {/* Abhijit Muhurta */}
              <div className="pb-4 border-b border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-lg text-green-300">
                      Abhijit Muhurta
                    </div>
                    <div className="text-sm text-gray-400">
                      Most auspicious time for important tasks
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mt-3">
                  {formatTime(panchang?.auspiciousTimes?.abhijitMuhurta?.start)}{" "}
                  - {formatTime(panchang?.auspiciousTimes?.abhijitMuhurta?.end)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Duration:{" "}
                  {panchang?.auspiciousTimes?.abhijitMuhurta?.duration} minutes
                </div>
              </div>

              {/* Amrit Kaal */}
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-lg text-green-300">
                      Amrit Kaal
                    </div>
                    <div className="text-sm text-gray-400">
                      Good time for remedies and prayers
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mt-3">
                  {formatTime(panchang?.auspiciousTimes?.amritKaal?.start)} -{" "}
                  {formatTime(panchang?.auspiciousTimes?.amritKaal?.end)}
                  {isNextDay(panchang?.auspiciousTimes?.amritKaal?.start) && (
                    <span className="text-sm text-gray-600"> (Next Day)</span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Duration: {panchang?.auspiciousTimes?.amritKaal?.duration}{" "}
                  minutes
                </div>
              </div>
            </div>
          </div>

          {/* Inauspicious */}
          <div className="card-cosmic p-8 bg-linear-to-br from-red-900/20 to-deep-space border-red-500/30">
            <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2">
              <FiAlertTriangle className="w-6 h-6" />
              Inauspicious Times (Avoid)
            </h3>

            <div className="space-y-4">
              {/* Rahu Kaal */}
              <div className="pb-4 border-b border-gray-700">
                <div className="font-bold text-lg text-red-300">Rahu Kaal</div>
                <div className="text-sm text-gray-400 mb-2">
                  Most inauspicious period
                </div>
                <div className="text-xl font-bold text-white">
                  {formatTime(panchang?.inauspiciousTimes?.rahuKaal?.start)} -{" "}
                  {formatTime(panchang?.inauspiciousTimes?.rahuKaal?.end)}
                </div>
              </div>

              {/* Gulika Kaal */}
              <div className="pb-4 border-b border-gray-700">
                <div className="font-bold text-lg text-orange-300">
                  Gulika Kaal
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  Inauspicious for new beginnings
                </div>
                <div className="text-xl font-bold text-white">
                  {formatTime(panchang?.inauspiciousTimes?.gulikaKaal?.start)} -{" "}
                  {formatTime(panchang?.inauspiciousTimes?.gulikaKaal?.end)}
                </div>
              </div>

              {/* Yama Ghanta */}
              <div>
                <div className="font-bold text-lg text-yellow-300">
                  Yama Ghanta
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  Avoid important activities
                </div>
                <div className="text-xl font-bold text-white">
                  {formatTime(panchang?.inauspiciousTimes?.yamaGhanta?.start)} -{" "}
                  {formatTime(panchang?.inauspiciousTimes?.yamaGhanta?.end)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Inauspicious Times */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-cosmic p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-gold-primary mb-6">
            Additional Inauspicious Periods
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dur Muhurtam */}
            <div>
              <h4 className="font-bold text-lg text-red-400 mb-4">
                Dur Muhurtam
              </h4>
              <div className="space-y-3">
                {panchang?.inauspiciousTimes?.durMuhurtam?.map((dm, i) => (
                  <div key={i} className="bg-deep-space/50 p-4 rounded-lg">
                    <div className="text-sm text-gray-400">Period {i + 1}</div>
                    <div className="text-lg font-bold text-white mt-1">
                      {formatTime(dm.start)} - {formatTime(dm.end)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Duration: {dm.duration} minutes
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Varjyam */}
            <div>
              <h4 className="font-bold text-lg text-red-400 mb-4">Varjyam</h4>
              <div className="space-y-3">
                {panchang?.inauspiciousTimes?.varjyam?.map((v, i) => (
                  <div key={i} className="bg-deep-space/50 p-4 rounded-lg">
                    <div className="text-sm text-gray-400">Period {i + 1}</div>
                    <div className="text-lg font-bold text-white mt-1">
                      {formatTime(v.start)} - {formatTime(v.end)}
                      {isNextDay(v.start) && (
                        <span className="text-sm text-gray-600">
                          {" "}
                          (Next Day)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Duration: {v.duration} minutes
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rashis & Samvats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-cosmic p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-gold-primary mb-6">
            Additional Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-deep-space/50 p-6 rounded-lg">
              <div className="text-sm text-gray-500 mb-2">Moon Rashi</div>
              <div className="text-2xl font-bold text-gold-light">
                {panchang?.rashis?.moon?.name}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Zodiac sign of Moon
              </div>
            </div>

            <div className="bg-deep-space/50 p-6 rounded-lg">
              <div className="text-sm text-gray-500 mb-2">Sun Rashi</div>
              <div className="text-2xl font-bold text-gold-light">
                {panchang?.rashis?.sun?.name}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Zodiac sign of Sun
              </div>
            </div>

            <div className="bg-deep-space/50 p-6 rounded-lg">
              <div className="text-sm text-gray-500 mb-2">Vikram Samvat</div>
              <div className="text-2xl font-bold text-gold-light">
                {panchang?.samvats?.vikramSamvat}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Hindu calendar year
              </div>
            </div>

            <div className="bg-deep-space/50 p-6 rounded-lg">
              <div className="text-sm text-gray-500 mb-2">Shaka Samvat</div>
              <div className="text-2xl font-bold text-gold-light">
                {panchang?.samvats?.shakaSamvat}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                National calendar of India
              </div>
            </div>

            <div className="bg-deep-space/50 p-6 rounded-lg">
              <div className="text-sm text-gray-500 mb-2">Month (Amanta)</div>
              <div className="text-2xl font-bold text-gold-light">
                {panchang?.months?.amanta}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Month ending at new moon
              </div>
            </div>

            <div className="bg-deep-space/50 p-6 rounded-lg">
              <div className="text-sm text-gray-500 mb-2">
                Month (Purnimanta)
              </div>
              <div className="text-2xl font-bold text-gold-light">
                {panchang?.months?.purnimanta}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Month ending at full moon
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-cosmic p-6 bg-linear-to-br from-gold-primary/10 to-deep-space border-gold-primary/30"
        >
          <div className="flex gap-3">
            <FiInfo className="w-5 h-5 text-gold-primary shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gold-primary mb-2">
                About This Panchang
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                All timings are calculated based on your selected location and
                date using authentic Vedic astronomy principles. The
                calculations include precise solar and lunar positions,
                considering observer parallax for maximum accuracy. Auspicious
                and inauspicious times are derived from classical Jyotish texts
                including Brihat Parashara Hora Shastra.
              </p>
              <p className="text-xs text-gray-500 mt-3">
                Calculated at:{" "}
                {new Date(panchang?.calculatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-12"
        >
          <Link href="/#panchang" className="btn-primary inline-block">
            View Today's Quick Panchang
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Need personalized consultation?{" "}
            <Link
              href="/book"
              className="text-gold-primary hover:text-gold-light"
            >
              Book an appointment
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .card-cosmic {
            border: 1px solid #333 !important;
            break-inside: avoid;
          }
          h1,
          h2,
          h3,
          h4 {
            color: #d4af37 !important;
          }
          .text-gold-primary,
          .text-gold-light {
            color: #d4af37 !important;
          }
        }
      `}</style>
    </div>
  );
}
