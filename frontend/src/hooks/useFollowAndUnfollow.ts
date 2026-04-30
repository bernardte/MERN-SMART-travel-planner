import { useEffect, useState } from "react";
import useToast from "./useToast";
import useAuthStore from "@/stores/useAuthStore";
import type { User } from "@/types/interface.type";
import { followAndUnfollowUserApi } from "@/api/user.api";

const useFollowUnfollow = (user: User | null) => {
  const currentUser = useAuthStore((state) => state.user);

  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  const { showToast } = useToast();

  // ✅ 同步 user 变化
  useEffect(() => {
    if (!user) return;

    setFollowing(user.followers?.includes(currentUser?._id || ""));

    setFollowerCount(user.followers?.length || 0);
  }, [user, currentUser]);

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast("info", "Please login first");
      return;
    }

    if (!user) return;

    setLoading(true);

    try {
      const res = await followAndUnfollowUserApi(user._id);

      setFollowing(res.isFollowing);
      setFollowerCount(res.followersCount);

      showToast(
        "success",
        res.isFollowing ? `Followed ${user.name}` : `Unfollowed ${user.name}`,
      );
    } catch (err: any) {
      showToast("error", "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return { following, loading, handleFollowUnfollow, followerCount };
};

export default useFollowUnfollow;
