import { useState } from 'react';
import { PageHeader } from '../components/shared/PageHeader';
import { useDashboard } from '../context/DashboardContext';

function Toggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="toggle-row">
      <span>{label}</span>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        className={`toggle-switch${checked ? ' on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="toggle-thumb" />
      </button>
    </div>
  );
}

export function SettingsPage() {
  const { account, openModal, showToast } = useDashboard();
  const [lowStock, setLowStock] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(false);
  const [monthlySummary, setMonthlySummary] = useState(true);
  const [newSchool, setNewSchool] = useState(false);
  const [autoReport, setAutoReport] = useState(false);
  const [reportFormat, setReportFormat] = useState('PDF');
  const [frequency, setFrequency] = useState('Monthly');

  const fields = [
    { label: 'Name', value: account.name },
    { label: 'Organisation', value: account.organisation },
    { label: 'Email', value: account.email },
    { label: 'Role', value: account.role },
  ] as const;

  const handleSave = () => {
    const prefs = [
      lowStock && 'low-stock alerts',
      weeklyReports && 'weekly reports',
      sessionReminders && 'session reminders',
      monthlySummary && 'monthly summaries',
      autoReport && `auto ${frequency.toLowerCase()} reports`,
    ].filter(Boolean);
    showToast(
      `Saved! You'll get ${prefs.length ? prefs.join(', ') : 'your quiet preferences'} — we've got you.`,
      'warm',
    );
  };

  const handleToggle = (setter: (v: boolean) => void, label: string, next: boolean) => {
    setter(next);
    showToast(
      next ? `${label} turned on — we'll keep you in the loop.` : `${label} turned off — no worries.`,
      'info',
    );
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Your cozy corner for account & preferences" />

      <section className="settings-section animate-in">
        <h2 className="settings-section-title">Account information</h2>
        <div className="settings-card">
          {fields.map((field) => (
            <div key={field.label} className="settings-field-row">
              <div>
                <span className="settings-field-label">{field.label}</span>
                <span className="settings-field-value">{field.value}</span>
              </div>
              <button
                type="button"
                className="btn-outline-grey btn-sm-inline"
                onClick={() =>
                  openModal({
                    type: 'edit-field',
                    fieldLabel: field.label,
                    fieldValue: field.value,
                  })
                }
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="settings-section animate-in" style={{ animationDelay: '50ms' }}>
        <h2 className="settings-section-title">Notification preferences</h2>
        <div className="settings-card">
          <Toggle
            id="low-stock"
            label="Low stock alerts"
            checked={lowStock}
            onChange={(v) => handleToggle(setLowStock, 'Low stock alerts', v)}
          />
          <Toggle
            id="weekly"
            label="Weekly usage reports"
            checked={weeklyReports}
            onChange={(v) => handleToggle(setWeeklyReports, 'Weekly reports', v)}
          />
          <Toggle
            id="sessions"
            label="Session reminders"
            checked={sessionReminders}
            onChange={(v) => handleToggle(setSessionReminders, 'Session reminders', v)}
          />
          <Toggle
            id="monthly"
            label="Monthly impact summary"
            checked={monthlySummary}
            onChange={(v) => handleToggle(setMonthlySummary, 'Monthly summary', v)}
          />
          <Toggle
            id="new-school"
            label="New school added"
            checked={newSchool}
            onChange={(v) => handleToggle(setNewSchool, 'New school alerts', v)}
          />
        </div>
      </section>

      <section className="settings-section animate-in" style={{ animationDelay: '100ms' }}>
        <h2 className="settings-section-title">Report settings</h2>
        <div className="settings-card">
          <div className="form-field inline-field">
            <label htmlFor="default-format">Default format</label>
            <select
              id="default-format"
              value={reportFormat}
              onChange={(e) => {
                setReportFormat(e.target.value);
                showToast(`Default format set to ${e.target.value}`, 'info');
              }}
            >
              <option>PDF</option>
              <option>Excel</option>
            </select>
          </div>
          <div className="form-field inline-field">
            <label htmlFor="frequency">Report frequency</label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => {
                setFrequency(e.target.value);
                showToast(`Reports will run ${e.target.value.toLowerCase()}`, 'info');
              }}
            >
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Quarterly</option>
            </select>
          </div>
          <Toggle
            id="auto-report"
            label="Automatic report generation"
            checked={autoReport}
            onChange={(v) => handleToggle(setAutoReport, 'Auto reports', v)}
          />
        </div>
      </section>

      <button type="button" className="btn-gradient settings-save-btn" onClick={handleSave}>
        Save settings
      </button>
    </>
  );
}
