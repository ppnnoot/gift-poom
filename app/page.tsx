"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { domMax, LazyMotion, m, AnimatePresence, useReducedMotion } from "framer-motion";
import FloatingHearts from "./components/FloatingHearts";
import ScatteredImages from "./components/ScatteredImages";

type PageState = "idle" | "prank" | "checkpoint";

export default function LandingPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("idle");
  const [btnPos, setBtnPos] = useState({ top: "0px", left: "0px" });
  const [clickCount, setClickCount] = useState(0);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const prankCountRef = useRef(0);
  const shouldReduceMotion = useReducedMotion();

  // ── Confetti on mount
  useEffect(() => {
    let cancelled = false;
    const launchConfetti = async () => {
      const confetti = (await import("canvas-confetti")).default;
      if (cancelled) return;
      const colors = ["#ff85b1", "#ffb3cf", "#ffd6e7", "#ff5c94", "#ffe3ee", "#c9184a"];
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 }, colors });
      setTimeout(() => {
        if (!cancelled) confetti({ particleCount: 60, spread: 100, origin: { x: 0.1, y: 0.6 }, colors });
      }, 400);
      setTimeout(() => {
        if (!cancelled) confetti({ particleCount: 60, spread: 100, origin: { x: 0.9, y: 0.6 }, colors });
      }, 700);
    };
    launchConfetti();
    return () => { cancelled = true; };
  }, []);

  // ── Runaway button logic
  const getRandomPos = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const btnW = 200;
    const btnH = 56;

    // Define safe zone (central 40% of the screen)
    const safeZoneW = vw * 0.4;
    const safeZoneH = vh * 0.4;
    const safeZoneLeft = (vw - safeZoneW) / 2;
    const safeZoneTop = (vh - safeZoneH) / 2;

    let top, left;
    let attempts = 0;
    
    // Try to find a position outside the safe zone
    do {
      top = Math.random() * (vh - btnH - 60) + 30;
      left = Math.random() * (vw - btnW - 60) + 30;
      attempts++;
      
      // Check if button rect overlaps with safe zone rect
      const overlaps = 
        left < safeZoneLeft + safeZoneW &&
        left + btnW > safeZoneLeft &&
        top < safeZoneTop + safeZoneH &&
        top + btnH > safeZoneTop;
        
      if (!overlaps || attempts > 10) break;
    } while (true);

    return { top: `${top}px`, left: `${left}px` };
  }, []);

  const handleButtonClick = useCallback(() => {
    const nextCount = prankCountRef.current + 1;
    prankCountRef.current = nextCount;
    setClickCount(nextCount);

    if (nextCount < 3) {
      setPageState("prank");
      setBtnPos(getRandomPos());
    } else {
      setPageState("checkpoint");
    }
  }, [getRandomPos]);

  const handleButtonHover = useCallback(() => {
    if (pageState === "prank") {
      setBtnPos(getRandomPos());
    }
  }, [pageState, getRandomPos]);

  const handleConfirm = () => {
    router.push("/gift");
  };

  const bothChecked = check1 && check2;

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 30, scale: 0.9 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 } as const
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <LazyMotion features={domMax}>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(145deg, #fff0f6 0%, #ffe8ef 40%, #ffd6e7 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
      <FloatingHearts count={12} />
      {/* <ScatteredImages count={6} opacity={1} blur="0px" isCenter={true} /> */}

      <AnimatePresence mode="wait">
        {pageState !== "checkpoint" ? (
          <m.main
            key="idle-prank"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            aria-label="Welcome and challenge screen"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "32px",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
              maxWidth: "500px",
            }}
          >
            <m.div variants={itemVariants}>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.8rem, 6vw, 2.8rem)",
                  fontWeight: 800,
                  marginBottom: "8px",
                  lineHeight: 1.2,
                  color: "#e8437b"
                }}
              >
                {clickCount === 0 && "พร้อมดูแล้วยังคับอ้วน"}
                {clickCount === 1 && "อุ๊ย! เมื่อกี้กดผิดนะอ้วน"}
                {clickCount === 2 && "กดผิดอีกแล้วนะอ้วน กดใหม่!"}
              </h1>
              
              <m.p 
                style={{ 
                  color: "#b76e79", 
                  fontSize: "1.1rem", 
                  marginTop: "8px",
                  fontWeight: 500
                }}
              >
                {pageState === "idle" 
                  ? "มีของพิเศษรออ้วนอยู่นะ" 
                  : "ลองจิ้มอีกทีนะ เค้าไม่แกล้งแล้ว"}
              </m.p>
            </m.div>

            <m.div variants={itemVariants}>
              <m.button
                ref={btnRef}
                onClick={handleButtonClick}
                onMouseEnter={handleButtonHover}
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  position: pageState === "prank" ? "fixed" : "relative",
                  top: pageState === "prank" ? btnPos.top : "auto",
                  left: pageState === "prank" ? btnPos.left : "auto",
                  zIndex: 100,
                  transition: pageState === "prank" ? "all 0.1s ease-out" : "box-shadow 0.2s ease, transform 0.2s ease",
                }}
                aria-label={pageState === "idle" ? "เริ่มดูของขวัญ" : "จิ้มปุ่มนี้"}
              >
                {pageState === "idle" ? "พร้อมแล้ว กดตรงนี้" : "จิ้มปุ่มนี้สิ"}
              </m.button>
            </m.div>
          </m.main>
        ) : (
          <m.main
            key="checkpoint"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            aria-label="Confirmation questions"
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "520px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "28px",
              textAlign: "center",
            }}
          >
            <m.div variants={itemVariants}>
              <h1
                style={{
                  fontSize: "clamp(1.6rem, 5vw, 2.22rem)",
                  fontWeight: 800,
                  color: "#e8437b",
                }}
              >
                ไม่แกล้งแล้วคับ อิอิ
              </h1>
              <p style={{ color: "#7a3a52", fontSize: "1.2rem", marginTop: "4px" }}>
                แต่ก่อนดู... ตอบคำถาม 2 ข้อนี้ก่อนนะ
              </p>
            </m.div>

            <m.div variants={itemVariants} style={{ width: "100%" }}>
              <div className="letter-card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "16px", cursor: "pointer", textAlign: "left" }}>
                  <input
                    type="checkbox"
                    className="cute-checkbox"
                    checked={check1}
                    onChange={(e) => setCheck1(e.target.checked)}
                  />
                  <span style={{ color: "#4a2030", fontWeight: 500 }}>
                    ยอมรับว่าอ้วนเป็นคนเก่งและภูมิใจในตัวเอง
                  </span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "16px", cursor: "pointer", textAlign: "left" }}>
                  <input
                    type="checkbox"
                    className="cute-checkbox"
                    checked={check2}
                    onChange={(e) => setCheck2(e.target.checked)}
                  />
                  <span style={{ color: "#4a2030", fontWeight: 500 }}>
                    ยืนยันว่าเค้าน่ารักที่สุด
                  </span>
                </label>
              </div>
            </m.div>

            <m.div variants={itemVariants}>
              <AnimatePresence>
                {bothChecked ? (
                  <m.button
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    onClick={handleConfirm}
                    className="btn-primary glow-pulse"
                    aria-label="ยืนยันและไปดูวิดีโอของขวัญ"
                  >
                    ยืนยัน! ไปดูกันเลยยย
                  </m.button>
                ) : (
                  <p style={{ color: "#ffb3cf", fontSize: "0.95rem", fontStyle: "italic" }}>
                    ติ๊กให้ครบ 2 ข้อก่อนนะอ้วน
                  </p>
                )}
              </AnimatePresence>
            </m.div>
          </m.main>
        )}
      </AnimatePresence>
    </div>
  </LazyMotion>
);
}
