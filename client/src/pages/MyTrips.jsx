import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TripCard from '../components/TripCard';
import { tripsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Filter, Search, BookMarked, Compass, Clock, MapPin } from 'lucide-react';

const statusFilters = [
  { label: 'All', value: '' },
  { label: 'Generated', value: 'generated' },
  { label: 'Saved', value: 'saved' },
  { label: 'Draft', value: 'draft' },
  { label: 'Shared', value: 'shared' },
];

const MyTrips = () => {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['trips', user?._id, filter],
    queryFn: () => tripsAPI.getAll({ status: filter || undefined, limit: 20 }),
    select: (res) => res.data,
    enabled: !!user?._id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => tripsAPI.delete(id),
    onSuccess: () => {
      qc.invalidateQueries(['trips']);
      toast.success('Trip deleted');
    },
    onError: () => toast.error('Failed to delete trip'),
  });

  const handleDelete = (id) => {
    if (window.confirm('Delete this trip? This cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const trips = (data?.trips || []).filter(t =>
    !search || t.destination?.toLowerCase().includes(search.toLowerCase()) || t.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-page" style={{ minHeight: '100vh' }}>
      <Navbar />
      <Sidebar />

      <div className="main-content">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <BookMarked size={20} color="#4a8c6f" />
              <span style={{ fontSize: 14, color: '#7eb89a', fontWeight: 500 }}>Your Adventures</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#1a3a2e', marginBottom: 4 }}>
              My Trips
            </h1>
            <p style={{ color: '#6b7280', fontSize: 15 }}>
              {data?.pagination?.total || 0} trips planned
            </p>
          </div>
          <Link to="/trips/create" className="btn-primary" id="my-trips-create">
            <Plus size={18} />
            Plan New Trip
          </Link>
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
          <div className="input-icon-wrapper" style={{ flex: 1, minWidth: 200, maxWidth: 320 }}>
            <Search size={16} className="icon" />
            <input
              id="search-trips"
              type="text"
              className="input-field"
              placeholder="Search destinations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '10px 10px 10px 42px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {statusFilters.map(({ label, value }) => (
              <button
                key={value}
                id={`filter-${value || 'all'}`}
                onClick={() => setFilter(value)}
                style={{
                  padding: '8px 16px', borderRadius: 50, fontSize: 13, fontWeight: 500,
                  border: `2px solid ${filter === value ? '#4a8c6f' : 'rgba(74,140,111,0.2)'}`,
                  background: filter === value ? '#4a8c6f' : 'white',
                  color: filter === value ? 'white' : '#374151',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Trip Grid */}
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height: 360, borderRadius: 24 }} className="skeleton" />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🗺️</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#1a3a2e', marginBottom: 10 }}>
              {search || filter ? 'No matching trips found' : 'No trips yet'}
            </h2>
            <p style={{ color: '#9ca3af', fontSize: 15, marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }}>
              {search || filter ? 'Try adjusting your search or filter.' : 'Start planning your first eco-adventure today!'}
            </p>
            {!search && !filter && (
              <Link to="/trips/create" className="btn-primary" id="empty-create-trip">
                <Plus size={18} />
                Plan My First Trip
              </Link>
            )}
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {trips.map(trip => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  onDelete={handleDelete}
                  showActions
                />
              ))}
            </div>
            {data?.pagination && data.pagination.total > trips.length && (
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <p style={{ color: '#9ca3af', fontSize: 14 }}>
                  Showing {trips.length} of {data.pagination.total} trips
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyTrips;
