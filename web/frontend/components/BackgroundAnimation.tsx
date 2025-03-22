"use client"

import React from "react";
import { motion } from "framer-motion";

const BackgroundAnimation: React.FC = () => {
  const circles = [
    { size: 1880, color: "bg-blue-600", opacity: 0.1, position: { top: "30%", left: "50%" } },
    //{ size: 1900, color: "bg-blue-600", opacity: 0.25, position: { top: "40%", left: "5%" } },
    { size: 1880, color: "bg-blue-600", opacity: 0.1, position: { top: "30%", left: "0%" } },
    { size: 1900, color: "bg-blue-600", opacity: 0.1, position: { top: "40%", left: "95%" } },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Wavy Patterns */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-lightblue-100 to-lightblue-300 opacity-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 30, ease: "easeInOut", loop: Infinity }} // Slow motion for wavy pattern
      />
      {/* Circles */}
      {circles.map((circle, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full ${circle.color} opacity-${circle.opacity * 100}`}
          style={{
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            top: circle.position.top, 
            left: circle.position.left,
          }}
          animate={{ scale: [1, 1.05, 1], opacity: [circle.opacity, circle.opacity + 0.1, circle.opacity] }}
          transition={{ duration: 4, ease: "easeInOut", loop: Infinity }}
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation; 