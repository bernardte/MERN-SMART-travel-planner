import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  BookMarked,
  ChevronDown,
  LogOut,
  Menu,
  UserCircle2,
  X,
} from "lucide-react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
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
import { getFilteredNavItems } from "@/lib/helpers/getFilterNavItems";

const preloadProfile = () => import("../pages/profile/ProfilePage");

const headerVariants: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/home";
  const user = useAuthStore((state) => state.user);
  const { handleLogout, isLoading: isLoggingOut } = useHandleLogout();
  const filteredNavItems = getFilteredNavItems(user);
  const displayName = user
    ? String(user.username || user.email || "Traveler")
    : "Traveler";
  const displayEmail = user ? String(user.email || "") : "";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  // Close menu when location changes (navigation)
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === "/" && ["/", "/home"].includes(location.pathname)) return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

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
            aria-label="Open user menu"
          >
            <div className="from-primary flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-300 to-cyan-500 text-xs font-semibold text-white shadow-md">
              {user?.profilePicture ? (
                <img
                  src={user?.profilePicture}
                  className="h-8 w-8 rounded-full object-cover"
                  alt=""
                />
              ) : (
                avatarInitial
              )}
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

  // Shared mobile menu content (used on both home and non‑home headers)
  const mobileMenuContent = (
    <nav className="flex flex-col space-y-1 px-4 pb-6" role="navigation">
      {/* User info section for mobile sidebar */}
      {user && (
        <div className="mb-4 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-300 to-cyan-500 text-sm font-semibold text-white shadow-md">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  className="h-10 w-10 rounded-full object-cover"
                  alt=""
                />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                {displayName}
              </p>
              {displayEmail && (
                <p className="text-xs text-gray-500">{displayEmail}</p>
              )}
            </div>
          </div>
        </div>
      )}
      {filteredNavItems.map((item) => (
        <Link
          key={item.label}
          to={item.link}
          onClick={() => setMobileMenuOpen(false)}
          className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${
            isActive(item.link)
              ? "bg-primary/15 text-primary"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {item.label}
        </Link>
      ))}
      {!user && (
        <>
          <Link
            to="/auth?mode=login"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Log In
          </Link>
          <Link
            to="/auth?mode=signup"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Sign Up
          </Link>
        </>
      )}
      {user && (
        <>
          <hr className="my-2 border-gray-200" />
          <Link
            to={`/profile/${user.username}`}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            <UserCircle2 className="h-5 w-5 text-blue-500" />
            Profile
          </Link>
          <Link
            to="/favourite-post"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            <BookMarked className="h-5 w-5 text-violet-500" />
            Favourites
          </Link>
          <button
            onClick={() => {
              void handleLogout();
              setMobileMenuOpen(false);
            }}
            disabled={isLoggingOut}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </>
      )}
    </nav>
  );

  // Mobile menu drawer component
  const MobileDrawer = () => (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer */}
          <motion.div
            ref={mobileMenuRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-xl md:hidden"
            role="dialog"
            aria-label="Mobile navigation menu"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <span className="text-lg font-bold text-gray-800">
                TravelBuddy
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="h-full overflow-y-auto pb-20">
              {mobileMenuContent}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Non‑home page header
  if (!isHome) {
    return (
      <>
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

            {/* Desktop nav */}
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

            {/* Right side */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="hidden md:block">{renderUserMenu(false)}</div>
              ) : (
                <div className="hidden items-center gap-3 md:flex">
                  <Link
                    to="/auth?mode=login"
                    className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/auth?mode=signup"
                    className="relative overflow-hidden rounded-full px-6 py-2.5 text-sm font-semibold transition-colors"
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
                </div>
              )}

              {/* Mobile menu button */}
              <button
                ref={menuButtonRef}
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none md:hidden"
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </motion.header>
        <MobileDrawer />
      </>
    );
  }

  // Home page header
  return (
    <>
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
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md">
                <span className="text-sm font-bold text-white">✈</span>
              </div>
              <span
                className={`hidden font-bold transition-colors sm:inline-block ${
                  isScrolled ? "text-gray-800" : "text-white"
                }`}
              >
                TravelBuddy
              </span>
            </Link>

            {/* Desktop nav */}
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
              <div className="hidden items-center gap-3 md:flex">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/auth?mode=login"
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
                    to="/auth?mode=signup"
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
              </div>
            ) : (
              <div className="hidden md:block">
                {renderUserMenu(!isScrolled)}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            ref={menuButtonRef}
            onClick={() => setMobileMenuOpen(true)}
            className={`rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none md:hidden ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </motion.header>
      <MobileDrawer />
    </>
  );
};

export default Navbar;
