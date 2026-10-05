import { Leaf } from 'lucide-react';

const steps = [
  'Validating your input',
  'Fetching destination data',
  'Gathering attractions & places',
  'Checking weather forecast',
  'Calculating distances & routes',
  'Analyzing budget allocation',
  'Crafting AI itinerary',
  'Optimizing your perfect trip',
];

const LoadingScreen = ({ currentStep = 0, destination = '' }) => {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(135deg, #0d2318 0%, #1a3a2e 50%, #0d2318 100%)',
      zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column',
    }}>
      {/* Animated leaves */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="leaf-particle"
          style={{
            left: `${10 + i * 12}%`,
            animationDuration: `${4 + i * 0.8}s`,
            animationDelay: `${i * 0.6}s`,
            fontSize: `${14 + (i % 3) * 6}px`,
          }}
        >
          {['🍃', '🌿', '🍀', '🌱'][i % 4]}
        </div>
      ))}

      <div style={{ textAlign: 'center', maxWidth: 440, padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'linear-gradient(135deg, #4a8c6f, #a8d5b8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          animation: 'float 3s ease-in-out infinite',
          boxShadow: '0 0 40px rgba(74, 140, 111, 0.4)',
        }}>
          <Leaf size={36} color="white" />
        </div>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 28, fontWeight: 700, color: 'white',
          marginBottom: 8,
        }}>
          Planning Your Adventure
        </h2>
        {destination && (
          <p style={{ color: '#a8d5b8', fontSize: 15, marginBottom: 40 }}>
            Crafting your perfect trip to <strong>{destination}</strong> ✨
          </p>
        )}

        {/* Steps */}
        <div style={{ textAlign: 'left' }}>
          {steps.map((step, i) => (
            <div
              key={i}
              className="generation-step"
              style={{
                opacity: i > currentStep ? 0.3 : 1,
                transition: 'opacity 0.5s ease',
              }}
            >
              {i < currentStep ? (
                <div className="check">✓</div>
              ) : i === currentStep ? (
                <div className="spinner" />
              ) : (
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.2)',
                }} />
              )}
              <span style={{
                fontSize: 14,
                color: i < currentStep ? '#a8d5b8' : i === currentStep ? 'white' : 'rgba(255,255,255,0.4)',
                fontWeight: i === currentStep ? 600 : 400,
              }}>
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 32 }}>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 50, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(currentStep / steps.length) * 100}%`,
              background: 'linear-gradient(90deg, #4a8c6f, #a8d5b8)',
              borderRadius: 50,
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
            {Math.round((currentStep / steps.length) * 100)}% complete
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
