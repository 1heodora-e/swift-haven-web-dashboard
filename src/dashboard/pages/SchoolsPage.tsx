import { Plus } from 'lucide-react';
import { RestockIcon } from '../components/shared/RestockIcon';
import { PageHeader } from '../components/shared/PageHeader';
import { InventoryRing } from '../components/shared/InventoryRing';
import { useDashboard } from '../context/DashboardContext';

export function SchoolsPage() {
  const { schools, openModal, requestRestockForSchool } = useDashboard();

  return (
    <>
      <PageHeader
        title="Schools"
        subtitle={`Managing ${schools.length} active school${schools.length === 1 ? '' : 's'} in Kigali`}
        action={
          <button
            type="button"
            className="btn-gradient"
            onClick={() => openModal({ type: 'add-school' })}
          >
            <Plus size={18} />
            Add School
          </button>
        }
      />
      <div className="school-cards-stack">
        {schools.map((school, i) => (
          <article
            key={school.id}
            className="school-detail-card animate-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="school-detail-left">
              <h2 className="school-detail-name">{school.name}</h2>
              <p className="school-detail-meta">
                {school.district} · {school.address}
              </p>
              <p className="school-dispenser-summary">
                {school.dispensers} smart dispenser{school.dispensers === 1 ? '' : 's'} on campus
              </p>
              <div className="school-mini-stats">
                <div className="mini-stat">
                  <span className="mini-stat-label">Total Girls Enrolled</span>
                  <span className="mini-stat-value">{school.girls}</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-label">Pads This Term</span>
                  <span className="mini-stat-value">{school.padsTerm.toLocaleString()}</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-stat-label">Sessions Delivered</span>
                  <span className="mini-stat-value">{school.sessions}</span>
                </div>
              </div>
              <div className="haven-circles-row">
                <span className="mini-stat-label">Haven Circles</span>
                <span
                  className={`badge ${school.circlesActive ? 'badge-full' : 'badge-inactive'}`}
                >
                  {school.circlesActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="school-detail-right">
              <InventoryRing percent={school.fillPercent} variant={school.ringVariant} />
              <div className="restock-dates">
                <p>
                  <span className="date-label">Last Restocked</span>
                  <span>{school.lastRestocked}</span>
                </p>
                <p>
                  <span className="date-label">Next Restock Due</span>
                  <span
                    className={
                      school.nextRestockOverdue
                        ? 'text-overdue'
                        : school.nextRestockUrgent
                          ? 'text-urgent'
                          : ''
                    }
                  >
                    {school.nextRestock}
                  </span>
                </p>
              </div>
              <div className="school-card-actions">
                <button
                  type="button"
                  className="btn-outline-pink"
                  onClick={() => openModal({ type: 'school-detail', schoolId: school.id })}
                >
                  View Details
                </button>
                <button
                  type="button"
                  className="btn-gradient btn-sm"
                  onClick={() => requestRestockForSchool(school.name)}
                >
                  <RestockIcon size={16} />
                  Request Restock
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
