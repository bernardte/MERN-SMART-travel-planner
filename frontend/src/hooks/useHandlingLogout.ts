import { useNavigate } from "react-router-dom";
import useToast from "./useToast";
import useAuthStore from "@/stores/useAuthStore";
import { useState } from "react";
import { logoutApi } from "@/api/auth.api";


const useHandleLogout = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const logout = useAuthStore((state) => state.logout);
    const { showToast } = useToast();
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        setIsLoading(true);

        try {
            await logoutApi();
            showToast("success", "Logout successfully!");
            logout();
            navigate("/auth?mode=login");
        } catch (error: any) {
            showToast("error", `${error?.response?.data?.error}`);
        }finally{
            setIsLoading(false);
        }
    }

    return { handleLogout, isLoading };
}

export default useHandleLogout;