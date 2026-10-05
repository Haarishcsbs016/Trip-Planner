import { IndianRupee, TrendingUp, TrendingDown, Car, Home, Coffee, Zap, MoreHorizontal } from 'lucide-react';

const budgetCategories = [
  { key: 'transportation', label: 'Transport', icon: Car, color: '#4a8c6f' },
  { key: 'accommodation', label: 'Stay', icon: Home, color: '#4a90b8' },
  { key: 'food', label: 'Food', icon: Coffee, color: '#d4a843' },
  { key: 'activities', label: 'Activities', icon: Zap, color: '#8c4a8c' },
  { key: 'miscellaneous', label: 'Misc', icon: MoreHorizontal, color: '#e55252' },
];

const BudgetCard = ({ budget, estimatedCost, budgetStatus, budgetBreakdown }) => {
  const overBudget = budgetStatus === 'over';
  const difference = Math.abs((budget || 0) - (estimatedCost || 0));
  const percentage = budget ? Math.min((estimatedCost / budget) * 100, 100) : 0;

  return (
    <div className="glass-card" style={{ padding: 28 }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#1a3a2e', marginBottom: 20 }}>
        💰 Budget Overview
      </h3>

      {/* Total vs Estimated */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ textAlign: 'center', padding: 16, background: '#f5f0e8', borderRadius: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 4 }}>Your Budget</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <IndianRupee size={18} color="#1a3a2e" />
            <span style={{ fontSize: 24, fontWeight: 800, color: '#1a3a2e' }}>{(budget || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: 16, background: overBudget ? '#fff5f5' : '#f0faf4', borderRadius: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 4 }}>Estimated Cost</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <IndianRupee size={18} color={overBudget ? '#e55252' : '#4a8c6f'} />
            <span style={{ fontSize: 24, fontWeight: 800, color: overBudget ? '#e55252' : '#4a8c6f' }}>
              {(estimatedCost || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Budget Bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Budget Used</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: overBudget ? '#e55252' : '#4a8c6f' }}>
            {percentage.toFixed(0)}%
          </span>
        </div>
        <div className="budget-bar">
          <div className={`budget-fill ${overBudget ? 'over' : 'within'}`} style={{ width: `${percentage}%` }} />
        </div>
      </div>

      {/* Status Banner */}
      <div style={{
        padding: '12px 16px', borderRadius: 12, marginBottom: 24,
        background: overBudget ? 'rgba(229,82,82,0.08)' : 'rgba(74,140,111,0.08)',
        border: `1px solid ${overBudget ? 'rgba(229,82,82,0.2)' : 'rgba(74,140,111,0.2)'}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        {overBudget ? <TrendingUp size={18} color="#e55252" /> : <TrendingDown size={18} color="#4a8c6f" />}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: overBudget ? '#e55252' : '#4a8c6f' }}>
            {overBudget ? `⚠ Exceeds budget by ₹${difference.toLocaleString('en-IN')}` : `✓ Within budget — ₹${difference.toLocaleString('en-IN')} remaining`}
          </div>
          {overBudget && (
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
              Try clicking "Make it cheaper" to get AI budget suggestions
            </div>
          )}
        </div>
      </div>

      {/* Breakdown */}
      {budgetBreakdown && (
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>
            Breakdown
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {budgetCategories.map(({ key, label, icon: Icon, color }) => {
              const amount = budgetBreakdown[key] || 0;
              const pct = estimatedCost ? (amount / estimatedCost) * 100 : 0;
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: `${color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={15} color={color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#1a3a2e' }}>₹{amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ height: 6, background: '#f0f0f0', borderRadius: 50, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 50, transition: 'width 1s ease' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetCard;
