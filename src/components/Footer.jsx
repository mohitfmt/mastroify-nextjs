import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="bg-deep-space border-t border-gold-primary/20 py-12 px-4 sm:px-6 lg:px-8"
      id="contact"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Image
              src="/logo.svg"
              alt="Mastroify"
              width={200}
              height={80}
              className="mb-4"
            />
            <p className="text-gray-400 mb-4 max-w-md">
              Authentic Vedic Astrology consultations guided by classical wisdom
              and modern convenience.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/mastroify"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/mastroify"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/mastroify/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@mastroify"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold-primary transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold-primary font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gold-primary transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gold-primary transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gold-primary transition-colors"
                >
                  Book Consultation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gold-primary transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold-primary font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+60 18 355 3290</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>info@mastroify.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Mastroify. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="text-gray-500 hover:text-gold-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gold-primary transition-colors"
            >
              Terms & Conditions
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gold-primary transition-colors"
            >
              Disclaimer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
