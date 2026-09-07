import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "neutral" | "primary";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
}) => {
  const variantStyles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    neutral: "bg-stone-100 text-stone-700 border-stone-200",
    primary: "bg-orange-50 text-orange-700 border-orange-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
};
