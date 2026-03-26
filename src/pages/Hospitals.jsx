import React, { useEffect, useState } from 'react';
import { MapPin, Building2, Loader2, Phone } from 'lucide-react';
import api from '../api/axios';
import MedicalCard from '../components/UI/MedicalCard';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await api.get('/hospitals');
        setHospitals(res.data || []);
      } catch (error) {
        console.error('Failed to fetch hospitals', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-dark dark:text-white">Partner Hospitals</h1>
          <p className="text-gray-500 dark:text-gray-400">Discover trusted medical facilities near you.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary-teal" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {hospitals.length > 0 ? (
            hospitals.map((hospital, idx) => (
              <MedicalCard key={idx}>
                <div className="flex flex-row items-center gap-4">
                  <div className="h-24 w-24 bg-teal-50 dark:bg-gray-700 rounded-xl flex items-center justify-center shrink-0">
                    <Building2 size={40} className="text-primary-teal" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-text-dark dark:text-white mb-1">{hospital.name}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${hospital.status === 'Active' || !hospital.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {hospital.status || 'Active'}
                      </span>
                    </div>
                    
                    <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <MapPin size={16} className="shrink-0 mt-0.5 text-gray-400" />
                      <span>{hospital.address || '123 Medical Center Drive, Health City'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <Phone size={16} className="text-gray-400" />
                      <span>{hospital.contact || '+1 (555) 123-4567'}</span>
                    </div>
                  </div>
                </div>
              </MedicalCard>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500">
              No partnered hospitals available at the moment.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Hospitals;
