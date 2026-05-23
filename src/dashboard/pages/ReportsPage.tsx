import { useState } from 'react';
import { CheckCircle2, Loader2, Download, Eye } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { ReportDownloadAction } from '../components/ReportDownloadAction';
import { useDashboard } from '../context/DashboardContext';

const pastReports = [
  {
    name: 'Term 1 2026 Full Report',
    date: 'April 15, 2026',
    schools: 'All schools',
    size: '2.4 MB',
    format: 'PDF' as const,
  },
  {
    name: 'Q1 2026 Mother Mary School Report',
    date: 'March 31, 2026',
    schools: 'Mother Mary only',
    size: '1.1 MB',
    format: 'PDF' as const,
  },
  {
    name: 'Term 3 2025 Full Report',
    date: 'December 20, 2025',
    schools: 'All schools',
    size: '2.8 MB',
    format: 'PDF' as const,
  },
  {
    name: 'Annual 2025 Impact Summary',
    date: 'January 5, 2026',
    schools: 'All schools',
    size: '4.2 MB',
    format: 'PDF' as const,
  },
];

export function ReportsPage() {
  const { openModal, showToast, schools, downloadReport } = useDashboard();
  const [period, setPeriod] = useState('This Term');
  const [format, setFormat] = useState<'PDF' | 'Excel'>('PDF');
  const [selectedSchools, setSelectedSchools] = useState<string[]>(() =>
    schools.map((s) => s.name),
  );
  const [genState, setGenState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [lastReportTitle, setLastReportTitle] = useState('');

  const allSchoolNames = schools.map((s) => s.name);

  const toggleSchool = (name: string) => {
    setSelectedSchools((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name],
    );
  };

  const buildTitle = () => `${period} Impact Report`;

  const runDownload = async (title: string) => {
    await downloadReport({
      title,
      period,
      format,
      schoolNames: selectedSchools,
    });
  };

  const handleGenerate = async () => {
    if (genState === 'loading') return;
    if (selectedSchools.length === 0) {
      showToast('Pick at least one school so we know who to celebrate!', 'warm');
      return;
    }
    setGenState('loading');
    const title = buildTitle();
    setLastReportTitle(title);
    try {
      await runDownload(title);
      setGenState('success');
    } catch {
      setGenState('idle');
    }
  };

  const handleDownloadNow = async () => {
    try {
      await runDownload(lastReportTitle || buildTitle());
    } catch {
      /* handled in context */
    }
  };

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Generate and download impact reports for your funders"
      />

      <section className="report-config-card animate-in" data-tour="report-generate">
        <form
          className="report-form"
          onSubmit={(e) => {
            e.preventDefault();
            void handleGenerate();
          }}
        >
          <div className="form-field">
            <label htmlFor="report-period">Report period</label>
            <select
              id="report-period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option>This Term</option>
              <option>Last Term</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="form-field">
            <span className="field-label">School selection</span>
            <div className="checkbox-group">
              {allSchoolNames.map((name) => (
                <label key={name} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedSchools.includes(name)}
                    onChange={() => toggleSchool(name)}
                  />
                  <span>{name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-field">
            <span className="field-label">Report format</span>
            <div className="radio-group">
              {(['PDF', 'Excel'] as const).map((f) => (
                <label key={f} className="radio-item">
                  <input
                    type="radio"
                    name="format"
                    checked={format === f}
                    onChange={() => setFormat(f)}
                  />
                  <span>
                    {f === 'PDF' ? 'PDF document' : 'Excel spreadsheet (CSV)'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {genState === 'success' ? (
            <div className="generate-success-block">
              <CheckCircle2 size={28} className="success-icon" />
              <p>
                Your {format === 'PDF' ? 'PDF' : 'spreadsheet'} was generated and downloaded!
              </p>
              <button
                type="button"
                className="btn-gradient btn-full"
                onClick={() => void handleDownloadNow()}
              >
                <Download size={18} />
                Download again
              </button>
            </div>
          ) : (
            <button
              type="submit"
              className="btn-gradient btn-full"
              disabled={genState === 'loading'}
            >
              {genState === 'loading' ? (
                <>
                  <Loader2 size={20} className="spin-icon" />
                  Building your {format === 'PDF' ? 'PDF' : 'spreadsheet'}…
                </>
              ) : (
                `Generate & download ${format === 'PDF' ? 'PDF' : 'Excel'}`
              )}
            </button>
          )}
        </form>
      </section>

      <section className="table-card animate-in" style={{ marginTop: 24 }}>
        <h2 className="chart-card-title section-heading">Previously generated reports</h2>
        <div className="school-table-wrap" style={{ marginTop: 16 }}>
          <table className="school-table reports-table">
            <thead>
              <tr>
                <th>Report name</th>
                <th>Date</th>
                <th>Schools</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pastReports.map((report) => (
                <tr key={report.name}>
                  <td className="school-name">{report.name}</td>
                  <td>{report.date}</td>
                  <td>{report.schools}</td>
                  <td>{report.size}</td>
                  <td className="actions-cell">
                    <ReportDownloadAction
                      label="Download"
                      reportName={report.name}
                      format={report.format}
                    />
                    <button
                      type="button"
                      className="btn-outline-grey btn-sm-inline"
                      onClick={() =>
                        openModal({ type: 'report-preview', reportName: report.name })
                      }
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
