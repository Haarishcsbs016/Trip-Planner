import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { 
  MapPin, Leaf, Compass, CloudSun, Sparkles, 
  Mountain, TreePine, Waves, ArrowRight, Star,
  Shield, Zap, Globe
} from 'lucide-react';

const features = [
  {
    icon: Sparkles, color: '#4a8c6f', bg: 'rgba(74,140,111,0.1)',
    title: 'AI-Powered Itineraries',
    desc: 'Our intelligent AI crafts personalized day-by-day plans tailored to your unique travel style, interests, and budget.'
  },
  {
    icon: CloudSun, color: '#4a90b8', bg: 'rgba(74,144,184,0.1)',
    title: 'Weather-Aware Planning',
    desc: 'Plans dynamically adapt to real-time weather forecasts — outdoor adventures on sunny days, cozy spots when it rains.'
  },
  {
    icon: Compass, color: '#d4a843', bg: 'rgba(212,168,67,0.1)',
    title: 'Geo-Optimized Routes',
    desc: 'Smart routing groups nearby attractions, minimizing travel time so you spend more time exploring, less time commuting.'
  },
  {
    icon: Shield, color: '#8c4a4a', bg: 'rgba(140,74,74,0.1)',
    title: 'Budget Intelligence',
    desc: 'Real-time cost tracking across transport, accommodation, food & activities with instant over-budget alerts.'
  },
  {
    icon: Globe, color: '#7eb89a', bg: 'rgba(126,184,154,0.1)',
    title: 'Share & Collaborate',
    desc: 'Generate a shareable link for your trip. Let friends view, comment, or collaborate on the perfect group adventure.'
  },
  {
    icon: Zap, color: '#8c6a4a', bg: 'rgba(140,106,74,0.1)',
    title: 'One-Click Regenerate',
    desc: 'Not happy? Say "Make it cheaper" or "Add more adventure" and AI instantly refines your entire itinerary.'
  },
];

const destinations = [
  { name: 'Ooty', tag: 'Nature & Tea', emoji: '🌿', color: '#1a3a2e' },
  { name: 'Goa', tag: 'Beach & Party', emoji: '🌊', color: '#1a3260' },
  { name: 'Manali', tag: 'Snow & Trek', emoji: '🏔️', color: '#2a1a3a' },
  { name: 'Rajasthan', tag: 'Heritage & Desert', emoji: '🏜️', color: '#3a2a1a' },
  { name: 'Kerala', tag: 'Backwaters & Spice', emoji: '🌴', color: '#1a3a35' },
  { name: 'Coorg', tag: 'Coffee & Forest', emoji: '☕', color: '#2d1a2d' },
];

const stats = [
  { value: '50K+', label: 'Trips Planned' },
  { value: '200+', label: 'Destinations' },
  { value: '98%', label: 'Happy Travelers' },
  { value: '4.9★', label: 'App Rating' },
];

