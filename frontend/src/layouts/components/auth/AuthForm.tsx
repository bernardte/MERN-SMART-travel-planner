import { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ResetPasswordForm from "./ResetPasswordForm";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

const buttonVariants: Variants = {
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.98 },
};

export type mode = "login" | "signup" | "reset";

const AuthForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlMode = searchParams.get("mode") as mode | null;
  const [mode, setMode] = useState<mode>(urlMode ?? "login");

  useEffect(() => {
    if (urlMode) {
      setMode(urlMode as mode);
    }
  }, [urlMode]);

  const handleModeChange = (newMode: mode) => {
    setMode(newMode);
    setSearchParams({ mode: newMode });
  };

  return (
    <>
      {mode === "reset" && (
        <Button
          variant="link"
          className="mb-4 -ml-2 h-auto p-0 text-sm hover:text-blue-600 hover:no-underline"
          onClick={() => handleModeChange("login")}
        >
          ← Back to Sign In
        </Button>
      )}
      {mode === "login" && (
        <Link
          to={"/home"}
          className="absolute -top-10 left-0 mb-4 -ml-2 p-0 text-sm text-blue-800 hover:text-blue-600 hover:no-underline"
        >
          ← Back to homepage
        </Link>
      )}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            {mode === "login" && (
              <>
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-blue-600">
                    Welcome Back
                  </h1>
                  <p className="mt-2 text-sm text-gray-500">
                    Sign in to continue your journey
                  </p>
                </div>
                <LoginForm />
                <div className="space-y-3">
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="text-center"
                  >
                    <Button
                      variant="link"
                      className="group h-auto p-0 text-sm font-medium text-blue-600 hover:text-blue-700"
                      onClick={() => handleModeChange("signup")}
                    >
                      Don't have an account?&nbsp;Sign Up Now
                    </Button>
                  </motion.div>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="text-center"
                  >
                    <Button
                      variant="link"
                      className="h-auto p-0 text-sm text-gray-500 hover:text-blue-700"
                      onClick={() => handleModeChange("reset")}
                    >
                      Forgot password?
                    </Button>
                  </motion.div>
                </div>
              </>
            )}

            {mode === "signup" && (
              <div>
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-blue-600">
                    Create Account
                  </h1>
                  <p className="mt-2 text-sm text-gray-500">
                    Join thousands of happy travelers
                  </p>
                </div>
                <SignupForm setMode={setMode} />
                <div className="-space-y-2 text-center md:-space-y-1">
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      variant="link"
                      className="h-auto p-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                      onClick={() => handleModeChange("login")}
                    >
                      Already have an account?&nbsp;Sign In Now
                    </Button>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center text-xs text-gray-400"
                  >
                    By creating an account, you agree to our{" "}
                    <Link
                      to="/terms"
                      className="font-medium text-blue-600 underline-offset-4 hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="font-medium text-blue-600 underline-offset-4 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </motion.p>
                </div>
              </div>
            )}

            {mode === "reset" && (
              <>
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-blue-600">
                    Reset Password
                  </h1>
                  <p className="mt-2 text-sm text-gray-500">
                    Enter your email to receive a reset link
                  </p>
                </div>
                <ResetPasswordForm />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default AuthForm;
