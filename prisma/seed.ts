import { PrismaClient } from "@prisma/client";
import {
  DEFAULT_SITE_CONTENT,
  DEFAULT_PROJECTS,
} from "../src/lib/content-defaults";

const prisma = new PrismaClient();

async function main() {
  console.log("seeding site pages...");
  for (const [page, content] of Object.entries(DEFAULT_SITE_CONTENT)) {
    await prisma.sitePage.upsert({
      where: { page },
      create: { page, content: content as object },
      update: {}, // 기존 콘텐츠는 보존
    });
    console.log(`  ✓ ${page}`);
  }

  console.log("seeding projects...");
  for (const p of DEFAULT_PROJECTS) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      create: p,
      update: {},
    });
    console.log(`  ✓ ${p.title}`);
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