const Landing = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Animated floating leaves
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="bg-nature" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,140,111,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-5%', left: '-5%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,213,184,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Floating icons */}
        {[
          { icon: TreePine, x: '8%', y: '20%', delay: '0s', size: 28 },
          { icon: Mountain, x: '88%', y: '15%', delay: '1s', size: 24 },
          { icon: Waves, x: '5%', y: '70%', delay: '0.5s', size: 22 },
          { icon: Leaf, x: '92%', y: '65%', delay: '1.5s', size: 26 },
          { icon: Compass, x: '80%', y: '45%', delay: '0.8s', size: 20 },
        ].map(({ icon: Icon, x, y, delay, size }, i) => (
          <div key={i} style={{
            position: 'absolute', left: x, top: y,
            animation: `float 4s ease-in-out infinite`,
            animationDelay: delay,
            opacity: 0.15,
            pointerEvents: 'none',
          }}>
            <Icon size={size} color="#a8d5b8" />
          </div>
        ))}

        {/* Hero Content */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 32px 80px', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 700 }}>
            {/* Pill badge */}
            <div className="animate-fade-in" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(168,213,184,0.15)', border: '1px solid rgba(168,213,184,0.3)',
              borderRadius: 50, padding: '6px 16px', marginBottom: 28,
            }}>
              <Sparkles size={14} color="#a8d5b8" />
              <span style={{ fontSize: 13, color: '#a8d5b8', fontWeight: 500 }}>AI-Powered Travel Intelligence</span>
            </div>

            <h1
              className="animate-fade-in delay-100"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(44px, 7vw, 80px)',
                fontWeight: 800, lineHeight: 1.1,
                color: 'white', marginBottom: 24,
              }}
            >
              Wander Smarter,<br />
              <span className="hero-text-gradient">Live Greener</span>
            </h1>

            <p className="animate-fade-in delay-200" style={{
              fontSize: 18, color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.7, maxWidth: 560, marginBottom: 40,
            }}>
              Let nature guide your journey. Enter your destination and our AI crafts 
              a perfect, weather-aware, budget-smart itinerary in seconds — completely 
              tailored to your soul.
            </p>

            <div className="animate-fade-in delay-300" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary" id="hero-get-started" style={{ padding: '16px 40px', fontSize: 16 }}>
                <Leaf size={18} />
                Start Your Adventure
              </Link>
              <Link to="/login" className="btn-ghost" id="hero-sign-in" style={{ padding: '16px 32px', fontSize: 16 }}>
                Sign In
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="animate-fade-in delay-400" style={{ display: 'flex', gap: 20, marginTop: 48, flexWrap: 'wrap' }}>
              {stats.map(({ value, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#a8d5b8' }}>{value}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          animation: 'float 2s ease-in-out infinite',
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>SCROLL</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(168,213,184,0.6), transparent)' }} />
        </div>
      </section>

      {/* ─── Destinations Showcase ─── */}
      <section style={{ padding: '80px 32px', background: 'var(--warm-white)', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <MapPin size={16} color="#4a8c6f" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#4a8c6f', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Popular Destinations
            </span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, color: '#1a3a2e', marginBottom: 12 }}>
            Where Will You Wander?
          </h2>
          <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 500, margin: '0 auto' }}>
            From misty mountains to serene backwaters — discover India's most breathtaking destinations
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 16,
        }}>
          {destinations.map(({ name, tag, emoji, color }) => (
            <Link
              key={name}
              to="/register"
              id={`dest-${name.toLowerCase()}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: `linear-gradient(135deg, ${color} 0%, ${color}aa 100%)`,
                borderRadius: 20, padding: '28px 20px',
                textAlign: 'center', cursor: 'pointer',
                transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>{emoji}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 6 }}>
                  {name}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{tag}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section style={{ padding: '80px 32px', background: '#f5f0e8' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Zap size={16} color="#4a8c6f" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#4a8c6f', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              How It Works
            </span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, color: '#1a3a2e', marginBottom: 48 }}>
            Plan Your Dream Trip in 3 Steps
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              {
                step: '01', emoji: '✏️',
                title: 'Tell Us Your Dream',
                desc: 'Enter your destination, dates, budget, and preferences through our beautiful multi-step form. Takes under 2 minutes.'
              },
              {
                step: '02', emoji: '🤖',
                title: 'AI Works Its Magic',
                desc: 'Our AI fetches live weather, attractions, restaurants, and distances — then crafts your perfect personalized itinerary.'
              },
              {
                step: '03', emoji: '🗺️',
                title: 'Explore, Edit & Share',
                desc: 'View your day-by-day plan with maps, edit anything you like, regenerate with AI, share with friends, or export to PDF.'
              },
            ].map(({ step, emoji, title, desc }, i) => (
              <div key={step} className="card" style={{ textAlign: 'left', position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: -12, left: 24,
                  background: 'linear-gradient(135deg, #1a3a2e, #4a8c6f)',
                  color: 'white', fontSize: 11, fontWeight: 800,
                  padding: '4px 12px', borderRadius: 50, letterSpacing: '0.05em',
                }}>
                  STEP {step}
                </div>
                <div style={{ fontSize: 40, marginBottom: 16, marginTop: 8 }}>{emoji}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#1a3a2e', marginBottom: 10 }}>
                  {title}
                </h3>
                <p style={{ color: '#6b7280', lineHeight: 1.6, fontSize: 15 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section style={{ padding: '80px 32px', background: 'var(--warm-white)', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, color: '#1a3a2e', marginBottom: 12 }}>
            Everything You Need to Explore
          </h2>
          <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 500, margin: '0 auto' }}>
            Powerful features designed for the modern eco-conscious traveler
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {features.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, color: '#1a3a2e' }}>{title}</h3>
              <p style={{ color: '#6b7280', lineHeight: 1.6, fontSize: 14, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="bg-nature" style={{ padding: '100px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 44, fontWeight: 700, color: 'white', marginBottom: 16,
          }}>
            Ready to Begin Your Journey?
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', marginBottom: 40, lineHeight: 1.7 }}>
            Join thousands of eco-conscious travelers who plan smarter, travel deeper, and live better.
          </p>
          <Link to="/register" className="btn-primary" id="cta-get-started" style={{ padding: '18px 48px', fontSize: 17 }}>
            <Leaf size={20} />
            Plan My First Trip — Free
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ background: '#0d2318', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
            <Leaf size={20} color="#4a8c6f" />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: 'white', fontWeight: 700 }}>WanderWise</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
            © 2026 WanderWise · AI-Powered Travel Planning · Made with 🌿 for Earth's Explorers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
