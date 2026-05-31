import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-[#111B33] text-[#E2E8F0] pt-5 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div className="space-y-3">
          <Link
            to="/"
            className="text-2xl font-extrabold text-[#A855F7] tracking-wide hover:text-[#9333EA] transition-colors duration-200"
          >
            QuickLoan
          </Link>
          <p className="text-gray-400 text-sm">
            Connecting you to loans seamlessly. Reliable, fast, and transparent
            since 2025.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h6 className="font-semibold text-gray-300 uppercase tracking-wider text-sm">Quick Links</h6>
          <ul className="space-y-1.5 text-sm">
            <li>
              <Link to="/" className="text-gray-400 hover:text-[#A855F7] transition-colors duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/all-loans"
                className="text-gray-400 hover:text-[#A855F7] transition-colors duration-200"
              >
                All Loans
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-gray-400 hover:text-[#A855F7] transition-colors duration-200"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-gray-400 hover:text-[#A855F7] transition-colors duration-200"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources (FIXED: Links removed, just showing text cleanly) */}
        <div className="space-y-2">
          <h6 className="font-semibold text-gray-300 uppercase tracking-wider text-sm">Resources</h6>
          <ul className="space-y-1.5 text-sm text-gray-400">
            <li className="cursor-default hover:text-gray-300 transition-colors">FAQ</li>
            <li className="cursor-default hover:text-gray-300 transition-colors">Terms of Service</li>
            <li className="cursor-default hover:text-gray-300 transition-colors">Privacy Policy</li>
          </ul>
        </div>

        {/* Social & Contact */}
        <div className="space-y-3">
          <h6 className="font-semibold text-gray-300 uppercase tracking-wider text-sm">Follow Us</h6>
          <div className="flex space-x-4 text-gray-400">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#A855F7] transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#A855F7] transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#A855F7] transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
          </div>
          <p className="text-gray-500 text-xs mt-3">
            © 2025 QuickLoan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;