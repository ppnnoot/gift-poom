"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import Image from "next/image";

const BGC_IMAGES = [
  "/bgc/InShot_20260227_144929193.png",
  "/bgc/InShot_20260227_145053581.png",
  "/bgc/InShot_20260227_145146112.png",
  "/bgc/InShot_20260227_145307435.png",
  "/bgc/InShot_20260227_145400293.png",
  "/bgc/InShot_20260227_145508416.png",
];

interface ScatteredImagesProps {
  count?: number;
  opacity?: number;
  blur?: string;
  isCenter?: boolean;
}

export default function ScatteredImages({ 
  count = 8, 
  opacity,
  blur = "0.5px",
  isCenter = false
}: ScatteredImagesProps) {
  const scattered = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      let leftPos;
      if (isCenter) {
        // Distribute across the middle section (20-80%)
        leftPos = 15 + Math.random() * 70;
      } else {
        // Favoring left (0-20%) or right (80-100%)
        const isLeft = Math.random() > 0.5;
        leftPos = isLeft 
          ? Math.random() * 20 
          : 80 + Math.random() * 20;
      }

      return {
        id: i,
        src: BGC_IMAGES[i % BGC_IMAGES.length],
        top: `${Math.random() * 90 + 5}%`,
        left: `${leftPos}%`,
        rotate: (Math.random() - 0.5) * 60,
        scale: 0.5 + Math.random() * 0.5,
        duration: 12 + Math.random() * 12,
        delay: Math.random() * -15,
        opacity: opacity ?? (0.3 + Math.random() * 0.2),
      };
    });
  }, [count, opacity, isCenter]);

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden" 
      style={{ zIndex: 0 }}
    >
      {scattered.map((img) => (
        <motion.div
          key={img.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: img.opacity,
            scale: img.scale,
            y: [0, -30, 0],
            rotate: [img.rotate, img.rotate + 8, img.rotate - 8, img.rotate]
          }}
          transition={{
            opacity: { duration: 1.5 },
            scale: { duration: 1.5 },
            y: { duration: img.duration / 2, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: img.duration / 3, repeat: Infinity, ease: "easeInOut" },
            delay: Math.abs(img.delay),
          }}
          style={{
            position: "absolute",
            top: img.top,
            left: img.left,
            width: "clamp(150px, 40vw, 300px)", // Responsive size
            height: "auto",
            filter: `blur(${blur}) drop-shadow(0 4px 15px rgba(0,0,0,0.1))`,
            transform: "translate(-50%, -50%)",
            zIndex: -1,
          }}
        >
          <Image
            src={img.src}
            alt="background decoration"
            width={300}
            height={500}
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
          />
        </motion.div>
      ))}
    </div>
  );
}
