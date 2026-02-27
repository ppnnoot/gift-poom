"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import Image from "next/image";

interface FinalMosaicProps {
  memoryImages: string[];
  bgcImages: string[];
}

export default function FinalMosaic({ memoryImages, bgcImages }: FinalMosaicProps) {
  const allImages = useMemo(() => {
    const combined = [
      ...memoryImages.map(src => ({ src, type: 'memory' as const })),
      ...bgcImages.map(src => ({ src, type: 'bgc' as const }))
    ];
    
    // Create a large number of items for the "explosion"
    return Array.from({ length: 60 }, (_, i) => { // Increased count for better richness
      const item = combined[i % combined.length];
      // Outward spiral/random distribution
      const angle = (i / 60) * Math.PI * 4 + (Math.random() * 0.5);
      const distance = 30 + Math.random() * 60; // Spread further to the edges
      
      return {
        id: i,
        src: item.src,
        type: item.type,
        x: Math.cos(angle) * distance * 1.6, // vw
        y: Math.sin(angle) * distance * 1.3, // vh
        rotate: (Math.random() - 0.5) * 45,
        scale: item.type === 'bgc' ? 0.3 + Math.random() * 0.4 : 0.5 + Math.random() * 0.5,
        delay: Math.random() * 0.2,
        duration: 1.0 + Math.random() * 1.2,
        floatDuration: 8 + Math.random() * 8,
        floatX: (Math.random() - 0.5) * 40,
        floatY: (Math.random() - 0.5) * 40,
      };
    });
  }, [memoryImages, bgcImages]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center" style={{ zIndex: 0 }}>
      {allImages.map((img) => (
        <motion.div
          key={img.id}
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: 0,
            y: 0,
            rotate: 0
          }}
          animate={{ 
            opacity: [0, 1, 0.7],
            scale: img.scale,
            x: [`0vw`, `${img.x}vw`],
            y: [`0vh`, `${img.y}vh`],
            rotate: img.rotate
          }}
          transition={{
            duration: img.duration,
            delay: img.delay,
            ease: [0.23, 1, 0.32, 1], // Power4 outward
          }}
          style={{
            position: "absolute",
          }}
        >
          <motion.div
            animate={{
              x: [0, img.floatX, 0],
              y: [0, img.floatY, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: img.floatDuration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`
              relative overflow-hidden rounded-xl shadow-2xl border-2 border-white/60
              ${img.type === 'bgc' ? 'w-24 md:w-48' : 'w-36 md:w-64'}
            `}
            style={{ willChange: "transform, opacity" }}
          >
            <Image
              src={img.src}
              alt="mosaic element"
              width={224}
              height={300}
              className="w-full h-auto object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
            />
          </motion.div>
        </motion.div>
      ))}
      
      {/* Central focus gradient to make text readable if needed */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/40 pointer-events-none" />
    </div>
  );
}
