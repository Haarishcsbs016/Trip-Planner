import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { userAPI } from '../services/api';
import { useAuthStore } from '../store/tripStore';
import toast from 'react-hot-toast';
import { User, Mail, Edit3, Save, Leaf, Camera, BookMarked, MapPin, Calendar } from 'lucide-react';

const travelStyleOptions = ['adventure', 'relaxation', 'nature', 'food', 'culture', 'history', 'photography', 'luxury', 'budget'];

const Profile = () => {
  const { user: storeUser, updateUser } = useAuthStore();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: storeUser?.name || '', bio: '', travelStyle: [] });

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userAPI.getProfile(),
    select: (res) => res.data,
    onSuccess: (data) => {
      setForm({
        name: data.user.name || '',
        bio: data.user.bio || '',
        travelStyle: data.user.travelStyle || [],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => userAPI.updateProfile(data),
    onSuccess: (res) => {
      updateUser(res.data.user);
      qc.invalidateQueries(['profile']);
      setEditing(false);
      toast.success('Profile updated! 🌿');
    },
    onError: () => toast.error('Update failed'),
  });

  const toggleStyle = (style) => {
    setForm(f => ({
      ...f,
      travelStyle: f.travelStyle.includes(style)
        ? f.travelStyle.filter(s => s !== style)
        : [...f.travelStyle, style],
    }));
  };

  const user = data?.user || storeUser;
  const stats = data?.stats;

  return (
    <div className="bg-page" style={{ minHeight: '100vh' }}>
      <Navbar />
      <Sidebar />

      <div className="main-content" style={{ maxWidth: 760 }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <User size={20} color="#4a8c6f" />
            <span style={{ fontSize: 14, color: '#7eb89a', fontWeight: 500 }}>Your Account</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#1a3a2e' }}>
            Profile
          </h1>
        </div>

        {/* Avatar + basic info */}
        <div className="glass-card" style={{ padding: 32, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: 90, height: 90, borderRadius: 24,
              background: 'linear-gradient(135deg, #1a3a2e, #4a8c6f)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, color: 'white', fontWeight: 800, flexShrink: 0,
            }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>

            <div style={{ flex: 1 }}>
              {editing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Name</label>
                    <input
                      id="profile-name"
                      type="text"
                      className="input-field"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Bio</label>
                    <textarea
                      id="profile-bio"
                      className="input-field"
                      rows={3}
                      placeholder="Tell us about yourself and your travel style..."
                      value={form.bio}
                      onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      id="save-profile"
                      onClick={() => updateMutation.mutate(form)}
                      className="btn-primary"
                      disabled={updateMutation.isPending}
                    >
                      <Save size={15} />
                      Save Changes
                    </button>
                    <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#1a3a2e' }}>
                      {user?.name}
                    </h2>
                    <button
                      id="edit-profile"
                      onClick={() => setEditing(true)}
                      style={{ background: 'rgba(74,140,111,0.1)', border: 'none', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#4a8c6f', fontSize: 13, fontWeight: 600 }}
                    >
                      <Edit3 size={13} />
                      Edit
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <Mail size={14} color="#9ca3af" />
                    <span style={{ fontSize: 14, color: '#6b7280' }}>{user?.email}</span>
                  </div>
                  {user?.bio ? (
                    <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{user.bio}</p>
                  ) : (
                    <p style={{ fontSize: 14, color: '#c4b5a0', fontStyle: 'italic' }}>No bio yet — tell us about your adventures!</p>
                  )}
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>
                      Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'recently'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { icon: BookMarked, label: 'Total Trips', value: stats?.totalTrips || 0, color: '#4a8c6f', bg: 'rgba(74,140,111,0.1)' },
            { icon: MapPin, label: 'Destinations', value: '—', color: '#4a90b8', bg: 'rgba(74,144,184,0.1)' },
            { icon: Calendar, label: 'Days Planned', value: '—', color: '#d4a843', bg: 'rgba(212,168,67,0.1)' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} style={{ background: 'white', borderRadius: 20, padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid rgba(168,213,184,0.2)', textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <Icon size={20} color={color} />
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1a3a2e' }}>{value}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Travel Style */}
        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#1a3a2e' }}>
              🌿 Travel Style
            </h3>
            {editing && (
              <span style={{ fontSize: 12, color: '#9ca3af' }}>Click to toggle</span>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {travelStyleOptions.map(style => {
              const active = (editing ? form.travelStyle : user?.travelStyle || []).includes(style);
              return (
                <button
                  key={style}
                  onClick={() => editing && toggleStyle(style)}
                  style={{
                    padding: '8px 16px', borderRadius: 50, fontSize: 13, fontWeight: 500,
                    border: `2px solid ${active ? '#4a8c6f' : 'rgba(74,140,111,0.2)'}`,
                    background: active ? '#4a8c6f' : 'white',
                    color: active ? 'white' : '#374151',
                    cursor: editing ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                  }}
                >
                  {style}
                </button>
              );
            })}
          </div>
          {!editing && (!user?.travelStyle || user.travelStyle.length === 0) && (
            <p style={{ color: '#c4b5a0', fontSize: 14, fontStyle: 'italic', marginTop: 12 }}>
              Edit your profile to add your travel preferences
            </p>
          )}
          {editing && (
            <div style={{ marginTop: 16 }}>
              <button
                onClick={() => updateMutation.mutate(form)}
                className="btn-primary"
                disabled={updateMutation.isPending}
              >
                <Save size={15} />
                Save Travel Style
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
