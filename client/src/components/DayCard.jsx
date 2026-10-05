import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, IndianRupee, Sun, Cloud, CloudRain, MapPin, Lightbulb } from 'lucide-react';

const WeatherIcon = ({ condition }) => {
  if (!condition) return <Sun size={14} color="#d4a843" />;
  const c = condition.toLowerCase();
  if (c.includes('rain')) return <CloudRain size={14} color="#4a90b8" />;
  if (c.includes('cloud')) return <Cloud size={14} color="#94a3b8" />;
  return <Sun size={14} color="#d4a843" />;
};

const ActivityItem = ({ activity, index }) => (
  <div className="timeline-item">
    <div className="timeline-dot" style={{
      background: activity.type === 'restaurant' ? '#d4a843' 
        : activity.type === 'hotel' ? '#4a90b8' 
        : '#4a8c6f'
    }}>
      {index + 1}
    </div>
    <div style={{
      background: 'white', borderRadius: 14,
      padding: '14px 16px',
      border: '1px solid rgba(168,213,184,0.2)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            background: 'rgba(74,140,111,0.1)', color: '#4a8c6f',
            padding: '2px 8px', borderRadius: 50, fontSize: 11, fontWeight: 600,
          }}>{activity.startTime}</span>
          <h5 style={{ fontSize: 14, fontWeight: 600, color: '#1a3a2e', margin: 0 }}>{activity.name}</h5>
        </div>
        {activity.estimatedCost > 0 && (
          <span style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 2, whiteSpace: 'nowrap' }}>
            <IndianRupee size={10} />₹{activity.estimatedCost?.toLocaleString('en-IN')}
          </span>
        )}
      </div>
      {activity.duration && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
          <Clock size={11} color="#9ca3af" />
          <span style={{ fontSize: 11, color: '#9ca3af' }}>{activity.duration}</span>
        </div>
      )}
      {activity.description && (
        <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>{activity.description}</p>
      )}
      {activity.tips && (
        <div style={{ marginTop: 8, padding: '6px 10px', background: 'rgba(212,168,67,0.08)', borderRadius: 8 }}>
          <span style={{ fontSize: 11, color: '#b8860b' }}>💡 {activity.tips}</span>
        </div>
      )}
    </div>
  </div>
);

const DayCard = ({ day, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const weatherClass = day.weather?.condition?.toLowerCase().includes('rain') ? 'weather-rainy'
    : day.weather?.condition?.toLowerCase().includes('cloud') ? 'weather-cloudy'
    : 'weather-sunny';

  return (
    <div className="day-card" id={`day-card-${day.day}`} style={{ marginBottom: 16 }}>
      {/* Day Header */}
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, #1a3a2e, #4a8c6f)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'white', flexShrink: 0,
          }}>
            <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.8 }}>DAY</span>
            <span style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{day.day}</span>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: '#1a3a2e', margin: 0 }}>
              {day.title}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              {day.date && <span style={{ fontSize: 12, color: '#9ca3af' }}>{day.date}</span>}
              {day.weather && (
                <span className={`weather-badge ${weatherClass}`}>
                  <WeatherIcon condition={day.weather.condition} />
                  {day.weather.temperature}°C · {day.weather.condition}
                </span>
              )}
              {day.theme && (
                <span style={{ fontSize: 11, color: '#7eb89a', fontWeight: 500 }}>{day.theme}</span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {day.estimatedCost && (
            <span style={{ fontSize: 13, fontWeight: 600, color: '#4a8c6f', display: 'flex', alignItems: 'center', gap: 2 }}>
              <IndianRupee size={13} />₹{day.estimatedCost.toLocaleString('en-IN')}
            </span>
          )}
          {expanded ? <ChevronUp size={20} color="#9ca3af" /> : <ChevronDown size={20} color="#9ca3af" />}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ marginTop: 20, animation: 'fadeIn 0.3s ease' }}>
          {/* Activities Timeline */}
          {day.activities?.length > 0 && (
            <div>
              <h5 style={{ fontSize: 13, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.05em', marginBottom: 16, textTransform: 'uppercase' }}>
                Activities
              </h5>
              <div className="timeline">
                {day.activities.map((activity, i) => (
                  <ActivityItem key={i} activity={activity} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Meals */}
          {day.meals && (
            <div style={{ marginTop: 20 }}>
              <h5 style={{ fontSize: 13, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.05em', marginBottom: 12, textTransform: 'uppercase' }}>
                🍽️ Meals
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {Object.entries(day.meals).map(([mealType, meal]) => meal && (
                  <div key={mealType} style={{
                    background: 'rgba(74,140,111,0.05)', borderRadius: 12,
                    padding: '12px', border: '1px solid rgba(74,140,111,0.1)',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#7eb89a', textTransform: 'uppercase', marginBottom: 4 }}>
                      {mealType}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a3a2e' }}>{meal.name}</div>
                    {meal.location && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{meal.location}</div>}
                    {meal.estimatedCost > 0 && (
                      <div style={{ fontSize: 11, color: '#4a8c6f', marginTop: 4, fontWeight: 600 }}>
                        ₹{meal.estimatedCost}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Accommodation */}
          {day.accommodation?.name && (
            <div style={{ marginTop: 16, padding: '14px 16px', background: 'rgba(74,144,184,0.06)', borderRadius: 14, border: '1px solid rgba(74,144,184,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <MapPin size={14} color="#4a90b8" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#4a90b8' }}>ACCOMMODATION</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1a3a2e' }}>{day.accommodation.name}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>{day.accommodation.location}</div>
                </div>
                {day.accommodation.estimatedCost > 0 && (
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#4a90b8' }}>
                    ₹{day.accommodation.estimatedCost}/night
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Tips */}
          {day.tips?.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Lightbulb size={14} color="#d4a843" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#b8860b' }}>PRO TIPS</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {day.tips.map((tip, i) => (
                  <div key={i} style={{
                    fontSize: 13, color: '#6b7280', padding: '8px 12px',
                    background: 'rgba(212,168,67,0.06)', borderRadius: 10,
                    borderLeft: '3px solid #d4a843',
                  }}>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DayCard;
