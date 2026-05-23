import { CheckCircle2, Heart, Info } from 'lucide-react';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warm';
}

export function ToastStack({ toasts }: { toasts: ToastItem[] }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-bubble toast-${toast.type}`}>
          {toast.type === 'success' && <CheckCircle2 size={18} />}
          {toast.type === 'info' && <Info size={18} />}
          {toast.type === 'warm' && <Heart size={18} />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
