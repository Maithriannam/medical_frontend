import React, { useState, useEffect } from 'react';
import { Upload, FileText, Loader2, List } from 'lucide-react';
import { toast } from 'react-hot-toast';
import MedicalCard from '../components/UI/MedicalCard';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Diagnosis = () => {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/diagnosis');
      setHistory(res.data || []);
    } catch (error) {
      console.error('Failed to load diagnosis history', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!symptoms) {
      return toast.error('Please provide symptoms');
    }

    setAnalyzing(true);
    try {
      const payload = {
        symptoms,
        email: user?.email,
      };
      
      const res = await api.post('/diagnosis/analyze', payload);
      setResult(res.data);
      toast.success('Analysis complete');
      fetchHistory(); 
    } catch (error) {
      console.error('Analysis failed', error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-dark dark:text-white">AI Diagnosis</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MedicalCard title="New Analysis" icon={Upload}>
          <form className="space-y-4 mt-2" onSubmit={handleAnalyze}>
            <div>
              <label className="block text-sm font-medium mb-1">Describe Symptoms</label>
              <textarea
                className="input-field min-h-[120px]"
                placeholder="E.g., Red itchy patch on arm for 3 days..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              disabled={analyzing}
              className="w-full btn-primary"
            >
              {analyzing ? <><Loader2 className="animate-spin" size={20} /> Analyzing...</> : 'Analyze Now'}
            </button>
          </form>
        </MedicalCard>

        {result && (
          <MedicalCard title="Analysis Result" icon={FileText} className="border-2 border-primary-teal">
            <div className="mt-2 space-y-4">
              <div className="p-4 bg-teal-50 dark:bg-gray-700/50 rounded-xl">
                <h4 className="font-semibold text-lg text-primary-teal">Predicted Condition</h4>
                <p className="text-xl font-bold mt-1 text-text-dark dark:text-white">
                  {result.condition || 'Unknown Condition'}
                </p>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                  Confidence: <span className="font-medium text-teal-600">{result.confidence || '95%'}</span>
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-text-dark dark:text-gray-200">Recommended Next Steps</h4>
                <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
                  {result.recommendation || 'Please consult a doctor for a formal diagnosis.'}
                </p>
              </div>
            </div>
          </MedicalCard>
        )}
      </div>

      <MedicalCard title="Diagnosis History" icon={List}>
        {historyLoading ? (
          <div className="flex justify-center py-6"><Loader2 className="animate-spin text-primary-teal" /></div>
        ) : history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {history.map((record, idx) => (
              <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-shadow bg-surface-light dark:bg-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{new Date(record.date || Date.now()).toLocaleDateString()}</span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-semibold rounded-full dark:text-gray-200">
                    {record.status || 'Reviewed'}
                  </span>
                </div>
                <h4 className="font-bold text-lg mb-1">{record.condition}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{record.symptoms}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-6 text-gray-500">No diagnosis history available.</p>
        )}
      </MedicalCard>
    </div>
  );
};

export default Diagnosis;
