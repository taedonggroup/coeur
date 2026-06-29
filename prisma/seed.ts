import { PrismaClient } from "@prisma/client";
import {
  DEFAULT_SITE_CONTENT,
  DEFAULT_PROJECTS,
} from "../src/lib/content-defaults";

const prisma = new PrismaClient();

// 시드는 "DB가 완전히 비었을 때만" 실행한다(최초 환경 구축용).
// 매 배포마다 돌리면 관리자가 삭제한 기본 샘플이 되살아나므로(2026-06 사고),
// 이미 데이터가 있으면 건드리지 않는다.
async function main() {
  console.log("seeding site pages...");
  const sitePageCount = await prisma.sitePage.count();
  if (sitePageCount === 0) {
    for (const [page, content] of Object.entries(DEFAULT_SITE_CONTENT)) {
      await prisma.sitePage.create({
        data: { page, content: content as object },
      });
      console.log(`  ✓ ${page}`);
    }
  } else {
    console.log(`  skipped — ${sitePageCount}개 페이지가 이미 존재`);
  }

  console.log("seeding projects...");
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    for (const p of DEFAULT_PROJECTS) {
      await prisma.project.create({ data: p });
      console.log(`  ✓ ${p.title}`);
    }
  } else {
    console.log(
      `  skipped — ${projectCount}개 프로젝트가 이미 존재 (기본 샘플 재생성 안 함)`,
    );
  }
  console.log("done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
