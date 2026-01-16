// app/api/panchang/route.js
import { NextResponse } from "next/server";
import * as Astronomy from "astronomy-engine";
import { format, addMinutes, subMinutes, addDays } from "date-fns";

/**
 * MASTROIFY COMPREHENSIVE PANCHANG CALCULATOR
 * Complete Vedic Panchang with all timings and calculations
 */

// ============================================
// VEDIC CONSTANTS
// ============================================

const NAKSHATRAS = [
  { name: "Ashwini", lord: "Ketu", deity: "Ashwini Kumaras" },
  { name: "Bharani", lord: "Venus", deity: "Yama" },
  { name: "Krittika", lord: "Sun", deity: "Agni" },
  { name: "Rohini", lord: "Moon", deity: "Brahma" },
  { name: "Mrigashira", lord: "Mars", deity: "Soma" },
  { name: "Ardra", lord: "Rahu", deity: "Rudra" },
  { name: "Punarvasu", lord: "Jupiter", deity: "Aditi" },
  { name: "Pushya", lord: "Saturn", deity: "Brihaspati" },
  { name: "Ashlesha", lord: "Mercury", deity: "Nagas" },
  { name: "Magha", lord: "Ketu", deity: "Pitris" },
  { name: "Purva Phalguni", lord: "Venus", deity: "Bhaga" },
  { name: "Uttara Phalguni", lord: "Sun", deity: "Aryaman" },
  { name: "Hasta", lord: "Moon", deity: "Savitar" },
  { name: "Chitra", lord: "Mars", deity: "Tvashtar" },
  { name: "Swati", lord: "Rahu", deity: "Vayu" },
  { name: "Vishakha", lord: "Jupiter", deity: "Indra-Agni" },
  { name: "Anuradha", lord: "Saturn", deity: "Mitra" },
  { name: "Jyeshtha", lord: "Mercury", deity: "Indra" },
  { name: "Mula", lord: "Ketu", deity: "Nirriti" },
  { name: "Purva Ashadha", lord: "Venus", deity: "Apas" },
  { name: "Uttara Ashadha", lord: "Sun", deity: "Vishvadevas" },
  { name: "Shravana", lord: "Moon", deity: "Vishnu" },
  { name: "Dhanishta", lord: "Mars", deity: "Vasus" },
  { name: "Shatabhisha", lord: "Rahu", deity: "Varuna" },
  { name: "Purva Bhadrapada", lord: "Jupiter", deity: "Aja Ekapada" },
  { name: "Uttara Bhadrapada", lord: "Saturn", deity: "Ahir Budhnya" },
  { name: "Revati", lord: "Mercury", deity: "Pushan" },
];

const TITHIS = [
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Purnima",
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Amavasya",
];

const YOGAS = [
  "Vishkumbha",
  "Preeti",
  "Ayushman",
  "Saubhagya",
  "Shobhana",
  "Atiganda",
  "Sukarma",
  "Dhriti",
  "Shoola",
  "Ganda",
  "Vriddhi",
  "Dhruva",
  "Vyaghata",
  "Harshana",
  "Vajra",
  "Siddhi",
  "Vyatipata",
  "Variyan",
  "Parigha",
  "Shiva",
  "Siddha",
  "Sadhya",
  "Shubha",
  "Shukla",
  "Brahma",
  "Indra",
  "Vaidhriti",
];

const KARANAS = [
  "Bava",
  "Balava",
  "Kaulava",
  "Taitila",
  "Garaja",
  "Vanija",
  "Vishti",
  "Shakuni",
  "Chatushpada",
  "Naga",
  "Kimstughna",
];

const RASHIS = [
  "Mesha",
  "Vrishabha",
  "Mithuna",
  "Karka",
  "Simha",
  "Kanya",
  "Tula",
  "Vrishchika",
  "Dhanu",
  "Makara",
  "Kumbha",
  "Meena",
];

const MONTHS_AMANTA = [
  "Chaitra",
  "Vaishakha",
  "Jyeshtha",
  "Ashadha",
  "Shravana",
  "Bhadrapada",
  "Ashwin",
  "Kartik",
  "Margashirsha",
  "Pausha",
  "Magha",
  "Phalguna",
];

const MONTHS_PURNIMANTA = [
  "Chaitra",
  "Vaishakha",
  "Jyeshtha",
  "Ashadha",
  "Shravana",
  "Bhadrapada",
  "Ashwin",
  "Kartik",
  "Margashirsha",
  "Pausha",
  "Magha",
  "Phalguna",
];

