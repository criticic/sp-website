'use client';
import { useEffect, useState } from 'react';
import { FaUsers, FaQrcode, FaUserGraduate } from 'react-icons/fa';

type Stats = {
  students: number;
  scans: number;
  completedProfiles: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ students: 0, scans: 0, completedProfiles: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const statCards = [
    { title: 'Total Students', value: stats.students, icon: FaUsers, color: 'bg-blue-100 text-blue-600' },
    { title: 'Total Scans', value: stats.scans, icon: FaQrcode, color: 'bg-green-100 text-green-600' },
    { title: 'Complete Profiles', value: stats.completedProfiles, icon: FaUserGraduate, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div>
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
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
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="/admin/students/new" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <h3 className="font-semibold text-blue-800">Add New Student</h3>
                    <p className="text-blue-600 text-sm">Create a new student profile</p>
                </a>
                <a href="/admin/students" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <h3 className="font-semibold text-green-800">View All Students</h3>
                    <p className="text-green-600 text-sm">Manage existing student records</p>
                </a>
            </div>
        </div>
    </div>
  );
}