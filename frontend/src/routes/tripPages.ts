import { lazy } from "react";

export const PlanNewTripPage = lazy(
  () => import("@/pages/planNewTrip/planNewTripPage"),
);
export const ViewTripPage = lazy(
  () => import("@/pages/planNewTrip/viewTripPage"),
);
export const EditTripPage = lazy(
  () => import("@/pages/planNewTrip/editTripPage"),
);

export const TripPlan = lazy(() => import("@/pages/tripPlan/TripPlanPage"));
export const TravelGuideFeed = lazy(
  () => import("@/pages/travelGuideFeed/TravelGuideFeed"),
);
export const EditTripPlanPage = lazy(
  () => import("@/pages/tripPlan/editTripPlanPage"),
);
