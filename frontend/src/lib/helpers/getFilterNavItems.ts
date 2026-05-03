import { navigationItems } from "@/constants/landingPage";
import type { User } from "@/types/interface.type";

export const getFilteredNavItems = (user: User | null) => {
  return navigationItems.filter((item) => {
    if (item.link === "/dashboard") {
      return !!user;
    }

    return true;
  });
};
 

