import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingScreen from '../components/LoadingScreen';
import { useTripStore } from '../store/tripStore';
import { tripsAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  MapPin, Calendar, Users, IndianRupee, Heart,
  Car, Train, Plane, Bike, Bus, Hotel, Sparkles, ChevronLeft, ChevronRight,
  Leaf, Check, Plus, Minus, Star, Fuel, Route, Gauge, Info, Filter, Eye
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
  { label: 'Bike', icon: Bike, id: 'bike' },
  { label: 'Bus', icon: Bus, id: 'bus' },
  { label: 'Train', icon: Train, id: 'train' },
  { label: 'Flight', icon: Plane, id: 'flight' },
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
const MultiPill = ({ options, selected, onToggle }) => (
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
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1a3a2e' }}>{days} Days · {Math.max(1, days - 1)} Nights</div>
            <div style={{ fontSize: 13, color: '#7eb89a' }}>Perfect duration for an immersive trip</div>
          </div>
        </div>
      )}
    </div>
  );
};

const Step3 = ({ form, update }) => {
  const { adults, children } = form.travelers;
  const [custom, setCustom] = useState(false);
  const [customVal, setCustomVal] = useState('');

  const Counter = ({ label, value, onInc, onDec, min = 0 }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '16px 20px', background: 'white', borderRadius: 16,
      border: '2px solid rgba(74,140,111,0.15)',
    }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1a3a2e' }}>{label}</div>
        <div style={{ fontSize: 12, color: '#9ca3af' }}>{label === 'Adults' ? '12+ years' : 'Under 12'}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          type="button"
          onClick={onDec}
          disabled={value <= min}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            border: '2px solid rgba(74,140,111,0.3)',
            background: value <= min ? '#f5f0e8' : 'white',
            color: value <= min ? '#9ca3af' : '#4a8c6f',
            cursor: value <= min ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Minus size={14} />
        </button>
        <span style={{ fontSize: 18, fontWeight: 800, color: '#1a3a2e', minWidth: 28, textAlign: 'center' }}>{value}</span>
        <button
          type="button"
          onClick={onInc}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            border: '2px solid #4a8c6f',
            background: '#4a8c6f', color: 'white',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#1a3a2e', marginBottom: 6 }}>
          Travelers & Budget 👥💰
        </h2>
        <p style={{ color: '#6b7280', fontSize: 15 }}>Who is joining and total budget for the trip</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
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

      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 10 }}>
        Total Budget (₹)
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
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
              padding: '14px 8px', borderRadius: 14, textAlign: 'center',
              border: `2px solid ${(value !== null && form.budget === value) || (value === null && custom) ? '#4a8c6f' : 'rgba(74,140,111,0.2)'}`,
              background: (value !== null && form.budget === value) || (value === null && custom) ? 'rgba(74,140,111,0.08)' : 'white',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 4 }}>{emoji}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a3a2e' }}>{label}</div>
          </button>
        ))}
      </div>

      {custom && (
        <div style={{ marginBottom: 16 }}>
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
    </div>
  );
};

const Step4 = ({ form, updatePref }) => {
  const toggleStyle = (id) => {
    const current = form.preferences.travelStyle || [];
    const updated = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
    updatePref({ travelStyle: updated, interests: updated });
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#1a3a2e', marginBottom: 6 }}>
          Travel Vibe & Interests ✨
        </h2>
        <p style={{ color: '#6b7280', fontSize: 15 }}>Select all that describe your preferred trip style</p>
      </div>
      <MultiPill
        options={travelStyles}
        selected={form.preferences.travelStyle || []}
        onToggle={toggleStyle}
      />
    </div>
  );
};

