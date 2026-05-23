import { useState, useCallback } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface ReportDownloadActionProps {
  reportName?: string;
  label?: string;
  className?: string;
  format?: 'PDF' | 'Excel';
  onSuccess?: () => void;
}

export function ReportDownloadAction({
  reportName = 'Impact Report',
  onSuccess,
  label = 'Download',
  className = '',
  format = 'PDF',
}: ReportDownloadActionProps) {
  const { downloadReport } = useDashboard();
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      await downloadReport({
        title: reportName,
        format,
        period: 'This Term',
      });
      onSuccess?.();
    } catch {
      /* toast in context */
    } finally {
      setLoading(false);
    }
  }, [loading, reportName, format, downloadReport, onSuccess]);

  return (
    <button
      type="button"
      className={`btn-outline-pink btn-sm-inline ${className}`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 size={14} className="spin-icon" />
          …
        </>
      ) : (
        <>
          <Download size={14} />
          {label}
        </>
      )}
    </button>
  );
}
