import React from "react";

function Button({ children, type = "button", className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-colors ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