// Kaal positions
const RAHU_KAAL_POSITIONS = { 0: 7, 1: 1, 2: 7, 3: 5, 4: 3, 5: 4, 6: 2 };
const GULIKA_KAAL_POSITIONS = { 0: 6, 1: 5, 2: 4, 3: 3, 4: 2, 5: 1, 6: 0 };
const YAMA_GHANTA_POSITIONS = { 0: 4, 1: 2, 2: 1, 3: 3, 4: 0, 5: 6, 6: 5 };

// ============================================
// ASTRONOMICAL CALCULATIONS
// ============================================

function getCelestialPositions(date, latitude, longitude) {
  const observer = new Astronomy.Observer(latitude, longitude, 0);

  const sunEquator = Astronomy.Equator("Sun", date, observer, true, true);
  const sunEcliptic = Astronomy.Ecliptic(sunEquator.vec);

  const moonEquator = Astronomy.Equator("Moon", date, observer, true, true);
  const moonEcliptic = Astronomy.Ecliptic(moonEquator.vec);

  const sunLongitude = (sunEcliptic.elon + 360) % 360;
  const moonLongitude = (moonEcliptic.elon + 360) % 360;

  return {
    sun: { longitude: sunLongitude, latitude: sunEcliptic.elat },
    moon: { longitude: moonLongitude, latitude: moonEcliptic.elat },
  };
}

function getSunMoonTimes(date, latitude, longitude) {
  const observer = new Astronomy.Observer(latitude, longitude, 0);

  const sunrise = Astronomy.SearchRiseSet("Sun", observer, 1, date, 1);
  const sunset = Astronomy.SearchRiseSet("Sun", observer, -1, date, 1);
  const moonrise = Astronomy.SearchRiseSet("Moon", observer, 1, date, 1);
  const moonset = Astronomy.SearchRiseSet("Moon", observer, -1, date, 1);

  return {
    sunrise: sunrise?.date || null,
    sunset: sunset?.date || null,
    moonrise: moonrise?.date || null,
    moonset: moonset?.date || null,
  };
}

// ============================================
// VEDIC CALCULATIONS WITH END TIMES
// ============================================

function calculateTithiWithEndTime(sunLongitude, moonLongitude, sunrise) {
  let diff = moonLongitude - sunLongitude;
  if (diff < 0) diff += 360;

  const tithiNumber = Math.floor(diff / 12);
  const tithiProgress = ((diff % 12) / 12) * 100;
  const paksha = tithiNumber < 15 ? "Shukla" : "Krishna";

  // Calculate remaining degrees to next tithi
  const remainingDegrees = 12 - (diff % 12);
  // Moon moves ~13° per day relative to sun
  const hoursToEnd = (remainingDegrees / 13) * 24;
  const endsAt = addMinutes(sunrise, hoursToEnd * 60);

  return {
    number: tithiNumber + 1,
    name: TITHIS[tithiNumber],
    paksha: paksha,
    progress: tithiProgress.toFixed(1),
    endsAt: endsAt,
  };
}

function calculateNakshatraWithEndTime(moonLongitude, sunrise) {
  const nakshatraIndex = Math.floor(moonLongitude / (360 / 27));
  const nakshatraProgress = ((moonLongitude % (360 / 27)) / (360 / 27)) * 100;

  // Calculate end time (Moon moves ~13.33° per day)
  const remainingDegrees = 360 / 27 - (moonLongitude % (360 / 27));
  const hoursToEnd = (remainingDegrees / 13.33) * 24;
  const endsAt = addMinutes(sunrise, hoursToEnd * 60);

  return {
    number: nakshatraIndex + 1,
    ...NAKSHATRAS[nakshatraIndex],
    progress: nakshatraProgress.toFixed(1),
    endsAt: endsAt,
  };
}

function calculateYogaWithEndTime(sunLongitude, moonLongitude, sunrise) {
  const sum = (sunLongitude + moonLongitude) % 360;
  const yogaIndex = Math.floor(sum / (360 / 27));

  const remainingDegrees = 360 / 27 - (sum % (360 / 27));
  const hoursToEnd = (remainingDegrees / 14.67) * 24; // Combined motion
  const endsAt = addMinutes(sunrise, hoursToEnd * 60);

  return {
    number: yogaIndex + 1,
    name: YOGAS[yogaIndex],
    endsAt: endsAt,
  };
}

