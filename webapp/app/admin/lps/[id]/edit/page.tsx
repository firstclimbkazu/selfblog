import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateLp } from "../../actions";
import LpEditor from "./LpEditor";

type Props = { params: Promise<{ id: string }> };

export const metadata = { title: "LP編集 — Still On The Wall" };

export default async function EditLpPage({ params }: Props) {
  const { id } = await params;

  const lp = await prisma.landingPage.findUnique({
    where: { id },
    include: { images: { orderBy: { createdAt: "desc" } } },
  });

  if (!lp) notFound();

  const updateWithId = updateLp.bind(null, id);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--sotw-text)] tracking-tight mb-1">
            LP編集
          </h1>
          <Link
            href="/admin/lps"
            className="text-sm text-[var(--sotw-text-2)] hover:text-[var(--sotw-moss)]"
          >
            ← LP一覧へ
          </Link>
        </div>
        <a
          href={`/lp/${lp.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--sotw-moss)] hover:underline"
        >
          プレビューを別タブで開く →
        </a>
      </div>

      <LpEditor
        lpId={lp.id}
        action={updateWithId}
        defaults={{
          title: lp.title,
          slug: lp.slug,
          html: lp.html,
          css: lp.css ?? "",
          js: lp.js ?? "",
          headHtml: lp.headHtml ?? "",
          metaTitle: lp.metaTitle ?? "",
          metaDescription: lp.metaDescription ?? "",
          metaOgImage: lp.metaOgImage ?? "",
          status: lp.status,
        }}
        images={lp.images.map((img) => ({
          id: img.id,
          publicUrl: img.publicUrl,
          fileName: img.fileName,
          fileSize: img.fileSize,
        }))}
      />
    </div>
  );
}
