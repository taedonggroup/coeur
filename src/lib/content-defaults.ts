// 페이지별 기본 콘텐츠. DB가 비어 있을 때 fallback / seed로 사용.

export const DEFAULT_SITE_CONTENT = {
  site: {
    title: "Coeur — 공간 디자인 스튜디오",
    description:
      "Coeur는 사람과 공간 사이, 머무는 마음을 조형하는 디자인 스튜디오입니다.",
    footerTagline: "공간의 마음을 디자인합니다.",
    copyright: "© {year} Coeur Studio. All rights reserved.",
  },
  home: {
    tagline: "공간의 본질을 디자인합니다.",
    subtagline: "사람과 공간 사이, 머무는 마음을 조형하는 디자인 스튜디오.",
    ctaPrimaryLabel: "작업 보기",
    ctaPrimaryHref: "/portfolio",
    ctaSecondaryLabel: "프로젝트 문의",
    ctaSecondaryHref: "/contact",
    // 히어로 로고 뒤 배경 이미지(공간 사진). 비우면 단색 배경으로 표시.
    heroImage:
      "https://0k5tddof4qirsgrn.public.blob.vercel-storage.com/uploads/1780485801537-12grl4.jpg",
    heroImageAlt: "Coeur 스튜디오 공간",
  },
  about: {
    eyebrow: "About",
    heading1: "공간의 마음,",
    heading2: "Coeur.",
    paragraphs: [
      "Coeur는 프랑스어로 '심장' 또는 '마음의 중심'을 뜻합니다. 우리는 공간이 단순한 물리적 구조가 아니라, 그 안에 머무는 사람들의 시간과 감정을 담는 매개라고 믿습니다.",
      "주거·상업·호스피탤리티 영역에서 브랜드 정체성과 사용자 경험을 잇는 공간을 디자인합니다. 디자인은 정직해야 하고, 정직한 디자인은 오래 사랑받습니다.",
    ],
    services: [
      "공간 컨설팅",
      "인테리어 디자인",
      "브랜드 공간 기획",
      "리노베이션",
    ],
    areas: [
      "Residential · 주거",
      "Commercial · 상업",
      "Hospitality · F&B",
      "Workplace · 오피스",
    ],
    studio: ["Founded · 2026", "Based · Seoul", "Studio · Coeur"],
  },
  portfolio: {
    eyebrow: "Portfolio",
    heading1: "선택된",
    heading2: "작업들.",
    subtitle: "주거·상업·호스피탤리티 영역에서 진행한 프로젝트.",
    footnote: "새로운 작업들은 곧 공개됩니다. 협업 문의는 Contact에서.",
  },
  contact: {
    eyebrow: "Contact",
    heading1: "이야기를",
    heading2: "시작해볼까요.",
    inquiryLabel: "프로젝트 문의",
    inquirySubtitle:
      "공간 기획·디자인·리노베이션 모두 환영합니다. 평균 1영업일 이내 회신드립니다.",
    email: "hello@coeur.studio",
    studioLabel: "스튜디오",
    studioCity: "Seoul · Korea",
    studioNote: "방문 미팅은 사전 예약 후 가능합니다.",
    socialInstagram: "#",
    socialBehance: "#",
    formNameLabel: "성함",
    formEmailLabel: "이메일",
    formPhoneLabel: "연락처 (선택)",
    formCategoryLabel: "프로젝트 분류 (선택)",
    formMessageLabel: "전하실 내용",
    formSubmitLabel: "문의 보내기",
    formSuccessText:
      "문의가 정상적으로 전송되었습니다. 빠르게 회신드리겠습니다.",
  },
} as const;

export type SiteContent = typeof DEFAULT_SITE_CONTENT;
export type PageKey = keyof SiteContent;

export const DEFAULT_PROJECTS = [
  {
    slug: "apartment-hannam",
    order: 1,
    number: "01",
    title: "Apartment in Hannam",
    category: "Residential",
    year: "2026",
    location: "Seoul",
    imageUrl:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80&auto=format&fit=crop",
    imageAlt: "Modern apartment living room with natural light",
    href: "#",
  },
  {
    slug: "studio-cafe-yongsan",
    order: 2,
    number: "02",
    title: "Studio Cafe — Yongsan",
    category: "F&B",
    year: "2026",
    location: "Seoul",
    imageUrl:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&q=80&auto=format&fit=crop",
    imageAlt: "Minimal cafe interior with warm wood tones",
    href: "#",
  },
  {
    slug: "showroom-seongsu",
    order: 3,
    number: "03",
    title: "Showroom — Seongsu",
    category: "Commercial",
    year: "2025",
    location: "Seoul",
    imageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&q=80&auto=format&fit=crop",
    imageAlt: "Concrete commercial showroom space",
    href: "#",
  },
  {
    slug: "stay-jeju",
    order: 4,
    number: "04",
    title: "Stay — Jeju",
    category: "Hospitality",
    year: "2025",
    location: "Jeju",
    imageUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80&auto=format&fit=crop",
    imageAlt: "Quiet hotel bedroom overlooking nature",
    href: "#",
  },
];
