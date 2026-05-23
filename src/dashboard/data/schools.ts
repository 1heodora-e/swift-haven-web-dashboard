export interface School {
  id: string;
  name: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  girls: number;
  padsTerm: number;
  sessions: number;
  circlesActive: boolean;
  fillPercent: number;
  ringVariant: 'pink' | 'amber' | 'red';
  lastRestocked: string;
  nextRestock: string;
  nextRestockUrgent?: boolean;
  nextRestockOverdue?: boolean;
  dispensers: number;
  status: 'full' | 'low' | 'critical';
  statusLabel: string;
}

export const INITIAL_SCHOOLS: School[] = [
  {
    id: 'mother-mary',
    name: 'Mother Mary Complex School',
    district: 'Kicukiro',
    address: 'KK 15 Ave, Kicukiro District',
    lat: -1.9596,
    lng: 30.1265,
    girls: 340,
    padsTerm: 892,
    sessions: 6,
    circlesActive: true,
    fillPercent: 78,
    ringVariant: 'pink',
    lastRestocked: '3 days ago',
    nextRestock: 'In 18 days',
    dispensers: 2,
    status: 'full',
    statusLabel: 'Full',
  },
  {
    id: 'st-josephine',
    name: 'St. Josephine Secondary School',
    district: 'Nyarugenge',
    address: 'KN 3 Rd, Nyarugenge District',
    lat: -1.9441,
    lng: 30.0619,
    girls: 215,
    padsTerm: 341,
    sessions: 0,
    circlesActive: false,
    fillPercent: 23,
    ringVariant: 'amber',
    lastRestocked: '18 days ago',
    nextRestock: 'In 2 days',
    nextRestockUrgent: true,
    dispensers: 1,
    status: 'low',
    statusLabel: 'Low',
  },
  {
    id: 'ecole-nyarugenge',
    name: 'Ecole Secondaire Nyarugenge',
    district: 'Gasabo',
    address: 'KG 7 Ave, Gasabo District',
    lat: -1.9361,
    lng: 30.1125,
    girls: 189,
    padsTerm: 187,
    sessions: 0,
    circlesActive: false,
    fillPercent: 8,
    ringVariant: 'red',
    lastRestocked: '31 days ago',
    nextRestock: 'Overdue',
    nextRestockOverdue: true,
    dispensers: 1,
    status: 'critical',
    statusLabel: 'Critical',
  },
];

export interface PendingRestock {
  id: string;
  school: string;
  quantity: number;
  notes: string;
  status: 'pending' | 'approved';
  submittedLabel: string;
}

export const INITIAL_PENDING: PendingRestock[] = [
  {
    id: 'pending-1',
    school: 'St. Josephine Secondary School',
    quantity: 500,
    notes: 'Urgent restock needed before next term sessions.',
    status: 'pending',
    submittedLabel: '2 days ago',
  },
];
