import type { PageId } from '../types';

export interface PitchTourStep {
  page: PageId;
  target: string;
  title: string;
  body: string;
}

export const PITCH_TOUR_STEPS: PitchTourStep[] = [
  {
    page: 'overview',
    target: 'stats',
    title: 'Real-time impact at a glance',
    body: 'Live metrics from smart dispensers across partner schools — girls reached, pads dispensed, and attendance.',
  },
  {
    page: 'overview',
    target: 'activity',
    title: 'Dispensers reporting live',
    body: 'Every few seconds, dispensers send usage data. Partners see issues before girls do.',
  },
  {
    page: 'overview',
    target: 'alert',
    title: 'Proactive stock alerts',
    body: 'Low inventory triggers partner notifications — restock before stockouts affect attendance.',
  },
  {
    page: 'overview',
    target: 'map',
    title: 'Deployed across Kigali',
    body: 'Three active schools today — built to scale across Rwanda.',
  },
  {
    page: 'overview',
    target: 'investment',
    title: 'Your investment, visualised',
    body: 'Slide to show funders how scaling schools multiplies dignity and reach.',
  },
  {
    page: 'inventory',
    target: 'inventory-form',
    title: 'Restock in one click',
    body: 'NGO partners request restocks directly — Swift Haven coordinates delivery.',
  },
  {
    page: 'reports',
    target: 'report-generate',
    title: 'Funder-ready reports',
    body: 'Generate branded PDF impact reports in seconds — no manual spreadsheets.',
  },
];
