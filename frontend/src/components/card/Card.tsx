import type { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  gradient: string; // 用于图标背景的渐变色
}

const StatsCard = ({ title, value, icon, gradient }: StatsCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      {/* 装饰性渐变光晕（鼠标悬停时可见） */}
      <div
        className={`absolute -top-8 -right-8 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            {title}
          </p>
          <h3 className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900">
            {value.toLocaleString()}
          </h3>
        </div>

        {/* 图标容器：带渐变背景和柔和阴影 */}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-md transition-transform duration-300 group-hover:scale-110`}
        >
          <div className="h-5 w-5 text-white">{icon}</div>
        </div>
      </div>

      {/* 底部微装饰线 */}
      <div
        className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${gradient} transition-all duration-500 group-hover:w-full`}
      />
    </div>
  );
};

export default StatsCard;
