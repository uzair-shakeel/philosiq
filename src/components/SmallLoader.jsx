import React from "react";

export default function SmallLoader({ size = 40, className = "" }) {
  const dimension = typeof size === "number" ? `${size}px` : size;
  return (
    <div className={`inline-flex items-center justify-center ${className}`} style={{ width: dimension, height: dimension }}>
      <video
        src="/Loading.mp4"
        width={dimension}
        height={dimension}
        autoPlay
        loop
        muted
        playsInline
        aria-label="Loading"
        onError={(e) => {
          // Fallback: simple CSS spinner if video fails
          const container = e.currentTarget?.parentElement;
          if (container) {
            const fallback = document.createElement("div");
            fallback.style.width = dimension;
            fallback.style.height = dimension;
            fallback.style.border = "3px solid rgba(0,0,0,0.1)";
            fallback.style.borderTop = "3px solid #7f1d1d"; // primary maroon
            fallback.style.borderRadius = "50%";
            fallback.style.animation = "smallspin 0.8s linear infinite";
            container.innerHTML = "";
            container.appendChild(fallback);
            const style = document.createElement("style");
            style.innerHTML = `@keyframes smallspin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`;
            document.head.appendChild(style);
          }
        }}
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}
