import React from "react";

const ToolbarButton = ({ onClick, isActive = false, children, title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`
      px-2 py-1 rounded border transition-all duration-200 text-xs font-medium
      hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100
      ${
        isActive
          ? "bg-blue-500 text-white border-blue-500 shadow-sm"
          : "bg-white text-gray-700 border-gray-300"
      }
    `}
  >
    {children}
  </button>
);

export default ToolbarButton;
