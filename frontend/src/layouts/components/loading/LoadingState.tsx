// components/ui/loading-state.tsx
import { motion, type Variants } from "framer-motion";
import { LoadingPulse, LoadingWave, LoadingSpinner } from "@/components/ui/loading";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  /** 加载类型 */
  type?: "spinner" | "pulse" | "wave" | "dots";
  /** 加载文字 */
  text?: string;
  /** 是否全屏 */
  fullScreen?: boolean;
  /** 是否显示背景 */
  withBackground?: boolean;
  /** 自定义类名 */
  className?: string;
}

// 动画变体
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

const logoVariants: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      duration: 0.6,
    },
  },
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.2,
    },
  },
};

const dotsVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.5,
    },
  },
};

const dotVariants: Variants = {
  hidden: { y: 0, opacity: 0 },
  visible: {
    y: [0, -10, 0],
    opacity: 1,
    transition: {
      repeat: Infinity,
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};

// 完整加载页面组件
const LoadingState = ({
  type = "pulse",
  text = "Loading",
  fullScreen = true,
  withBackground = true,
  className,
}: LoadingStateProps) => {
  const content = (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        "flex flex-col items-center justify-center gap-6",
        fullScreen && "fixed inset-0 z-50",
        withBackground &&
          "bg-gradient-to-br from-slate-50 via-white to-blue-50",
        className,
      )}
    >
      {/* Logo / Icon */}
      <motion.div variants={logoVariants} className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
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
        {/* 装饰光环 */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -inset-4 rounded-full bg-blue-400 opacity-20 blur-xl"
        />
      </motion.div>

      {/* 加载动画 */}
      <motion.div variants={textVariants}>
        {type === "spinner" && <LoadingSpinner size="lg" color="primary" />}
        {type === "pulse" && <LoadingPulse size="lg" color="primary" />}
        {type === "wave" && <LoadingWave size="lg" color="primary" />}
        {type === "dots" && (
          <motion.div variants={dotsVariants} className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                variants={dotVariants}
                custom={i}
                className="h-3 w-3 rounded-full bg-blue-600"
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* 加载文字 */}
      <motion.div variants={textVariants} className="text-center">
        <p className="text-lg font-medium text-gray-700">{text}</p>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-1 text-sm text-gray-400"
        >
          Please wait while we prepare everything for you
        </motion.p>
      </motion.div>

      {/* 进度条 */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-gray-200"
      >
        <motion.div
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-full w-1/2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600"
        />
      </motion.div>
    </motion.div>
  );

  return content;
};

// 简化版 - 适用于小区域加载
const LoadingInline = ({ text = "Loading..." }: { text?: string }) => (
  <div className="flex items-center justify-center gap-3 p-4">
    <LoadingSpinner size="sm" color="primary" />
    <span className="text-sm text-gray-500">{text}</span>
  </div>
);

// 骨架屏 - 适用于内容区域
const LoadingSkeleton = () => (
  <div className="w-full animate-pulse space-y-4 p-6">
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded bg-gray-200" />
        <div className="h-3 w-1/4 rounded bg-gray-200" />
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 w-full rounded bg-gray-200" />
      <div className="h-4 w-5/6 rounded bg-gray-200" />
      <div className="h-4 w-4/6 rounded bg-gray-200" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="h-24 rounded-lg bg-gray-200" />
      <div className="h-24 rounded-lg bg-gray-200" />
    </div>
  </div>
);

// 卡片加载状态
const LoadingCard = () => (
  <div className="w-full max-w-md animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-gray-200" />
      <div className="flex-1">
        <div className="h-3 w-24 rounded bg-gray-200" />
        <div className="mt-1 h-2 w-16 rounded bg-gray-200" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full rounded bg-gray-200" />
      <div className="h-3 w-5/6 rounded bg-gray-200" />
      <div className="h-3 w-4/6 rounded bg-gray-200" />
    </div>
    <div className="mt-4 flex gap-2">
      <div className="h-8 w-20 rounded bg-gray-200" />
      <div className="h-8 w-20 rounded bg-gray-200" />
    </div>
  </div>
);

export {
  LoadingState,
  LoadingInline,
  LoadingSkeleton,
  LoadingCard,
  LoadingPulse,
  LoadingWave,
  LoadingSpinner,
};
