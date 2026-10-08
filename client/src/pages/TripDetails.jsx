import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DayCard from '../components/DayCard';
import BudgetCard from '../components/BudgetCard';
import { tripsAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  MapPin, Calendar, Users, IndianRupee, Heart, Share2,
  Download, Sparkles, RefreshCw, ArrowLeft, Leaf,
  ChevronDown, X, Check, Car, Hotel, Gauge, Fuel, Route
} from 'lucide-react';
import jsPDF from 'jspdf';

const regenerateOptions = [
  { label: '✨ Regenerate Day', instruction: 'Regenerate the itinerary with fresh new activities' },
  { label: '💰 Make it cheaper', instruction: 'Find budget-friendly alternatives to reduce costs' },
  { label: '🎯 Add more adventure', instruction: 'Add more adventurous outdoor activities' },
  { label: '🧘 Make it relaxing', instruction: 'Replace strenuous activities with relaxing experiences' },
  { label: '🍜 Add more food spots', instruction: 'Add more local food and restaurant experiences' },
  { label: '📷 Photography spots', instruction: 'Add scenic photography locations and viewpoints' },
  { label: '🏛️ More culture', instruction: 'Include more cultural, heritage and historical experiences' },
];

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [regenOpen, setRegenOpen] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => tripsAPI.getOne(id),
    select: (res) => res.data.trip,
  });

  const saveMutation = useMutation({
    mutationFn: () => tripsAPI.save(id),
    onSuccess: (res) => {
      qc.invalidateQueries(['trip', id]);
      qc.invalidateQueries(['trips']);
      toast.success(res.data.saved ? '❤️ Trip saved!' : 'Trip unsaved');
    },
    onError: () => toast.error('Failed to save trip'),
  });

  const shareMutation = useMutation({
    mutationFn: () => tripsAPI.share(id),
    onSuccess: (res) => {
      setShareUrl(res.data.shareUrl);
      navigator.clipboard.writeText(res.data.shareUrl).catch(() => {});
      toast.success('Share link copied! 🔗');
    },
    onError: () => toast.error('Failed to generate share link'),
  });

  const handleRegenerate = async (instruction) => {
    setRegenOpen(false);
    setRegenLoading(true);
    try {
      await tripsAPI.regenerate(id, instruction);
      qc.invalidateQueries(['trip', id]);
      toast.success('Itinerary updated by AI! ✨');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Regeneration failed');
    } finally {
      setRegenLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!data) return;
    const doc = new jsPDF();
    const totalTravelers = (data.travelers?.adults || 1) + (data.travelers?.children || 0);
    const transport = data.transportDetails || {};
    const hotel = data.selectedHotel || data.itinerary?.[0]?.accommodation || {};
    const breakdown = data.budgetBreakdown || {};
    const nights = Math.max(1, (data.days || 1) - 1);

    let y = 20;

    // Header Box
    doc.setFillColor(26, 58, 46);
    doc.rect(15, 12, 180, 34, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('TRIP PLANNER', 105, 22, { align: 'center' });

    doc.setFontSize(13);
    doc.text(`${(data.destination || 'DESTINATION').toUpperCase()} TRIP`, 105, 30, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.text(`📍 ${data.startLocation || 'Start'} → ${data.destination || 'Destination'}   |   📅 ${data.startDate} – ${data.endDate}   |   👥 ${totalTravelers} Travelers`, 105, 38, { align: 'center' });

    y = 54;
    doc.setTextColor(30, 41, 59);

    // Section 1: TRIP SUMMARY
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 15, y); y += 5;
    doc.text('TRIP SUMMARY', 15, y); y += 5;
    doc.text('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 15, y); y += 9;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const vehicleName = (transport.vehicleType || 'Car').toUpperCase();
    const fuelTypeName = (transport.fuelType || 'Petrol');
    const mileageVal = transport.mileage || 15;
    const travelCostVal = breakdown.transportation || transport.calculatedFuelCost || 0;

    doc.setFont('helvetica', 'bold');
    doc.text('Transportation:', 15, y); doc.setFont('helvetica', 'normal');
    doc.text(`${vehicleName}`, 55, y); y += 5;

    doc.setFont('helvetica', 'bold');
    doc.text('Fuel Type:', 15, y); doc.setFont('helvetica', 'normal');
    doc.text(`${fuelTypeName}`, 55, y); y += 5;

    doc.setFont('helvetica', 'bold');
    doc.text('Mileage:', 15, y); doc.setFont('helvetica', 'normal');
    doc.text(`${mileageVal} km/l`, 55, y); y += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('Estimated Travel Cost:', 15, y); doc.setFont('helvetica', 'normal');
    doc.text(`₹${travelCostVal.toLocaleString('en-IN')}`, 60, y); y += 8;

    if (hotel && hotel.name) {
      doc.setFont('helvetica', 'bold');
      doc.text('Hotel:', 15, y); doc.setFont('helvetica', 'normal');
      doc.text(`${hotel.name} (⭐ ${hotel.rating || 4.5})`, 40, y); y += 6;

      doc.setFont('helvetica', 'bold');
      doc.text('Stay:', 15, y); doc.setFont('helvetica', 'normal');
      doc.text(`${nights} Night${nights > 1 ? 's' : ''}`, 40, y); y += 8;
    }

    // Section 2: DAY BY DAY ITINERARY
    (data.itinerary || []).forEach(day => {
      if (y > 240) { doc.addPage(); y = 20; }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 15, y); y += 5;
      doc.text(`DAY ${day.day}: ${(day.title || day.date || '').toUpperCase()}`, 15, y); y += 5;
      doc.text('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 15, y); y += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);

      (day.activities || []).forEach(act => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'bold');
        doc.text(`${act.startTime || '09:00 AM'}`, 18, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${act.name} — ${act.description || ''}`.substring(0, 75), 45, y);
        y += 6;
      });
      y += 4;
    });

    // Section 3: COST SUMMARY
    if (y > 210) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 15, y); y += 5;
    doc.text('COST SUMMARY', 15, y); y += 5;
    doc.text('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 15, y); y += 9;

    const transportAmt = breakdown.transportation || 0;
    const accomAmt = breakdown.accommodation || 0;
    const foodAmt = breakdown.food || 0;
    const totalCostAmt = data.estimatedCost || (transportAmt + accomAmt + foodAmt);
    const perPersonAmt = Math.round(totalCostAmt / (totalTravelers || 1));

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Transportation', 18, y); doc.text(`₹${transportAmt.toLocaleString('en-IN')}`, 140, y, { align: 'right' }); y += 6;
    doc.text('Accommodation', 18, y); doc.text(`₹${accomAmt.toLocaleString('en-IN')}`, 140, y, { align: 'right' }); y += 6;
    doc.text('Food & Dining', 18, y); doc.text(`₹${foodAmt.toLocaleString('en-IN')}`, 140, y, { align: 'right' }); y += 8;

    doc.setFont('helvetica', 'bold');
    doc.text('Total', 18, y); doc.text(`₹${totalCostAmt.toLocaleString('en-IN')}`, 140, y, { align: 'right' }); y += 6;
    doc.text('Per Person', 18, y); doc.text(`₹${perPersonAmt.toLocaleString('en-IN')}`, 140, y, { align: 'right' }); y += 8;

    doc.text('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 15, y);

    doc.save(`${data.destination}-Trip-Plan.pdf`);
    toast.success('PDF downloaded successfully! 📄');
  };

  if (isLoading) {
    return (
      <div className="bg-page" style={{ minHeight: '100vh' }}>
        <Navbar />
        <Sidebar />
        <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 70px)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16, animation: 'float 2s ease-in-out infinite' }}>🌿</div>
            <p style={{ color: '#6b7280' }}>Loading your adventure...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-page" style={{ minHeight: '100vh' }}>
        <Navbar />
        <Sidebar />
        <div className="main-content" style={{ textAlign: 'center', paddingTop: 80 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2e', marginBottom: 8 }}>Trip not found</h2>
          <button onClick={() => navigate('/my-trips')} className="btn-primary" style={{ marginTop: 16 }}>
            ← Back to My Trips
          </button>
        </div>
      </div>
    );
  }

  const trip = data;
  const totalTravelers = (trip.travelers?.adults || 1) + (trip.travelers?.children || 0);
  const isSaved = trip.status === 'saved';
  const transport = trip.transportDetails || {};
  const hotel = trip.selectedHotel || trip.itinerary?.[0]?.accommodation;

  return (
    <div className="bg-page" style={{ minHeight: '100vh' }}>
      <Navbar />
      <Sidebar />

      <div className="main-content">
        {/* Back button */}
        <button
          onClick={() => navigate('/my-trips')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4a8c6f', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, marginBottom: 20, padding: 0 }}
        >
          <ArrowLeft size={16} />
          Back to My Trips
        </button>

        {/* Trip Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1a3a2e 0%, #2d5a45 60%, #1e4a35 100%)',
          borderRadius: 28, padding: '40px', marginBottom: 28,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='40' cy='40' r='35'/%3E%3C/g%3E%3C/svg%3E\")" }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Status tags */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {trip.tags?.slice(0, 4).map(tag => (
                <span key={tag} style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.15)', borderRadius: 50, fontSize: 12, color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  {tag}
                </span>
              ))}
            </div>

            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 4vw, 40px)', color: 'white', marginBottom: 12 }}>
              {trip.title || `${trip.days}-Day Trip to ${trip.destination}`}
            </h1>

            {trip.summary && (
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, lineHeight: 1.6, maxWidth: 600, marginBottom: 24 }}>
                {trip.summary}
              </p>
            )}

            {/* Info pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {[
                { icon: MapPin, text: `${trip.startLocation} → ${trip.destination}` },
                { icon: Calendar, text: `${trip.startDate} – ${trip.endDate}` },
                { icon: Users, text: `${totalTravelers} Travelers` },
                { icon: IndianRupee, text: `₹${(trip.estimatedCost || trip.budget || 0).toLocaleString('en-IN')} Est.` },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'rgba(255,255,255,0.12)', borderRadius: 50, border: '1px solid rgba(255,255,255,0.2)' }}>
                  <Icon size={14} color="rgba(255,255,255,0.8)" />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
          {/* Regenerate */}
          <div style={{ position: 'relative' }}>
            <button
              id="regenerate-btn"
              className="btn-primary"
              onClick={() => setRegenOpen(!regenOpen)}
              disabled={regenLoading}
              style={{ background: 'linear-gradient(135deg, #2d5a45, #4a8c6f)' }}
            >
              {regenLoading ? <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : <Sparkles size={16} />}
              AI Modify
              <ChevronDown size={14} />
            </button>

            {regenOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: 0,
                background: 'white', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
                padding: 8, minWidth: 220, zIndex: 200, animation: 'scaleIn 0.2s ease',
              }}>
                {regenerateOptions.map(({ label, instruction }) => (
                  <button
                    key={label}
                    onClick={() => handleRegenerate(instruction)}
                    style={{
                      display: 'block', width: '100%', padding: '10px 14px',
                      borderRadius: 10, border: 'none', background: 'transparent',
                      color: '#1a3a2e', fontSize: 13, fontWeight: 500,
                      cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f5f0e8'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            id="save-trip-btn"
            onClick={() => saveMutation.mutate()}
            className={isSaved ? 'btn-primary' : 'btn-secondary'}
            style={isSaved ? { background: 'linear-gradient(135deg, #d4a843, #b8860b)' } : {}}
          >
            <Heart size={16} fill={isSaved ? 'white' : 'none'} />
            {isSaved ? 'Saved' : 'Save Trip'}
          </button>

          <button
            id="share-trip-btn"
            onClick={() => shareMutation.mutate()}
            className="btn-secondary"
          >
            <Share2 size={16} />
            Share
          </button>

          <button
            id="export-pdf-btn"
            onClick={handleExportPDF}
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #1a3a2e, #4a8c6f)' }}
          >
            <Download size={16} />
            Download Trip PDF
          </button>
        </div>

        {/* Share URL display */}
        {shareUrl && (
          <div style={{
            padding: '14px 20px', background: 'rgba(74,140,111,0.08)',
            borderRadius: 14, border: '1px solid rgba(74,140,111,0.2)',
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
          }}>
            <Check size={16} color="#4a8c6f" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#4a8c6f', marginBottom: 2 }}>Share link copied!</div>
              <div style={{ fontSize: 12, color: '#9ca3af', wordBreak: 'break-all' }}>{shareUrl}</div>
            </div>
            <button onClick={() => setShareUrl('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          {/* Itinerary */}
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#1a3a2e', marginBottom: 20 }}>
              📅 Day-by-Day Itinerary
            </h2>

            {trip.itinerary?.length > 0 ? (
              trip.itinerary.map((day, i) => (
                <DayCard key={day.day || i} day={day} defaultExpanded={i === 0} />
              ))
            ) : (
              <div style={{
                textAlign: 'center', padding: '60px 24px',
                background: 'white', borderRadius: 24,
                border: '2px dashed rgba(74,140,111,0.3)',
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2e', marginBottom: 8 }}>
                  No itinerary yet
                </h3>
                <p style={{ color: '#9ca3af', marginBottom: 20 }}>
                  This trip hasn't been generated yet.
                </p>
                <button
                  onClick={async () => {
                    try {
                      await tripsAPI.generate(id);
                      qc.invalidateQueries(['trip', id]);
                      toast.success('Itinerary generated!');
                    } catch (e) { toast.error('Generation failed'); }
                  }}
                  className="btn-primary"
                >
                  <Sparkles size={16} />
                  Generate Itinerary
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Selected Hotel Card */}
            {hotel && hotel.name && (
              <div className="glass-card" style={{ padding: 24, border: '2px solid rgba(74,140,111,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Hotel size={18} color="#4a8c6f" />
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: '#1a3a2e', margin: 0 }}>
                    Selected Hotel Stay
                  </h4>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1a3a2e', marginBottom: 4 }}>
                  {hotel.name}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#d4a843', marginBottom: 6 }}>
                  ⭐ {hotel.rating || 4.5} Rating
                </div>
                <div style={{ fontSize: 13, color: '#4a8c6f', fontWeight: 700, marginBottom: 8 }}>
                  ₹{(hotel.pricePerNight || hotel.estimatedCost || 5000).toLocaleString('en-IN')}/night
                  {hotel.isEstimatedPrice && <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 6 }}>(Est. Price)</span>}
                </div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  📍 {hotel.address || hotel.location || trip.destination}
                </div>
              </div>
            )}

            {/* Vehicle & Transportation Details Card */}
            <div className="glass-card" style={{ padding: 24, border: '2px solid rgba(74,140,111,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Car size={18} color="#4a8c6f" />
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: '#1a3a2e', margin: 0 }}>
                  Transportation Details
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>Vehicle</span>
                  <span style={{ fontWeight: 700, color: '#1a3a2e', textTransform: 'capitalize' }}>{transport.vehicleType || 'Car'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>Fuel Type</span>
                  <span style={{ fontWeight: 700, color: '#1a3a2e', textTransform: 'capitalize' }}>{transport.fuelType || 'Petrol'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>Mileage</span>
                  <span style={{ fontWeight: 700, color: '#1a3a2e' }}>{transport.mileage || 15} km/l</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>One-Way Distance</span>
                  <span style={{ fontWeight: 700, color: '#1a3a2e' }}>{transport.oneWayDistanceKm || 300} km</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>Round Trip</span>
                  <span style={{ fontWeight: 700, color: '#1a3a2e' }}>{transport.roundTripDistanceKm || 600} km</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px dashed #e5e7eb' }}>
                  <span style={{ color: '#4a8c6f', fontWeight: 700 }}>Est. Travel Cost</span>
                  <span style={{ fontWeight: 800, color: '#4a8c6f' }}>
                    ₹{(trip.budgetBreakdown?.transportation || transport.calculatedFuelCost || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <BudgetCard
              budget={trip.budget}
              estimatedCost={trip.estimatedCost}
              budgetStatus={trip.budgetStatus}
              budgetBreakdown={trip.budgetBreakdown}
            />
          </div>
        </div>
      </div>

      {/* Close regen dropdown if click outside */}
      {regenOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }} onClick={() => setRegenOpen(false)} />
      )}
    </div>
  );
};

export default TripDetails;
