import { db } from "@/db";
import { newsletters as newslettersTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { FaNewspaper } from "react-icons/fa";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

export default async function NewsletterListPage() {
  const newsletters = await db.select().from(newslettersTable).orderBy(desc(newslettersTable.publishDate));

  return (
    <div className="py-16 md:py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-6">Publications</p>
        <h2 className="mb-4">Newsletters</h2>
        <div className="rostrum-rule my-6 justify-center">◆</div>
        <p className="text-lg text-slate leading-relaxed max-w-xl mx-auto">Browse campus updates, student achievements, and important announcements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsletters.map((newsletter) => (
          <Link key={newsletter.id} href={`/newsletters/${newsletter.id}`} className="block bg-light-parchment border-t-2 border-gold/30 hover:border-gold transition-all duration-300 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center border border-slate/20 mb-4">
                <FaNewspaper className="w-6 h-6 text-slate" />
              </div>
              <h3 className="font-body font-medium text-ink text-base mb-2">{newsletter.title}</h3>
              <p className="text-xs text-slate leading-relaxed line-clamp-3 mb-4 font-body">{newsletter.description}</p>
              <div className="font-mono text-xs text-slate/70 mb-4">{formatDate(newsletter.publishDate)}</div>
              <span className="inline-block px-4 py-2 bg-ink text-white text-xs font-mono uppercase tracking-wider hover:bg-gold hover:text-ink transition-colors">
                View
              </span>
            </div>
          </Link>
        ))}
      </div>

      {newsletters.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate font-body">No newsletters available at the moment.</p>
        </div>
      )}
    </div>
  );
}
