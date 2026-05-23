import { useState, useEffect, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { useDashboard } from '../context/DashboardContext';

const dispensers = [
  {
    school: 'Mother Mary School',
    id: 'DISP-001',
    stock: 780,
    capacity: 1000,
    percent: 78,
    barClass: 'bar-pink',
    status: 'full' as const,
    statusLabel: 'Full',
    daily: 12,
    days: 65,
    daysClass: '',
  },
  {
    school: 'Mother Mary School',
    id: 'DISP-002',
    stock: 650,
    capacity: 1000,
    percent: 65,
    barClass: 'bar-pink',
    status: 'good' as const,
    statusLabel: 'Good',
    daily: 10,
    days: 65,
    daysClass: '',
  },
  {
    school: 'St. Josephine School',
    id: 'DISP-003',
    stock: 230,
    capacity: 1000,
    percent: 23,
    barClass: 'bar-amber',
    status: 'low' as const,
    statusLabel: 'Low',
    daily: 8,
    days: 29,
    daysClass: 'text-urgent',
  },
  {
    school: 'Ecole Secondaire',
    id: 'DISP-004',
    stock: 80,
    capacity: 1000,
    percent: 8,
    barClass: 'bar-red',
    status: 'critical' as const,
    statusLabel: 'Critical',
    daily: 6,
    days: 13,
    daysClass: 'text-overdue',
  },
];

export function InventoryPage() {
  const {
    schools,
    pendingRestocks,
    restockPrefill,
    submitRestock,
    approveRestock,
    requestRestockForSchool,
    showToast,
  } = useDashboard();

  const [school, setSchool] = useState(restockPrefill.school);
  const [quantity, setQuantity] = useState(restockPrefill.quantity);
  const [notes, setNotes] = useState(restockPrefill.notes);

  useEffect(() => {
    setSchool(restockPrefill.school);
    setQuantity(restockPrefill.quantity);
    setNotes(restockPrefill.notes);
  }, [restockPrefill]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitRestock(school, Number(quantity), notes);
    setSchool('');
    setQuantity('');
    setNotes('');
  };

  const lowCount = schools.filter((s) => s.status === 'low' || s.status === 'critical').length;

  return (
    <>
      <PageHeader
        title="Inventory"
        subtitle="Track and manage pad stock across all dispensers"
      />

      <div className="inventory-summary-row">
        <button
          type="button"
          className="summary-card summary-green animate-in summary-clickable"
          onClick={() => showToast('1,247 pads keeping girls comfortable across Kigali', 'info')}
        >
          <span className="summary-label">Total pads in stock</span>
          <span className="summary-value">1,247</span>
          <span className="summary-sub">units across all schools</span>
        </button>
        <button
          type="button"
          className="summary-card summary-amber animate-in summary-clickable"
          style={{ animationDelay: '50ms' }}
          onClick={() => {
            const low = schools.find((s) => s.status === 'low' || s.status === 'critical');
            if (low) requestRestockForSchool(low.name);
          }}
        >
          <span className="summary-label">Low stock alerts</span>
          <span className="summary-value">{lowCount}</span>
          <span className="summary-sub">tap to start a restock</span>
        </button>
        <article
          className="summary-card summary-neutral animate-in"
          style={{ animationDelay: '100ms' }}
        >
          <span className="summary-label">Avg. days until restock</span>
          <span className="summary-value">12</span>
          <span className="summary-sub">days remaining on average</span>
        </article>
      </div>

      <section className="table-card animate-in">
        <div className="school-table-wrap">
          <table className="school-table inventory-table">
            <thead>
              <tr>
                <th>School</th>
                <th>Dispenser</th>
                <th>Current stock</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Daily use</th>
                <th>Days left</th>
              </tr>
            </thead>
            <tbody>
              {dispensers.map((d) => (
                <tr
                  key={d.id}
                  className="table-row-clickable"
                  onClick={() => {
                    const match = schools.find((s) =>
                      d.school.toLowerCase().includes(s.name.split(' ')[0].toLowerCase()),
                    );
                    if (match) requestRestockForSchool(match.name);
                    else showToast(`Opening restock for ${d.school}`, 'info');
                  }}
                >
                  <td className="school-name">{d.school}</td>
                  <td>
                    <code className="dispenser-id">{d.id}</code>
                  </td>
                  <td>
                    <div className="stock-cell">
                      <span className="stock-text">
                        {d.stock} of {d.capacity} pads
                      </span>
                      <div className="progress-bar-track">
                        <div
                          className={`progress-bar-fill ${d.barClass}`}
                          style={{ width: `${d.percent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>{d.capacity.toLocaleString()}</td>
                  <td>
                    <span className={`badge badge-${d.status === 'good' ? 'full' : d.status}`}>
                      {d.statusLabel}
                    </span>
                  </td>
                  <td>{d.daily} pads/day</td>
                  <td className={d.daysClass || undefined}>
                    <strong>{d.days}</strong> days
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="inventory-bottom-grid">
        <section className="form-card animate-in" data-tour="inventory-form">
          <h2 className="chart-card-title">Restock request</h2>
          <form className="restock-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="restock-school">School</label>
              <select
                id="restock-school"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                required
              >
                <option value="">Choose a school…</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="restock-qty">Quantity needed</label>
              <input
                id="restock-qty"
                type="number"
                min={1}
                placeholder="e.g. 500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="restock-notes">Notes</label>
              <textarea
                id="restock-notes"
                rows={3}
                placeholder="Anything we should know for delivery?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-gradient btn-full">
              Submit restock request
            </button>
          </form>
        </section>

        <section className="form-card pending-card animate-in">
          <h2 className="chart-card-title">Pending requests</h2>
          {pendingRestocks.length === 0 ? (
            <p className="empty-cozy">No pending requests — you're all caught up!</p>
          ) : (
            <div className="pending-list">
              {pendingRestocks.map((req) => (
                <div key={req.id} className="pending-request">
                  <div className="pending-request-header">
                    <strong>{req.school}</strong>
                    <span
                      className={`badge ${req.status === 'pending' ? 'badge-low' : 'badge-full'}`}
                    >
                      {req.status === 'pending' ? 'Pending' : 'Approved'}
                    </span>
                  </div>
                  <p className="pending-meta">
                    Submitted {req.submittedLabel} · {req.quantity} pads requested
                  </p>
                  <p className="pending-notes">{req.notes}</p>
                  {req.status === 'pending' && (
                    <button
                      type="button"
                      className="btn-soft btn-approve"
                      onClick={() => approveRestock(req.id)}
                    >
                      <Check size={16} />
                      Mark as approved
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