function calculateKaranaWithEndTime(tithiNumber, tithiProgress, sunrise) {
  const karanaIndex = Math.floor(((tithiNumber - 1) * 2) % 11);

  // Karana changes twice per tithi
  const isFirstHalf = tithiProgress < 50;
  const remainingPercent = isFirstHalf
    ? 50 - tithiProgress
    : 100 - tithiProgress;
  const hoursToEnd = (remainingPercent / 100) * 12; // ~12 hours per karana
  const endsAt = addMinutes(sunrise, hoursToEnd * 60);

  return {
    name: KARANAS[karanaIndex],
    endsAt: endsAt,
  };
}

// ============================================
// RASHI CALCULATIONS
// ============================================

function calculateRashi(longitude) {
  const rashiIndex = Math.floor(longitude / 30);
  return {
    index: rashiIndex + 1,
    name: RASHIS[rashiIndex],
  };
}

// ============================================
// SAMVAT CALCULATIONS
// ============================================

function calculateSamvats(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  // Vikram Samvat (starts from Chaitra, ~April)
  const vikramSamvat = month >= 3 ? year + 57 : year + 56;

  // Shaka Samvat (starts from Chaitra, ~March/April)
  const shakaSamvat = month >= 2 ? year - 78 : year - 79;

  return {
    vikramSamvat,
    shakaSamvat,
  };
}

// ============================================
// HINDU MONTH CALCULATION
// ============================================

function calculateHinduMonth(moonLongitude, sunLongitude) {
  // Month determined by Sun's position
  const monthIndex = Math.floor(sunLongitude / 30);

  // Amanta: Month ends at New Moon
  // Purnimanta: Month ends at Full Moon
  const amantaMonth = MONTHS_AMANTA[monthIndex];
  const purnimantagMonth = MONTHS_PURNIMANTA[(monthIndex + 1) % 12];

  return {
    amanta: amantaMonth,
    purnimanta: purnimantagMonth,
  };
}

// ============================================
// KAAL CALCULATIONS
// ============================================

function calculateRahuKaal(sunrise, sunset, weekday) {
  const dayDuration = sunset - sunrise;
  const rahuDuration = dayDuration / 8;
  const position = RAHU_KAAL_POSITIONS[weekday];

  const rahuStart = new Date(sunrise.getTime() + rahuDuration * (position - 1));
  const rahuEnd = new Date(rahuStart.getTime() + rahuDuration);

  return {
    start: rahuStart,
    end: rahuEnd,
    duration: Math.round(rahuDuration / 60000),
  };
}

function calculateGulikaKaal(sunrise, sunset, weekday) {
  const dayDuration = sunset - sunrise;
  const gulikaDuration = dayDuration / 8;
  const position = GULIKA_KAAL_POSITIONS[weekday];

  const gulikaStart = new Date(sunrise.getTime() + gulikaDuration * position);
  const gulikaEnd = new Date(gulikaStart.getTime() + gulikaDuration);

  return {
    start: gulikaStart,
    end: gulikaEnd,
    duration: Math.round(gulikaDuration / 60000),
  };
}

function calculateYamaGhanta(sunrise, sunset, weekday) {
  const dayDuration = sunset - sunrise;
  const yamaGhantaDuration = dayDuration / 8;
  const position = YAMA_GHANTA_POSITIONS[weekday];

  const yamaGhantaStart = new Date(
    sunrise.getTime() + yamaGhantaDuration * position
  );
  const yamaGhantaEnd = new Date(
    yamaGhantaStart.getTime() + yamaGhantaDuration
  );

  return {
    start: yamaGhantaStart,
    end: yamaGhantaEnd,
    duration: Math.round(yamaGhantaDuration / 60000),
  };
}

function calculateAbhijitMuhurta(sunrise, sunset) {
  const noon = new Date((sunrise.getTime() + sunset.getTime()) / 2);
  return {
    start: subMinutes(noon, 24),
    end: addMinutes(noon, 24),
    duration: 48,
  };
}

function calculateDurMuhurtam(sunrise, weekday) {
  const durDuration = 48 * 60 * 1000;
  const timings = [
    [720, 768],
    [780, 828],
    [900, 948],
    [660, 708],
    [360, 408],
    [540, 588],
    [420, 468],
  ];

  const [start1, start2] = timings[weekday];

  return [
    {
      start: addMinutes(sunrise, start1 - 360),
      end: addMinutes(sunrise, start1 - 360 + 48),
      duration: 48,
    },
    {
      start: addMinutes(sunrise, start2 - 360),
      end: addMinutes(sunrise, start2 - 360 + 48),
      duration: 48,
    },
  ];
}

