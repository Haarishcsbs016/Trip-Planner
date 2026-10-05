import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingScreen from '../components/LoadingScreen';
import { useTripStore } from '../store/tripStore';
import { tripsAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  MapPin, Calendar, Users, IndianRupee, Heart,
  Car, Train, Plane, Bike, Bus, Home, Hotel,
  Mountain, TreePine, Utensils, Camera, ShoppingBag,
  Palette, History, Sparkles, ChevronLeft, ChevronRight,
  Leaf, Check, Baby, Plus, Minus
} from 'lucide-react';
import { differenceInDays } from 'date-fns';

// ─── Step configs ───
const travelStyles = [
  { label: 'Adventure', icon: '🧗', id: 'adventure' },
  { label: 'Relaxation', icon: '🧘', id: 'relaxation' },
  { label: 'Nature', icon: '🌿', id: 'nature' },
  { label: 'Food', icon: '🍜', id: 'food' },
  { label: 'Culture', icon: '🎭', id: 'culture' },
  { label: 'Shopping', icon: '🛍️', id: 'shopping' },
  { label: 'History', icon: '🏛️', id: 'history' },
  { label: 'Photography', icon: '📷', id: 'photography' },
  { label: 'Luxury', icon: '💎', id: 'luxury' },
  { label: 'Budget', icon: '💰', id: 'budget' },
  { label: 'Wildlife', icon: '🦁', id: 'wildlife' },
  { label: 'Beach', icon: '🏖️', id: 'beach' },
];

const transports = [
  { label: 'Car', icon: Car, id: 'car' },
  { label: 'Bus', icon: Bus, id: 'bus' },
  { label: 'Train', icon: Train, id: 'train' },
  { label: 'Flight', icon: Plane, id: 'flight' },
  { label: 'Bike', icon: Bike, id: 'bike' },
  { label: 'Rental Car', icon: Car, id: 'rental car' },
];

const accommodations = [
  { label: 'Budget', emoji: '🏠', desc: 'Hostels & guesthouses', id: 'budget' },
  { label: 'Mid-range', emoji: '🏨', desc: 'Comfortable hotels', id: 'mid-range' },
  { label: 'Luxury', emoji: '👑', desc: 'Premium hotels & resorts', id: 'luxury' },
  { label: 'Hostel', emoji: '🎒', desc: 'Social & affordable', id: 'hostel' },
  { label: 'Resort', emoji: '🌴', desc: 'All-inclusive experiences', id: 'resort' },
  { label: 'Homestay', emoji: '🏡', desc: 'Local authentic living', id: 'homestay' },
];

const budgetPresets = [
  { label: '₹10,000', value: 10000, emoji: '💚' },
  { label: '₹25,000', value: 25000, emoji: '💙' },
  { label: '₹50,000', value: 50000, emoji: '💜' },
  { label: 'Custom', value: null, emoji: '✨' },
];

