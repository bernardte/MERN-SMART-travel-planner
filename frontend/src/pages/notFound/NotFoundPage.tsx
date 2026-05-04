import { useNavigate } from "react-router-dom";
import {
  Home,
  Compass,
  MapPin,
  Plane,
  ArrowLeft,
  Sparkles,
  Globe,
  Navigation,
  Users,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/useAuthStore";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50/50">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-cyan-300/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-blue-300/20 to-transparent blur-3xl delay-1000" />
        <div className="animate-float absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-400/10 to-blue-400/10 blur-3xl" />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="animate-float-particle absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
            style={{
              width: Math.random() * 4 + 2 + "px",
              height: Math.random() * 4 + 2 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animationDelay: Math.random() * 5 + "s",
              animationDuration: Math.random() * 8 + 4 + "s",
              opacity: 0.3 + Math.random() * 0.5,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          {/* Animated 404 Number */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-32 w-32 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-2xl" />
            </div>
            <div className="relative flex items-baseline justify-center gap-2">
              <span className="animate-gradient bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-8xl font-bold text-transparent md:text-9xl">
                4
              </span>
              <div className="relative">
                <div className="animate-ping-slow absolute inset-0">
                  <Plane className="h-16 w-16 text-cyan-400 md:h-20 md:w-20" />
                </div>
                <Plane className="animate-float-plane relative h-16 w-16 text-cyan-500 md:h-20 md:w-20" />
              </div>
              <span className="animate-gradient animation-delay-200 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-8xl font-bold text-transparent md:text-9xl">
                4
              </span>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8 space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Oops! Page Not Found
            </h1>
            <p className="mx-auto max-w-md text-base text-gray-500 md:text-lg">
              The page you're looking for seems to have wandered off to explore
              another destination. Let's get you back on track!
            </p>
          </div>

          {/* Search Suggestions */}
          <div className="mb-12 rounded-2xl bg-white/60 p-6 shadow-lg backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Compass className="h-5 w-5 text-cyan-500" />
              <span className="text-sm font-medium text-gray-700">
                You might be looking for:
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Home className="h-4 w-4" />
                Home
              </button>
              {user && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
                >
                  <Globe className="h-4 w-4" />
                  Travel Guides
                </button>
              )}
              <button
                onClick={() => navigate("/community-guide")}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
              >
                <Users className="h-4 w-4" />
                Community
              </button>
              <button
                onClick={() => navigate("/favourite-post")}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
              >
                <Bookmark className="h-4 w-4" />
                Saved
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 px-8 py-3 py-5 text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-lg"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant={"default"}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-5 text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Navigation className="h-4 w-4" />
              Return Home
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>

          {/* Helpful Tip */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 p-4">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-cyan-500" />
              <span>
                💡 Tip: Check the URL for typos or use the navigation above to
                find your way!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute right-0 bottom-0 left-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-full md:h-24"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="url(#wave-gradient)"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-20px);
          }
        }

        @keyframes float-plane {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        @keyframes float-particle {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-plane {
          animation: float-plane 3s ease-in-out infinite;
        }

        .animate-float-particle {
          animation: float-particle linear infinite;
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }

        .animate-ping-slow {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;

