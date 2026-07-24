import { db } from "@/db";
import { updates as updatesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from 'next/link';
import { FaArrowLeft } from "react-icons/fa";
import { formatDate } from "@/lib/utils";
import { marked } from 'marked';

export const revalidate = 3600;

async function getUpdate(slug: string) {
  const [update] = await db.select().from(updatesTable).where(eq(updatesTable.slug, slug));
  return update;
}

export default async function UpdatePage({ params }: { params: Promise<{ slug: string }> }): Promise<React.JSX.Element> {
  const { slug } = await params;
  const update = await getUpdate(slug);

  if (!update) { notFound(); }

  const contentHtml = await marked.parse(update.content);

  return (
    <div className="py-16 md:py-24 px-6 md:px-12 lg:px-16 max-w-3xl mx-auto">
      <Link href="/updates" className="inline-flex items-center gap-2 font-mono text-xs text-slate hover:text-gold transition-colors mb-8">
        <FaArrowLeft className="w-3 h-3" />
        Back to Updates
      </Link>

      <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-4">Update</p>
      <h1 className="mb-4">{update.title}</h1>

      <div className="flex flex-wrap items-center gap-4 mb-8 font-mono text-xs text-slate">
        <span>{formatDate(update.pubDate)}</span>
        <span className="text-slate/30">/</span>
        <span>By {update.author}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {update.tags.map((tag: string) => (
          <span key={tag} className="px-3 py-1 bg-ink text-white text-xs font-mono">#{tag}</span>
        ))}
      </div>

      <article className="content" dangerouslySetInnerHTML={{ __html: contentHtml }}></article>
    </div>
  );
}
