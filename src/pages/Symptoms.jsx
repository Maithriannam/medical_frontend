import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Info, Activity } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const symptomDatabase = [
  {
    id: 's1',
    name: 'Erythema (Redness)',
    description: 'Abnormal redness of the skin often caused by increased blood flow.',
    severity: 'low',
  },
  {
    id: 's2',
    name: 'Pruritus (Itching)',
    description: 'An uncomfortable, irritating sensation that creates an urge to scratch.',
    severity: 'low',
  },
  {
    id: 's3',
    name: 'Swelling & Inflammation',
    description: 'Enlargement of skin tissues caused by fluid accumulation or immune response.',
    severity: 'medium',
  },
  {
    id: 's4',
    name: 'Blistering',
    description: 'Fluid-filled sacs on the skin surface due to burns, friction, or infection.',
    severity: 'high',
  },
  {
    id: 's5',
    name: 'Scaling / Flaking',
    description: 'Visible peeling or shedding of the outermost skin layer.',
    severity: 'medium',
  },
  {
    id: 's6',
    name: 'Rapidly Spreading Rash',
    description: 'A noticeable change in skin texture or color spreading actively across areas.',
    severity: 'high',
  }
];

const getSeverityColor = (severity) => {
  switch(severity) {
    case 'high': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
    case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
    default: return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
  }
};

const Symptoms = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();

  const toggleSymptom = (id) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) return;
    setAnalyzing(true);
    try {
      const symptomsNames = selectedSymptoms.map(id => symptomDatabase.find(s => s.id === id)?.name).join(', ');
      await api.post('/diagnosis/analyze', { symptoms: symptomsNames });
      toast.success('Assessment complete! View your results in History.');
      navigate('/history');
    } catch (error) {
      console.error('Failed formatting assessment', error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto md:mt-4">
      <div className="flex flex-col gap-1 mb-8 text-left">
        <h1 className="text-3xl lg:text-4xl font-bold text-text-dark dark:text-white">Symptom Assessment</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Select the primary symptoms you are experiencing to generate a pre-clinical assessment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {symptomDatabase.map((symptom) => {
          const isSelected = selectedSymptoms.includes(symptom.id);
          return (
            <div 
              key={symptom.id}
              onClick={() => toggleSymptom(symptom.id)}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col gap-3 ${
                isSelected 
                  ? 'border-primary-teal bg-teal-50 dark:bg-gray-700 shadow-md ring-1 ring-primary-teal'
                  : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-teal-300 hover:shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className={`text-lg font-bold ${isSelected ? 'text-primary-teal' : 'text-text-dark dark:text-white'}`}>
                  {symptom.name}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getSeverityColor(symptom.severity)}`}>
                  {symptom.severity} Risk
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {symptom.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-soft mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 text-text-dark dark:text-gray-300">
          <Info className="flex-shrink-0 text-primary-teal" size={24} />
          <p className="text-sm">Select one or more symptoms above to proceed with your AI analysis.</p>
        </div>
        <button 
          onClick={handleAnalyze}
          disabled={selectedSymptoms.length === 0 || analyzing}
          className="btn-primary px-8 py-3 w-full md:w-auto text-lg whitespace-nowrap disabled:opacity-50"
        >
          {analyzing ? <Loader2 className="animate-spin" size={20} /> : <Activity size={20} />}
          {analyzing ? 'Analyzing...' : 'Generate Analysis'}
        </button>
      </div>
    </div>
  );
};

export default Symptoms;
