// __tests__/panchang-simple.test.js
/**
 * SIMPLE PANCHANG API TESTS (Beginner-Friendly)
 *
 * This tests the most critical functionality:
 * 1. Sunrise before sunset
 * 2. Positive durations
 * 3. Valid ranges for Vedic elements
 */

// Test helper function
async function getPanchang(lat, lon, date) {
  const url = `http://localhost:3000/api/panchang?lat=${lat}&lon=${lon}&date=${date}`;
  const response = await fetch(url);
  return await response.json();
}

// ============================================
// TEST 1: Basic Sanity Checks
// ============================================

test("Delhi: Sunrise should be BEFORE sunset", async () => {
  const data = await getPanchang(28.6139, 77.209, "2026-01-16");

  const sunrise = new Date(data.sunMoon.sunrise);
  const sunset = new Date(data.sunMoon.sunset);

  // The most important check!
  expect(sunrise.getTime()).toBeLessThan(sunset.getTime());
});

test("Delhi: Day duration should be POSITIVE", async () => {
  const data = await getPanchang(28.6139, 77.209, "2026-01-16");

  expect(data.dayNight.dinamana.hours).toBeGreaterThan(0);
  expect(data.dayNight.dinamana.totalMinutes).toBeGreaterThan(0);
});

test("Delhi: Rahu Kaal duration should be POSITIVE", async () => {
  const data = await getPanchang(28.6139, 77.209, "2026-01-16");

  expect(data.inauspiciousTimes.rahuKaal.duration).toBeGreaterThan(0);
});

// ============================================
// TEST 2: Vedic Elements in Valid Range
// ============================================

test("Tithi should be between 1 and 30", async () => {
  const data = await getPanchang(28.6139, 77.209, "2026-01-16");

  expect(data.tithi.number).toBeGreaterThanOrEqual(1);
  expect(data.tithi.number).toBeLessThanOrEqual(30);
});

test("Nakshatra should be between 1 and 27", async () => {
  const data = await getPanchang(28.6139, 77.209, "2026-01-16");

  expect(data.nakshatra.number).toBeGreaterThanOrEqual(1);
  expect(data.nakshatra.number).toBeLessThanOrEqual(27);
});

test("Yoga should be between 1 and 27", async () => {
  const data = await getPanchang(28.6139, 77.209, "2026-01-16");

  expect(data.yoga.number).toBeGreaterThanOrEqual(1);
  expect(data.yoga.number).toBeLessThanOrEqual(27);
});

// ============================================
// TEST 3: Hindi Translations Present
// ============================================

test("Hindi translations should be present", async () => {
  const data = await getPanchang(28.6139, 77.209, "2026-01-16");

  expect(data.weekdayHindi).toBeTruthy();
  expect(data.tithi.hindi).toBeTruthy();
  expect(data.nakshatra.hindi).toBeTruthy();
  expect(data.yoga.hindi).toBeTruthy();
});

// ============================================
// TEST 4: Day + Night = 24 Hours
// ============================================

test("Day + Night should equal 24 hours", async () => {
  const data = await getPanchang(28.6139, 77.209, "2026-01-16");

  const dayMinutes = data.dayNight.dinamana.totalMinutes;
  const nightMinutes = data.dayNight.ratrimana.totalMinutes;

  expect(dayMinutes + nightMinutes).toBe(1440); // 24 * 60 = 1440 minutes
});

// ============================================
// That's it! Just 9 simple tests.
// Run with: npm test
// ============================================
