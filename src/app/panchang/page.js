import PanchangDetails from "@/components/PanchangDetails";

export const metadata = {
  title: "Complete Vedic Panchang - Daily Hindu Calendar | Mastroify",
  description:
    "Access detailed Vedic Panchang with Tithi, Nakshatra, Yoga, Karana, auspicious timings, inauspicious periods, and activity recommendations. Choose any date and location for accurate Hindu calendar data calculated using classical Jyotish principles.",
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
    "auspicious timings",
    "brahma muhurta",
    "amrit kaal",
    "gulika kaal",
    "yama ghanta",
    "dur muhurtam",
    "vedic astrology calendar",
  ],
  openGraph: {
    title: "Complete Vedic Panchang - Daily Hindu Calendar",
    description:
      "Detailed Vedic Panchang with all timings, auspicious moments, inauspicious periods, and activity recommendations for any date and location.",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Complete Vedic Panchang | Mastroify",
    description:
      "Accurate Vedic Panchang with Tithi, Nakshatra, Yoga, Karana, and timing recommendations",
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
      "Detailed Vedic Panchang with Tithi, Nakshatra, Yoga, Karana, and all auspicious/inauspicious timings calculated using authentic Vedic astronomy",
    url: "https://www.mastroify.com/panchang",
    isPartOf: {
      "@type": "WebSite",
      name: "Mastroify",
      url: "https://www.mastroify.com",
    },
    about: {
      "@type": "Thing",
      name: "Vedic Astrology Panchang",
      description:
        "Daily Hindu calendar with precise calculations for auspicious and inauspicious timings based on classical Jyotish texts",
    },
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "Mastroify Panchang Calculator",
      applicationCategory: "LifestyleApplication",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "82",
      },
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
