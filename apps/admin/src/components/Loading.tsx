import React from "react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center py-10" role="status">
      <div className="
        animate-spin 
        h-8 w-8 
        rounded-full 
        border-2 
        border-gray-300 
        dark:border-gray-600 
        border-t-transparent
      " />
    </div>
  );
}
