import useAuth from "@/hooks/useAuth";
import useAuthStore from "@/stores/useAuthStore"
import { LoadingState } from "@/layouts/components/loading/LoadingState";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectRoute = () => {
    const user = useAuthStore(state => state.user);
    const { isLoading } = useAuth();

    if (isLoading) {
        return <LoadingState />;
    }

    if(!user){
        return <Navigate to={"/auth"} replace />
    }

    return <Outlet />
}
