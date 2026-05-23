import { useEffect, useState } from 'react';

export interface ActivityEvent {
  id: string;
  message: string;
  time: string;
  type: 'dispense' | 'sync' | 'session' | 'alert';
}

const TEMPLATES: Omit<ActivityEvent, 'id' | 'time'>[] = [
  { type: 'dispense', message: 'DISP-003 · St. Josephine · 2 pads dispensed' },
  { type: 'dispense', message: 'DISP-001 · Mother Mary · 1 pad dispensed' },
  { type: 'sync', message: 'DISP-002 · Mother Mary · dispenser synced · 99% online' },
  { type: 'dispense', message: 'DISP-004 · Ecole Nyarugenge · 1 pad dispensed' },
  { type: 'session', message: 'Haven Circles · Mother Mary · check-in recorded' },
  { type: 'sync', message: 'All dispensers · Kigali cluster · heartbeat OK' },
  { type: 'alert', message: 'DISP-003 · stock below 25% · alert sent to partners' },
  { type: 'dispense', message: 'DISP-001 · Mother Mary · 3 pads dispensed' },
];

function randomTemplate(): Omit<ActivityEvent, 'id' | 'time'> {
  return TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function useLiveActivity(maxItems = 8) {
  const [events, setEvents] = useState<ActivityEvent[]>(() => {
    const now = new Date();
    return TEMPLATES.slice(0, 4).map((t, i) => ({
      ...t,
      id: `init-${i}`,
      time: formatTime(new Date(now.getTime() - (i + 1) * 45000)),
    }));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const t = randomTemplate();
      const event: ActivityEvent = {
        ...t,
        id: `evt-${Date.now()}`,
        time: formatTime(new Date()),
      };
      setEvents((prev) => [event, ...prev].slice(0, maxItems));
    }, 12000);
    return () => clearInterval(interval);
  }, [maxItems]);

  return events;
}
