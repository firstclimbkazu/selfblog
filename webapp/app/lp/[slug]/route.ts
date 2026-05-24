import { prisma } from "@/lib/prisma";
import { renderLandingPage } from "./render";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const lp = await prisma.landingPage.findUnique({
    where: { slug },
  });

  if (!lp || lp.status !== "PUBLISHED") {
    return new Response("Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const html = renderLandingPage({
    title: lp.metaTitle ?? lp.title,
    description: lp.metaDescription,
    ogImage: lp.metaOgImage,
    headHtml: lp.headHtml,
    css: lp.css,
    js: lp.js,
    body: lp.html,
  });

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
