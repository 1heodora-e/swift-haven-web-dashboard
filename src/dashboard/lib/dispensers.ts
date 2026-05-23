import type { School } from '../data/schools';

export interface DispenserUnit {
  id: string;
  location: string;
  fillPercent: number;
  status: 'full' | 'low' | 'critical';
}

const LOCATIONS = [
  'Main block — ground floor',
  "Girls' dormitory",
  'Science wing',
  'Admin & clinic',
];

export function getSchoolDispensers(school: School): DispenserUnit[] {
  const count = Math.max(1, school.dispensers);
  return Array.from({ length: count }, (_, i) => {
    const offset = count === 1 ? 0 : (i - (count - 1) / 2) * 14;
    const fillPercent = Math.min(100, Math.max(0, Math.round(school.fillPercent + offset)));
    const status: DispenserUnit['status'] =
      fillPercent >= 50 ? 'full' : fillPercent >= 25 ? 'low' : 'critical';
    return {
      id: `DISP-${String(i + 1).padStart(3, '0')}`,
      location: LOCATIONS[i] ?? `Campus point ${i + 1}`,
      fillPercent,
      status,
    };
  });
}
