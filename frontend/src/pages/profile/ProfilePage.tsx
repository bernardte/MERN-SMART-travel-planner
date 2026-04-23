import useAuthStore from "@/stores/useAuthStore";
import { AtSign, Mail, Sparkles, UserCircle2 } from "lucide-react";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const displayName = user
    ? String(user.name || user.username || "Traveler")
    : "Traveler";
  const username = user ? String(user.username || "traveler") : "traveler";
  const email = user ? String(user.email || "No email provided") : "";

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-24 pb-14">
      <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-white/90 p-6 shadow-xl ring-1 ring-gray-100 backdrop-blur-xl md:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">
                User Profile
              </p>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">
                {displayName}
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Manage your account details and travel identity.
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
              <span className="text-xl font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-gray-500">
                <UserCircle2 className="h-4 w-4" />
                <p className="text-xs font-semibold tracking-wide uppercase">
                  Full Name
                </p>
              </div>
              <p className="text-lg font-semibold text-gray-900">{displayName}</p>
            </article>

            <article className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-gray-500">
                <AtSign className="h-4 w-4" />
                <p className="text-xs font-semibold tracking-wide uppercase">
                  Username
                </p>
              </div>
              <p className="text-lg font-semibold text-gray-900">@{username}</p>
            </article>

            <article className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm md:col-span-2">
              <div className="mb-3 flex items-center gap-2 text-gray-500">
                <Mail className="h-4 w-4" />
                <p className="text-xs font-semibold tracking-wide uppercase">
                  Email Address
                </p>
              </div>
              <p className="text-lg font-semibold text-gray-900">{email}</p>
            </article>
          </div>

          <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <p className="text-sm font-semibold">Profile looks great</p>
            </div>
            <p className="mt-2 text-sm text-white/85">
              Keep your profile details up to date for a more personalized
              TravelBuddy experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
