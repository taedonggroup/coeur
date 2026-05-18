"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  duration?: number;
  delay?: number;
  className?: string;
};

export function HandwritingLogo({
  duration = 2.6,
  delay = 0.4,
  className = "",
}: Props) {
  return (
    <div
      className={`relative w-full max-w-[820px] mx-auto aspect-[3/2] ${className}`}
    >
      <motion.div
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration, ease: [0.65, 0.05, 0.36, 1], delay }}
        className="absolute inset-0"
        style={{ willChange: "clip-path" }}
      >
        <Image
          src="/logo.png"
          alt="Coeur"
          fill
          priority
          sizes="(max-width: 768px) 90vw, 820px"
          className="object-contain select-none"
          draggable={false}
        />
      </motion.div>

      <motion.div
        initial={{ left: "0%", opacity: 0 }}
        animate={{
          left: ["0%", "1%", "100%", "100%"],
          opacity: [0, 0.7, 0.7, 0],
        }}
        transition={{
          duration: duration + 0.2,
          times: [0, 0.04, 0.95, 1],
          ease: [0.65, 0.05, 0.36, 1],
          delay,
        }}
        className="absolute top-[34%] bottom-[34%] w-[2px] -translate-x-1/2 rounded-full bg-white/70"
        style={{
          boxShadow: "0 0 12px 3px rgba(255,255,255,0.45)",
          filter: "blur(0.4px)",
        }}
        aria-hidden
      />
    </div>
  );
}
