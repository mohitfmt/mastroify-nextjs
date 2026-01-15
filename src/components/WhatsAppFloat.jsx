"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function WhatsAppFloat() {
  const whatsappMessage = encodeURIComponent(
    "नमस्कार, मैं Mastroify की सेवाएं लेना चाहता हूँ।"
  );
  const whatsappLink = `https://api.whatsapp.com/send?phone=60183553290&text=${whatsappMessage}`;

  return (
    <Link
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp"
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
    </Link>
  );
}
