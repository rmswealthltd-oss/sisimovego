import React from "react";
import { cn } from "../lib/ui";

export interface TagProps {
  children: React.ReactNode;
  color?:
    | "gray"
    | "green"
    | "red"
    | "yellow"
    | "blue"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "default";
}

export function Tag({ children, color = "gray" }: TagProps) {
  const colorMap: Record<string, string> = {
    gray: "bg-gray-200 text-gray-700",
    green: "bg-green-200 text-green-700",
    red: "bg-red-200 text-red-700",
    yellow: "bg-yellow-200 text-yellow-800",
    blue: "bg-blue-200 text-blue-700",
    success: "bg-green-200 text-green-700",
    danger: "bg-red-200 text-red-700",
    warning: "bg-yellow-200 text-yellow-800",
    info: "bg-blue-200 text-blue-700",
    default: "bg-gray-200 text-gray-700",
  };

  return (
    <span className={cn("px-2 py-1 text-xs rounded-lg font-medium", colorMap[color])}>
      {children}
    </span>
  );
}

export default Tag;
