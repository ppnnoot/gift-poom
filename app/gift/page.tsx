"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { domMax, LazyMotion, m, AnimatePresence, useReducedMotion } from "framer-motion";
import FloatingHearts from "../components/FloatingHearts";
import FinalMosaic from "../components/FinalMosaic";

const STEPS = [
  { emoji: "🎓", label: "ยินดีด้วย" },
  { emoji: "💌", label: "จดหมาย" },
  { emoji: "📸", label: "ความทรงจำ" },
  { emoji: "✨", label: "บทสรุป" },
  { emoji: "🎵", label: "เพลง" },
];

const BGC_IMAGES = [
  "/bgc/InShot_20260227_144929193.webp",
  "/bgc/InShot_20260227_145053581.webp",
  "/bgc/InShot_20260227_145146112.webp",
  "/bgc/InShot_20260227_145307435.webp",
  "/bgc/InShot_20260227_145400293.webp",
  "/bgc/InShot_20260227_145508416.webp",
];

async function fireConfetti(small = false) {
  const confetti = (await import("canvas-confetti")).default;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const multiplier = isMobile ? 0.6 : 1;
  const colors = ["#ff85b1", "#ffb3cf", "#ffd6e7", "#ff5c94", "#ffe3ee", "#c9184a", "#fff", "#ffef99"];
  const fire = (opts: object) => confetti({ colors, ...opts });
  
  if (small) {
    fire({ particleCount: Math.floor(60 * multiplier), spread: 70, origin: { y: 0.5 } });
  } else {
    fire({ particleCount: Math.floor(150 * multiplier), spread: 100, origin: { y: 0.4 } });
    if (!isMobile) {
      setTimeout(() => fire({ particleCount: 80, angle: 60, spread: 80, origin: { x: 0, y: 0.5 } }), 300);
      setTimeout(() => fire({ particleCount: 80, angle: 120, spread: 80, origin: { x: 1, y: 0.5 } }), 600);
      setTimeout(() => fire({ particleCount: 60, spread: 70, origin: { y: 0.6 } }), 1000);
    }
  }
}

interface MemoryItem {
  type: "photo" | "video";
  src: string;
  alt?: string;
  label?: string;
}

