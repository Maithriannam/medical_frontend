import React, { useEffect, useState } from 'react';
import { MapPin, Building2, Loader2, Phone, Navigation } from 'lucide-react';
import api from '../api/axios';
import MedicalCard from '../components/UI/MedicalCard';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for custom marker icons not showing by default in react-leaflet 
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Sub-component to dynamically fly the map to requested markers
const MapFlight = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { duration: 1.5 });
  }, [center, map]);
  return null;
}

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLocation, setActiveLocation] = useState([40.7128, -74.0060]); // NYC default

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await api.get('/hospitals');
        // If API doesn't return lat/lng, attach random nearby offsets from default for demonstration
        const mockCoordHospitals = (res.data || []).map((h, i) => ({
          ...h,
          lat: h.lat || (40.7128 + (Math.random() - 0.5) * 0.1),
          lng: h.lng || (-74.0060 + (Math.random() - 0.5) * 0.1)
        }));
        setHospitals(mockCoordHospitals);
        if (mockCoordHospitals.length > 0) {
          setActiveLocation([mockCoordHospitals[0].lat, mockCoordHospitals[0].lng]);
        }
      } catch (error) {
        console.error('Failed to fetch hospitals', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between mt-2">
        <div>
          <h1 className="text-3xl font-bold text-text-dark dark:text-white">Hospital Directory</h1>
          <p className="text-gray-500 dark:text-gray-400">Locate certified clinics and medical facilities near you.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 h-[600px] mb-8">
        
        {/* LEAFLET MAP VIEW */}
        <div className="lg:col-span-7 h-full rounded-2xl overflow-hidden shadow-soft border border-gray-200 dark:border-gray-700 relative z-0">
          <MapContainer center={activeLocation} zoom={12} scrollWheelZoom={true} className="h-full w-full object-cover">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapFlight center={activeLocation} />
            
            {hospitals.map((hospital, idx) => (
              <Marker key={idx} position={[hospital.lat, hospital.lng]}>
                <Popup className="rounded-2xl">
                  <div className="p-1">
                    <h3 className="font-bold text-gray-900 border-b pb-1 mb-2">{hospital.name}</h3>
                    <p className="text-sm text-gray-600 flex items-start gap-1"><MapPin size={14} className="mt-0.5 shrink-0"/>{hospital.address}</p>
                    <p className="text-sm font-semibold text-primary-teal flex items-center gap-1 mt-1"><Phone size={14}/>{hospital.contact || '+1 555-0101'}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* LIST VIEW */}
        <div className="lg:col-span-5 flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-bold flex items-center gap-2 dark:text-white"><Navigation size={18} className="text-primary-teal"/> Nearby Clinics</h3>
          </div>
          
          <div className="overflow-y-auto flex-1 p-4 space-y-4">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary-teal" size={40} /></div>
            ) : hospitals.length > 0 ? (
              hospitals.map((hospital, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveLocation([hospital.lat, hospital.lng])}
                  className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary-teal dark:hover:border-teal-500 cursor-pointer transition-colors bg-white dark:bg-gray-800"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-text-dark dark:text-white leading-tight pr-4">{hospital.name}</h3>
                    <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full shrink-0 ${hospital.status === 'Active' || !hospital.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {hospital.status || 'Active'}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400 mt-3">
                    <MapPin size={16} className="shrink-0 mt-0.5 text-gray-400" />
                    <span>{hospital.address || 'Medical Center Drive, Health City'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                    <Phone size={16} className="text-gray-400" />
                    <span>{hospital.contact || '+1 (555) 123-4567'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-500 text-sm">
                No partnered hospitals available in this area.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hospitals;
