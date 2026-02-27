"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const HEARTS = ["💕", "🌸", "💗", "✨", "🌺", "💖", "🌷", "💝", "🎀", "🌹"];

interface FloatingHeartsProps {
  count?: number;
}

export default function FloatingHearts({ count = 16 }: FloatingHeartsProps) {
  const hearts = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: HEARTS[i % HEARTS.length],
      left: `${(i * (100 / count) + Math.random() * 5) % 95}%`,
      duration: 10 + Math.random() * 10,
      delay: Math.random() * 10,
      size: 0.8 + Math.random() * 1.5,
      startX: (Math.random() - 0.5) * 50,
    }));
  }, [count]);

  return (
    <div className="hearts-bg" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          initial={{ y: "110vh", opacity: 0, x: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.7, 0.7, 0],
            x: [0, h.startX, -h.startX, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: h.duration,
            repeat: Infinity,
            delay: h.delay,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: h.left,
            fontSize: `${h.size}rem`,
            filter: "drop-shadow(0 0 10px rgba(255,182,193,0.3))",
            willChange: "transform, opacity",
          }}
        >
          {h.emoji}
        </motion.span>
      ))}
    </div>
  );
}
