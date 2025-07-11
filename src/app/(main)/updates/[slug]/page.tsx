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

  if (!update) {
    notFound();
  }

  const contentHtml = await marked.parse(update.content);

  return (
    <div className="bg-white py-8">
      <div className="gap-16 items-center px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-1 lg:py-16 lg:px-3">
        <div className="font-light text-gray-500 sm:text-lg">
          <Link href="/updates" className="inline-flex items-center font-medium text-black hover:text-primary my-4">
            <FaArrowLeft className="h-6 w-6" />
            <span className="ml-1 font-bold text-lg">All Updates</span>
          </Link>
          <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">{update.title}</h1>
          <h3 className="text-lg mb-2">Written by {update.author} on {formatDate(update.pubDate)}</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {update.tags.map((tag: string) => (
              <span key={tag} className="px-2 py-1 bg-lime-200 text-lime-800 rounded-full text-xs font-medium">#{tag}</span>
            ))}
          </div>
          <article
            className="content"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          ></article>
        </div>
      </div>
    </div>
  );
}