import React from "react";

export default function SmallLoader({ className = "" }) {
  const dimension = "180px"; 
  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      <img
        src="/Loading.gif"
        width={dimension}
        height={dimension}
        alt="Loading"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}
