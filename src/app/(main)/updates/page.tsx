import { db } from "@/db";
import { updates as updatesTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600; // Revalidate every hour

export default async function UpdatesListPage() {
  const allUpdates = await db.select().from(updatesTable).orderBy(desc(updatesTable.pubDate));

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-3">
      <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
        <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold">Updates & Announcements</h2>
        <p className="font-light sm:text-xl">Stay informed with the latest updates and announcements from Students Parliament IIT BHU.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {allUpdates.map(item => (
          <Link href={`/updates/${item.slug}`} key={item.slug} className="block bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <article className="p-6">
              <div className="flex justify-between items-center mb-5 text-gray-500">
                <span className="text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded bg-green-100 text-green-800">Update</span>
                <span className="text-sm">{formatDate(item.pubDate)}</span>
              </div>
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{item.title}</h2>
              <p className="mb-5 font-light text-gray-500 line-clamp-3">{item.summary}</p>
              <div className="flex items-center space-x-4">
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                  <FaUser className="w-4 h-4 text-gray-600" />
                </div>
                <span className="font-medium">{item.author}</span>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {allUpdates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No updates available at the moment.</p>
        </div>
      )}
    </div>
  );
}