import React from 'react';
import { db } from "@/db";
import { newsletters as newslettersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from 'next/link';
import { FaArrowLeft } from "react-icons/fa";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

async function getNewsletter(id: string) {
  const [newsletter] = await db.select().from(newslettersTable).where(eq(newslettersTable.id, id));
  return newsletter;
}

export default async function NewsletterPage({ params }: { params: Promise<{ id: string }> }): Promise<React.JSX.Element> {
  const { id } = await params;
  const newsletter = await getNewsletter(id);

  if (!newsletter) { notFound(); }

  return (
    <div className="py-16 md:py-24 px-6 md:px-12 lg:px-16 max-w-4xl mx-auto">
      <Link href="/newsletters" className="inline-flex items-center gap-2 font-mono text-xs text-slate hover:text-gold transition-colors mb-8">
        <FaArrowLeft className="w-3 h-3" />
        Back to Newsletters
      </Link>

      <div className="max-w-2xl mb-10">
        <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-4">Newsletter</p>
        <h1 className="mb-3">{newsletter.title}</h1>
        <p className="text-lg text-slate leading-relaxed font-body mb-3">{newsletter.description}</p>
        <p className="font-mono text-xs text-slate/70">{formatDate(newsletter.publishDate)}</p>
      </div>

      <div className="bg-light-parchment p-6">
        <div className="relative">
          <div
            className="w-full h-[400px] sm:h-[600px] md:h-[800px] [&>iframe]:w-full [&>iframe]:!h-full [&>embed]:w-full [&>embed]:!h-full [&>object]:w-full [&>object]:!h-full"
            dangerouslySetInnerHTML={{ __html: newsletter.pdfPath }}
          />
        </div>
      </div>
    </div>
  );
}
