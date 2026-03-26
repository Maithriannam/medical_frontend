import React, { useEffect, useState } from 'react';
import { Search, Loader2, Star, Users, Calendar, Clock, Edit3, X, MapPin, BadgeDollarSign } from 'lucide-react';
import api from '../api/axios';
import MedicalCard from '../components/UI/MedicalCard';
import toast from 'react-hot-toast';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  
  const [bookingModal, setBookingModal] = useState({ isOpen: false, doctor: null });
  const [bookingForm, setBookingForm] = useState({ date: '', time: '', symptoms: '' });
  const [submitting, setSubmitting] = useState(false);

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

  const openBooking = (doc) => {
    setBookingModal({ isOpen: true, doctor: doc });
    setBookingForm({ date: '', time: '', symptoms: '' });
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!bookingForm.date || !bookingForm.time) return toast.error('Please select date and time');
    
    setSubmitting(true);
    try {
      await api.post('/bookings', {
        doctorId: bookingModal.doctor?.id || 1, // fallback ID if not strictly defined 
        doctorName: bookingModal.doctor?.name,
        date: bookingForm.date,
        time: bookingForm.time,
        symptoms: bookingForm.symptoms,
        cost: bookingModal.doctor?.consultationFee || '$80',
        experience: bookingModal.doctor?.experience || '10+ Years',
        status: 'Pending'
      });
      toast.success('Appointment booked successfully!');
      setBookingModal({ isOpen: false, doctor: null });
    } catch(err) {
      console.error(err);
      toast.error('Could not communicate with Booking backend');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.specialization?.toLowerCase().includes(filter.toLowerCase()) ||
    doc.name?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
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
              <MedicalCard key={idx} className="hover:-translate-y-1 transition-transform group">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 bg-teal-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-primary-teal shrink-0">
                    <Users size={30} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-dark dark:text-white">{doc.name}</h3>
                    <p className="text-sm font-medium text-primary-teal mb-1">{doc.specialization}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span>{doc.rating || '4.8'}</span>
                      <span className="mx-1">•</span>
                      <span>{doc.experience || '10+ Yrs'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-400"/> {doc.location || 'City Hospital'}</div>
                    <div className="flex items-center gap-1.5 font-semibold text-primary-teal"><BadgeDollarSign size={16}/> {doc.consultationFee || '$80'}</div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {doc.about || 'Experienced specialist committed to providing excellent patient care. Specialized in clinical treatments and diagnostics.'}
                  </p>
                  
                  <button 
                    onClick={() => openBooking(doc)}
                    className="w-full btn-primary mt-2"
                  >
                    Book Now
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

      {/* Booking Modal */}
      {bookingModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-text-dark dark:text-white">Book Appointment</h2>
              <button 
                onClick={() => setBookingModal({ isOpen: false, doctor: null })}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleBook} className="p-6 space-y-5">
              <div className="flex items-center gap-4 p-4 bg-teal-50 dark:bg-gray-900 rounded-2xl border border-teal-100 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-primary-teal text-white flex justify-center items-center"><Users /></div>
                <div>
                  <h4 className="font-bold text-text-dark dark:text-white">{bookingModal.doctor?.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{bookingModal.doctor?.specialization} • {bookingModal.doctor?.experience || '10+ Yrs'}</p>
                </div>
                <div className="ml-auto font-bold text-primary-teal">
                  {bookingModal.doctor?.consultationFee || '$80'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><Calendar size={16}/> Date</label>
                  <input 
                    type="date" 
                    required 
                    className="input-field w-full"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingForm.date}
                    onChange={e => setBookingForm({...bookingForm, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><Clock size={16}/> Time</label>
                  <input 
                    type="time" 
                    required 
                    className="input-field w-full"
                    value={bookingForm.time}
                    onChange={e => setBookingForm({...bookingForm, time: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><Edit3 size={16}/> Current Symptoms</label>
                <textarea 
                  className="input-field w-full min-h-[100px] resize-none"
                  placeholder="Briefly describe what you're experiencing..."
                  value={bookingForm.symptoms}
                  onChange={e => setBookingForm({...bookingForm, symptoms: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-lg mt-2">
                {submitting ? <Loader2 className="animate-spin text-white text-center w-full" /> : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
