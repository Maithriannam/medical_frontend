import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Loader2, ArrowLeft, Calendar, FileCheck2 } from 'lucide-react';
import api from '../api/axios';
import MedicalCard from '../components/UI/MedicalCard';

const HistoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/history/${id}`);
        setDetail(res.data);
      } catch (error) {
        console.error('Failed to fetch history details', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="animate-spin text-primary-teal" size={48} />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] items-center justify-center gap-4">
        <p className="text-gray-500">History record not found.</p>
        <button onClick={() => navigate('/history')} className="btn-primary">Back to History</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/history')}
          className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-text-dark dark:text-white">Record Details</h1>
          <p className="text-gray-500 dark:text-gray-400">View complete information for this medical event.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MedicalCard icon={FileText} title="Overview">
          <div className="space-y-4 mt-2">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Record Type</p>
              <p className="text-lg font-medium text-text-dark dark:text-white">{detail.type || 'Diagnosis'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Description / Action</p>
              <p className="text-md text-text-dark dark:text-white">{detail.action || detail.description || 'Routine Checkup completed safely.'}</p>
            </div>
            <div className="flex items-center gap-2 mt-4 text-gray-600 dark:text-gray-300">
              <Calendar size={18} className="text-primary-teal" />
              <span>{detail.date ? new Date(detail.date).toLocaleString() : new Date().toLocaleString()}</span>
            </div>
          </div>
        </MedicalCard>

        <MedicalCard icon={FileCheck2} title="Verdict & Status">
          <div className="space-y-4 mt-2">
             <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
               <p className="text-sm text-gray-500">Current Status</p>
               <span className={`inline-flex px-3 py-1 mt-1 text-sm font-semibold rounded-full ${detail.status === 'Completed' || detail.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                 {detail.status || 'Resolved'}
               </span>
             </div>
             
             {detail.notes && (
               <div>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Doctor/AI Notes</p>
                 <p className="text-md text-text-dark dark:text-white mt-1">{detail.notes}</p>
               </div>
             )}
          </div>
        </MedicalCard>
      </div>
    </div>
  );
};

export default HistoryDetail;
