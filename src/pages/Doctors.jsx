import React, { useEffect, useState } from 'react';
import { Search, Loader2, Star, Users } from 'lucide-react';
import api from '../api/axios';
import MedicalCard from '../components/UI/MedicalCard';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/doctors');
        setDoctors(res.data || []);
      } catch (error) {
        console.error('Failed to fetch doctors', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doc => 
    doc.specialization?.toLowerCase().includes(filter.toLowerCase()) ||
    doc.name?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-dark dark:text-white">Our Specialists</h1>
          <p className="text-gray-500 dark:text-gray-400">Find and book appointments with top doctors.</p>
        </div>
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field pl-10"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary-teal" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc, idx) => (
              <MedicalCard key={idx} className="hover:-translate-y-1 transition-transform">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 bg-teal-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-primary-teal shrink-0">
                    <Users size={30} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-dark dark:text-white">{doc.name}</h3>
                    <p className="text-sm font-medium text-primary-teal mb-1">{doc.specialization}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span>{doc.rating || '4.8'} ({doc.reviews || 120} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {doc.about || 'Experienced specialist committed to providing excellent patient care.'}
                  </p>
                  <button className="w-full btn-secondary text-primary-teal border-primary-teal hover:bg-teal-50 dark:hover:bg-gray-700">
                    Book Appointment
                  </button>
                </div>
              </MedicalCard>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500">
              No doctors found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Doctors;
