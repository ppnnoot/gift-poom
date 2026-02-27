"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
    const top = Math.random() * (vh - btnH - 60) + 30;
    const left = Math.random() * (vw - btnW - 60) + 30;
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
          <motion.div
            key="idle-prank"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
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
            <motion.div variants={itemVariants}>
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
              
              <motion.p 
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
              </motion.p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
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
              >
                {pageState === "idle" ? "พร้อมแล้ว กดตรงนี้" : "จิ้มปุ่มนี้สิ"}
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="checkpoint"
            variants={containerVariants}
            initial="initial"
            animate="animate"
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
            <motion.div variants={itemVariants}>
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
            </motion.div>

            <motion.div variants={itemVariants} style={{ width: "100%" }}>
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
            </motion.div>

            <motion.div variants={itemVariants}>
              <AnimatePresence>
                {bothChecked ? (
                  <motion.button
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    onClick={handleConfirm}
                    className="btn-primary glow-pulse"
                  >
                    ยืนยัน! ไปดูกันเลยยย
                  </motion.button>
                ) : (
                  <p style={{ color: "#ffb3cf", fontSize: "0.95rem", fontStyle: "italic" }}>
                    ติ๊กให้ครบ 2 ข้อก่อนนะอ้วน
                  </p>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
