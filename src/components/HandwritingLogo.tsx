"use client";

import { motion } from "framer-motion";

// 손글씨 그리기(SVG 마스크) 애니메이션을 제거하고 로고를 정적 이미지로 표시한다.
// logo.png는 흰 글씨 + 검은 배경(투명도 없음)이므로 mix-blend-screen으로
// 검은 배경을 페이지에 녹여 없애고 흰 "Coeur"만 보이게 한다.

// 로고 등장 후 태그라인/CTA가 이어지는 타이밍 기준(HomeHero에서 사용).
export const HANDWRITING_TOTAL_S = 0.6;

type Props = {
  className?: string;
  onComplete?: () => void;
};

export function HandwritingLogo({ className = "", onComplete }: Props) {
  return (
    <motion.img
      src="/logo.png"
      alt="Coeur"
      fetchPriority="high"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onAnimationComplete={onComplete}
      className={`w-full max-w-[300px] sm:max-w-[560px] md:max-w-[820px] mx-auto mix-blend-screen ${className}`}
    />
  );
}
