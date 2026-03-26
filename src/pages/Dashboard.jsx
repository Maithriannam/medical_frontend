import React, { useEffect, useState } from 'react';
import { Activity, Users, Stethoscope, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MedicalCard from '../components/UI/MedicalCard';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, historyRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/history')
        ]);
        setSummary(summaryRes.data);
        setHistory(historyRes.data?.slice(0, 5) || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-primary-teal" size={48} />
      </div>
    );
  }

  const stats = [
    { title: 'Total Patients', value: summary?.totalPatients || 0, icon: Users },
    { title: 'Consultations', value: summary?.consultations || 0, icon: Stethoscope },
    { title: 'Critical Cases', value: summary?.criticalCases || 0, icon: AlertCircle },
    { title: 'Active Treatments', value: summary?.activeTreatments || 0, icon: Activity },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-dark dark:text-white">
          Welcome back, {user?.name || user?.email?.split('@')[0]}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Here's your overview for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <MedicalCard key={idx} icon={stat.icon} title={stat.title}>
            <p className="text-4xl font-bold mt-2 text-primary-teal">{stat.value}</p>
          </MedicalCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MedicalCard title="Recent Activity" icon={Activity}>
            {history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {history.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{item.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No recent activity found.</div>
            )}
          </MedicalCard>
        </div>
        
        <div className="lg:col-span-1">
          <MedicalCard title="Quick Actions">
            <div className="flex flex-col gap-3 mt-4">
              <a href="/diagnosis" className="btn-primary block text-center">New Diagnosis</a>
              <a href="/doctors" className="btn-secondary block text-center">Find Doctor</a>
            </div>
          </MedicalCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