export default function GiftPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0); // สูงสุด step ที่เคยเข้าถึงแล้ว
  const [animKey, setAnimKey] = useState(0);
  const launchedRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  // ── รวมรูปและวิดีโอ ──
  const MEMORIES = useMemo(() => {
    const photos: MemoryItem[] = [
      { type: "photo", src: "/80757.jpg", alt: "ความทรงจำ 1" },
      { type: "photo", src: "/80758.jpg", alt: "ความทรงจำ 2" },
      { type: "photo", src: "/80759.jpg", alt: "ความทรงจำ 3" },
      { type: "photo", src: "/01.webp", alt: "ความทรงจำ 4" },
      { type: "photo", src: "/02.webp", alt: "ความทรงจำ 5" },
    ];

    const videos: MemoryItem[] = [
      { type: "video", src: "https://drive.google.com/file/d/15VOhz91EPn_8bEegoKC1Vkq860gqUDAN/preview", label: "วิดีโอ 1" },
      { type: "video", src: "https://drive.google.com/file/d/1cP2wouBocJBCCveuZJX6ya0-YmzNoyAs/preview", label: "วิดีโอ 2" },
      { type: "video", src: "https://drive.google.com/file/d/1O6DGxivBZ6y6mdraUl4wZpxigP2vZ59q/preview", label: "วิดีโอ 3" },
      { type: "video", src: "https://drive.google.com/file/d/1f9HCJMJxDXE58xM8X7n21qKkn-hS-Xil/preview", label: "วิดีโอ 4" },
    ];

    return [...photos, ...videos].sort(() => Math.random() - 0.5);
  }, []);

  // Confetti on first load
  useEffect(() => {
    if (launchedRef.current) return;
    launchedRef.current = true;
    fireConfetti(false);
  }, []);

  const goNext = () => {
    const next = step + 1;
    if (next === 3) fireConfetti(true); // mini confetti ก่อน song
    setStep(next);
    setMaxStep((m) => Math.max(m, next));
    setAnimKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => {
    setStep((s) => s - 1);
    setAnimKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isLast = step === STEPS.length - 1;
  const canGoNext = step < maxStep;

  // Framer Motion variants
  const pageVariants = {
    initial: { opacity: 0, x: 20, scale: 0.98 },
    animate: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.34, 1.56, 0.64, 1] as const, // Spring-like cubic bezier
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    },
    exit: { 
      opacity: 0, 
      x: -20, 
      scale: 0.98,
      transition: { duration: 0.3 } 
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 } as const
    },
  };

  return (
    <LazyMotion features={domMax}>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #fff0f6 0%, #ffe8ef 30%, #ffd6e7 60%, #fff0f6 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <FloatingHearts count={16} />

      {/* Nav bar: ย้อนกลับ / ถัดไป */}
      <nav
        role="navigation"
        aria-label="การนำทางหลัก"
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "620px",
          margin: "0 auto",
          padding: "20px 24px 0",
        }}
      >
        {/* ย้อนกลับ */}
        {step > 0 ? (
          <button
            onClick={goPrev}
            style={{
              background: "transparent",
              border: "1.5px solid #ffb3cf",
              borderRadius: "50px",
              padding: "8px 20px",
              color: "#e8437b",
              fontSize: "0.9rem",
              cursor: "pointer",
              fontFamily: "'Mitr', sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#fff0f5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            aria-label="ย้อนกลับไปหน้าก่อนหน้า"
          >
            ← ย้อนกลับ
          </button>
        ) : <div />}

        {/* <span style={{ color: "#b76e79", fontSize: "0.85rem" }}>
          {STEPS[step].emoji} {STEPS[step].label}
        </span> */}

        {/* ถัดไป — แสดงเฉพาะ step ที่เคยไปแล้ว */}
        {canGoNext ? (
          <button
            onClick={goNext}
            style={{
              background: "transparent",
              border: "1.5px solid #ffb3cf",
              borderRadius: "50px",
              padding: "8px 20px",
              color: "#e8437b",
              fontSize: "0.9rem",
              cursor: "pointer",
              fontFamily: "'Mitr', sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#fff0f5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            aria-label="ไปหน้าถัดไป"
          >
            ถัดไป →
          </button>
        ) : <div />}
      </nav>

      {/* Main content — Framer Motion slide transition ระหว่าง step */}
      <AnimatePresence mode="wait" initial={false}>
        <m.main
          key={step}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          aria-label={`Step ${step + 1}: ${STEPS[step].label}`}
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "620px",
            margin: "0 auto",
            padding: "32px 24px 80px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "32px",
          }}
        >

        {/* ── STEP 0: HERO ── */}
        {step === 0 && (
          <m.section key="step0" variants={pageVariants} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", width: "100%" }}>
            <m.h1 
              variants={itemVariants} 
              style={{ fontSize: "clamp(2rem, 7vw, 3rem)", fontWeight: 800, lineHeight: 1.3, color: "#e8437b" }}
            >
              ยินดีด้วยนะ อ้วน
            </m.h1>
            <m.p variants={itemVariants} style={{ color: "#b76e79", fontSize: "1.05rem", lineHeight: 1.8, fontWeight: 500 }}>
              เก่งมากเรียนจบ ม.6 แล้ว เก่งที่สุดเลย<br />
              อย่าลืมภูมิใจในตัวเองเยอะๆ นะ
            </m.p>
            <m.div variants={itemVariants} style={{ marginTop: "8px" }}>
              <Image
                src="/80760.jpg"
                alt="บัณฑิตน่ารัก"
                width={260}
                height={260}
                priority
                style={{
                  borderRadius: "50%",
                  border: "5px solid #ffb3cf",
                  boxShadow: "0 12px 48px rgba(255,133,177,0.45), 0 0 0 10px rgba(255,230,240,0.6)",
                  transform: "rotate(90deg)",
                }}
              />
            </m.div>

            <m.div variants={itemVariants} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" }}>
              {[
                "ยินดีด้วยนะคับที่เรียนจบ ม.6 แล้ว ภูมิใจในตัวเองเยอะ ๆ เลยนะ เพราะการมาถึงวันนี้ไม่ง่ายเลย",
                "ตลอดเวลาที่ผ่านมา อ้วนต้องผ่านทั้งความเหนื่อย ความกดดัน และเรื่องต่าง ๆ มากมาย แต่สุดท้ายอ้วนก็ทำสำเร็จได้ เก่งมากจริง ๆ",
                "วันนี้คือจุดเริ่มต้นของเส้นทางใหม่ ๆ ที่รออยู่ข้างหน้า ไม่ว่าอ้วนจะเลือกเดินไปทางไหน ขอให้เป็นทางที่ทำให้มีความสุข",
                "อย่าลืมเชื่อมั่นในตัวเองเหมือนที่เค้าเชื่อมั่นในอ้วนเสมอนะ ยินดีด้วยอีกครั้ง ภูมิใจมากจริง ๆ",
              ].map((text, i) => (
                <m.div
                  key={i}
                  whileHover={{ x: 6 }}
                  style={{
                    background: "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(8px)",
                    borderLeft: "4px solid #ff85b1",
                    borderRadius: "0 16px 16px 0",
                    padding: "16px 20px",
                    color: "#4a2030",
                    fontSize: "0.98rem",
                    lineHeight: 1.9,
                    boxShadow: "0 2px 12px rgba(255,133,177,0.1)",
                  }}
                >
                  {text}
                </m.div>
              ))}
            </m.div>
          </m.section>
        )}

        {/* ── STEP 1: LOVE LETTER ── */}
        {step === 1 && (
          <m.section key="step1" variants={pageVariants} className="letter-card" style={{ width: "100%", padding: "32px 24px" }}>
            <m.div variants={itemVariants} style={{ textAlign: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#c9184a", marginTop: "8px" }}>
                จดหมายถึงอ้วน
              </h2>
            </m.div>
            <m.div variants={itemVariants} style={{ color: "#4a2030", lineHeight: 1.8, fontSize: "0.98rem", display: "flex", flexDirection: "column", gap: "14px", position: "relative", zIndex: 1 }}>
              <p style={{ fontWeight: 600 }}>ถึงอ้วนของเค้า</p>
              <p>วันนี้เป็นวันสำคัญมาก ๆ เลยนะ วันที่อ้วนใกล้จบ ม.6</p>
              <p>เค้าเห็นความตั้งใจของอ้วนมาตลอด เห็นวันที่เหนื่อย วันที่กดดัน วันที่คิดมาก แต่ถึงอย่างนั้นอ้วนก็ยังสู้ ยังพยายาม และไม่ยอมแพ้เลย เค้าภูมิใจในตัวอ้วนมาก ๆ</p>
              <p>และยิ่งกว่านั้น… เค้าดีใจมากที่ได้อยู่ข้าง ๆ อ้วนในช่วงเวลาสำคัญแบบนี้</p>
              <p>การได้เห็นอ้วนเติบโตขึ้นทีละก้าว ได้เห็นอ้วนพยายามเพื่ออนาคตของตัวเอง มันทำให้เค้ารู้สึกโชคดีมาก ๆ ที่มีอ้วนอยู่ในชีวิต</p>
              <p>อ้วนไม่ได้เป็นแค่คนเก่งของเค้า แต่อ้วนเป็นความสบายใจ เป็นรอยยิ้ม และเป็นคนสำคัญของเค้าเสมอ</p>
              <p>ไม่ว่าเส้นทางข้างหน้าจะพาไปไกลแค่ไหน เค้าจะคอยภูมิใจในทุกความพยายาม และคอยเป็นกำลังใจให้อ้วนแบบนี้เสมอ 🤍</p>
              <p style={{ textAlign: "right", color: "#e8437b", fontStyle: "italic", fontWeight: 600, fontSize: "1.1rem" }}>
                รักนะ, — ภูมิ
              </p>
            </m.div>
          </m.section>
        )}

        {/* ── STEP 2: GALLERY (รูป + วิดีโอ) ── */}
        {step === 2 && (
          <m.section key="step2" variants={pageVariants} style={{ width: "100%", textAlign: "center" }}>
            <m.h2 variants={itemVariants} style={{ fontSize: "2rem", fontWeight: 800, color: "#c9184a", marginBottom: "32px" }}>
              ความทรงจำ
            </m.h2>

            <div
              style={{
                columns: "2",
                columnGap: "16px",
                maxWidth: "540px",
                margin: "0 auto",
              }}
            >
              {MEMORIES.map((item: MemoryItem, i: number) => {
                const rotations = [-2.5, 1.8, -1.2, 2.2, -1.8, 2.5, -0.8, 1.5, -2, 1];
                const rot = rotations[i % rotations.length];
                
                return (
                  <m.div
                    key={i}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={item.type === "photo" ? "photo-card" : "video-card"}
                    style={{
                      breakInside: "avoid",
                      marginBottom: "16px",
                      borderRadius: "20px",
                      overflow: "hidden",
                      border: item.type === "photo" ? "4px solid #ffffff" : "none",
                      boxShadow: "0 10px 25px rgba(255,133,177,0.2)",
                      transformOrigin: "center",
                      display: "inline-block",
                      width: "100%",
                      rotate: rot
                    }}
                  >
                    {item.type === "photo" ? (
                      <Image
                        src={item.src}
                        alt={item.alt || ""}
                        width={280}
                        height={400}
                        style={{ width: "100%", height: "auto", display: "block" }}
                        sizes="(max-width: 600px) 50vw, 280px"
                      />
                    ) : (
                      <div className="video-card-inner" style={{ borderRadius: "16px", overflow: "hidden", position: "relative", minHeight: "180px", background: "#000" }}>
                        <iframe
                          src={`${item.src}?loading=lazy`}
                          title={item.label}
                          width="100%"
                          height="180"
                          allow="autoplay"
                          loading="lazy"
                          style={{ display: "block", border: "none" }}
                        />
                      </div>
                    )}
                  </m.div>
                );
              })}
            </div>

            <m.p variants={itemVariants} style={{ marginTop: "32px", color: "#b76e79", fontSize: "1.1rem", fontStyle: "italic", fontWeight: 500 }}>
              ทุกช่วงเวลาที่ผ่านมาด้วยกัน ล้วนมีค่า
            </m.p>
          </m.section>
        )}



        {/* ── STEP 3: SUMMARY MOSAIC ── */}
        {step === 3 && (
          <m.section key="step3" variants={pageVariants} style={{ width: "100%", position: "relative" }}>
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
              <FinalMosaic 
                memoryImages={MEMORIES.filter(m => m.type === 'photo').map(m => m.src)} 
                bgcImages={BGC_IMAGES} 
              />
              
              <m.div 
                variants={itemVariants} 
                className="relative z-10 p-6 md:p-12 max-w-2xl w-[95%]"
              >
                <div className="space-y-6 md:space-y-8">
                  <m.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-3xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-2"
                  >
                    Happy Graduation!<br/>
                    <span className="mt-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 block mt-2">
                      รักที่สุดในโลกเลย
                    </span>
                  </m.h2>

                  <m.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-4 text-lg md:text-xl text-gray-900 leading-relaxed font-bold px-2"
                    style={{ textShadow: "0 2px 4px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4)" }}
                  >
                    <p>
                      อ้วนเก่งที่สุดเลยนะ! ขอให้ก้าวต่อไปข้างหน้าของอ้วนเต็มไปด้วยความสุข และความสำเร็จนะครับ
                    </p>
                    <p>
                      ไม่ว่าอ้วนจะเจออะไร เค้าจะคอยเป็นกำลังใจให้ ซัพพอร์ต และอยู่ข้างๆ อ้วนเสมอเลยนะ ยินดีด้วยอีกครั้งนะครับคนเก่ง!
                    </p>
                  </m.div>

                  {/* Central button removed as requested - moved to global nav */}
                </div>
              </m.div>
            </div>
          </m.section>
        )}

        {/* ── STEP 4: SONG ── */}
        {step === 4 && (
          <m.section key="step4" variants={pageVariants} style={{ width: "100%" }}>
            <m.div variants={itemVariants} className="song-card" style={{ padding: "36px" }}>
              <m.div style={{ textAlign: "center", marginBottom: "28px" }}>
                <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#c9184a", marginTop: "12px" }}>
                  เพลงที่อยากมอบให้
                </h2>
                <p style={{ color: "#b76e79", fontSize: "1.05rem", marginTop: "8px", fontWeight: 500 }}>
                  เค้ามีเพลงเยอะมากที่อยากให้อ้วน แต่ขอเลือกเพลงนี้มาให้...
                </p>
              </m.div>
              <m.div 
                whileHover={{ scale: 1.02 }}
                style={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 15px 40px rgba(255,133,177,0.3)", background: "#fff" }}
              >
                <iframe
                  width="100%"
                  height="220"
                  src="https://www.youtube.com/embed/7Prl8eq6fvM"
                  title="เพลงที่อยากมอบให้"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ display: "block" }}
                />
              </m.div>
              <p style={{ textAlign: "center", marginTop: "24px", color: "#e8437b", fontSize: "1.1rem", fontStyle: "italic", fontWeight: 500 }}>
                เพลงนี้ทำให้นึกถึงอ้วนทุกครั้งที่ได้ยินเลยนะครับ
              </p>
            </m.div>

            {/* Footer */}
            <m.div variants={itemVariants} style={{ textAlign: "center", marginTop: "60px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <p style={{ fontSize: "1.4rem", color: "#c9184a", fontStyle: "italic", fontWeight: 800 }}>
                "อ้วนคือของขวัญที่ดีที่สุดในชีวิตเค้า"
              </p>
              <p style={{ color: "#b76e79", fontSize: "0.9rem", fontWeight: 600, opacity: 0.8 }}>- made with love for you -</p>
            </m.div>
          </m.section>
        )}

        {/* ── NEXT BUTTON ── */}
        {!isLast && (
          <m.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goNext}
            className="btn-primary glow-pulse"
            style={{ fontSize: "1rem", padding: "12px 32px", marginTop: "20px" }}
            aria-label="ไปหน้าต่อไป"
          >
            {step === 0 && "ไปอ่านจดหมายจากเค้านะอ้วน"}
            {step === 1 && "ไปดูความทรงจำของเรากัน"}
            {step === 2 && "สุดท้ายแล้ววว"}
            {step === 3 && "ไปฟังเพลงกันเถอะ! 🎵"}
          </m.button>
        )}
        </m.main>
      </AnimatePresence>
    </div>
  </LazyMotion>
);
}
