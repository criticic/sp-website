import { db } from "@/db";
import { newsletters, updates, members } from "@/db/schema";
import { count } from 'drizzle-orm';
import { FaRegNewspaper, FaFileAlt, FaUsers } from 'react-icons/fa';

async function getStats() {
    const updatesCount = await db.select({ value: count() }).from(updates);
    const newslettersCount = await db.select({ value: count() }).from(newsletters);
    const membersCount = await db.select({ value: count() }).from(members);
    return {
        updates: updatesCount[0].value,
        newsletters: newslettersCount[0].value,
        members: membersCount[0].value,
    };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { title: 'Updates', value: stats.updates, icon: FaFileAlt },
    { title: 'Newsletters', value: stats.newsletters, icon: FaRegNewspaper },
    { title: 'Team Members', value: stats.members, icon: FaUsers },
  ];

  return (
    <div>
      <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-2">Admin</p>
      <h1 className="text-3xl md:text-4xl mb-10">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div key={card.title} className="bg-light-parchment border-t-2 border-gold/30 p-6">
            <div className="flex items-start justify-between mb-3">
              <card.icon className="w-6 h-6 text-slate" />
            </div>
            <p className="font-mono text-3xl text-ink mb-1">{card.value}</p>
            <p className="font-mono text-xs text-slate uppercase tracking-wider">{card.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
