import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, IndianRupee, Heart, Trash2, Star } from 'lucide-react';
import { format } from 'date-fns';

const destinationGradients = [
  'linear-gradient(135deg, #1a3a2e 0%, #4a8c6f 100%)',
  'linear-gradient(135deg, #1a3260 0%, #4a6cb8 100%)',
  'linear-gradient(135deg, #3a1a1a 0%, #8c4a4a 100%)',
  'linear-gradient(135deg, #1a3a35 0%, #4a8c7a 100%)',
  'linear-gradient(135deg, #2d1a3a 0%, #6b4a8c 100%)',
  'linear-gradient(135deg, #3a2a1a 0%, #8c6a4a 100%)',
];

const getGradient = (str) => {
  const idx = str?.charCodeAt(0) % destinationGradients.length || 0;
  return destinationGradients[idx];
};

const TripCard = ({ trip, onDelete, showActions = true }) => {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(trip._id);
  };

  const handleClick = () => navigate(`/trips/${trip._id}`);

  const formatDate = (d) => {
    try { return format(new Date(d), 'MMM dd'); } 
    catch { return d; }
  };

  const budgetOverBadge = trip.budgetStatus === 'over';

  return (
    <div className="trip-card" onClick={handleClick} id={`trip-card-${trip._id}`}>
      {/* Image / Gradient Header */}
      <div className="trip-card-img" style={{ background: getGradient(trip.destination) }}>
        {/* Overlay pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='28'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }} />
        
        {/* Status badge */}
        <div style={{ position: 'absolute', top: 14, left: 14 }}>
          <span className={`badge ${trip.status === 'saved' ? 'badge-gold' : 'badge-green'}`}
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
            {trip.status === 'saved' ? '❤️ Saved' : trip.status === 'generated' ? '✨ Generated' : '📝 Draft'}
          </span>
        </div>

        {/* Budget status */}
        {budgetOverBadge && (
          <div style={{ position: 'absolute', top: 14, right: 14 }}>
            <span style={{
              background: 'rgba(229,82,82,0.9)', color: 'white',
              padding: '4px 10px', borderRadius: 50, fontSize: 11, fontWeight: 600,
            }}>⚠ Over budget</span>
          </div>
        )}

        {/* Destination name */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '40px 20px 16px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
        }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>
            {trip.destination}
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, margin: 0 }}>
            from {trip.startLocation}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '16px 20px 20px' }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1a3a2e', marginBottom: 12, 
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {trip.title}
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={13} color="#7eb89a" />
            <span style={{ fontSize: 12, color: '#6b7280' }}>
              {trip.startDate ? `${formatDate(trip.startDate)} – ${formatDate(trip.endDate)}` : `${trip.days} days`}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={13} color="#7eb89a" />
            <span style={{ fontSize: 12, color: '#6b7280' }}>
              {(trip.travelers?.adults || 1) + (trip.travelers?.children || 0)} travelers
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <IndianRupee size={13} color="#7eb89a" />
            <span style={{ fontSize: 12, color: '#6b7280' }}>
              ₹{(trip.budget || 0).toLocaleString('en-IN')}
            </span>
          </div>
          {trip.estimatedCost && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={13} color="#d4a843" fill="#d4a843" />
              <span style={{ fontSize: 12, color: budgetOverBadge ? '#e55252' : '#4a8c6f', fontWeight: 500 }}>
                ₹{trip.estimatedCost.toLocaleString('en-IN')} est.
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {trip.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
            {trip.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{
                padding: '2px 10px', borderRadius: 50,
                background: 'rgba(74,140,111,0.08)',
                color: '#4a8c6f', fontSize: 11, fontWeight: 500,
              }}>{tag}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              id={`view-trip-${trip._id}`}
              onClick={handleClick}
              className="btn-primary"
              style={{ flex: 1, padding: '10px', fontSize: 13 }}
            >
              View Trip →
            </button>
            {onDelete && (
              <button
                onClick={handleDelete}
                style={{
                  padding: '10px 12px', borderRadius: 12,
                  background: '#fff5f5', border: '1px solid #fecaca',
                  color: '#e55252', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff5f5'}
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripCard;
