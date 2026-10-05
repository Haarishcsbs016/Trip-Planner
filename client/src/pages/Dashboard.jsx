import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TripCard from '../components/TripCard';
import { tripsAPI } from '../services/api';
import { useAuthStore } from '../store/tripStore';
import {
  Plus, MapPin, Leaf, Compass, BookMarked,
  TrendingUp, Clock, Star, ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: tripsData, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: () => tripsAPI.getAll({ limit: 6 }),
    select: (res) => res.data,
  });

  const trips = tripsData?.trips || [];
  const savedTrips = trips.filter(t => t.status === 'saved');
  const recentTrips = trips.slice(0, 3);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-page">
      <Navbar />
      <Sidebar />

      <div className="main-content">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <Leaf size={20} color="#4a8c6f" />
                <span style={{ fontSize: 14, color: '#7eb89a', fontWeight: 500 }}>{getGreeting()}</span>
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(26px, 4vw, 36px)', color: '#1a3a2e', marginBottom: 6 }}>
                Welcome back, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p style={{ color: '#6b7280', fontSize: 15 }}>
                Where will your next adventure take you?
              </p>
            </div>

            <Link to="/trips/create" className="btn-primary" id="dashboard-plan-trip" style={{ whiteSpace: 'nowrap' }}>
              <Plus size={18} />
              Plan New Trip
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            {
              label: 'Total Trips',
              value: tripsData?.pagination?.total || 0,
              icon: Compass, color: '#4a8c6f', bg: 'rgba(74,140,111,0.1)',
            },
            {
              label: 'Saved Trips',
              value: savedTrips.length,
              icon: BookMarked, color: '#d4a843', bg: 'rgba(212,168,67,0.1)',
            },
            {
              label: 'Destinations',
              value: new Set(trips.map(t => t.destination)).size,
              icon: MapPin, color: '#4a90b8', bg: 'rgba(74,144,184,0.1)',
            },
            {
              label: 'Itineraries',
              value: trips.filter(t => t.status !== 'draft').length,
              icon: Star, color: '#8c4a8c', bg: 'rgba(140,74,140,0.1)',
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="stat-card">
              <div className="stat-icon" style={{ background: bg }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#1a3a2e' }}>{value}</div>
                <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Hero CTA if no trips */}
        {!isLoading && trips.length === 0 && (
          <div style={{
            borderRadius: 28,
            background: 'linear-gradient(135deg, #1a3a2e 0%, #2d5a45 60%, #1e4a35 100%)',
            padding: '60px 48px',
            textAlign: 'center',
            marginBottom: 32,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='50' cy='50' r='40'/%3E%3C/g%3E%3C/svg%3E\")" }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🗺️</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: 'white', marginBottom: 12 }}>
                Your Adventure Awaits
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 32, maxWidth: 420, margin: '0 auto 32px' }}>
                You haven't planned any trips yet. Let our AI craft your perfect nature escape — it takes just 2 minutes!
              </p>
              <Link to="/trips/create" className="btn-primary" id="empty-state-create" style={{ padding: '16px 40px', fontSize: 16 }}>
                <Plus size={18} />
                Plan My First Trip
              </Link>
            </div>
          </div>
        )}

        {/* Recent Trips */}
        {trips.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={18} color="#4a8c6f" />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#1a3a2e' }}>Recent Trips</h2>
              </div>
              <Link to="/my-trips" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#4a8c6f', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                View all <ChevronRight size={16} />
              </Link>
            </div>

            {isLoading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ height: 340, borderRadius: 24 }} className="skeleton" />
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {recentTrips.map(trip => (
                  <TripCard key={trip._id} trip={trip} showActions />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick actions */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#1a3a2e', marginBottom: 16 }}>
            Quick Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { icon: '🏔️', label: 'Adventure Trip', to: '/trips/create', desc: 'Mountains & Trekking' },
              { icon: '🏖️', label: 'Beach Getaway', to: '/trips/create', desc: 'Coastal & Relaxation' },
              { icon: '🌿', label: 'Nature Escape', to: '/trips/create', desc: 'Forests & Wildlife' },
              { icon: '🏛️', label: 'Heritage Tour', to: '/trips/create', desc: 'Culture & History' },
            ].map(({ icon, label, to, desc }) => (
              <Link
                key={label}
                to={to}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'white', borderRadius: 18, padding: '20px 18px',
                  border: '1px solid rgba(168,213,184,0.2)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease', cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; }}
                >
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1a3a2e', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
