import { navigationItems } from "@/constants/landingPage";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  BookMarked,
  ChevronDown,
  LogOut,
  Menu,
  UserCircle2,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import useAuthStore from "@/stores/useAuthStore";
import useHandleLogout from "@/hooks/useHandlingLogout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
const preloadProfile = () => import("../pages/profile/ProfilePage");

const headerVariants: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const itemVariants: Variants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/home";
  const user = useAuthStore((state) => state.user);
  const { handleLogout, isLoading: isLoggingOut } = useHandleLogout();
  const displayName = user
    ? String(user.username || user.email || "Traveler")
    : "Traveler";
  const displayEmail = user ? String(user.email || "") : "";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll(); //! after switching from new page back to current page this will trigger again.

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === "/" && ["/", "/home"].includes(location.pathname)) return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const filteredNavItems = navigationItems.filter((item) => {
    if (item.link === "/dashboard") {
      return !!user; // only show if logged in
    }

    return true;
  });

  const renderUserMenu = (isTransparentMode: boolean) => {
    if (!user) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`group flex items-center gap-2 rounded-full px-2.5 py-1.5 text-sm font-medium ring-1 transition-all duration-300 ${
              isTransparentMode
                ? "bg-white/15 text-white ring-white/30 hover:bg-white/25"
                : "bg-white text-gray-700 shadow-sm ring-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="from-primary flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-300 to-cyan-500 text-xs font-semibold text-white shadow-md">
              {user?.profilePicture ? user?.profilePicture : avatarInitial}
            </div>
            <div className="hidden max-w-24 text-left sm:block">
              <p className="truncate text-sm leading-tight">{displayName}</p>
              <p
                className={`truncate text-xs ${
                  isTransparentMode ? "text-white/80" : "text-gray-500"
                }`}
              >
                My Account
              </p>
            </div>
            <ChevronDown className="h-4 w-4 opacity-80" />
          </motion.button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-64 rounded-2xl border border-gray-100 bg-white/95 p-2 shadow-xl backdrop-blur-xl"
        >
          <DropdownMenuLabel className="px-3 pb-2">
            <p className="text-[11px] font-medium tracking-[0.16em] text-gray-400 uppercase">
              Signed in as
            </p>
            <p className="truncate text-sm font-semibold text-gray-900">
              {displayName}
            </p>
            {displayEmail && (
              <p className="truncate text-xs text-gray-500">{displayEmail}</p>
            )}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild className="rounded-xl px-3 py-2">
            <Link
              to={`/profile/${user.username}`}
              className="flex items-center gap-2"
              onMouseEnter={preloadProfile}
            >
              <UserCircle2 className="h-4 w-4 text-blue-500" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="rounded-xl px-3 py-2">
            <Link to="/favourite-post" className="flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-violet-500" />
              <span>Favourites</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            disabled={isLoggingOut}
            className="rounded-xl px-3 py-2"
            onSelect={(event) => {
              event.preventDefault();
              void handleLogout();
            }}
          >
            <LogOut className="h-4 w-4" />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Non-home page (Dashboard and other pages)
  if (!isHome) {
    return (
      <motion.header
        key="non-home-navbar"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/60 shadow-lg backdrop-blur-xl transition-all duration-300"
      >
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md">
              <span className="text-sm font-bold text-white">✈</span>
            </div>

            <span
              className={`hidden font-bold transition-colors sm:inline-block ${
                isScrolled ? "text-gray-800" : "text-gray-900"
              }`}
            >
              TravelBuddy
            </span>
          </Link>

          {/* Nav Items */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
            <div className="flex items-center gap-1">
              {filteredNavItems.map((item) => (
                <motion.div
                  key={item.label}
                  whileHover="hover"
                  variants={itemVariants}
                >
                  <Link
                    to={item.link}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive(item.link)
                        ? "bg-primary/15 text-primary shadow-sm"
                        : isScrolled
                          ? "hover:text-primary text-gray-700 hover:bg-white/50"
                          : "hover:text-primary text-gray-800 hover:bg-white/50"
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>

                    {isActive(item.link) && (
                      <motion.span
                        layoutId="activeTab"
                        className="bg-primary/10 absolute inset-0 rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              renderUserMenu(false)
            ) : (
              <Link
                to="/auth?mode=login"
                className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg hover:shadow-blue-500/25"
              >
                Log In
              </Link>
            )}

            {/* Mobile Menu */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="rounded-lg p-2 text-gray-700 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>
    );
  }

  // Landing page (Home)
  return (
    <motion.header
      key="home-navbar"
      initial={false}
      animate={{
        backgroundColor: isScrolled
          ? "rgba(255,255,255,0.85)"
          : "rgba(255,255,255,0)",
        backdropFilter: isScrolled ? "blur(20px)" : "blur(0px)",
        boxShadow: isScrolled
          ? "0 4px 20px rgba(0,0,0,0.06)"
          : "0 0 0 rgba(0,0,0,0)",
        borderBottomColor: isScrolled
          ? "rgba(229,231,235,0.8)"
          : "rgba(255,255,255,0)",
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-0 z-50 w-full border-b"
    >
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex flex-1">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md">
              <span className="text-sm font-bold text-white">✈</span>
            </div>
            <span
              className={`hidden font-bold transition-colors sm:inline-block ${
                isScrolled ? "text-gray-800" : "text-white"
              }`}
            >
              {" "}
              TravelBuddy
            </span>
          </Link>

          {/* Menu */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
            <div className="flex gap-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.link}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    isActive(item.link)
                      ? isScrolled
                        ? "bg-blue-50 text-blue-600"
                        : "bg-white/20 text-white"
                      : isScrolled
                        ? "text-gray-700 hover:bg-gray-300/40"
                        : "text-white hover:bg-white/15"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={"/auth?mode=login"}
                  className="relative overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <span className="relative z-10">Log In</span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={"/auth?mode=signup"}
                  className={`relative overflow-hidden rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
                    isScrolled ? "text-gray-700" : "text-white"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1">
                    Sign Up
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    >
                      →
                    </motion.span>
                  </span>
                </Link>
              </motion.div>
            </>
          ) : (
            renderUserMenu(!isScrolled)
          )}
        </div>

        {/* Right */}
        <Menu
          className={`h-5 w-5 md:hidden ${
            isScrolled ? "text-gray-700" : "text-white"
          }`}
        />
      </div>
    </motion.header>
  );
};

export default Navbar;
