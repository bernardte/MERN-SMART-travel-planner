import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <span className="text-sm font-bold text-white">✈</span>
              </div>
              <span className="text-lg font-bold text-gray-800">
                TravelBuddy
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Your ultimate companion for discovering, planning, and sharing
              amazing travel experiences.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800">Product</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li>
                <Link
                  to="#features"
                  className="hover:text-primary transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="#destinations"
                  className="hover:text-primary transition-colors"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  to="/guides"
                  className="hover:text-primary transition-colors"
                >
                  Community Guides
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="hover:text-primary transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="hover:text-primary transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-400">
          © 2024 TravelBuddy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer