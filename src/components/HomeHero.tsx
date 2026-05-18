"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HandwritingLogo, HANDWRITING_TOTAL_S } from "./HandwritingLogo";

export function HomeHero() {
  const after = HANDWRITING_TOTAL_S; // ≈ 3.25s

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
      <HandwritingLogo />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: after + 0.15, ease: "easeOut" }}
        className="mt-2 sm:mt-6 max-w-xl text-center"
      >
        <p className="font-display italic text-2xl sm:text-3xl text-white/85 leading-snug">
          공간의 본질을 디자인합니다.
        </p>
        <p className="mt-4 text-sm sm:text-base text-white/45 leading-relaxed">
          사람과 공간 사이, 머무는 마음을 조형하는 디자인 스튜디오.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: after + 0.75, ease: "easeOut" }}
        className="mt-10 flex flex-col sm:flex-row gap-3"
      >
        <Link
          href="/portfolio"
          className="px-7 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-white/85 transition-colors"
        >
          작업 보기
        </Link>
        <Link
          href="/contact"
          className="px-7 py-3 rounded-full border border-white/20 text-sm text-white/90 hover:border-white/50 hover:bg-white/5 transition-colors"
        >
          프로젝트 문의
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: after + 1.6 }}
        className="absolute bottom-10 text-xs uppercase tracking-[0.3em] text-white/30"
        aria-hidden
      >
        scroll
      </motion.div>
    </section>
  );
}
