// components/ui/loading.tsx
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface LoadingProps {
  /** 加载状态 */
  loading?: boolean;
  /** 尺寸大小 */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** 颜色主题 */
  color?: "default" | "primary" | "white" | "success" | "danger";
  /** 加载文字 */
  text?: string;
  /** 是否全屏 */
  fullScreen?: boolean;
  /** 是否覆盖层模式 */
  overlay?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 子元素（覆盖层模式下需要） */
  children?: React.ReactNode;
  /** 加载动画类型 */
  type?: "spinner" | "dots" | "pulse" | "wave";
}

const sizeClasses = {
  xs: "h-3 w-3 border-[1.5px]",
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-3",
  xl: "h-12 w-12 border-4",
};

const colorClasses = {
  default: "border-gray-200 border-t-gray-600",
  primary: "border-blue-200 border-t-blue-600",
  white: "border-white/30 border-t-white",
  success: "border-green-200 border-t-green-600",
  danger: "border-red-200 border-t-red-600",
};

// Spinner 动画
const Spinner = ({
  size,
  color,
}: {
  size: keyof typeof sizeClasses;
  color: keyof typeof colorClasses;
}) => (
  <div
    className={cn(
      "animate-spin rounded-full",
      sizeClasses[size],
      colorClasses[color],
    )}
  />
);

// Dots 动画
const Dots = ({ color }: { color: keyof typeof colorClasses }) => (
  <div className="flex items-center gap-1">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className={cn(
          "h-2 w-2 animate-bounce rounded-full",
          color === "white" ? "bg-white" : "bg-blue-600",
        )}
        style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.6s" }}
      />
    ))}
  </div>
);

// Pulse 动画
const Pulse = ({ color }: { color: keyof typeof colorClasses }) => (
  <div className="relative">
    <div
      className={cn(
        "h-6 w-6 animate-ping rounded-full opacity-75",
        color === "white" ? "bg-white" : "bg-blue-600",
      )}
    />
    <div
      className={cn(
        "absolute inset-0 h-6 w-6 rounded-full",
        color === "white" ? "bg-white" : "bg-blue-600",
      )}
    />
  </div>
);

// Wave 动画
const Wave = ({ color }: { color: keyof typeof colorClasses }) => (
  <div className="flex items-center gap-[3px]">
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        className={cn(
          "animate-wave w-1 rounded-full",
          color === "white" ? "bg-white" : "bg-blue-600",
        )}
        style={{
          height: "12px",
          animationDelay: `${i * 0.1}s`,
          animationDuration: "0.8s",
        }}
      />
    ))}
  </div>
);

// 添加 wave 动画到全局 CSS 或 tailwind.config.js
// 如果不想配置，可以使用内联样式
const waveStyle = `
@keyframes wave {
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1); }
}
.animate-wave {
  animation: wave 0.8s ease-in-out infinite;
}
`;

// 主组件
const Loading = forwardRef<HTMLDivElement, LoadingProps>(
  (
    {
      loading = true,
      size = "md",
      color = "primary",
      text,
      fullScreen = false,
      overlay = false,
      className,
      children,
      type = "spinner",
    },
    ref,
  ) => {
    // 注入动画样式（仅一次）
    if (
      typeof document !== "undefined" &&
      !document.querySelector("#loading-styles")
    ) {
      const style = document.createElement("style");
      style.id = "loading-styles";
      style.textContent = waveStyle;
      document.head.appendChild(style);
    }

    const renderLoader = () => {
      switch (type) {
        case "dots":
          return <Dots color={color} />;
        case "pulse":
          return <Pulse color={color} />;
        case "wave":
          return <Wave color={color} />;
        default:
          return <Spinner size={size} color={color} />;
      }
    };

    const loaderContent = (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-3",
          fullScreen && "fixed inset-0 z-50",
          overlay && "absolute inset-0 z-10",
          !fullScreen && !overlay && "relative",
          className,
        )}
      >
        {renderLoader()}
        {text && (
          <p
            className={cn(
              "text-sm font-medium",
              color === "white" ? "text-white" : "text-gray-600",
            )}
          >
            {text}
          </p>
        )}
      </div>
    );

    // 不显示加载状态时，直接返回子元素
    if (!loading) {
      return children ? <>{children}</> : null;
    }

    // 覆盖层模式
    if (overlay && children) {
      return (
        <div className="relative">
          {children}
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm">
            {loaderContent}
          </div>
        </div>
      );
    }

    // 全屏模式
    if (fullScreen) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          {loaderContent}
        </div>
      );
    }

    // 普通模式
    return loaderContent;
  },
);

Loading.displayName = "Loading";

// 便捷组件
export const LoadingSpinner = (props: Omit<LoadingProps, "type">) => (
  <Loading {...props} type="spinner" />
);

export const LoadingDots = (props: Omit<LoadingProps, "type">) => (
  <Loading {...props} type="dots" />
);

export const LoadingPulse = (props: Omit<LoadingProps, "type">) => (
  <Loading {...props} type="pulse" />
);

export const LoadingWave = (props: Omit<LoadingProps, "type">) => (
  <Loading {...props} type="wave" />
);

export default Loading;
