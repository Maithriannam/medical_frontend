import React, { useEffect, useState } from 'react';
import { History as HistoryIcon, Loader2, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import MedicalCard from '../components/UI/MedicalCard';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/history');
        const sortedHistory = (res.data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistory(sortedHistory);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const paginatedHistory = history.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-text-dark dark:text-white">Medical History</h1>
        <p className="text-gray-500 dark:text-gray-400">View your past diagnoses, treatments, and records.</p>
      </div>

      <MedicalCard icon={HistoryIcon} title="All Records">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary-teal" size={40} /></div>
        ) : history.length > 0 ? (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {paginatedHistory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <FileText size={16} className="text-primary-teal" />
                        {item.type || 'Diagnosis'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.action || item.description || 'Routine Checkup'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'Completed' || item.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {item.status || 'Resolved'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => navigate(`/history/${item.id || idx + 1}`)}
                          className="text-primary-teal hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, history.length)} of {history.length}
                </span>
                <div className="flex gap-2 text-text-dark dark:text-white">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <HistoryIcon size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
            <p>No medical records found.</p>
          </div>
        )}
      </MedicalCard>
    </div>
  );
};

export default History;
