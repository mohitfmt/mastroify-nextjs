import { Inter, Playfair_Display, Philosopher } from "next/font/google";
import "./globals.css";

// Font configurations
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const philosopher = Philosopher({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-philosopher",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.mastroify.com"),
  title: {
    default:
      "Mastroify - Authentic Vedic Astrology Consultation | Expert Jyotish Analysis",
    template: "%s | Mastroify - Vedic Astrology",
  },
  description:
    "Professional Vedic astrology consultations with 6+ years of classical Jyotish expertise. Birth chart reading, career guidance, relationship compatibility, and personalized remedies. Serving clients globally since 2021.",
  keywords: [
    "vedic astrology",
    "birth chart reading",
    "kundali analysis",
    "jyotish consultation",
    "career astrology",
    "marriage compatibility",
    "online astrologer",
    "kundali matching",
    "horoscope reading",
    "vastu consultation",
    "astrology remedies",
    "gemstone recommendation",
    "indian astrology",
    "vedic astrologer online",
    "professional astrologer",
  ],
  authors: [{ name: "Mastroify", url: "https://www.mastroify.com" }],
  creator: "Mastroify",
  publisher: "Mastroify",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.mastroify.com",
    siteName: "Mastroify",
    title: "Mastroify - Authentic Vedic Astrology Consultation",
    description:
      "Expert Vedic astrology analysis by classically trained astrologer with 6+ years experience. Personalized birth chart readings, career guidance, and relationship compatibility.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mastroify - Vedic Astrology Consultation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mastroify - Vedic Astrology Consultation",
    description:
      "Professional Jyotish guidance from expert with 6+ years of classical study. Serving clients globally since 2021.",
    creator: "@mastroify",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "bvciaBzkToQ2Qn1nF2LY1fPV-GcSg1JoV20ihXvZAVU",
  },
  alternates: {
    canonical: "https://www.mastroify.com",
  },
  category: "Astrology",
};

export default function RootLayout({ children }) {
  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.mastroify.com/#organization",
        name: "Mastroify",
        url: "https://www.mastroify.com",
        logo: {
          "@type": "ImageObject",
          url: "https://www.mastroify.com/logo.svg",
          width: 400,
          height: 160,
        },
        image: "https://www.mastroify.com/og-image.png",
        description:
          "Authentic Vedic Astrology consultations by expert with 6+ years of classical Jyotish study",
        foundingDate: "2021",
        email: "info@mastroify.com",
        telephone: "+60183553290",
        address: {
          "@type": "PostalAddress",
          addressCountry: "MY",
          addressLocality: "Kuala Lumpur",
        },
        sameAs: [
          "https://www.facebook.com/mastroify",
          "https://twitter.com/mastroify",
          "https://www.instagram.com/mastroify/",
          "https://www.youtube.com/@mastroify",
          "https://www.tiktok.com/@mastroify",
          "https://www.pinterest.com/mastroify/",
          "https://www.patreon.com/mastroify",
          "https://www.reddit.com/user/mastroify",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://www.mastroify.com/#website",
        url: "https://www.mastroify.com",
        name: "Mastroify",
        publisher: {
          "@id": "https://www.mastroify.com/#organization",
        },
        inLanguage: ["en", "hi"],
        potentialAction: {
          "@type": "SearchAction",
          target: "https://www.mastroify.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": "https://www.mastroify.com/#webpage",
        url: "https://www.mastroify.com",
        name: "Mastroify - Authentic Vedic Astrology Consultation",
        datePublished: "2021-01-01",
        dateModified: new Date().toISOString().split("T")[0],
        isPartOf: {
          "@id": "https://www.mastroify.com/#website",
        },
        about: {
          "@id": "https://www.mastroify.com/#organization",
        },
        description:
          "Professional Vedic astrology consultations with 6+ years of classical Jyotish expertise. Birth chart reading, career guidance, relationship compatibility.",
        inLanguage: "en",
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://www.mastroify.com/#service",
        name: "Vedic Astrology Consultation Services",
        image: "https://www.mastroify.com/logo.svg",
        priceRange: "$$",
        telephone: "+60183553290",
        address: {
          "@type": "PostalAddress",
          addressCountry: "MY",
        },
        url: "https://www.mastroify.com",
        areaServed: [
          {
            "@type": "Country",
            name: "India",
          },
          {
            "@type": "Country",
            name: "United States",
          },
          {
            "@type": "Country",
            name: "Canada",
          },
          {
            "@type": "Country",
            name: "United Kingdom",
          },
          {
            "@type": "Country",
            name: "Australia",
          },
          {
            "@type": "Country",
            name: "Singapore",
          },
          {
            "@type": "Country",
            name: "Malaysia",
          },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Vedic Astrology Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Birth Chart Reading",
                description:
                  "Comprehensive Kundali analysis covering all 12 houses, planetary positions, Dashas, and yogas",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Vastu Consultation",
                description:
                  "Traditional Vastu Shastra guidance for homes, offices, and commercial spaces",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Career Guidance",
                description:
                  "Detailed career analysis examining 10th house, D-10 chart, and timing for job changes",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Relationship Compatibility",
                description:
                  "Kundali matching and relationship analysis using Ashtakoota Guna Milan",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Remedies & Solutions",
                description:
                  "Personalized gemstone recommendations, mantras, and practical remedies",
              },
            },
          ],
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "82",
          bestRating: "5",
          worstRating: "1",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How long does it take to receive my astrology report?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Reports are delivered within 3-5 days. We prioritize quality analysis over speed, ensuring every consultation is personally reviewed by our expert astrologer.",
            },
          },
          {
            "@type": "Question",
            name: "What information do I need to provide for a birth chart reading?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You need to provide your exact birth date, birth time (as accurate as possible), and birth place. The accuracy of birth time significantly impacts the chart analysis.",
            },
          },
          {
            "@type": "Question",
            name: "Are the reports available in Hindi?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes! All our reports and consultations are available in both English and Hindi (देवनागरी script), serving both Indian and international diaspora clients.",
            },
          },
          {
            "@type": "Question",
            name: "How is Mastroify different from automated astrology apps?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Every consultation at Mastroify is personally reviewed by an expert astrologer with 6+ years of classical Jyotish study. We provide customized, detailed analysis - not computer-generated generic reports.",
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${philosopher.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
