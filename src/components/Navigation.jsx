"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services = [
    "Birth Chart Reading",
    "Vastu Consultation",
    "Remedies & Solutions",
    "Career Guidance",
    "Relationship Compatibility",
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-deep-space/75 backdrop-blur-md border-b border-gold-primary/20 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="shrink-0">
            <Image
              src="/logo.svg"
              alt="Mastroify"
              width={150}
              height={60}
              className="cursor-pointer"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-300 hover:text-gold-primary transition-colors"
            >
              Home
            </a>
            <a
              href="#about"
              className="text-gray-300 hover:text-gold-primary transition-colors"
            >
              About
            </a>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-300 hover:text-gold-primary transition-colors">
                Services
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-deep-space border border-gold-primary/20 rounded-lg shadow-xl overflow-hidden"
                  >
                    {services.map((service) => (
                      <a
                        key={service}
                        href="#"
                        className="block px-4 py-3 text-gray-300 hover:bg-gold-primary/10 hover:text-gold-primary transition-colors border-b border-gray-800 last:border-b-0"
                      >
                        {service}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="#contact"
              className="text-gray-300 hover:text-gold-primary transition-colors"
            >
              Contact
            </a>

            <button className="btn-primary py-2! px-6! text-sm">
              Book Consultation
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gold-primary"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-deep-space border-t border-gold-primary/20"
          >
            <div className="px-4 py-4 space-y-4">
              <a
                href="#"
                className="block text-gray-300 hover:text-gold-primary transition-colors"
              >
                Home
              </a>
              <a
                href="#about"
                className="block text-gray-300 hover:text-gold-primary transition-colors"
              >
                About
              </a>

              <div>
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="flex items-center justify-between w-full text-gray-300 hover:text-gold-primary transition-colors"
                >
                  Services
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      servicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {servicesOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    {services.map((service) => (
                      <a
                        key={service}
                        href="#"
                        className="block text-sm text-gray-400 hover:text-gold-primary transition-colors"
                      >
                        {service}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="#contact"
                className="block text-gray-300 hover:text-gold-primary transition-colors"
              >
                Contact
              </a>

              <button className="btn-primary w-full py-2! text-sm">
                Book Consultation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
