import { db } from "@/db";
import { updates as updatesTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

export default async function UpdatesListPage() {
  const allUpdates = await db.select().from(updatesTable).orderBy(desc(updatesTable.pubDate));

  return (
    <div className="py-16 md:py-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-6">Updates</p>
        <h2 className="mb-4">Updates & Announcements</h2>
        <div className="rostrum-rule my-6 justify-center">◆</div>
        <p className="text-lg text-slate leading-relaxed max-w-xl mx-auto">Stay informed with the latest updates from Students Parliament IIT BHU.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {allUpdates.map(item => (
          <Link href={`/updates/${item.slug}`} key={item.slug} className="block bg-light-parchment border-t-2 border-gold/30 hover:border-gold transition-colors duration-300">
            <article className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-xs text-gold uppercase tracking-wider">Update</span>
                <span className="font-mono text-xs text-slate">{formatDate(item.pubDate)}</span>
              </div>
              <h3 className="font-body font-medium text-ink text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-slate leading-relaxed line-clamp-3 mb-4 font-body">{item.summary}</p>
              <div className="flex items-center gap-2 text-xs font-mono text-slate">
                <FaUser className="w-3 h-3" />
                <span>{item.author}</span>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {allUpdates.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate font-body">No updates available at the moment.</p>
        </div>
      )}
    </div>
  );
}
