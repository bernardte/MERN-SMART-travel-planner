import { motion } from "framer-motion";
import AuthForm from "../../layouts/components/auth/AuthForm";
import type { Variants } from "framer-motion";

// Animation variant
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const leftVariants: Variants = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

const rightVariants: Variants = {
  hidden: { x: 60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

const AuthenticationPage = () => {
  return (
    <div className="from--100 flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br to-blue-100 p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid h-[90vh] w-full max-w-6xl grid-cols-1 overflow-hidden rounded-3xl bg-gradient-to-b from-amber-50 via-white to-slate-50 shadow-2xl md:grid-cols-2"
      >
        {/* Left side - Auth Form */}
        <motion.div
          variants={leftVariants}
          className="flex h-full w-full items-center justify-center bg-linear-to-b from-blue-100 via-white to-cyan-50 p-6"
        >
          <div className="w-full max-w-md">
            <AuthForm />
          </div>
        </motion.div>

        {/* right side - Auth Form */}
        <motion.div
          variants={rightVariants}
          className="relative hidden h-full w-full flex-col bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-800 md:flex"
        >
          {/* Glow effects */}
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          {/* Content */}
          <div className="relative flex h-full w-full flex-col items-center justify-center px-10 text-center text-white">
            {/* Icon */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h2 className="text-4xl font-bold">Smart Travel Planner</h2>

            <p className="mt-3 text-white/80">Your travel companion</p>

            {/* Quote */}
            <p className="mt-8 max-w-md text-sm leading-relaxed text-white/90">
              “Plan trips smarter, faster, and easier with suggestions tailored
              just for you.”
            </p>

            {/* Stats */}
            <div className="mt-10 flex gap-10">
              <div>
                <p className="text-2xl font-bold">10K+</p>
                <p className="text-xs text-white/70">Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold">50+</p>
                <p className="text-xs text-white/70">Destinations</p>
              </div>
              <div>
                <p className="text-2xl font-bold">4.9</p>
                <p className="text-xs text-white/70">Rating</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthenticationPage;
