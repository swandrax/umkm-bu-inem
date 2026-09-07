import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-98 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-xs sm:text-sm gap-2",
    lg: "px-5 py-2.5 text-sm sm:text-base gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 focus:ring-amber-500",
    secondary:
      "bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200 hover:text-stone-900 focus:ring-stone-400",
    danger:
      "bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus:ring-rose-500",
    outline:
      "border border-stone-300 bg-white text-stone-700 hover:border-amber-500 hover:text-amber-600 focus:ring-amber-500",
    ghost:
      "text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus:ring-stone-400",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
};
