import { lazy } from "react";

export const LandingPage = lazy(() => import("@/pages/landing/LandingPage"));
export const AuthenticationPage = lazy(
  () => import("@/pages/authentication/AuthenticationPage"),
);
export const TravelCommunityGuidesPage = lazy(
  () => import("@/pages/community/CommunityPage"),
);
