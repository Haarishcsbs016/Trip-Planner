import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tripsAPI } from '../services/api';
import DayCard from '../components/DayCard';
import BudgetCard from '../components/BudgetCard';
import Navbar from '../components/Navbar';
import { MapPin, Calendar, Users, IndianRupee, Leaf } from 'lucide-react';

const SharedTrip = () => {
  const { shareId } = useParams();

  const { data: trip, isLoading, error } = useQuery({
    queryKey: ['shared-trip', shareId],
    queryFn: () => tripsAPI.getShared(shareId),
    select: (res) => res.data.trip,
  });

  if (isLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f0e8' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16, animation: 'float 2s ease-in-out infinite' }}>🌿</div>
        <p style={{ color: '#6b7280' }}>Loading shared trip...</p>
      </div>
    </div>
  );

  if (error || !trip) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f0e8' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2e' }}>Trip not found</h2>
        <p style={{ color: '#9ca3af', marginTop: 8 }}>This shared link may be invalid or expired.</p>
      </div>
    </div>
  );

  const totalTravelers = (trip.travelers?.adults || 1) + (trip.travelers?.children || 0);

  return (
    <div className="bg-page" style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '100px 24px 48px' }}>
        {/* Shared badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <Leaf size={16} color="#4a8c6f" />
          <span style={{ fontSize: 13, color: '#7eb89a', fontWeight: 600 }}>Shared Trip Itinerary</span>
        </div>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1a3a2e 0%, #2d5a45 100%)',
          borderRadius: 28, padding: 40, marginBottom: 28, color: 'white',
        }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, marginBottom: 10 }}>
            {trip.title}
          </h1>
          {trip.summary && <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, marginBottom: 20 }}>{trip.summary}</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {[
              { icon: MapPin, text: `${trip.startLocation} → ${trip.destination}` },
              { icon: Calendar, text: `${trip.startDate} – ${trip.endDate}` },
              { icon: Users, text: `${totalTravelers} Travelers` },
              { icon: IndianRupee, text: `₹${(trip.estimatedCost || 0).toLocaleString('en-IN')} Est.` },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(255,255,255,0.12)', borderRadius: 50 }}>
                <Icon size={13} color="rgba(255,255,255,0.8)" />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#1a3a2e', marginBottom: 16 }}>
              📅 Itinerary
            </h2>
            {trip.itinerary?.map((day, i) => (
              <DayCard key={day.day || i} day={day} defaultExpanded={i === 0} />
            ))}
          </div>
          <BudgetCard
            budget={trip.budget}
            estimatedCost={trip.estimatedCost}
            budgetStatus={trip.budgetStatus}
            budgetBreakdown={trip.budgetBreakdown}
          />
        </div>
      </div>
    </div>
  );
};

export default SharedTrip;
