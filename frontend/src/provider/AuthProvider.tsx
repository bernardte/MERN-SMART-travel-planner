import { getLoginUserApi } from "@/api/auth.api";
import useAuthStore from "@/stores/useAuthStore";
import useFollowStore from "@/stores/useFollowStore";
import { createContext, useEffect, useRef, useState } from "react";

interface AuthContextType {
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isRun = useRef(false);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const response = await getLoginUserApi();
        const authUser = response?.data?.data?.user;
        if (!authUser) {
          throw new Error("User not found");
        }
        setUser(authUser);
        const map: Record<string, boolean> = {};
        authUser.following?.forEach((id: string) => {
          map[id] = true;
        });

        useFollowStore.getState().setFollowingMap(map);
      } catch (error: unknown) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
