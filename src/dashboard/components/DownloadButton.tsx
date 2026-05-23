import { useState, useCallback } from 'react';
import { Download } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import '../Dashboard.css';

interface DownloadButtonProps {
  onSuccess?: () => void;
}

export function DownloadButton({ onSuccess }: DownloadButtonProps) {
  const { downloadReport } = useDashboard();
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      await downloadReport({
        title: 'Term Impact Report',
        period: 'This Term',
        format: 'PDF',
      });
      onSuccess?.();
    } catch {
      /* toast shown in context */
    } finally {
      setLoading(false);
    }
  }, [loading, downloadReport, onSuccess]);

  return (
    <button
      type="button"
      className="btn-download"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <span className="spinner" aria-hidden />
      ) : (
        <Download size={18} />
      )}
      {loading ? 'Generating PDF…' : 'Download Impact Report'}
    </button>
  );
}

export function SuccessToast({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="toast-container toast-top-right" role="status" aria-live="polite">
      <div className="toast-success toast-gradient">
        <span>Term Report Generated Successfully</span>
        <div className="toast-progress" />
      </div>
    </div>
  );
}
