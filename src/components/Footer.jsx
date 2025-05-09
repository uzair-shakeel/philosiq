import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-darkBlue text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img src="/footer logo.png" alt="logo" className="h-12 w-auto" />
            </Link>
            <p className="text-gray-300 text-sm">
              Discover your political identity through our comprehensive survey
              and explore the nuances of political thought.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-primary-lightMaroon transition-colors duration-300"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="hover:text-primary-lightMaroon transition-colors duration-300"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="hover:text-primary-lightMaroon transition-colors duration-300"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="hover:text-primary-lightMaroon transition-colors duration-300"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative inline-block after:content-[''] after:absolute after:w-1/2 after:h-0.5 after:bg-primary-maroon after:bottom-[-5px] after:left-0">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/quiz"
                  className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Take the Quiz
                </Link>
              </li>
              <li>
                <Link
                  href="/archetypes"
                  className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Political Archetypes
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative inline-block after:content-[''] after:absolute after:w-1/2 after:h-0.5 after:bg-primary-maroon after:bottom-[-5px] after:left-0">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/mindmap"
                  className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Mind Map
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Research Methodology
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative inline-block after:content-[''] after:absolute after:w-1/2 after:h-0.5 after:bg-primary-maroon after:bottom-[-5px] after:left-0">
              Contact Us
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a
                  href="mailto:support@philosiq.com"
                  className="hover:text-white transition-colors duration-300"
                >
                  support@philosiq.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© {currentYear} Philosiq. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
