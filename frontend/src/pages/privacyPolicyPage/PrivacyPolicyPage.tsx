import { Helmet } from "react-helmet-async";
import { Shield, Eye, Database, Mail, Lock, Globe } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Travel Planner</title>
        <meta
          name="description"
          content="Privacy Policy for Travel Planner App"
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-2 text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Content Card */}
          <div className="space-y-8 rounded-2xl bg-white p-6 shadow-md sm:p-8">
            <Section
              icon={<Eye className="h-5 w-5" />}
              title="Information We Collect"
            >
              <p>
                We collect information you provide directly to us, such as when
                you create an account, plan trips, or communicate with us. This
                may include:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
                <li>Name, email address, and profile information</li>
                <li>Trip details, destinations, dates, and preferences</li>
                <li>User-generated content like travel guides and reviews</li>
                <li>
                  Payment information (processed securely by third parties)
                </li>
              </ul>
            </Section>

            <Section
              icon={<Database className="h-5 w-5" />}
              title="How We Use Your Information"
            >
              <ul className="list-inside list-disc space-y-1 text-gray-600">
                <li>Provide, maintain, and improve our services</li>
                <li>Personalize your experience and recommend trips</li>
                <li>Communicate with you about updates and promotions</li>
                <li>Analyze usage patterns to enhance features</li>
                <li>Ensure safety and prevent fraud</li>
              </ul>
            </Section>

            <Section
              icon={<Globe className="h-5 w-5" />}
              title="Sharing of Information"
            >
              <p>
                We do not sell your personal data. We may share information:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
                <li>With your consent or at your direction</li>
                <li>With service providers who assist our operations</li>
                <li>To comply with legal obligations</li>
                <li>
                  In connection with a business transfer (merger, acquisition)
                </li>
              </ul>
            </Section>

            <Section icon={<Lock className="h-5 w-5" />} title="Data Security">
              <p>
                We implement industry-standard security measures including
                encryption, access controls, and regular audits. However, no
                method of transmission over the Internet is 100% secure.
              </p>
            </Section>

            <Section icon={<Mail className="h-5 w-5" />} title="Your Rights">
              <p>Depending on your location, you may have rights to:</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
                <li>Access, correct, or delete your personal data</li>
                <li>Object to or restrict certain processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="mt-2 text-sm text-gray-500">
                To exercise these rights, contact us at{" "}
                <strong>privacy@travelplanner.com</strong>
              </p>
            </Section>

            <Section title="Children's Privacy">
              <p>
                Our service is not directed to children under 13. We do not
                knowingly collect personal information from children. If you
                believe a child has provided us with data, please contact us.
              </p>
            </Section>

            <Section title="Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the "Last updated" date.
              </p>
            </Section>

            <Section title="Contact Us">
              <p>
                If you have questions about this Privacy Policy, please contact
                us at:
                <br />
                <strong>Email:</strong> privacy@travelplanner.com
                <br />
                <strong>Address:</strong> 123 Travel Street, Suite 400,
                Adventure City, AC 12345
              </p>
            </Section>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper component for consistent sections
const Section = ({
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

export default PrivacyPolicy;
