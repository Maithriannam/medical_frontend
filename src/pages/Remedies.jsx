import React, { useState } from 'react';
import { Pill, Search, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import MedicalCard from '../components/UI/MedicalCard';

const Remedies = () => {
  const [condition, setCondition] = useState('');
  const [remedies, setRemedies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!condition.trim()) {
      return toast.error('Please enter a condition');
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.get(`/remedies/${condition}`);
      
      // Assume API returns array of remedies or object with remedies list
      const data = Array.isArray(res.data) ? res.data : (res.data?.remedies || [res.data]);
      setRemedies(data);
      if(data.length === 0) toast('No remedies found for this condition.');
    } catch (error) {
      console.error('Failed to fetch remedies', error);
      setRemedies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-text-dark dark:text-white">Remedies & Treatments</h1>
        <p className="text-gray-500 dark:text-gray-400">Search for AI-recommended home remedies and medical guidelines.</p>
      </div>

      <MedicalCard className="bg-teal-50/50 dark:bg-gray-800/50 border border-teal-100 dark:border-gray-700">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3 text-gray-400 flex items-center justify-center" size={20} />
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g., Eczema, Psoriasis, Acne..."
              className="input-field pl-12 h-12 text-lg"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary h-12 px-8 text-lg font-medium whitespace-nowrap"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : 'Search Causes'}
          </button>
        </form>
      </MedicalCard>

      {hasSearched && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-text-dark dark:text-white flex items-center gap-2">
            <Pill className="text-primary-teal" />
            Suggested Remedies for "{condition}"
          </h3>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary-teal" size={40} /></div>
          ) : remedies.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {remedies.map((remedy, idx) => (
                 <MedicalCard key={idx} className="h-full">
                    <div className="flex flex-col h-full">
                      <div className="mb-4">
                        <span className="px-3 py-1 bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 text-xs font-bold rounded-full uppercase tracking-wider">
                          {remedy.category || 'Treatment'}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-text-dark dark:text-white mb-2">{remedy.title || remedy.name || 'Treatment Guideline'}</h4>
                      <p className="text-gray-600 dark:text-gray-300 flex-1">
                        {remedy.description || remedy.details || remedy.instructions || 'Follow standard medical procedures for this condition.'}
                      </p>
                      
                      {remedy.warning && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg">
                          <p className="text-sm text-red-700 dark:text-red-400 font-medium">⚠️ {remedy.warning}</p>
                        </div>
                      )}
                    </div>
                 </MedicalCard>
               ))}
             </div>
          ) : (
            <MedicalCard>
              <div className="py-8 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No verified remedies found in our database.</p>
                <p className="text-sm text-gray-400 mt-2">Please try searching with a different medical term or consult a doctor.</p>
              </div>
            </MedicalCard>
          )}
        </div>
      )}
    </div>
  );
};

export default Remedies;
