import Link from "next/link";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <Link
        href="/admin/portfolio"
        className="text-xs text-white/55 hover:text-white"
      >
        ← 포트폴리오
      </Link>
      <h1 className="font-display text-3xl sm:text-4xl mt-3 mb-2">
        새 프로젝트
      </h1>
      <p className="text-white/55 text-sm mb-10">
        카드를 만들면 포트폴리오 페이지의 그리드에 추가됩니다.
      </p>
      <ProjectForm
        initial={{
          slug: "",
          number: "",
          title: "",
          category: "",
          year: String(new Date().getFullYear()),
          location: "",
          imageUrl: "",
          imageAlt: "",
          href: "#",
          order: 0,
          published: true,
        }}
      />
    </div>
  );
}
