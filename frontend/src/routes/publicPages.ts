import { lazy } from "react";

export const LandingPage = lazy(() => import("@/pages/landing/LandingPage"));
export const AuthenticationPage = lazy(
  () => import("@/pages/authentication/AuthenticationPage"),
);
export const TravelCommunityGuidesPage = lazy(
  () => import("@/pages/community/CommunityPage"),
);

export const PrivacyPolicyPage = lazy(
  () => import("@/pages/privacyPolicyPage/PrivacyPolicyPage"),
);

export const TermOfServicePage = lazy(
  () => import("@/pages/termOfService/TermOfService"),
);

export const CookiePolicyPage = lazy(
  () => import("@/pages/cookiePolicyPage/CookiePolicyPage"),
);
