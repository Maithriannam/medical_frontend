import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Loader2, Key } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import MedicalCard from '../components/UI/MedicalCard';

const Profile = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    bio: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/user/profile?email=${user?.email}`);
        if(res.data) {
          setFormData(prev => ({
            ...prev,
            ...res.data
          }));
        }
      } catch (error) {
        console.error('Failed to load profile details', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/user/update', formData);
      toast.success('Profile updated successfully');
      login({ ...user, name: formData.name });
    } catch (error) {
      console.error('Profile update failed', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="animate-spin text-primary-teal" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-text-dark dark:text-white">Profile Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account details and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <MedicalCard className="text-center">
            <div className="flex flex-col items-center">
              <div className="h-32 w-32 bg-teal-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-primary-teal mb-4 overflow-hidden shadow-inner shrink-0">
                <User size={64} className="opacity-80" />
              </div>
              <h2 className="text-xl font-bold text-text-dark dark:text-white">{formData.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{formData.email}</p>
              
              <div className="w-full pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-3">
                <button className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors w-full text-left font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                  <User size={18} className="text-primary-teal" /> Personal Info
                </button>
                <button className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors w-full text-left font-medium text-gray-600 dark:text-gray-400">
                  <Key size={18} className="text-primary-teal" /> Security
                </button>
              </div>
            </div>
          </MedicalCard>
        </div>

        <div className="lg:col-span-2">
          <MedicalCard title="Personal Information">
            <form className="space-y-6 mt-4" onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input 
                      name="name" type="text" value={formData.name} onChange={handleChange}
                      className="input-field pl-10" required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input 
                      name="email" type="email" value={formData.email} disabled
                      className="input-field pl-10 opacity-70 cursor-not-allowed" 
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input 
                      name="phone" type="tel" value={formData.phone} onChange={handleChange}
                      className="input-field pl-10" placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input 
                      name="address" type="text" value={formData.address} onChange={handleChange}
                      className="input-field pl-10" placeholder="New York, USA"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Medical Bio / Notes</label>
                <textarea 
                  name="bio" value={formData.bio} onChange={handleChange}
                  className="input-field min-h-[100px]" 
                  placeholder="Any pre-existing conditions or medical history notes..."
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="submit" disabled={saving} className="btn-primary w-full md:w-auto px-8">
                  {saving ? <><Loader2 className="animate-spin" size={18} /> Saving...</> : 'Save Changes'}
                </button>
              </div>
            </form>
          </MedicalCard>
        </div>
      </div>
    </div>
  );
};

export default Profile;
