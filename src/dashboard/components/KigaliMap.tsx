import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useDashboard } from '../context/DashboardContext';
import 'leaflet/dist/leaflet.css';
import '../Dashboard.css';

const KIGALI_CENTER: [number, number] = [-1.9441, 30.0619];

const statusColor: Record<string, string> = {
  full: '#16a34a',
  low: '#d97706',
  critical: '#dc2626',
};

export function KigaliMap() {
  const { schools, openModal } = useDashboard();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="chart-card map-card animate-in" data-tour="map">
        <div className="map-placeholder">Loading map…</div>
      </section>
    );
  }

  return (
    <section className="chart-card map-card animate-in" data-tour="map">
      <div className="chart-card-header">
        <h2 className="chart-card-title font-serif">Schools in Kigali</h2>
        <p className="chart-card-subtitle">Tap a pin to view deployment details</p>
      </div>
      <div className="map-wrap">
        <MapContainer center={KIGALI_CENTER} zoom={12} scrollWheelZoom={false} className="kigali-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {schools.map((school) => (
            <CircleMarker
              key={school.id}
              center={[school.lat, school.lng]}
              radius={14}
              pathOptions={{
                color: '#ffffff',
                weight: 3,
                fillColor: statusColor[school.status] ?? '#ec4899',
                fillOpacity: 0.9,
              }}
              eventHandlers={{
                click: () => openModal({ type: 'school-detail', schoolId: school.id }),
              }}
            >
              <Popup>
                <strong>{school.name}</strong>
                <br />
                {school.girls} girls · {school.fillPercent}% stock
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}
