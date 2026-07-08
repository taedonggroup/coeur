"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { HandwritingLogo, HANDWRITING_TOTAL_S } from "./HandwritingLogo";
import { DisplayText } from "./DisplayText";
import type { DisplayMap } from "@/lib/display-fields";

type Props = {
  content: {
    tagline: string;
    subtagline: string;
    ctaPrimaryLabel: string;
    ctaPrimaryHref: string;
    ctaSecondaryLabel: string;
    ctaSecondaryHref: string;
    heroImage?: string;
    heroImageAlt?: string;
    display?: DisplayMap;
  };
};

export function HomeHero({ content }: Props) {
  const after = HANDWRITING_TOTAL_S;
  const heroImage = content.heroImage?.trim();
  return (
    <section className="relative isolate min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12 sm:pt-24 sm:pb-16 gap-2 sm:gap-0 overflow-hidden">
      {heroImage && (
        <div aria-hidden className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* 로고·문구 가독성을 위한 어두운 스크림 (사진을 배경으로 눌러줌) */}
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/85" />
        </div>
      )}
      <HandwritingLogo className="relative z-10" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: after + 0.15, ease: "easeOut" }}
        className="relative z-10 mt-2 sm:mt-6 max-w-xl text-center"
      >
        <DisplayText
          as="p"
          page="home"
          field="tagline"
          content={content}
          className="font-display italic text-white/85 leading-snug"
        />
        <DisplayText
          as="p"
          page="home"
          field="subtagline"
          content={content}
          className="mt-4 text-white/45 leading-relaxed"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: after + 0.75, ease: "easeOut" }}
        className="relative z-10 mt-10 flex flex-col sm:flex-row gap-3"
      >
        <Link
          href={content.ctaPrimaryHref}
          className="px-7 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-white/85 transition-colors"
        >
          {content.ctaPrimaryLabel}
        </Link>
        <Link
          href={content.ctaSecondaryHref}
          className="px-7 py-3 rounded-full border border-white/20 text-sm text-white/90 hover:border-white/50 hover:bg-white/5 transition-colors"
        >
          {content.ctaSecondaryLabel}
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: after + 1.6 }}
        className="absolute bottom-10 z-10 text-xs uppercase tracking-[0.3em] text-white/30"
        aria-hidden
      >
        scroll
      </motion.div>
    </section>
  );
}
