import { Helmet } from "react-helmet-async";
import {
  FileText,
  Scale,
  AlertCircle,
  UserCheck,
  Ban,
  Clock,
} from "lucide-react";

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Travel Planner</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Terms of Service
            </h1>
            <p className="mt-2 text-gray-500">
              Effective date: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8 rounded-2xl bg-white p-6 shadow-md sm:p-8">
            <LegalSection
              icon={<Scale className="h-5 w-5" />}
              title="Acceptance of Terms"
            >
              <p>
                By accessing or using Travel Planner ("the Service"), you agree
                to be bound by these Terms of Service. If you do not agree,
                please do not use the Service.
              </p>
            </LegalSection>

            <LegalSection
              icon={<UserCheck className="h-5 w-5" />}
              title="Eligibility & Account Responsibility"
            >
              <p>
                You must be at least 13 years old to use this Service. You are
                responsible for:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>
                  Maintaining the confidentiality of your account credentials
                </li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </LegalSection>

            <LegalSection
              icon={<AlertCircle className="h-5 w-5" />}
              title="User Conduct & Prohibited Activities"
            >
              <p>You agree not to:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Post false, misleading, or fraudulent content</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Upload malware, viruses, or harmful code</li>
                <li>Attempt to gain unauthorized access to other accounts</li>
                <li>Use the Service for any illegal purpose</li>
                <li>Harass, abuse, or harm others</li>
              </ul>
            </LegalSection>

            <LegalSection
              icon={<Clock className="h-5 w-5" />}
              title="Content Ownership & License"
            >
              <p>
                You retain ownership of content you create (e.g., travel guides,
                reviews). By posting, you grant us a worldwide, royalty-free
                license to host, use, display, and distribute your content as
                necessary to operate the Service.
              </p>
              <p className="mt-2">
                Our platform content (logos, design, code) is owned by Travel
                Planner and protected by copyright laws.
              </p>
            </LegalSection>

            <LegalSection title="Trip Planning & Third-Party Services">
              <p>
                The Service provides tools for planning trips. We are not
                responsible for actual travel arrangements, bookings, or any
                third-party services you may use. Your interactions with third
                parties (hotels, flights, etc.) are governed by their own terms.
              </p>
            </LegalSection>

            <LegalSection title="Disclaimer of Warranties">
              <p>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT
                WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR
                SECURE.
              </p>
            </LegalSection>

            <LegalSection title="Limitation of Liability">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRAVEL PLANNER SHALL NOT
                BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
              </p>
            </LegalSection>

            <LegalSection title="Termination">
              <p>
                We may suspend or terminate your account at our sole discretion,
                without notice, for conduct that violates these Terms or is
                harmful to other users. You may delete your account at any time.
              </p>
            </LegalSection>

            <LegalSection title="Governing Law">
              <p>
                These Terms shall be governed by the laws of [Your
                State/Country], without regard to conflict of law principles.
                Any disputes shall be resolved in the courts of [Your City].
              </p>
            </LegalSection>

            <LegalSection title="Changes to Terms">
              <p>
                We may update these Terms from time to time. Continued use of
                the Service after changes constitutes acceptance of the new
                Terms.
              </p>
            </LegalSection>

            <LegalSection title="Contact">
              <p>
                Questions about these Terms? Contact us at{" "}
                <strong>legal@travelplanner.com</strong>
              </p>
            </LegalSection>
          </div>
        </div>
      </div>
    </>
  );
};

const LegalSection = ({
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

export default TermsOfService;
