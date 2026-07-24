import { db } from "@/db";
import { newsletters as newslettersTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { FaNewspaper } from "react-icons/fa";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600; // Revalidate every hour

export default async function NewsletterListPage() {
  const newsletters = await db
    .select()
    .from(newslettersTable)
    .orderBy(desc(newslettersTable.publishDate));

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-3">
      <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
        <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold">Newsletters</h2>
        <p className="font-light sm:text-xl">Browse and read our newsletters featuring campus updates, student achievements, and important announcements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsletters.map((newsletter) => (
          <Link
            key={newsletter.id}
            href={`/newsletters/${newsletter.id}`}
            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105 block"
          >
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                  <FaNewspaper className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{newsletter.title}</h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-3">{newsletter.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  <span className="font-medium">Published: {formatDate(newsletter.publishDate)}</span>
                </div>
                <div className="flex justify-center gap-3">
                  <span className="inline-flex items-center px-4 py-2 bg-accent text-white rounded-lg text-sm">
                    View Newsletter
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {newsletters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No newsletters available at the moment.</p>
        </div>
      )}
    </div>
  );
}