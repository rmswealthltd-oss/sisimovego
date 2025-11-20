"use client";

/**
 * Footer — compact, trust-first
 * Fully hydration-safe — dynamic year handled on client only
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn
} from "react-icons/fa";

export default function Footer() {
  const [year, setYear] = useState("");

  // Avoid SSR/client mismatch
  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300 mt-24">
      <div className="max-w-[1350px] mx-auto px-4 md:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
              SM
            </div>
            <div>
              <div className="font-bold text-white">SisiMove</div>
              <div className="text-sm text-gray-400">Africa-first ride sharing</div>
            </div>
          </div>

          <p className="text-gray-400 text-sm">
            Safe, affordable, verified drivers across cities and intercity routes.
          </p>

          <div className="flex gap-3 mt-4">
            <a className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700">
              <FaFacebookF size={12} />
            </a>
            <a className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700">
              <FaTwitter size={12} />
            </a>
            <a className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700">
              <FaInstagram size={12} />
            </a>
            <a className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700">
              <FaLinkedinIn size={12} />
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/support" className="hover:text-white">Help Center</Link></li>
            <li><Link href="/safety" className="hover:text-white">Safety</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
            <li><Link href="/cookies" className="hover:text-white">Cookies</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © {year} SisiMove — All rights reserved.
      </div>
    </footer>
  );
}
