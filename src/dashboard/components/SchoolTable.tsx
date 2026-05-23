import { useDashboard } from '../context/DashboardContext';
import '../Dashboard.css';

function StatusBadge({
  status,
  label,
}: {
  status: 'full' | 'low' | 'critical';
  label: string;
}) {
  return <span className={`badge badge-${status}`}>{label}</span>;
}

export function SchoolTable() {
  const { schools, requestRestockForSchool, openModal } = useDashboard();

  return (
    <section className="table-card animate-in">
      <div className="table-card-header">
        <h2 className="chart-card-title">School Status</h2>
        <p className="chart-card-subtitle">Active deployments in Kigali</p>
      </div>
      <div className="school-table-wrap">
        <table className="school-table">
          <thead>
            <tr>
              <th>School name</th>
              <th>Dispensers</th>
              <th>Girls enrolled</th>
              <th>Pads this month</th>
              <th>Stock level</th>
              <th>Last restocked</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {schools.map((school) => (
              <tr
                key={school.id}
                className={`row-accent-${school.status}${school.status === 'critical' ? ' row-critical-tint' : ''} table-row-clickable`}
                onClick={() => openModal({ type: 'school-detail', schoolId: school.id })}
              >
                <td className="school-name-cell">
                  <span className="school-name">{school.name}</span>
                  <span className="school-district">{school.district}</span>
                </td>
                <td>
                  {school.dispensers} dispenser{school.dispensers > 1 ? 's' : ''}
                </td>
                <td>{school.girls.toLocaleString()}</td>
                <td>{school.padsTerm.toLocaleString()}</td>
                <td>
                  <StatusBadge status={school.status} label={school.statusLabel} />
                </td>
                <td>{school.lastRestocked}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  {(school.status === 'low' || school.status === 'critical') && (
                    <button
                      type="button"
                      className="btn-restock btn-restock-gradient"
                      onClick={() => requestRestockForSchool(school.name)}
                    >
                      Request Restock
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
