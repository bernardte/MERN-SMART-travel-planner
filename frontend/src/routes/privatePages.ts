import { lazy } from "react";

export const DashboardPage = lazy(
  () => import("@/pages/dashboard/DashboardPage"),
);
export const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"));
export const PostPage = lazy(() => import("@/pages/post/PostPage"));
export const SavedPostPage = lazy(
  () => import("@/pages/SavedPost/SavedPostPage"),
);
