"use client";

import React, { JSX, useEffect, useState } from "react";

export default function Particles() {
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const arr = [...Array(15)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-white rounded-full opacity-10 animate-bounce"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }}
      />
    ));
    setParticles(arr);
  }, []);

  return <>{particles}</>;
}
