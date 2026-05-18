import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await db.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div>
      <Link
        href="/admin/portfolio"
        className="text-xs text-white/55 hover:text-white"
      >
        ← 포트폴리오
      </Link>
      <h1 className="font-display text-3xl sm:text-4xl mt-3 mb-2">
        {project.title}
      </h1>
      <p className="text-white/55 text-sm mb-10">
        프로젝트 정보를 수정하거나 공개 여부를 변경할 수 있습니다.
      </p>
      <ProjectForm
        initial={{
          id: project.id,
          slug: project.slug,
          number: project.number,
          title: project.title,
          category: project.category,
          year: project.year,
          location: project.location,
          imageUrl: project.imageUrl,
          imageAlt: project.imageAlt,
          href: project.href,
          order: project.order,
          published: project.published,
        }}
      />
    </div>
  );
}
