import { useState, useCallback, useEffect } from 'react';

export function useReportToast(durationMs = 3000) {
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => setVisible(true), []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), durationMs);
    return () => clearTimeout(t);
  }, [visible, durationMs]);

  return { toastVisible: visible, showToast: show };
}
