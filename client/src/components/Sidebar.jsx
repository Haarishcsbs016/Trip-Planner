import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/tripStore';
import {
  LayoutDashboard, Plus, BookMarked, User,
  LogOut, MapPin, Heart, Settings, Leaf
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/trips/create', icon: Plus, label: 'Plan New Trip' },
    { to: '/my-trips', icon: BookMarked, label: 'My Trips' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <aside className="sidebar">
      {/* User avatar mini */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', marginBottom: 24,
        background: 'linear-gradient(135deg, rgba(74,140,111,0.1), rgba(168,213,184,0.1))',
        borderRadius: 16,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'linear-gradient(135deg, #4a8c6f, #a8d5b8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 700, color: 'white', flexShrink: 0,
        }}>
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#1a3a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.name || 'Explorer'}
          </div>
          <div style={{ fontSize: 12, color: '#7eb89a' }}>Travel Enthusiast</div>
        </div>
      </div>

      {/* Navigation links */}
      <div style={{ marginBottom: 8, fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.1em', padding: '0 16px', marginBottom: 8 }}>
        NAVIGATION
      </div>

      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          id={`sidebar-${label.toLowerCase().replace(/\s/g, '-')}`}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}

      <div style={{ margin: '20px 0 8px', fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.1em', padding: '0 16px' }}>
        QUICK TIPS
      </div>

      {/* Nature tip card */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3a2e, #2d5a45)',
        borderRadius: 16, padding: '16px',
        color: 'white', marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Leaf size={16} color="#a8d5b8" />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#a8d5b8' }}>Eco Travel Tip</span>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
          Choose eco-friendly accommodations and support local businesses on your next adventure!
        </p>
      </div>

      {/* Logout */}
      <button
        onClick={() => { logout(); navigate('/'); }}
        className="sidebar-link"
        style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', color: '#e55252', marginTop: 'auto' }}
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
