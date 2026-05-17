import { Link } from "react-router-dom";
import {
  ArrowUp,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getFilteredNavItems } from "@/lib/helpers/getFilterNavItems";
import useAuthStore from "@/stores/useAuthStore";

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const user = useAuthStore((state) => state.user);
  const filteredNavItems = getFilteredNavItems(user);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-20 border-t border-gray-100 bg-white/80 shadow-lg backdrop-blur-sm">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                <span className="text-lg font-bold text-white">✈</span>
              </div>
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-xl font-bold text-transparent">
                TravelBuddy
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500">
              Your ultimate companion for discovering, planning, and sharing
              amazing travel experiences around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="relative mb-5 inline-block text-base font-semibold text-gray-800 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-8 after:bg-gradient-to-r after:from-blue-500 after:to-indigo-600">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {filteredNavItems.map((item) => (
                <li key={item.link}>
                  <Link
                    to={item.link}
                    className="group flex items-center text-gray-500 transition-all hover:text-blue-600"
                  >
                    <span className="mr-2 opacity-0 transition-all group-hover:mr-2 group-hover:opacity-100">
                      →
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="relative mb-5 inline-block text-base font-semibold text-gray-800 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-8 after:bg-gradient-to-r after:from-blue-500 after:to-indigo-600">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/privacy"
                  className="group flex items-center text-gray-500 transition-all hover:text-blue-600"
                >
                  <span className="mr-2 opacity-0 transition-all group-hover:mr-2 group-hover:opacity-100">
                    →
                  </span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="group flex items-center text-gray-500 transition-all hover:text-blue-600"
                >
                  <span className="mr-2 opacity-0 transition-all group-hover:mr-2 group-hover:opacity-100">
                    →
                  </span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="group flex items-center text-gray-500 transition-all hover:text-blue-600"
                >
                  <span className="mr-2 opacity-0 transition-all group-hover:mr-2 group-hover:opacity-100">
                    →
                  </span>
                  Cookie Policy
                </Link>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="relative mb-5 inline-block text-base font-semibold text-gray-800 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-8 after:bg-gradient-to-r after:from-blue-500 after:to-indigo-600">
                Contact
              </h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span>hello@travelbuddy.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span>+60 123-4567</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span>21, Jalan penang 28</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="relative mb-5 inline-block text-base font-semibold text-gray-800 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-8 after:bg-gradient-to-r after:from-blue-500 after:to-indigo-600">
              Stay Inspired
            </h4>
            <p className="mb-3 text-sm text-gray-500">
              Get travel tips, exclusive deals, and inspiration in your inbox.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Add newsletter signup logic here
              }}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-all outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                required
              />
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:scale-105 hover:shadow-md"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-2 text-xs text-gray-400">
              No spam, unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-100 pt-8 text-center sm:flex-row">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} TravelBuddy. All rights reserved.
          </p>
          <div className="mt-3 flex gap-4 text-xs text-gray-400 sm:mt-0">
            <Link
              to="/privacy"
              className="transition-colors hover:text-blue-500"
            >
              Privacy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-blue-500">
              Terms
            </Link>
            <Link
              to="/cookies"
              className="transition-colors hover:text-blue-500"
            >
              Cookies
            </Link>
            <button
              onClick={scrollToTop}
              className="transition-colors hover:text-blue-500"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button (appears on scroll) */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed right-6 bottom-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </footer>
  );
};

export default Footer;
