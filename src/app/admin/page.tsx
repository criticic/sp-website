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
    { title: 'Updates', value: stats.updates, icon: FaFileAlt, color: 'bg-blue-100 text-blue-600' },
    { title: 'Newsletters', value: stats.newsletters, icon: FaRegNewspaper, color: 'bg-green-100 text-green-600' },
    { title: 'Team Members', value: stats.members, icon: FaUsers, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statCards.map((card) => (
                <div key={card.title} className="p-6 bg-white rounded-lg shadow-md flex items-center">
                    <div className={`p-4 rounded-full mr-4 ${card.color}`}>
                        <card.icon className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-500">{card.title}</h2>
                        <p className="text-4xl font-bold text-gray-800">{card.value}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}