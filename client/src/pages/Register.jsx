import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/tripStore';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const passwordStrength = () => {
    const p = form.password;
    if (p.length === 0) return 0;
    if (p.length < 6) return 1;
    if (p.length < 10) return 2;
    return 3;
  };
  
  const strength = passwordStrength();
  const strengthColors = ['#e5e7eb', '#e55252', '#d4a843', '#4a8c6f'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const res = await authAPI.register(form);
      setAuth(res.data.user, res.data.token);
      toast.success(`Welcome to WanderWise, ${res.data.user.name}! 🌿`);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        setErrors(data.errors);
      } else if (data?.message) {
        setErrors([data.message]);
      } else if (err.message === 'Network Error' || !err.response) {
        setErrors(['Unable to connect to the authentication server. Please check your backend deployment or internet connection.']);
      } else {
        setErrors(['Registration failed. Please try again.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a3a2e 0%, #2d5a45 50%, #1a3a2e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '-15%', right: '-8%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,140,111,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #4a8c6f, #a8d5b8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={24} color="white" />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: 'white' }}>WanderWise</span>
          </Link>
        </div>

        {/* Card */}
        <div style={{ background: 'white', borderRadius: 28, padding: '40px 36px', boxShadow: '0 20px 80px rgba(0,0,0,0.3)' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#1a3a2e', marginBottom: 4 }}>
            Join WanderWise
          </h1>
          <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 28 }}>
            Start your eco-adventure today 🌿
          </p>

          {errors.length > 0 && (
            <div style={{ padding: '12px 16px', borderRadius: 12, marginBottom: 20, background: '#fff5f5', border: '1px solid #fecaca' }}>
              {errors.map((err, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e55252', fontSize: 13, marginBottom: i < errors.length - 1 ? 4 : 0 }}>
                  <AlertCircle size={14} />
                  {err}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Full Name</label>
              <div className="input-icon-wrapper">
                <User size={16} className="icon" />
                <input
                  id="register-name"
                  type="text"
                  className="input-field"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Email</label>
              <div className="input-icon-wrapper">
                <Mail size={16} className="icon" />
                <input
                  id="register-email"
                  type="email"
                  className="input-field"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Password</label>
              <div className="input-icon-wrapper" style={{ position: 'relative' }}>
                <Lock size={16} className="icon" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  autoComplete="new-password"
                  style={{ paddingRight: 46 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength */}
              {form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 4, borderRadius: 50,
                        background: strength >= i ? strengthColors[strength] : '#e5e7eb',
                        transition: 'background 0.3s ease',
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: strengthColors[strength], fontWeight: 600 }}>
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
            </div>

            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '12px', background: 'rgba(74,140,111,0.06)', borderRadius: 12,
            }}>
              <CheckCircle size={16} color="#4a8c6f" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>
                By creating an account, you agree to our Terms of Service and commit to responsible, eco-conscious travel 🌍
              </span>
            </div>

            <button
              id="register-submit"
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: 16, marginTop: 8, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Creating account...
                </span>
              ) : (
                <>Create Account <Leaf size={16} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280', marginTop: 24 }}>
            Already exploring?{' '}
            <Link to="/login" id="go-to-login" style={{ color: '#4a8c6f', fontWeight: 600, textDecoration: 'none' }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
