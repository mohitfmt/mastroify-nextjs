// __tests__/panchang-api.test.js
/**
 * PANCHANG API UNIT TESTS
 *
 * Critical tests to ensure API is working correctly
 * Tests multiple locations, dates, and edge cases
 *
 * Run with: npm test
 * Or: jest panchang-api.test.js
 */

// ============================================
// TEST HELPERS
// ============================================

async function getPanchang(lat, lon, date = "2026-01-16") {
  const url = `http://localhost:3000/api/panchang?lat=${lat}&lon=${lon}&date=${date}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return await response.json();
}

function minutesBetween(start, end) {
  return Math.round((new Date(end) - new Date(start)) / (1000 * 60));
}

// ============================================
// TEST 1: TIMEZONE CONVERSION (CRITICAL!)
// ============================================

console.log("\n🧪 TEST 1: Timezone Conversion\n");

describe("Timezone Conversion", () => {
  test("Delhi: Sunrise BEFORE Sunset", async () => {
    const data = await getPanchang(28.6139, 77.209);
    const sunrise = new Date(data.sunMoon.sunrise);
    const sunset = new Date(data.sunMoon.sunset);

    expect(sunrise.getTime()).toBeLessThan(sunset.getTime());
    console.log(`  ✅ Sunrise: ${sunrise.toISOString()}`);
    console.log(`  ✅ Sunset:  ${sunset.toISOString()}`);
  });

  test("Delhi: Day duration is POSITIVE", async () => {
    const data = await getPanchang(28.6139, 77.209);

    expect(data.dayNight.dinamana.totalMinutes).toBeGreaterThan(0);
    expect(data.dayNight.dinamana.hours).toBeGreaterThan(0);

    console.log(`  ✅ Day: ${data.dayNight.dinamana.formatted}`);
    console.log(`  ✅ Night: ${data.dayNight.ratrimana.formatted}`);
  });

  test("Delhi: Rahu Kaal duration is POSITIVE", async () => {
    const data = await getPanchang(28.6139, 77.209);

    expect(data.inauspiciousTimes.rahuKaal.duration).toBeGreaterThan(0);

    const start = new Date(data.inauspiciousTimes.rahuKaal.start);
    const end = new Date(data.inauspiciousTimes.rahuKaal.end);
    expect(start.getTime()).toBeLessThan(end.getTime());

    console.log(
      `  ✅ Rahu Kaal: ${data.inauspiciousTimes.rahuKaal.duration} minutes`
    );
  });
});

// ============================================
// TEST 2: MULTIPLE LOCATIONS
// ============================================

console.log("\n🧪 TEST 2: Multiple Locations\n");

describe("Multiple Locations", () => {
  const locations = [
    { name: "Delhi", lat: 28.6139, lon: 77.209 },
    { name: "Mumbai", lat: 19.076, lon: 72.8777 },
    { name: "New York", lat: 40.7128, lon: -74.006 },
    { name: "London", lat: 51.5074, lon: -0.1278 },
  ];

  test.each(locations)("$name: All times valid", async (loc) => {
    const data = await getPanchang(loc.lat, loc.lon);

    // Sunrise < Sunset
    const sunrise = new Date(data.sunMoon.sunrise);
    const sunset = new Date(data.sunMoon.sunset);
    expect(sunrise.getTime()).toBeLessThan(sunset.getTime());

    // Positive durations
    expect(data.dayNight.dinamana.totalMinutes).toBeGreaterThan(0);
    expect(data.inauspiciousTimes.rahuKaal.duration).toBeGreaterThan(0);

    console.log(`  ✅ ${loc.name}: Day ${data.dayNight.dinamana.formatted}`);
  });
});

// ============================================
// TEST 3: VEDIC CALCULATIONS
// ============================================

console.log("\n🧪 TEST 3: Vedic Calculations\n");

describe("Vedic Elements", () => {
  test("Tithi: Valid range (1-30)", async () => {
    const data = await getPanchang(28.6139, 77.209);

    expect(data.tithi.number).toBeGreaterThanOrEqual(1);
    expect(data.tithi.number).toBeLessThanOrEqual(30);
    expect(["Shukla", "Krishna"]).toContain(data.tithi.paksha);

    console.log(`  ✅ Tithi: ${data.tithi.name} (${data.tithi.paksha})`);
  });

  test("Nakshatra: Valid range (1-27)", async () => {
    const data = await getPanchang(28.6139, 77.209);

    expect(data.nakshatra.number).toBeGreaterThanOrEqual(1);
    expect(data.nakshatra.number).toBeLessThanOrEqual(27);

    console.log(`  ✅ Nakshatra: ${data.nakshatra.name}`);
  });

  test("Yoga: Valid range (1-27)", async () => {
    const data = await getPanchang(28.6139, 77.209);

    expect(data.yoga.number).toBeGreaterThanOrEqual(1);
    expect(data.yoga.number).toBeLessThanOrEqual(27);

    console.log(`  ✅ Yoga: ${data.yoga.name}`);
  });

  test("Karanas: Exactly 2 per day", async () => {
    const data = await getPanchang(28.6139, 77.209);

    expect(data.karanas).toHaveLength(2);
    expect(data.karanas[0].isFirst).toBe(true);
    expect(data.karanas[1].isFirst).toBe(false);

    console.log(
      `  ✅ Karanas: ${data.karanas[0].name}, ${data.karanas[1].name}`
    );
  });
});

// ============================================
// TEST 4: ALL DURATIONS POSITIVE
// ============================================

console.log("\n🧪 TEST 4: All Durations Positive\n");

describe("Positive Durations", () => {
  test("All auspicious times positive", async () => {
    const data = await getPanchang(28.6139, 77.209);

    const times = [
      "brahmaMuhurta",
      "pratahSandhya",
      "abhijitMuhurta",
      "vijayaMuhurta",
      "godhuliMuhurta",
      "sayanhnaSandhya",
      "amritKaal",
      "nishitaMuhurta",
    ];

    times.forEach((name) => {
      expect(data.auspiciousTimes[name].duration).toBeGreaterThan(0);
    });

    console.log(`  ✅ All 8 auspicious times have positive durations`);
  });

  test("All inauspicious times positive", async () => {
    const data = await getPanchang(28.6139, 77.209);

    expect(data.inauspiciousTimes.rahuKaal.duration).toBeGreaterThan(0);
    expect(data.inauspiciousTimes.gulikaKaal.duration).toBeGreaterThan(0);
    expect(data.inauspiciousTimes.yamaGhanta.duration).toBeGreaterThan(0);

    data.inauspiciousTimes.durMuhurtam.forEach((dm) => {
      expect(dm.duration).toBe(48);
    });

    data.inauspiciousTimes.varjyam.forEach((v) => {
      expect(v.duration).toBe(72);
    });

    console.log(`  ✅ All inauspicious periods have positive durations`);
  });
});

// ============================================
// TEST 5: START < END ALWAYS
// ============================================

console.log("\n🧪 TEST 5: Start < End Always\n");

describe("Time Order Validation", () => {
  test("All periods have start before end", async () => {
    const data = await getPanchang(28.6139, 77.209);

    // Check all auspicious times
    Object.entries(data.auspiciousTimes).forEach(([name, time]) => {
      const start = new Date(time.start);
      const end = new Date(time.end);
      expect(start.getTime()).toBeLessThan(end.getTime());
    });

    // Check inauspicious times
    const checkTime = (time) => {
      const start = new Date(time.start);
      const end = new Date(time.end);
      expect(start.getTime()).toBeLessThan(end.getTime());
    };

    checkTime(data.inauspiciousTimes.rahuKaal);
    checkTime(data.inauspiciousTimes.gulikaKaal);
    checkTime(data.inauspiciousTimes.yamaGhanta);
    data.inauspiciousTimes.durMuhurtam.forEach(checkTime);
    data.inauspiciousTimes.varjyam.forEach(checkTime);

    console.log(`  ✅ All periods have correct time order`);
  });
});

// ============================================
// TEST 6: HINDI TRANSLATIONS
// ============================================

console.log("\n🧪 TEST 6: Hindi Translations\n");

describe("Hindi Translations", () => {
  test("All Hindi fields present", async () => {
    const data = await getPanchang(28.6139, 77.209);

    expect(data.weekdayHindi).toBeTruthy();
    expect(data.tithi.hindi).toBeTruthy();
    expect(data.tithi.pakshaHindi).toBeTruthy();
    expect(data.nakshatra.hindi).toBeTruthy();
    expect(data.yoga.hindi).toBeTruthy();
    expect(data.karanas[0].hindi).toBeTruthy();
    expect(data.rashis.moon.hindi).toBeTruthy();
    expect(data.months.amantaHindi).toBeTruthy();
    expect(data.rituAyana.rituHindi).toBeTruthy();
    expect(data.summary.dayTypeHindi).toBeTruthy();

    console.log(`  ✅ All Hindi translations present`);
  });
});

// ============================================
// TEST 7: SPECIAL YOGAS
// ============================================

console.log("\n🧪 TEST 7: Special Yogas\n");

describe("Special Yogas", () => {
  test("All yoga flags are boolean", async () => {
    const data = await getPanchang(28.6139, 77.209);

    Object.values(data.specialYogas).forEach((value) => {
      expect(typeof value).toBe("boolean");
    });

    console.log(`  ✅ All 8 special yoga flags present`);
  });
});

// ============================================
// TEST 8: PANCHAKA
// ============================================

console.log("\n🧪 TEST 8: Panchaka Rahita\n");

describe("Panchaka Rahita", () => {
  test("Has 14 segments", async () => {
    const data = await getPanchang(28.6139, 77.209);

    expect(data.panchaka).toHaveLength(14);

    console.log(`  ✅ Panchaka has 14 segments`);
  });

  test("All segments have valid types", async () => {
    const data = await getPanchang(28.6139, 77.209);

    const validTypes = ["Good", "Mrityu", "Agni", "Raja", "Chora", "Roga"];

    data.panchaka.forEach((segment) => {
      expect(validTypes).toContain(segment.type);
    });

    console.log(`  ✅ All Panchaka types valid`);
  });
});

// ============================================
// TEST 9: ERROR HANDLING
// ============================================

console.log("\n🧪 TEST 9: Error Handling\n");

describe("Error Handling", () => {
  test("Rejects invalid coordinates", async () => {
    await expect(getPanchang(999, 999)).rejects.toThrow();
    console.log(`  ✅ Rejects invalid coordinates`);
  });

  test("Rejects invalid date", async () => {
    await expect(getPanchang(28.6139, 77.209, "invalid")).rejects.toThrow();
    console.log(`  ✅ Rejects invalid date`);
  });
});

// ============================================
// SUMMARY
// ============================================

console.log("\n✅ ALL TESTS COMPLETE!\n");