// ─── Step 5: Simple Transportation Details ───
const Step5 = ({ form, updateTransportDetails, updatePref }) => {
  const details = form.transportDetails || {
    vehicleType: 'car',
    fuelType: 'petrol',
    mileage: 15,
    oneWayDistanceKm: 0,
    roundTripDistanceKm: 0,
    fuelRequiredLiters: 0,
    fuelPricePerLiter: 104,
    calculatedFuelCost: 0,
  };

  const [loadingDistance, setLoadingDistance] = useState(false);

  const vehicleType = details.vehicleType || 'car';
  const fuelType = details.fuelType || 'petrol';
  const mileage = details.mileage || (vehicleType === 'car' ? 15 : 40);

  // Auto calculate distance & fuel cost when inputs change
  useEffect(() => {
    if (form.startLocation && form.destination && (vehicleType === 'car' || vehicleType === 'bike')) {
      let isSubscribed = true;
      setLoadingDistance(true);

      tripsAPI.getDistance({
        startLocation: form.startLocation,
        destination: form.destination,
        vehicleType,
        fuelType,
        mileage,
      })
        .then((res) => {
          if (isSubscribed && res.data?.distance) {
            updateTransportDetails(res.data.distance);
          }
        })
        .catch((err) => {
          console.error('Distance calculation error:', err);
        })
        .finally(() => {
          if (isSubscribed) setLoadingDistance(false);
        });

      return () => { isSubscribed = false; };
    }
  }, [form.startLocation, form.destination, vehicleType, fuelType, mileage]);

  const handleVehicleChange = (vType) => {
    const defaultMileage = vType === 'bike' ? 40 : 15;
    const defaultFuel = 'petrol';
    updatePref({ transport: [vType] });
    updateTransportDetails({
      vehicleType: vType,
      fuelType: defaultFuel,
      mileage: defaultMileage,
    });
  };

  const handleFuelChange = (fType) => {
    const price = fType === 'diesel' ? 92 : 104;
    updateTransportDetails({
      fuelType: fType,
      fuelPricePerLiter: price,
    });
  };

  const handleMileageChange = (val) => {
    const m = Math.max(1, Number(val) || 1);
    updateTransportDetails({ mileage: m });
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#1a3a2e', marginBottom: 6 }}>
          🚗 Simple Transportation Details
        </h2>
        <p style={{ color: '#6b7280', fontSize: 15 }}>Configure your vehicle & mileage for calculated travel cost</p>
      </div>

      {/* Mode Selector */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
          Transportation Mode
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {transports.map(({ label, icon: Icon, id }) => {
            const sel = vehicleType === id;
            return (
              <button
                key={id}
                id={`vehicle-${id}`}
                type="button"
                onClick={() => handleVehicleChange(id)}
                style={{
                  padding: '14px 6px', borderRadius: 14, textAlign: 'center',
                  border: `2px solid ${sel ? '#4a8c6f' : 'rgba(74,140,111,0.2)'}`,
                  background: sel ? 'rgba(74,140,111,0.1)' : 'white',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >
                <Icon size={18} color={sel ? '#4a8c6f' : '#6b7280'} style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1a3a2e' }}>{label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Car or Bike Config Box */}
      {(vehicleType === 'car' || vehicleType === 'bike') ? (
        <div style={{
          background: 'white', padding: 24, borderRadius: 20,
          border: '2px solid rgba(74,140,111,0.2)', marginBottom: 20,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            {/* Fuel Type */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
                Fuel Type
              </label>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer', color: '#1a3a2e' }}>
                  <input
                    type="radio"
                    name="fuelType"
                    checked={fuelType === 'petrol'}
                    onChange={() => handleFuelChange('petrol')}
                    style={{ accentColor: '#4a8c6f' }}
                  />
                  Petrol
                </label>
                {vehicleType === 'car' && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer', color: '#1a3a2e' }}>
                    <input
                      type="radio"
                      name="fuelType"
                      checked={fuelType === 'diesel'}
                      onChange={() => handleFuelChange('diesel')}
                      style={{ accentColor: '#4a8c6f' }}
                    />
                    Diesel
                  </label>
                )}
              </div>
            </div>

            {/* Mileage */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
                Mileage (km/l)
              </label>
              <div className="input-icon-wrapper" style={{ maxWidth: 160 }}>
                <Gauge size={16} className="icon" />
                <input
                  id="vehicle-mileage"
                  type="number"
                  className="input-field"
                  value={mileage}
                  min={1}
                  max={100}
                  onChange={e => handleMileageChange(e.target.value)}
                />
                <span style={{ fontSize: 13, color: '#9ca3af', marginRight: 10 }}>km/l</span>
              </div>
            </div>
          </div>

          {/* Actual Route Distance & Fuel Calculation Output */}
          <div style={{
            background: '#f9f8f4', padding: '18px 20px', borderRadius: 16,
            border: '1px solid rgba(74,140,111,0.15)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1a3a2e', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Route size={16} color="#4a8c6f" />
                Route Fuel Calculation
              </div>
              {loadingDistance && <span style={{ fontSize: 12, color: '#7eb89a' }}>Calculating distance...</span>}
            </div>

            <div style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.8 }}>
              <div><strong>{form.destination || 'Destination'} → {form.startLocation || 'Start'}</strong></div>
              <div>Distance = <strong>{details.oneWayDistanceKm || 300} km</strong></div>
              <div>Round trip: {details.oneWayDistanceKm || 300} × 2 = <strong>{details.roundTripDistanceKm || 600} km</strong></div>
              <div>Mileage = <strong>{details.mileage || 15} km/l</strong></div>
              <div>
                Fuel required = {details.roundTripDistanceKm || 600} / {details.mileage || 15} = <strong>{details.fuelRequiredLiters || 40} L</strong>
              </div>
              <div>Fuel price = <strong>₹{details.fuelPricePerLiter || 104}/L</strong></div>
              <div style={{
                marginTop: 10, paddingTop: 10, borderTop: '1px dashed #d1d5db',
                fontSize: 15, fontWeight: 800, color: '#4a8c6f',
              }}>
                Fuel cost ≈ ₹{(details.calculatedFuelCost || 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          padding: 20, background: '#f5f0e8', borderRadius: 16,
          fontSize: 14, color: '#6b7280', textAlign: 'center',
        }}>
          Standard public transport estimation will be used for {vehicleType}.
        </div>
      )}
    </div>
  );
};

// ─── Step 6: Real Hotel Discovery ───
const Step6 = ({ form, setSelectedHotel }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [minRating, setMinRating] = useState(4.0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [viewingHotel, setViewingHotel] = useState(null);

  const fetchHotels = () => {
    if (!form.destination) return;
    setLoading(true);
    tripsAPI.getHotels({
      destination: form.destination,
      minRating,
      maxPrice,
    })
      .then((res) => {
        if (res.data?.hotels) {
          setHotels(res.data.hotels);
          // Auto select first hotel if none selected
          if (!form.selectedHotel && res.data.hotels.length > 0) {
            setSelectedHotel(res.data.hotels[0]);
          }
        }
      })
      .catch((err) => {
        toast.error('Failed to load real hotel data');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHotels();
  }, [form.destination, minRating, maxPrice]);

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#1a3a2e', marginBottom: 6 }}>
          🏨 Real Hotel Discovery
        </h2>
        <p style={{ color: '#6b7280', fontSize: 15 }}>Real accommodation options fetched for {form.destination || 'your destination'}</p>
      </div>

      {/* Filter Bar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center',
        padding: '14px 18px', background: 'white', borderRadius: 16,
        border: '1px solid rgba(74,140,111,0.2)', marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#1a3a2e' }}>
          <Filter size={15} color="#4a8c6f" /> Filters:
        </div>

        {/* Rating Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#6b7280' }}>Min Rating:</span>
          {[3.5, 4.0, 4.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setMinRating(r)}
              style={{
                padding: '4px 10px', borderRadius: 50, fontSize: 12, fontWeight: 600,
                border: `1px solid ${minRating === r ? '#4a8c6f' : '#e5e7eb'}`,
                background: minRating === r ? '#4a8c6f' : 'white',
                color: minRating === r ? 'white' : '#374151', cursor: 'pointer',
              }}
            >
              {r} ⭐
            </button>
          ))}
        </div>

        {/* Budget Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#6b7280' }}>Max Price:</span>
          {[5000, 8000, 12000, 20000].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setMaxPrice(p)}
              style={{
                padding: '4px 10px', borderRadius: 50, fontSize: 12, fontWeight: 600,
                border: `1px solid ${maxPrice === p ? '#4a8c6f' : '#e5e7eb'}`,
                background: maxPrice === p ? '#4a8c6f' : 'white',
                color: maxPrice === p ? 'white' : '#374151', cursor: 'pointer',
              }}
            >
              ₹{(p / 1000)}k/night
            </button>
          ))}
        </div>
      </div>

      {/* Hotel Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
          <div style={{ fontSize: 32, marginBottom: 10, animation: 'float 2s infinite' }}>🏨</div>
          Fetching real hotel data for {form.destination}...
        </div>
      ) : hotels.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', background: 'white', borderRadius: 16 }}>
          No hotels matching filters. Try adjusting rating or price range.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {hotels.map((h) => {
            const isSelected = form.selectedHotel?.placeId === h.placeId || form.selectedHotel?.name === h.name;
            const hotelImg = h.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
            return (
              <div
                key={h.placeId || h.name}
                style={{
                  background: 'white', borderRadius: 18, overflow: 'hidden',
                  border: `2px solid ${isSelected ? '#4a8c6f' : 'rgba(74,140,111,0.15)'}`,
                  boxShadow: isSelected ? '0 8px 24px rgba(74,140,111,0.2)' : '0 2px 10px rgba(0,0,0,0.04)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                {/* Hotel Image Banner */}
                <div style={{ position: 'relative', height: 130, width: '100%', overflow: 'hidden' }}>
                  <img
                    src={hotelImg}
                    alt={h.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    background: 'rgba(26,58,46,0.85)', backdropFilter: 'blur(4px)',
                    color: '#d4a843', padding: '4px 8px', borderRadius: 50,
                    fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3
                  }}>
                    ⭐ {h.rating}
                  </div>
                </div>

                <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1a3a2e', marginBottom: 4, lineHeight: 1.3 }}>{h.name}</h4>

                    <div style={{ fontSize: 14, fontWeight: 800, color: '#4a8c6f', marginBottom: 6 }}>
                      ₹{h.pricePerNight?.toLocaleString('en-IN')}/night
                      {h.isEstimatedPrice && (
                        <span style={{ fontSize: 10, fontWeight: 500, color: '#9ca3af', marginLeft: 6 }}>
                          (Est. price)
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4, lineHeight: 1.3 }}>
                      <MapPin size={13} style={{ flexShrink: 0, color: '#4a8c6f' }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.address}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button
                      type="button"
                      onClick={() => setViewingHotel(h)}
                      style={{
                        padding: '8px 12px', borderRadius: 10,
                        border: '1px solid #d1d5db', background: 'white',
                        fontSize: 12, fontWeight: 600, color: '#374151', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <Eye size={13} /> View
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedHotel(h)}
                      style={{
                        flex: 1, padding: '8px 14px', borderRadius: 10,
                        border: 'none',
                        background: isSelected ? '#4a8c6f' : '#f0faf4',
                        color: isSelected ? 'white' : '#4a8c6f',
                        fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                      }}
                    >
                      {isSelected ? <Check size={14} /> : null}
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Hotel Banner */}
      {form.selectedHotel && (
        <div style={{
          marginTop: 20, padding: '14px 18px', background: 'rgba(74,140,111,0.08)',
          borderRadius: 14, border: '1px solid rgba(74,140,111,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#7eb89a', textTransform: 'uppercase' }}>Selected Accommodation</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a3a2e' }}>
              {form.selectedHotel.name} (⭐ {form.selectedHotel.rating}) — ₹{form.selectedHotel.pricePerNight?.toLocaleString('en-IN')}/night
            </div>
          </div>
          <Check size={18} color="#4a8c6f" />
        </div>
      )}

      {/* Modal detail viewer with Hotel API photo, address, amenities and Map link */}
      {viewingHotel && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16
        }}>
          <div style={{
            background: 'white', borderRadius: 24, padding: 24, maxWidth: 440, width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'scaleIn 0.2s ease'
          }}>
            {/* Modal Hotel Image */}
            <div style={{ position: 'relative', height: 180, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
              <img
                src={viewingHotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                alt={viewingHotel.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', top: 12, right: 12,
                background: 'rgba(26,58,46,0.9)', color: '#d4a843',
                padding: '4px 10px', borderRadius: 50, fontSize: 13, fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 4
              }}>
                ⭐ {viewingHotel.rating}
              </div>
            </div>

            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#1a3a2e', marginBottom: 6 }}>
              {viewingHotel.name}
            </h3>

            <div style={{ fontSize: 13, color: '#4b5563', marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
              <MapPin size={16} color="#4a8c6f" style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{viewingHotel.address}</span>
            </div>

            <div style={{ fontSize: 15, fontWeight: 800, color: '#4a8c6f', marginBottom: 12 }}>
              Rate: ₹{viewingHotel.pricePerNight?.toLocaleString('en-IN')}/night
              {viewingHotel.isEstimatedPrice && <span style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', marginLeft: 6 }}>(Estimated API Rate)</span>}
            </div>

            {/* Amenities tags */}
            {viewingHotel.amenities && viewingHotel.amenities.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {viewingHotel.amenities.map((amenity, idx) => (
                  <span key={idx} style={{
                    padding: '3px 9px', background: '#f0faf4', color: '#4a8c6f',
                    borderRadius: 50, fontSize: 11, fontWeight: 600, border: '1px solid rgba(74,140,111,0.2)'
                  }}>
                    ✓ {amenity}
                  </span>
                ))}
              </div>
            )}

            <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.5, marginBottom: 16 }}>
              {viewingHotel.description || 'This accommodation will serve as your daily stay hub for itinerary optimization and activity planning.'}
            </p>

            {/* External Google Maps address link */}
            <div style={{ marginBottom: 20 }}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(viewingHotel.name + ' ' + viewingHotel.address)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: 13, fontWeight: 600, color: '#4a8c6f', textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 6
                }}
              >
                📍 Open Location in Google Maps ↗
              </a>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn-secondary"
                onClick={() => setViewingHotel(null)}
                style={{ flex: 1 }}
              >
                Close
              </button>
              <button
                className="btn-primary"
                onClick={() => { setSelectedHotel(viewingHotel); setViewingHotel(null); }}
                style={{ flex: 1 }}
              >
                Select Hotel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Step 7: Final Review & Confirmation ───
const Step7 = ({ form }) => {
  const days = form.startDate && form.endDate
    ? differenceInDays(new Date(form.endDate), new Date(form.startDate))
    : 1;

  const transport = form.transportDetails || {};
  const hotel = form.selectedHotel;

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#1a3a2e', marginBottom: 6 }}>
          Review Your Trip Plan 📄
        </h2>
        <p style={{ color: '#6b7280', fontSize: 15 }}>Everything is configured! Ready to generate your custom AI itinerary?</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Destination & Dates Card */}
        <div style={{ padding: 18, background: 'white', borderRadius: 16, border: '1px solid rgba(74,140,111,0.2)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 4 }}>Trip Overview</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1a3a2e' }}>
            📍 {form.startLocation || 'Start'} → {form.destination || 'Destination'}
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
            📅 {form.startDate} to {form.endDate} ({days} Days) · 👥 {(form.travelers?.adults || 1) + (form.travelers?.children || 0)} Travelers
          </div>
        </div>

        {/* Vehicle & Fuel Card */}
        <div style={{ padding: 18, background: 'white', borderRadius: 16, border: '1px solid rgba(74,140,111,0.2)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 4 }}>Transportation</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1a3a2e', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Car size={16} color="#4a8c6f" />
            {transport.vehicleType ? transport.vehicleType.toUpperCase() : 'CAR'} ({transport.fuelType || 'petrol'}, {transport.mileage || 15} km/l)
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
            Route: {transport.oneWayDistanceKm || 300} km (Round trip {transport.roundTripDistanceKm || 600} km) → Est. Fuel Cost: <strong>₹{(transport.calculatedFuelCost || 0).toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* Hotel Card */}
        <div style={{ padding: 18, background: 'white', borderRadius: 16, border: '1px solid rgba(74,140,111,0.2)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 4 }}>Hotel Accommodation</div>
          {hotel ? (
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1a3a2e' }}>
                🏨 {hotel.name} (⭐ {hotel.rating})
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                Rate: ₹{hotel.pricePerNight?.toLocaleString('en-IN')}/night · {hotel.address}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 13, color: '#9ca3af' }}>No hotel selected. Standard mid-range hotel will be assigned.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main CreateTrip ───
const CreateTrip = () => {
  const navigate = useNavigate();
  const {
    currentStep, nextStep, prevStep, tripForm,
    updateTripForm, updateTransportDetails, setSelectedHotel, updatePreferences,
    resetForm, isGenerating, setGenerating, generationStep, setGenerationStep
  } = useTripStore();

  const totalSteps = 7;

  const update = (data) => updateTripForm(data);
  const updatePref = (data) => updatePreferences(data);

  const canProceed = () => {
    const f = tripForm;
    switch (currentStep) {
      case 1: return f.destination.length >= 2 && f.startLocation.length >= 2;
      case 2: return f.startDate && f.endDate && new Date(f.endDate) > new Date(f.startDate);
      case 3: return f.travelers.adults >= 1 && f.budget >= 500;
      case 4: return (f.preferences.travelStyle || []).length > 0;
      case 5: return true;
      case 6: return !!f.selectedHotel;
      case 7: return true;
      default: return true;
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerationStep(0);

    try {
      const stepInterval = setInterval(() => {
        setGenerationStep(s => {
          if (s >= 7) { clearInterval(stepInterval); return s; }
          return s + 1;
        });
      }, 700);

      const start = new Date(tripForm.startDate);
      const end = new Date(tripForm.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      const createRes = await tripsAPI.create({
        ...tripForm,
        days,
      });

      const tripId = createRes.data.trip._id;
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
    <Step4 form={tripForm} updatePref={updatePref} />,
    <Step5 form={tripForm} updateTransportDetails={updateTransportDetails} updatePref={updatePref} />,
    <Step6 form={tripForm} setSelectedHotel={setSelectedHotel} />,
    <Step7 form={tripForm} />,
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

            {/* Summary Preview */}
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
                {tripForm.selectedHotel && <span>🏨 {tripForm.selectedHotel.name}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTrip;
