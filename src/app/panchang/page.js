import PanchangDetails from "@/components/PanchangDetails";

export const metadata = {
  title: "Complete Vedic Panchang - Daily Hindu Calendar | Mastroify",
  description:
    "Access detailed Vedic Panchang with Tithi, Nakshatra, Yoga, Karana, auspicious timings, and inauspicious periods. Choose any date and location for accurate Hindu calendar data.",
  keywords: [
    "vedic panchang",
    "hindu calendar",
    "panchang today",
    "tithi nakshatra",
    "rahu kaal",
    "abhijit muhurta",
    "indian panchang",
    "daily panchang",
    "hindu panchang",
    "jyotish panchang",
  ],
  openGraph: {
    title: "Complete Vedic Panchang - Daily Hindu Calendar",
    description:
      "Detailed Vedic Panchang with all timings, auspicious moments, and inauspicious periods for any date and location.",
    type: "website",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://www.mastroify.com/panchang",
  },
};

export default function PanchangPage() {
  // JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Vedic Panchang - Complete Hindu Calendar",
    description:
      "Detailed Vedic Panchang with Tithi, Nakshatra, Yoga, Karana, and all auspicious/inauspicious timings",
    url: "https://www.mastroify.com/panchang",
    isPartOf: {
      "@type": "WebSite",
      name: "Mastroify",
      url: "https://www.mastroify.com",
    },
    about: {
      "@type": "Thing",
      name: "Vedic Astrology Panchang",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-night-sky">
        <PanchangDetails />
      </main>
    </>
  );
}
