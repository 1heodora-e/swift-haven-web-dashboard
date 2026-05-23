import { useState } from 'react';
import { Package, Users, MapPin, Heart, Radio } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { getSchoolDispensers } from '../lib/dispensers';
import { ModalShell } from './shared/Modal';

export function DashboardModals() {
  const {
    modal,
    getSchool,
    closeModal,
    addSchool,
    updateAccountField,
    account,
    downloadReport,
  } = useDashboard();

  if (modal.type === 'none') return null;

  if (modal.type === 'school-detail' && modal.schoolId) {
    const school = getSchool(modal.schoolId);
    if (!school) return null;
    const units = getSchoolDispensers(school);
    return (
      <ModalShell title={school.name} wide>
        <div className="modal-detail-grid">
          <p className="modal-lead">
            <MapPin size={16} aria-hidden /> {school.district} · {school.address}
          </p>
          <div className="modal-stat-pills">
            <span className="pill-stat">
              <Users size={14} aria-hidden /> {school.girls} girls
            </span>
            <span className="pill-stat">
              <Package size={14} aria-hidden /> {school.padsTerm.toLocaleString()} pads this term
            </span>
            <span className="pill-stat">
              <Radio size={14} aria-hidden /> {school.dispensers} smart dispenser
              {school.dispensers === 1 ? '' : 's'}
            </span>
            <span className="pill-stat">
              <Heart size={14} aria-hidden /> {school.sessions} Haven Circles sessions
            </span>
          </div>

          <section className="modal-section">
            <h3 className="modal-section-title">Smart dispensers at this school</h3>
            <p className="modal-section-desc">
              Each unit is connected for live stock monitoring and restock alerts.
            </p>
            <ul className="dispenser-detail-list">
              {units.map((unit) => (
                <li key={unit.id} className="dispenser-detail-card">
                  <div className="dispenser-detail-top">
                    <span className="dispenser-detail-id">{unit.id}</span>
                    <span className={`badge badge-${unit.status}`}>{unit.status}</span>
                  </div>
                  <p className="dispenser-detail-location">{unit.location}</p>
                  <div className="dispenser-detail-bar-wrap">
                    <div
                      className={`dispenser-detail-bar bar-${unit.status}`}
                      style={{ width: `${unit.fillPercent}%` }}
                    />
                  </div>
                  <p className="dispenser-detail-fill">
                    <strong>{unit.fillPercent}%</strong> fill level
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <p className="modal-copy">
            School average fill is <strong>{school.fillPercent}%</strong>. Last restocked{' '}
            {school.lastRestocked.toLowerCase()}. Next restock {school.nextRestock.toLowerCase()}.
          </p>
          <p className="modal-copy">
            Haven Circles is{' '}
            <strong>{school.circlesActive ? 'active' : 'not yet running'}</strong> at this school.
          </p>
        </div>
      </ModalShell>
    );
  }

  if (modal.type === 'add-school') {
    return <AddSchoolModal onAdd={addSchool} onClose={closeModal} />;
  }

  if (modal.type === 'edit-field' && modal.fieldLabel) {
    const map: Record<string, keyof typeof account> = {
      name: 'name',
      organisation: 'organisation',
      email: 'email',
      role: 'role',
    };
    const key = map[modal.fieldLabel.toLowerCase()] ?? 'name';
    return (
      <EditFieldModal
        label={modal.fieldLabel}
        initialValue={account[key]}
        onSave={(v) => updateAccountField(key, v)}
        onClose={closeModal}
      />
    );
  }

  if (modal.type === 'report-preview' && modal.reportName) {
    return (
      <ModalShell
        title={modal.reportName}
        footer={
          <button
            type="button"
            className="btn-gradient"
            onClick={() => {
              void downloadReport({
                title: modal.reportName!,
                format: 'PDF',
                period: 'This Term',
              }).then(() => closeModal());
            }}
          >
            Download PDF
          </button>
        }
        wide
      >
        <div className="report-preview">
          <p className="modal-lead">A warm snapshot of impact across your partner schools.</p>
          <ul className="preview-list">
            <li>1,247 girls reached across Kigali</li>
            <li>3,847+ pads dispensed this term</li>
            <li>94% average attendance during menstrual cycle</li>
            <li>Haven Circles sessions growing term over term</li>
          </ul>
          <p className="modal-copy soft">
            This is a preview — your full PDF includes charts, school breakdowns, and funder-ready
            narratives.
          </p>
        </div>
      </ModalShell>
    );
  }

  if (modal.type === 'notifications') {
    const items = [
      {
        title: 'Low stock at St. Josephine',
        body: 'Dispenser at 23% — restock recommended within 2 days.',
        time: '2h ago',
        action: 'inventory' as const,
      },
      {
        title: 'Haven Circles milestone',
        body: 'Mother Mary School completed Session 6 with 37 girls!',
        time: 'Yesterday',
        action: null,
      },
      {
        title: 'Weekly report ready',
        body: 'Your usage summary for all schools is ready to view.',
        time: '3 days ago',
        action: 'reports' as const,
      },
    ];
    return (
      <ModalShell title="Your notifications">
        <ul className="notif-list">
          {items.map((n) => (
            <li key={n.title} className="notif-item">
              <strong>{n.title}</strong>
              <p>{n.body}</p>
              <span className="notif-time">{n.time}</span>
            </li>
          ))}
        </ul>
      </ModalShell>
    );
  }

  return null;
}

function AddSchoolModal({
  onAdd,
  onClose,
}: {
  onAdd: (d: { name: string; district: string; address: string }) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');

  return (
    <ModalShell
      title="Add a new partner school"
      footer={
        <>
          <button type="button" className="btn-soft" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-gradient"
            onClick={() => {
              if (!name.trim() || !district.trim()) return;
              onAdd({ name: name.trim(), district: district.trim(), address: address.trim() || district });
            }}
          >
            Add school
          </button>
        </>
      }
    >
      <form
        className="cozy-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim() || !district.trim()) return;
          onAdd({ name: name.trim(), district: district.trim(), address: address.trim() || district });
        }}
      >
        <div className="form-field">
          <label htmlFor="new-name">School name</label>
          <input
            id="new-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Lycée FAWE"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="new-district">District</label>
          <input
            id="new-district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder="e.g. Gasabo"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="new-address">Address (optional)</label>
          <input
            id="new-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street or landmark"
          />
        </div>
      </form>
    </ModalShell>
  );
}

function EditFieldModal({
  label,
  initialValue,
  onSave,
  onClose,
}: {
  label: string;
  initialValue: string;
  onSave: (v: string) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <ModalShell
      title={`Edit ${label}`}
      footer={
        <>
          <button type="button" className="btn-soft" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-gradient"
            onClick={() => value.trim() && onSave(value.trim())}
          >
            Save changes
          </button>
        </>
      }
    >
      <div className="form-field">
        <label htmlFor="edit-field">{label}</label>
        <input
          id="edit-field"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
      </div>
    </ModalShell>
  );
}
