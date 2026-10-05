import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/tripStore';
import { 
  Leaf, MapPin, Menu, X, User, LogOut, 
  LayoutDashboard, Plus, BookMarked, ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled || !isLanding ? 'scrolled' : ''}`} style={{
      background: !isLanding || scrolled ? 'rgba(26, 58, 46, 0.95)' : 'transparent',
    }}>
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
        <div style={{
          width: 40, height: 40,
          background: 'linear-gradient(135deg, #4a8c6f, #a8d5b8)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Leaf size={20} color="white" strokeWidth={2.5} />
        </div>
        <span style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: 20, fontWeight: 700, color: 'white',
          letterSpacing: '-0.3px'
        }}>
          WanderWise
        </span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-6">
        {!isAuthenticated ? (
          <>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Home</Link>
            <Link to="/login" className="btn-ghost" style={{ padding: '8px 20px', fontSize: 14 }}>Sign In</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: 14 }}>Get Started</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Dashboard</Link>
            <Link to="/trips/create" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Plan Trip</Link>
            <Link to="/my-trips" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>My Trips</Link>
            
            {/* User dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                id="user-menu-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 50, padding: '6px 14px',
                  color: 'white', cursor: 'pointer', fontSize: 14,
                  fontWeight: 500
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4a8c6f, #a8d5b8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: 'white'
                }}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                {user?.name?.split(' ')[0]}
                <ChevronDown size={14} />
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: 'white', borderRadius: 16,
                  boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
                  padding: '8px', minWidth: 180, zIndex: 200,
                  animation: 'scaleIn 0.2s ease'
                }}>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px', borderRadius: 10, textDecoration: 'none',
                      color: '#1a3a2e', fontSize: 14, fontWeight: 500
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f5f0e8'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <User size={16} /> Profile
                  </Link>
                  <hr style={{ margin: '4px 0', borderColor: '#f0ede6' }} />
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                      padding: '10px 14px', borderRadius: 10, border: 'none',
                      background: 'transparent', color: '#e55252', fontSize: 14,
                      fontWeight: 500, cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Mobile toggle */}
      <button
        className="md:hidden btn-ghost"
        style={{ padding: '8px', border: 'none' }}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={22} color="white" /> : <Menu size={22} color="white" />}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(26,58,46,0.97)',
          zIndex: 150, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 24,
          animation: 'fadeIn 0.3s ease'
        }}>
          <button onClick={() => setMenuOpen(false)} style={{
            position: 'absolute', top: 20, right: 20,
            background: 'none', border: 'none', color: 'white', cursor: 'pointer'
          }}>
            <X size={28} />
          </button>
          <Link to="/" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontSize: 20 }}>Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontSize: 20 }}>Dashboard</Link>
              <Link to="/trips/create" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontSize: 20 }}>Plan Trip</Link>
              <button onClick={handleLogout} style={{ color: '#7eb89a', background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontSize: 20 }}>Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{ color: '#a8d5b8', textDecoration: 'none', fontSize: 20 }}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
