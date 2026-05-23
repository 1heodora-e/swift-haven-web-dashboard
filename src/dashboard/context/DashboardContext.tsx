import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { PageId } from '../types';
import type { PendingRestock, School } from '../data/schools';
import {
  computeMetrics,
  downloadImpactReport,
  schoolsForReportTitle,
} from '../lib/reportGenerator';
import { PITCH_TOUR_STEPS } from '../lib/pitchTourSteps';
import {
  getDefaultState,
  loadPersistedState,
  savePersistedState,
  type PersistedAccount,
} from '../lib/storage';

export interface ReportDownloadOptions {
  title: string;
  period?: string;
  format?: 'PDF' | 'Excel';
  schoolNames?: string[];
}

export type ToastType = 'success' | 'info' | 'warm';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

export type ModalType =
  | 'none'
  | 'school-detail'
  | 'add-school'
  | 'edit-field'
  | 'report-preview'
  | 'notifications'
  | 'restock';

export interface ModalState {
  type: ModalType;
  schoolId?: string;
  reportName?: string;
  fieldLabel?: string;
  fieldValue?: string;
  prefillSchool?: string;
}

interface PitchTourState {
  active: boolean;
  stepIndex: number;
}

interface DashboardContextValue {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  schools: School[];
  pendingRestocks: PendingRestock[];
  account: PersistedAccount;
  toasts: ToastItem[];
  modal: ModalState;
  restockPrefill: { school: string; quantity: string; notes: string };
  pitchTour: PitchTourState;
  lastSynced: Date;
  showToast: (message: string, type?: ToastType) => void;
  openModal: (state: Omit<ModalState, 'type'> & { type: ModalType }) => void;
  closeModal: () => void;
  getSchool: (id: string) => School | undefined;
  addSchool: (data: { name: string; district: string; address: string }) => void;
  submitRestock: (school: string, quantity: number, notes: string) => void;
  approveRestock: (id: string) => void;
  requestRestockForSchool: (schoolName: string) => void;
  updateAccountField: (field: keyof PersistedAccount, value: string) => void;
  navigateToInventory: (schoolName?: string) => void;
  downloadReport: (options: ReportDownloadOptions) => Promise<void>;
  setRestockPrefill: (prefill: Partial<{ school: string; quantity: string; notes: string }>) => void;
  clearRestockPrefill: () => void;
  startPitchTour: () => void;
  stopPitchTour: () => void;
  nextTourStep: () => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

function scrollToTourTarget(target: string) {
  requestAnimationFrame(() => {
    document.querySelectorAll('[data-tour].tour-spotlight').forEach((el) => {
      el.classList.remove('tour-spotlight');
    });
    const el = document.querySelector(`[data-tour="${target}"]`);
    if (el) {
      el.classList.add('tour-spotlight');
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

export function DashboardProvider({
  children,
  activePage,
  setActivePage,
}: {
  children: ReactNode;
  activePage: PageId;
  setActivePage: (page: PageId) => void;
}) {
  const initial = loadPersistedState() ?? getDefaultState();

  const [schools, setSchools] = useState<School[]>(initial.schools);
  const [pendingRestocks, setPendingRestocks] = useState<PendingRestock[]>(
    initial.pendingRestocks,
  );
  const [account, setAccount] = useState<PersistedAccount>(initial.account);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [restockPrefill, setRestockPrefillState] = useState({
    school: '',
    quantity: '',
    notes: '',
  });
  const [pitchTour, setPitchTour] = useState<PitchTourState>({ active: false, stepIndex: 0 });
  const [lastSynced, setLastSynced] = useState(() => new Date());

  useEffect(() => {
    savePersistedState({ schools, pendingRestocks, account });
  }, [schools, pendingRestocks, account]);

  useEffect(() => {
    const interval = setInterval(() => setLastSynced(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!pitchTour.active) return;
    const step = PITCH_TOUR_STEPS[pitchTour.stepIndex];
    if (step) {
      setActivePage(step.page);
      scrollToTourTarget(step.target);
    }
  }, [pitchTour.active, pitchTour.stepIndex, setActivePage]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const openModal = useCallback((state: ModalState) => setModal(state), []);
  const closeModal = useCallback(() => setModal({ type: 'none' }), []);

  const getSchool = useCallback(
    (id: string) => schools.find((s) => s.id === id),
    [schools],
  );

  const addSchool = useCallback(
    (data: { name: string; district: string; address: string }) => {
      const newSchool: School = {
        id: `school-${Date.now()}`,
        name: data.name,
        district: data.district,
        address: data.address,
        lat: -1.94 + (Math.random() - 0.5) * 0.06,
        lng: 30.08 + (Math.random() - 0.5) * 0.08,
        girls: 0,
        padsTerm: 0,
        sessions: 0,
        circlesActive: false,
        fillPercent: 100,
        ringVariant: 'pink',
        lastRestocked: 'Just added',
        nextRestock: 'In 30 days',
        dispensers: 1,
        status: 'full',
        statusLabel: 'Full',
      };
      setSchools((prev) => [...prev, newSchool]);
      showToast(`Welcome ${data.name} to the Haven family!`, 'warm');
      closeModal();
    },
    [showToast, closeModal],
  );

  const submitRestock = useCallback(
    (school: string, quantity: number, notes: string) => {
      setPendingRestocks((prev) => [
        {
          id: `pending-${Date.now()}`,
          school,
          quantity,
          notes: notes || 'No additional notes.',
          status: 'pending',
          submittedLabel: 'Just now',
        },
        ...prev,
      ]);
      showToast(`Restock request sent for ${school} — we'll take care of it!`, 'success');
      setRestockPrefillState({ school: '', quantity: '', notes: '' });
    },
    [showToast],
  );

  const approveRestock = useCallback(
    (id: string) => {
      setPendingRestocks((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'approved' as const } : r)),
      );
      showToast('Restock approved — pads are on their way!', 'success');
    },
    [showToast],
  );

  const requestRestockForSchool = useCallback(
    (schoolName: string) => {
      setRestockPrefillState({
        school: schoolName,
        quantity: '500',
        notes: '',
      });
      setActivePage('inventory');
      showToast(`Let's get ${schoolName} restocked — form ready for you.`, 'info');
    },
    [setActivePage, showToast],
  );

  const navigateToInventory = useCallback(
    (schoolName?: string) => {
      if (schoolName) {
        setRestockPrefillState((p) => ({ ...p, school: schoolName }));
      }
      setActivePage('inventory');
    },
    [setActivePage],
  );

  const updateAccountField = useCallback(
    (field: keyof PersistedAccount, value: string) => {
      setAccount((prev) => ({ ...prev, [field]: value }));
      showToast(`${field.charAt(0).toUpperCase() + field.slice(1)} updated — looking good!`, 'success');
      closeModal();
    },
    [showToast, closeModal],
  );

  const downloadReport = useCallback(
    async (options: ReportDownloadOptions) => {
      const format = options.format ?? 'PDF';
      let filtered = options.schoolNames?.length
        ? schools.filter((s) => options.schoolNames!.includes(s.name))
        : schoolsForReportTitle(options.title, schools);

      if (options.schoolNames?.length && filtered.length === 0) {
        filtered = schools;
      }

      const payload = {
        title: options.title,
        period: options.period ?? 'This Term',
        generatedAt: new Date(),
        schools: filtered,
        account,
        metrics: computeMetrics(filtered),
      };

      try {
        await downloadImpactReport(payload, format);
        const ext = format === 'Excel' ? 'spreadsheet (CSV)' : 'PDF';
        showToast(
          `${options.title} saved as ${ext} — thank you for sharing our impact!`,
          'success',
        );
      } catch {
        showToast('We could not build that report. Please try again in a moment.', 'warm');
        throw new Error('Report generation failed');
      }
    },
    [schools, account, showToast],
  );

  const setRestockPrefill = useCallback(
    (prefill: Partial<{ school: string; quantity: string; notes: string }>) => {
      setRestockPrefillState((p) => ({ ...p, ...prefill }));
    },
    [],
  );

  const clearRestockPrefill = useCallback(() => {
    setRestockPrefillState({ school: '', quantity: '', notes: '' });
  }, []);

  const startPitchTour = useCallback(() => {
    setPitchTour({ active: true, stepIndex: 0 });
    setActivePage('overview');
    showToast('Pitch tour started — follow the prompts!', 'info');
  }, [setActivePage, showToast]);

  const stopPitchTour = useCallback(() => {
    setPitchTour({ active: false, stepIndex: 0 });
    document.querySelectorAll('[data-tour].tour-spotlight').forEach((el) => {
      el.classList.remove('tour-spotlight');
    });
  }, []);

  const nextTourStep = useCallback(() => {
    setPitchTour((prev) => {
      if (prev.stepIndex >= PITCH_TOUR_STEPS.length - 1) {
        document.querySelectorAll('[data-tour].tour-spotlight').forEach((el) => {
          el.classList.remove('tour-spotlight');
        });
        showToast('Tour complete — you are ready to pitch!', 'warm');
        return { active: false, stepIndex: 0 };
      }
      return { active: true, stepIndex: prev.stepIndex + 1 };
    });
  }, [showToast]);

  const value = useMemo(
    () => ({
      activePage,
      setActivePage,
      schools,
      pendingRestocks,
      account,
      toasts,
      modal,
      restockPrefill,
      pitchTour,
      lastSynced,
      showToast,
      openModal,
      closeModal,
      getSchool,
      addSchool,
      submitRestock,
      approveRestock,
      requestRestockForSchool,
      updateAccountField,
      navigateToInventory,
      downloadReport,
      setRestockPrefill,
      clearRestockPrefill,
      startPitchTour,
      stopPitchTour,
      nextTourStep,
    }),
    [
      activePage,
      setActivePage,
      schools,
      pendingRestocks,
      account,
      toasts,
      modal,
      restockPrefill,
      pitchTour,
      lastSynced,
      showToast,
      openModal,
      closeModal,
      getSchool,
      addSchool,
      submitRestock,
      approveRestock,
      requestRestockForSchool,
      updateAccountField,
      navigateToInventory,
      downloadReport,
      setRestockPrefill,
      clearRestockPrefill,
      startPitchTour,
      stopPitchTour,
      nextTourStep,
    ],
  );

  return (
    <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
