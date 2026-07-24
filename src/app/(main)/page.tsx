import Link from "next/link";
import { db } from "@/db";
import { committees, members } from "@/db/schema";
import { count } from 'drizzle-orm';

export default async function HomePage() {
  const [committeesCount] = await db.select({ value: count() }).from(committees);
  const [membersCount] = await db.select({ value: count() }).from(members);

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center">
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24">
        <div className="max-w-4xl">
          <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-6">
            Students Parliament
          </p>

          <h1 className="mb-6">
            Empowering Student <br />
            <span className="text-gold">Voices</span> at IIT BHU
          </h1>

          <div className="rostrum-rule my-8">
            ◆
          </div>

          <p className="text-lg md:text-xl text-slate max-w-2xl leading-relaxed mb-10">
            The Students Parliament serves as the democratic voice of students, working towards academic excellence, student welfare, and institutional development through transparent governance and active participation.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">
              Get Involved
            </Link>
            <Link href="/team" className="btn-secondary">
              Our Team
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="border-t border-gold/30 pt-4">
              <p className="font-mono text-2xl text-ink">{committeesCount.value}</p>
              <p className="font-mono text-xs text-slate mt-1 uppercase tracking-wider">Committees</p>
            </div>
            <div className="border-t border-gold/30 pt-4">
              <p className="font-mono text-2xl text-ink">{membersCount.value}</p>
              <p className="font-mono text-xs text-slate mt-1 uppercase tracking-wider">Members</p>
            </div>
            <div className="border-t border-gold/30 pt-4">
              <p className="font-mono text-2xl text-ink">Est. 2012</p>
              <p className="font-mono text-xs text-slate mt-1 uppercase tracking-wider">Established</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