function calculateAmritKaal(sunrise, weekday) {
  const startMinutes = [360, 420, 480, 540, 300, 600, 660][weekday];

  return {
    start: addMinutes(sunrise, startMinutes - 360),
    end: addMinutes(sunrise, startMinutes - 360 + 48),
    duration: 48,
  };
}

function calculateVarjyam(sunrise, moonLongitude) {
  // Varjyam = 3 ghatis (72 minutes) when Moon is in certain positions
  // Simplified calculation based on Nakshatra
  const nakshatraIndex = Math.floor(moonLongitude / (360 / 27));

  // First Varjyam (varies by nakshatra)
  const varjyam1Start = addMinutes(sunrise, 480 + nakshatraIndex * 20);
  const varjyam1End = addMinutes(varjyam1Start, 72);

  // Second Varjyam (next day)
  const varjyam2Start = addMinutes(sunrise, 1320 + nakshatraIndex * 15);
  const varjyam2End = addMinutes(varjyam2Start, 72);

  return [
    {
      start: varjyam1Start,
      end: varjyam1End,
      duration: 72,
    },
    {
      start: varjyam2Start,
      end: varjyam2End,
      duration: 72,
    },
  ];
}

// ============================================
// MAIN API HANDLER
// ============================================

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const lat = parseFloat(searchParams.get("lat") || "28.6139");
    const lon = parseFloat(searchParams.get("lon") || "77.2090");
    const dateParam = searchParams.get("date");

    if (
      isNaN(lat) ||
      isNaN(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 }
      );
    }

    const targetDate = dateParam ? new Date(dateParam) : new Date();
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const weekday = targetDate.getDay();

    // Calculate positions
    const positions = getCelestialPositions(targetDate, lat, lon);
    const times = getSunMoonTimes(targetDate, lat, lon);

    // Calculate Vedic elements with end times
    const tithi = calculateTithiWithEndTime(
      positions.sun.longitude,
      positions.moon.longitude,
      times.sunrise
    );
    const nakshatra = calculateNakshatraWithEndTime(
      positions.moon.longitude,
      times.sunrise
    );
    const yoga = calculateYogaWithEndTime(
      positions.sun.longitude,
      positions.moon.longitude,
      times.sunrise
    );
    const karana = calculateKaranaWithEndTime(
      tithi.number,
      parseFloat(tithi.progress),
      times.sunrise
    );

    // Calculate Rashis
    const moonRashi = calculateRashi(positions.moon.longitude);
    const sunRashi = calculateRashi(positions.sun.longitude);

    // Calculate Samvats
    const samvats = calculateSamvats(targetDate);

    // Calculate Hindu months
    const months = calculateHinduMonth(
      positions.moon.longitude,
      positions.sun.longitude
    );

    // Calculate all Kaals
    const rahuKaal = calculateRahuKaal(times.sunrise, times.sunset, weekday);
    const gulikaKaal = calculateGulikaKaal(
      times.sunrise,
      times.sunset,
      weekday
    );
    const yamaGhanta = calculateYamaGhanta(
      times.sunrise,
      times.sunset,
      weekday
    );
    const abhijitMuhurta = calculateAbhijitMuhurta(times.sunrise, times.sunset);
    const durMuhurtam = calculateDurMuhurtam(times.sunrise, weekday);
    const amritKaal = calculateAmritKaal(times.sunrise, weekday);
    const varjyam = calculateVarjyam(times.sunrise, positions.moon.longitude);

    // Prepare comprehensive response
    const panchang = {
      date: format(targetDate, "yyyy-MM-dd"),
      weekday: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][weekday],
      location: { latitude: lat, longitude: lon },
      sunMoon: {
        sunrise: times.sunrise,
        sunset: times.sunset,
        moonrise: times.moonrise,
        moonset: times.moonset,
      },
      tithi: tithi,
      nakshatra: nakshatra,
      yoga: yoga,
      karana: karana,
      rashis: {
        moon: moonRashi,
        sun: sunRashi,
      },
      samvats: samvats,
      months: months,
      auspiciousTimes: {
        abhijitMuhurta: abhijitMuhurta,
        amritKaal: amritKaal,
      },
      inauspiciousTimes: {
        rahuKaal: rahuKaal,
        gulikaKaal: gulikaKaal,
        yamaGhanta: yamaGhanta,
        durMuhurtam: durMuhurtam,
        varjyam: varjyam,
      },
      calculatedAt: new Date().toISOString(),
    };

    return NextResponse.json(panchang, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Panchang calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate Panchang", details: error.message },
      { status: 500 }
    );
  }
}
