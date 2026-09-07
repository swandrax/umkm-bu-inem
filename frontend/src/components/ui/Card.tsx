import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-3xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-xs ${className}`}
    >
      {children}
    </div>
  );
};
