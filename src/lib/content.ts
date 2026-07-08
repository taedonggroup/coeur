import { unstable_cache } from "next/cache";
import { db } from "./db";
import {
  DEFAULT_SITE_CONTENT,
  DEFAULT_PROJECTS,
  type PageKey,
  type SiteContent,
} from "./content-defaults";
import type { DisplayMap } from "./display-fields";

// 데스크톱/모바일 분리 + 폰트 크기 설정을 담는 보조 객체(optional).
export type PageContent<K extends PageKey> = SiteContent[K] & {
  display?: DisplayMap;
};

// DB가 비어 있거나 연결되지 않은 경우 디폴트 콘텐츠로 안전하게 fallback.
export async function getPageContent<K extends PageKey>(
  page: K,
): Promise<PageContent<K>> {
  return unstable_cache(
    async () => {
      try {
        const row = await db.sitePage.findUnique({ where: { page } });
        if (!row) return DEFAULT_SITE_CONTENT[page];
        return {
          ...DEFAULT_SITE_CONTENT[page],
          ...(row.content as object),
        } as PageContent<K>;
      } catch (err) {
        console.warn(
          `[getPageContent] DB error for ${page}, using defaults`,
          err,
        );
        return DEFAULT_SITE_CONTENT[page];
      }
    },
    [`site-page:${page}`],
    { tags: [`site-page:${page}`] },
  )();
}

export async function getProjects() {
  return unstable_cache(
    async () => {
      try {
        const rows = await db.project.findMany({
          where: { published: true },
          orderBy: { order: "asc" },
        });
        if (rows.length === 0) {
          // DB가 비어 있을 때 디폴트 4건 표시
          return DEFAULT_PROJECTS.map((p, i) => ({
            id: `default-${i}`,
            slug: p.slug,
            order: p.order,
            number: p.number,
            title: p.title,
            category: p.category,
            year: p.year,
            location: p.location,
            imageUrl: p.imageUrl,
            imageAlt: p.imageAlt,
            href: p.href,
            published: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));
        }
        return rows;
      } catch (err) {
        console.warn("[getProjects] DB error, using defaults", err);
        return DEFAULT_PROJECTS.map((p, i) => ({
          id: `default-${i}`,
          slug: p.slug,
          order: p.order,
          number: p.number,
          title: p.title,
          category: p.category,
          year: p.year,
          location: p.location,
          imageUrl: p.imageUrl,
          imageAlt: p.imageAlt,
          href: p.href,
          published: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
      }
    },
    ["projects:published"],
    { tags: ["projects"] },
  )();
}

export async function getAllProjectsForAdmin() {
  return db.project.findMany({ orderBy: { order: "asc" } });
}

// 공개 상세 페이지용: slug로 published 프로젝트 1건 조회 (projects 태그로 캐시).
export async function getProjectBySlug(slug: string) {
  return unstable_cache(
    async () => {
      try {
        const row = await db.project.findUnique({ where: { slug } });
        if (!row || !row.published) return null;
        return row;
      } catch (err) {
        console.warn(`[getProjectBySlug] DB error for ${slug}`, err);
        return null;
      }
    },
    [`project:${slug}`],
    { tags: ["projects"] },
  )();
}

// 상세 페이지 정적 생성용 published slug 목록.
export async function getPublishedSlugs(): Promise<string[]> {
  try {
    const rows = await db.project.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}
