import React from 'react';
import { db } from "@/db";
import { newsletters as newslettersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from 'next/link';
import { FaArrowLeft } from "react-icons/fa";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600; // Revalidate every hour

async function getNewsletter(id: string) {
  const [newsletter] = await db.select().from(newslettersTable).where(eq(newslettersTable.id, id));
  return newsletter;
}

export default async function NewsletterPage({ params }: { params: Promise<{ id: string }> }): Promise<React.JSX.Element> {
  const { id } = await params;
  const newsletter = await getNewsletter(id);

  if (!newsletter) {
    notFound();
  }

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-3">
      <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
        <h1 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold">{newsletter.title}</h1>
        <p className="font-light sm:text-xl mb-4">{newsletter.description}</p>
        <div className="text-sm text-gray-500 mb-6">
          <span className="font-medium">Published: {formatDate(newsletter.publishDate)}</span>
        </div>
        <div className="flex justify-center gap-4">
          <Link
            href="/newsletters"
            className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <FaArrowLeft className="w-5 h-5 mr-2" />
            Back to Newsletters
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="relative">
                <div 
                  className="w-full h-[800px] [&>iframe]:w-full [&>iframe]:!h-full [&>embed]:w-full [&>embed]:!h-full [&>object]:w-full [&>object]:!h-full"
                  dangerouslySetInnerHTML={{ __html: newsletter.pdfPath }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}