// ─── Progress Bar ───
const StepProgress = ({ current, total }) => (
  <div style={{ marginBottom: 32 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
      <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>Step {current} of {total}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#4a8c6f' }}>{Math.round((current / total) * 100)}%</span>
    </div>
    <div style={{ height: 6, background: '#f0ede6', borderRadius: 50, overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        width: `${(current / total) * 100}%`,
        background: 'linear-gradient(90deg, #4a8c6f, #a8d5b8)',
        borderRadius: 50,
        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }} />
    </div>
  </div>
);

// ─── Multi-select pill ───
const MultiPill = ({ options, selected, onToggle, multi = true }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
    {options.map(opt => {
      const isSelected = selected.includes(opt.id);
      return (
        <button
          key={opt.id}
          id={`pill-${opt.id}`}
          type="button"
          onClick={() => onToggle(opt.id)}
          style={{
            padding: '10px 18px', borderRadius: 50,
            border: `2px solid ${isSelected ? '#4a8c6f' : 'rgba(74,140,111,0.2)'}`,
            background: isSelected ? '#4a8c6f' : 'white',
            color: isSelected ? 'white' : '#374151',
            cursor: 'pointer', fontWeight: 500, fontSize: 14,
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all 0.2s ease',
            transform: isSelected ? 'translateY(-1px)' : 'none',
            boxShadow: isSelected ? '0 4px 12px rgba(74,140,111,0.3)' : 'none',
          }}
        >
          {opt.icon && (typeof opt.icon === 'string'
            ? <span>{opt.icon}</span>
            : <opt.icon size={16} />)}
          {opt.emoji && <span>{opt.emoji}</span>}
          {opt.label}
          {isSelected && <Check size={14} />}
        </button>
      );
    })}
  </div>
);

// ─── Steps ───

const Step1 = ({ form, update }) => (
  <div style={{ animation: 'fadeIn 0.4s ease' }}>
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#1a3a2e', marginBottom: 6 }}>
        Where are you headed? 🌍
      </h2>
      <p style={{ color: '#6b7280', fontSize: 15 }}>Tell us your dream destination and starting point</p>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
          🎯 Destination
        </label>
        <div className="input-icon-wrapper">
          <MapPin size={16} className="icon" />
          <input
            id="trip-destination"
            type="text"
            className="input-field"
            placeholder="e.g. Ooty, Goa, Manali"
            value={form.destination}
            onChange={e => update({ destination: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
          📍 Starting Location
        </label>
        <div className="input-icon-wrapper">
          <MapPin size={16} className="icon" />
          <input
            id="trip-start-location"
            type="text"
            className="input-field"
            placeholder="e.g. Chennai, Mumbai, Delhi"
            value={form.startLocation}
            onChange={e => update({ startLocation: e.target.value })}
            required
          />
        </div>
      </div>
    </div>
  </div>
);

const Step2 = ({ form, update }) => {
  const days = form.startDate && form.endDate
    ? differenceInDays(new Date(form.endDate), new Date(form.startDate))
    : 0;

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#1a3a2e', marginBottom: 6 }}>
          When are you traveling? 📅
        </h2>
        <p style={{ color: '#6b7280', fontSize: 15 }}>Choose your travel dates</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Start Date</label>
          <input
            id="trip-start-date"
            type="date"
            className="input-field"
            value={form.startDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => update({ startDate: e.target.value })}
          />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>End Date</label>
          <input
            id="trip-end-date"
            type="date"
            className="input-field"
            value={form.endDate}
            min={form.startDate || new Date().toISOString().split('T')[0]}
            onChange={e => update({ endDate: e.target.value })}
          />
        </div>
      </div>
      {days > 0 && (
        <div style={{
          padding: '16px 20px', background: 'rgba(74,140,111,0.08)',
          borderRadius: 16, border: '1px solid rgba(74,140,111,0.2)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 28 }}>🌿</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1a3a2e' }}>{days} Days · {days - 1} Nights</div>
            <div style={{ fontSize: 13, color: '#7eb89a' }}>Perfect duration for an immersive adventure</div>
          </div>
        </div>
      )}
    </div>
  );
};

const Step3 = ({ form, update }) => {
  const { adults, children } = form.travelers;
  const Counter = ({ label, value, onInc, onDec, min = 0 }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '20px 24px', background: 'white', borderRadius: 18,
      border: '2px solid rgba(74,140,111,0.15)',
    }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1a3a2e' }}>{label}</div>
        <div style={{ fontSize: 13, color: '#9ca3af' }}>
          {label === 'Adults' ? '12+ years' : 'Under 12'}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          type="button"
          onClick={onDec}
          disabled={value <= min}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '2px solid rgba(74,140,111,0.3)',
            background: value <= min ? '#f5f0e8' : 'white',
            color: value <= min ? '#9ca3af' : '#4a8c6f',
            cursor: value <= min ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Minus size={16} />
        </button>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#1a3a2e', minWidth: 32, textAlign: 'center' }}>{value}</span>
        <button
          type="button"
          onClick={onInc}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '2px solid #4a8c6f',
            background: '#4a8c6f', color: 'white',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#1a3a2e', marginBottom: 6 }}>
          Who's coming along? 👥
        </h2>
        <p style={{ color: '#6b7280', fontSize: 15 }}>Tell us about your travel group</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Counter
          label="Adults"
          value={adults}
          min={1}
          onDec={() => update({ travelers: { adults: Math.max(1, adults - 1), children } })}
          onInc={() => update({ travelers: { adults: adults + 1, children } })}
        />
        <Counter
          label="Children"
          value={children}
          min={0}
          onDec={() => update({ travelers: { adults, children: Math.max(0, children - 1) } })}
          onInc={() => update({ travelers: { adults, children: children + 1 } })}
        />
      </div>
      <div style={{
        marginTop: 20, padding: '14px 20px', background: 'rgba(212,168,67,0.08)',
        borderRadius: 14, border: '1px solid rgba(212,168,67,0.2)',
      }}>
        <span style={{ fontSize: 14, color: '#b8860b', fontWeight: 500 }}>
          🌟 {adults + children} traveler{adults + children !== 1 ? 's' : ''} — AI will optimize the plan for your group!
        </span>
      </div>
    </div>
  );
};

const Step4 = ({ form, update }) => {
  const [custom, setCustom] = useState(false);
  const [customVal, setCustomVal] = useState('');

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#1a3a2e', marginBottom: 6 }}>
          What's your budget? 💰
        </h2>
        <p style={{ color: '#6b7280', fontSize: 15 }}>Total budget for the entire trip (in Indian Rupees)</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        {budgetPresets.map(({ label, value, emoji }) => (
          <button
            key={label}
            id={`budget-${label}`}
            type="button"
            onClick={() => {
              if (value === null) { setCustom(true); }
              else { setCustom(false); update({ budget: value }); }
            }}
            style={{
              padding: '20px', borderRadius: 18, textAlign: 'center',
              border: `2px solid ${(value !== null && form.budget === value) || (value === null && custom) ? '#4a8c6f' : 'rgba(74,140,111,0.2)'}`,
              background: (value !== null && form.budget === value) || (value === null && custom) ? 'rgba(74,140,111,0.08)' : 'white',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>{emoji}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a3a2e' }}>{label}</div>
          </button>
        ))}
      </div>
      {custom && (
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
            Enter custom budget (₹)
          </label>
          <div className="input-icon-wrapper">
            <IndianRupee size={16} className="icon" />
            <input
              id="budget-custom"
              type="number"
              className="input-field"
              placeholder="e.g. 35000"
              value={customVal}
              min={500}
              onChange={e => { setCustomVal(e.target.value); update({ budget: Number(e.target.value) }); }}
            />
          </div>
        </div>
      )}
      {form.budget > 0 && (
        <div style={{ marginTop: 16, padding: '14px 20px', background: 'rgba(74,140,111,0.08)', borderRadius: 14, border: '1px solid rgba(74,140,111,0.2)' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#4a8c6f' }}>
            🎯 Budget: ₹{form.budget.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: 13, color: '#7eb89a', marginLeft: 8 }}>
            AI will optimize to stay within this
          </span>
        </div>
      )}
    </div>
  );
};

const Step5 = ({ form, updatePref }) => {
  const toggle = (id) => {
    const current = form.preferences.travelStyle;
    const updated = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
    updatePref({ travelStyle: updated, interests: updated });
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#1a3a2e', marginBottom: 6 }}>
          Your travel vibe ✨
        </h2>
        <p style={{ color: '#6b7280', fontSize: 15 }}>Select all that define your perfect trip (multi-select)</p>
      </div>
      <MultiPill
        options={travelStyles}
        selected={form.preferences.travelStyle}
        onToggle={toggle}
      />
      {form.preferences.travelStyle.length > 0 && (
        <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(74,140,111,0.06)', borderRadius: 12 }}>
          <span style={{ fontSize: 13, color: '#4a8c6f', fontWeight: 500 }}>
            ✓ {form.preferences.travelStyle.length} style{form.preferences.travelStyle.length !== 1 ? 's' : ''} selected
          </span>
        </div>
      )}
    </div>
  );
};

const Step6 = ({ form, updatePref }) => {
  const toggle = (id) => {
    const current = form.preferences.transport;
    const updated = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
    updatePref({ transport: updated });
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#1a3a2e', marginBottom: 6 }}>
          How will you travel? 🚗
        </h2>
        <p style={{ color: '#6b7280', fontSize: 15 }}>Select your preferred mode(s) of transport</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {transports.map(({ label, icon: Icon, id }) => {
          const sel = form.preferences.transport.includes(id);
          return (
            <button
              key={id}
              id={`transport-${id}`}
              type="button"
              onClick={() => toggle(id)}
              style={{
                padding: '20px 12px', borderRadius: 18, textAlign: 'center',
                border: `2px solid ${sel ? '#4a8c6f' : 'rgba(74,140,111,0.2)'}`,
                background: sel ? 'rgba(74,140,111,0.1)' : 'white',
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: sel ? '#4a8c6f' : 'rgba(74,140,111,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 10px', transition: 'background 0.2s',
              }}>
                <Icon size={20} color={sel ? 'white' : '#4a8c6f'} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a3a2e' }}>{label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Step7 = ({ form, updatePref }) => (
  <div style={{ animation: 'fadeIn 0.4s ease' }}>
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#1a3a2e', marginBottom: 6 }}>
        Where will you stay? 🏨
      </h2>
      <p style={{ color: '#6b7280', fontSize: 15 }}>Choose your preferred accommodation style</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      {accommodations.map(({ label, emoji, desc, id }) => {
        const sel = form.preferences.accommodation === id;
        return (
          <button
            key={id}
            id={`accom-${id}`}
            type="button"
            onClick={() => updatePref({ accommodation: id })}
            style={{
              padding: '20px', borderRadius: 18, textAlign: 'left',
              border: `2px solid ${sel ? '#4a8c6f' : 'rgba(74,140,111,0.2)'}`,
              background: sel ? 'rgba(74,140,111,0.08)' : 'white',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{emoji}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a3a2e', marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>{desc}</div>
            {sel && <div style={{ marginTop: 8 }}><span style={{ fontSize: 11, color: '#4a8c6f', fontWeight: 700 }}>✓ Selected</span></div>}
          </button>
        );
      })}
    </div>
  </div>
);

// ─── Main CreateTrip ───
const CreateTrip = () => {
  const navigate = useNavigate();
  const { currentStep, nextStep, prevStep, tripForm, updateTripForm, updatePreferences, resetForm, isGenerating, setGenerating, generationStep, setGenerationStep } = useTripStore();
  const totalSteps = 7;

  const update = (data) => updateTripForm(data);
  const updatePref = (data) => updatePreferences(data);

  const canProceed = () => {
    const f = tripForm;
    switch (currentStep) {
      case 1: return f.destination.length >= 2 && f.startLocation.length >= 2;
      case 2: return f.startDate && f.endDate && new Date(f.endDate) > new Date(f.startDate);
      case 3: return f.travelers.adults >= 1;
      case 4: return f.budget >= 500;
      case 5: return f.preferences.travelStyle.length > 0;
      case 6: return f.preferences.transport.length > 0;
      case 7: return !!f.preferences.accommodation;
      default: return true;
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerationStep(0);

    try {
      // Simulate progress steps
      const stepInterval = setInterval(() => {
        setGenerationStep(s => {
          if (s >= 7) { clearInterval(stepInterval); return s; }
          return s + 1;
        });
      }, 700);

      // Step 1: Create trip
      const start = new Date(tripForm.startDate);
      const end = new Date(tripForm.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      const createRes = await tripsAPI.create({
        ...tripForm,
        days,
      });

      const tripId = createRes.data.trip._id;

      // Step 2: Generate itinerary
      const genRes = await tripsAPI.generate(tripId);

      clearInterval(stepInterval);
      setGenerationStep(8);

      setTimeout(() => {
        setGenerating(false);
        resetForm();
        toast.success('Your trip itinerary is ready! 🌿');
        navigate(`/trips/${tripId}`);
      }, 1000);
    } catch (error) {
      setGenerating(false);
      toast.error(error.response?.data?.message || 'Failed to generate trip. Please try again.');
    }
  };

  const stepComponents = [
    <Step1 form={tripForm} update={update} />,
    <Step2 form={tripForm} update={update} />,
    <Step3 form={tripForm} update={update} />,
    <Step4 form={tripForm} update={update} />,
    <Step5 form={tripForm} updatePref={updatePref} />,
    <Step6 form={tripForm} updatePref={updatePref} />,
    <Step7 form={tripForm} updatePref={updatePref} />,
  ];

  return (
    <>
      {isGenerating && <LoadingScreen currentStep={generationStep} destination={tripForm.destination} />}

      <div className="bg-page" style={{ minHeight: '100vh' }}>
        <Navbar />

        <div style={{
          maxWidth: 680, margin: '0 auto', padding: '100px 24px 48px',
          minHeight: '100vh', display: 'flex', alignItems: 'flex-start',
        }}>
          <div style={{ width: '100%' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'linear-gradient(135deg, #1a3a2e, #4a8c6f)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Leaf size={26} color="white" />
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#1a3a2e', marginBottom: 6 }}>
                Plan Your Trip
              </h1>
              <p style={{ color: '#6b7280', fontSize: 15 }}>
                {tripForm.destination ? `${tripForm.startLocation || 'Your city'} → ${tripForm.destination}` : 'Tell us about your dream adventure'}
              </p>
            </div>

            {/* Progress */}
            <StepProgress current={currentStep} total={totalSteps} />

            {/* Step content */}
            <div className="glass-card" style={{ padding: '36px 40px', marginBottom: 24 }}>
              {stepComponents[currentStep - 1]}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <button
                id="step-back"
                type="button"
                onClick={prevStep}
                className="btn-secondary"
                disabled={currentStep === 1}
                style={{ opacity: currentStep === 1 ? 0.3 : 1 }}
              >
                <ChevronLeft size={18} />
                Back
              </button>

              {currentStep < totalSteps ? (
                <button
                  id="step-next"
                  type="button"
                  onClick={nextStep}
                  className="btn-primary"
                  disabled={!canProceed()}
                  style={{ opacity: canProceed() ? 1 : 0.5 }}
                >
                  Continue
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  id="generate-trip-btn"
                  type="button"
                  onClick={handleGenerate}
                  className="btn-primary"
                  disabled={!canProceed()}
                  style={{
                    padding: '16px 36px', fontSize: 16,
                    background: 'linear-gradient(135deg, #1a3a2e, #4a8c6f)',
                    opacity: canProceed() ? 1 : 0.5,
                  }}
                >
                  <Sparkles size={20} />
                  Generate My Trip ✨
                </button>
              )}
            </div>

            {/* Trip summary preview */}
            {tripForm.destination && tripForm.startLocation && (
              <div style={{
                marginTop: 24, padding: '16px 20px',
                background: 'white', borderRadius: 16,
                border: '1px solid rgba(168,213,184,0.3)',
                display: 'flex', flexWrap: 'wrap', gap: 16,
                fontSize: 13, color: '#6b7280',
              }}>
                <span>📍 {tripForm.startLocation} → {tripForm.destination}</span>
                {tripForm.startDate && <span>📅 {differenceInDays(new Date(tripForm.endDate || tripForm.startDate), new Date(tripForm.startDate)) || '?'} days</span>}
                {tripForm.budget > 0 && <span>💰 ₹{tripForm.budget.toLocaleString('en-IN')}</span>}
                {tripForm.travelers.adults > 0 && <span>👥 {tripForm.travelers.adults + tripForm.travelers.children} travelers</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTrip;
