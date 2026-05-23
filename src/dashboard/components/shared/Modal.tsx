import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

interface ModalProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

export function ModalShell({ title, children, footer, wide }: ModalProps) {
  const { closeModal } = useDashboard();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeModal]);

  return (
    <div className="modal-backdrop" onClick={closeModal} role="presentation">
      <div
        className={`modal-panel${wide ? ' modal-wide' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <button type="button" className="modal-close" onClick={closeModal} aria-label="Close">
            <X size={20} />
          </button>
          <h2 id="modal-title" className="modal-title">
            {title}
          </h2>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
