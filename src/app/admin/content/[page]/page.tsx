import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { DEFAULT_SITE_CONTENT } from "@/lib/content-defaults";
import { ContentEditor } from "@/components/admin/ContentEditor";

const LABELS: Record<string, Record<string, string>> = {
  site: {
    title: "사이트 제목 (브라우저 탭)",
    description: "사이트 설명 (SEO 메타)",
    footerTagline: "푸터 한 줄 슬로건",
    copyright: "푸터 저작권 (연도는 {year}로 표기)",
  },
  home: {
    tagline: "메인 태그라인",
    subtagline: "보조 문구",
    ctaPrimaryLabel: "첫 번째 버튼 라벨",
    ctaPrimaryHref: "첫 번째 버튼 링크",
    ctaSecondaryLabel: "두 번째 버튼 라벨",
    ctaSecondaryHref: "두 번째 버튼 링크",
  },
  about: {
    eyebrow: "상단 카테고리 라벨",
    heading1: "헤드라인 윗줄",
    heading2: "헤드라인 아랫줄 (이탤릭)",
    paragraphs: "본문 문단 (한 줄당 한 문단)",
    services: "서비스 목록 (한 줄당 한 항목)",
    areas: "영역 목록 (한 줄당 한 항목)",
    studio: "스튜디오 정보 (한 줄당 한 항목)",
  },
  portfolio: {
    eyebrow: "상단 카테고리 라벨",
    heading1: "헤드라인 (앞부분)",
    heading2: "헤드라인 (뒷부분, 이탤릭)",
    subtitle: "헤드 우측 부제",
    footnote: "리스트 하단 안내문",
  },
  contact: {
    eyebrow: "상단 카테고리 라벨",
    heading1: "헤드라인 (앞부분)",
    heading2: "헤드라인 (뒷부분, 이탤릭)",
    inquiryLabel: "이메일 영역 라벨",
    inquirySubtitle: "이메일 하단 안내문",
    email: "대표 이메일",
    studioLabel: "스튜디오 영역 라벨",
    studioCity: "스튜디오 위치",
    studioNote: "스튜디오 하단 안내",
    socialInstagram: "Instagram URL",
    socialBehance: "Behance URL",
    formNameLabel: "폼 - 이름 라벨",
    formEmailLabel: "폼 - 이메일 라벨",
    formPhoneLabel: "폼 - 연락처 라벨",
    formCategoryLabel: "폼 - 카테고리 라벨",
    formMessageLabel: "폼 - 메시지 라벨",
    formSubmitLabel: "폼 - 전송 버튼 라벨",
    formSuccessText: "폼 - 전송 성공 메시지",
  },
};

const PAGE_TITLES: Record<string, string> = {
  site: "사이트 메타",
  home: "홈",
  about: "About",
  portfolio: "포트폴리오 헤더",
  contact: "Contact",
};

export default async function ContentEditPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  if (!(page in DEFAULT_SITE_CONTENT)) notFound();

  const defaults = (
    DEFAULT_SITE_CONTENT as unknown as Record<string, Record<string, unknown>>
  )[page];
  const row = await db.sitePage.findUnique({ where: { page } });
  const current = (row?.content as Record<string, unknown>) ?? {};

  const fields = Object.keys(defaults).map((key) => ({
    key,
    label: LABELS[page]?.[key] ?? key,
    value: current[key] ?? defaults[key],
    isArray: Array.isArray(defaults[key]),
  }));

  return (
    <div>
      <Link
        href="/admin/content"
        className="text-xs text-white/55 hover:text-white"
      >
        ← 콘텐츠 목록
      </Link>
      <h1 className="font-display text-3xl sm:text-4xl mt-3 mb-2">
        {PAGE_TITLES[page] ?? page}
      </h1>
      <p className="text-white/55 text-sm mb-10">
        수정 후 저장하면 공개 사이트에 즉시 반영됩니다.
      </p>
      <ContentEditor page={page} fields={fields} />
    </div>
  );
}
