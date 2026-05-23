import { INITIAL_PENDING, INITIAL_SCHOOLS, type PendingRestock, type School } from '../data/schools';

const STORAGE_KEY = 'haven-dashboard-v1';

export interface PersistedAccount {
  name: string;
  organisation: string;
  email: string;
  role: string;
}

export interface PersistedState {
  schools: School[];
  pendingRestocks: PendingRestock[];
  account: PersistedAccount;
}

const DEFAULT_ACCOUNT: PersistedAccount = {
  name: 'Programme Officer',
  organisation: 'Health Development Initiative Rwanda',
  email: 'programme.officer@hdirwanda.org',
  role: 'NGO Partner',
};

export function loadPersistedState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

export function savePersistedState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota or private mode */
  }
}

export function getDefaultState(): PersistedState {
  return {
    schools: INITIAL_SCHOOLS,
    pendingRestocks: INITIAL_PENDING,
    account: DEFAULT_ACCOUNT,
  };
}
