import { Helmet } from "react-helmet-async";
import { Cookie, Settings, BarChart3, Target, ShieldCheck } from "lucide-react";

const CookiePolicy = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy | Travel Planner</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
              <Cookie className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Cookie Policy
            </h1>
            <p className="mt-2 text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8 rounded-2xl bg-white p-6 shadow-md sm:p-8">
            <CookieSection title="What Are Cookies?">
              <p>
                Cookies are small text files placed on your device when you
                visit a website. They help us remember your preferences,
                understand how you use our site, and improve your experience.
              </p>
            </CookieSection>

            <CookieSection
              icon={<Settings className="h-5 w-5" />}
              title="How We Use Cookies"
            >
              <p>We use cookies for the following purposes:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>
                  <strong>Essential Cookies:</strong> Required for basic site
                  functionality (login, session management).
                </li>
                <li>
                  <strong>Preference Cookies:</strong> Remember your settings
                  like language or region.
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how
                  visitors interact with our site (e.g., Google Analytics).
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> Used to display relevant
                  travel recommendations and ads.
                </li>
              </ul>
            </CookieSection>

            <CookieSection
              icon={<BarChart3 className="h-5 w-5" />}
              title="Third-Party Cookies"
            >
              <p>
                We may allow third-party services (analytics providers, ad
                networks) to place cookies on your device. These include:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Google Analytics – to analyze site traffic</li>
                <li>
                  Stripe / PayPal – for payment processing (if applicable)
                </li>
                <li>Social media platforms – if you share content</li>
              </ul>
              <p className="mt-2 text-sm text-gray-500">
                These third parties have their own cookie policies.
              </p>
            </CookieSection>

            <CookieSection
              icon={<Target className="h-5 w-5" />}
              title="Your Control Over Cookies"
            >
              <p>
                Most browsers allow you to control cookies through their
                settings. You can:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Delete all cookies already on your device</li>
                <li>Block cookies from specific sites</li>
                <li>
                  Set your browser to alert you when cookies are being sent
                </li>
                <li>Use "Incognito" or "Private" mode</li>
              </ul>
              <div className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                <strong>Note:</strong> Disabling essential cookies may prevent
                core features like logging in or saving trips from working
                properly.
              </div>
            </CookieSection>

            <CookieSection
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Consent Management"
            >
              <p>
                When you first visit our site, you will see a cookie banner
                allowing you to accept or reject non-essential cookies. You can
                change your preferences at any time by clicking the "Cookie
                Settings" link in our footer.
              </p>
            </CookieSection>

            <CookieSection title="Changes to This Policy">
              <p>
                We may update this Cookie Policy occasionally. Any changes will
                be posted on this page with an updated effective date.
              </p>
            </CookieSection>

            <CookieSection title="Contact Us">
              <p>
                If you have questions about our use of cookies, please contact
                us at:
                <br />
                <strong>Email:</strong> privacy@travelplanner.com
              </p>
            </CookieSection>
          </div>
        </div>
      </div>
    </>
  );
};

const CookieSection = ({
  icon,
  title,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border-b border-gray-100 pb-6 last:border-0">
    <div className="mb-3 flex items-center gap-2">
      {icon && <div className="text-primary">{icon}</div>}
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="prose prose-sm max-w-none text-gray-600">{children}</div>
  </div>
);

export default CookiePolicy;
