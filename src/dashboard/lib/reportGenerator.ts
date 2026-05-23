import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { School } from '../data/schools';

const PINK: [number, number, number] = [236, 72, 153];
const PINK_DARK: [number, number, number] = [190, 24, 93];
const TEXT: [number, number, number] = [26, 26, 46];
const MUTED: [number, number, number] = [107, 114, 128];

export interface ReportAccount {
  name: string;
  organisation: string;
  email: string;
  role: string;
}

export interface ImpactMetrics {
  totalGirls: number;
  totalPads: number;
  activeSchools: number;
  attendanceRate: string;
  havenCirclesSessions: number;
}

export interface ReportPayload {
  title: string;
  period: string;
  generatedAt: Date;
  schools: School[];
  account: ReportAccount;
  metrics: ImpactMetrics;
}

export function computeMetrics(schools: School[]): ImpactMetrics {
  return {
    totalGirls: schools.reduce((sum, s) => sum + s.girls, 0),
    totalPads: schools.reduce((sum, s) => sum + s.padsTerm, 0),
    activeSchools: schools.length,
    attendanceRate: '94%',
    havenCirclesSessions: schools.reduce((sum, s) => sum + s.sessions, 0),
  };
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 80);
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Builds and triggers download of a branded Swift Haven impact PDF */
export function generateImpactPdf(payload: ReportPayload): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 18;
  let y = 0;

  // Header band
  doc.setFillColor(...PINK);
  doc.roundedRect(0, 0, pageW, 42, 0, 0, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Swift Haven Africa', margin, 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Restoring Womens Dignity', margin, 26);
  doc.setFontSize(9);
  doc.text('www.swift-haven.org', pageW - margin, 26, { align: 'right' });

  y = 52;
  doc.setTextColor(...TEXT);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(payload.title, margin, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(`Report period: ${payload.period}`, margin, y);
  y += 5;
  doc.text(`Generated: ${formatDate(payload.generatedAt)}`, margin, y);
  y += 5;
  doc.text(`Prepared for: ${payload.account.organisation}`, margin, y);
  y += 5;
  doc.text(`Contact: ${payload.account.name} (${payload.account.email})`, margin, y);
  y += 12;

  // Executive summary
  doc.setTextColor(...PINK_DARK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Executive summary', margin, y);
  y += 8;

  const { metrics } = payload;
  const summaryItems = [
    ['Total girls reached', metrics.totalGirls.toLocaleString()],
    ['Pads dispensed (selected schools)', metrics.totalPads.toLocaleString()],
    ['Active partner schools', String(metrics.activeSchools)],
    ['Average attendance (menstrual cycle)', metrics.attendanceRate],
    ['Haven Circles sessions delivered', String(metrics.havenCirclesSessions)],
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  summaryItems.forEach(([label, value]) => {
    doc.setTextColor(...MUTED);
    doc.text(label, margin, y);
    doc.setTextColor(...TEXT);
    doc.setFont('helvetica', 'bold');
    doc.text(value, pageW - margin, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    y += 7;
  });

  y += 6;
  doc.setTextColor(...TEXT);
  doc.setFontSize(10);
  const narrative =
    'Swift Haven installs smart pad dispensers in secondary school restrooms across Kigali, ' +
    'giving girls dignified access to menstrual products while providing partners with real-time impact data. ' +
    'This report summarises deployment health, usage, and Haven Circles engagement for the selected schools.';
  const lines = doc.splitTextToSize(narrative, pageW - margin * 2);
  doc.text(lines, margin, y);
  y += lines.length * 5 + 8;

  // School table
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['School', 'District', 'Girls', 'Pads (term)', 'Stock', 'Haven Circles']],
    body: payload.schools.map((s) => [
      s.name,
      s.district,
      String(s.girls),
      s.padsTerm.toLocaleString(),
      `${s.fillPercent}% (${s.statusLabel})`,
      s.circlesActive ? `Active (${s.sessions} sessions)` : 'Inactive',
    ]),
    headStyles: {
      fillColor: PINK,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: TEXT },
    alternateRowStyles: { fillColor: [253, 242, 248] },
    styles: { cellPadding: 3, lineColor: [252, 231, 243], lineWidth: 0.1 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable?.finalY ?? y + 40;

  // Inventory alerts
  const lowStock = payload.schools.filter(
    (s) => s.status === 'low' || s.status === 'critical',
  );
  let footY = finalY + 12;
  if (footY > 250) {
    doc.addPage();
    footY = 24;
  }

  if (lowStock.length > 0) {
    doc.setTextColor(...PINK_DARK);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Inventory attention needed', margin, footY);
    footY += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...TEXT);
    lowStock.forEach((s) => {
      doc.text(
        `• ${s.name}: ${s.fillPercent}% full — next restock ${s.nextRestock.toLowerCase()}`,
        margin,
        footY,
      );
      footY += 5;
    });
  }

  // Footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const h = doc.internal.pageSize.getHeight();
    doc.setDrawColor(...PINK);
    doc.setLineWidth(0.3);
    doc.line(margin, h - 16, pageW - margin, h - 16);
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(
      `Swift Haven Africa · Haven Dashboard · Page ${i} of ${pageCount}`,
      pageW / 2,
      h - 10,
      { align: 'center' },
    );
  }

  const filename = `${sanitizeFilename(payload.title)}.pdf`;
  doc.save(filename);
}

/** Excel-compatible CSV download */
export function generateImpactExcel(payload: ReportPayload): void {
  const rows: string[][] = [
    ['Swift Haven Africa - Impact Report'],
    [payload.title],
    [`Period: ${payload.period}`],
    [`Generated: ${formatDate(payload.generatedAt)}`],
    [`Organisation: ${payload.account.organisation}`],
    [],
    ['Metric', 'Value'],
    ['Total girls reached', String(payload.metrics.totalGirls)],
    ['Pads dispensed', String(payload.metrics.totalPads)],
    ['Active schools', String(payload.metrics.activeSchools)],
    ['Attendance rate', payload.metrics.attendanceRate],
    ['Haven Circles sessions', String(payload.metrics.havenCirclesSessions)],
    [],
    ['School', 'District', 'Girls', 'Pads This Term', 'Fill %', 'Status', 'Haven Circles', 'Sessions'],
    ...payload.schools.map((s) => [
      s.name,
      s.district,
      String(s.girls),
      String(s.padsTerm),
      String(s.fillPercent),
      s.statusLabel,
      s.circlesActive ? 'Active' : 'Inactive',
      String(s.sessions),
    ]),
  ];

  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','),
    )
    .join('\r\n');

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(payload.title)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function downloadImpactReport(
  payload: ReportPayload,
  format: 'PDF' | 'Excel',
): Promise<void> {
  await new Promise((r) => setTimeout(r, 400));
  if (format === 'Excel') {
    generateImpactExcel(payload);
  } else {
    generateImpactPdf(payload);
  }
}

/** Infer school filter from historical report titles */
export function schoolsForReportTitle(title: string, allSchools: School[]): School[] {
  const lower = title.toLowerCase();
  if (lower.includes('mother mary')) {
    return allSchools.filter((s) => s.name.toLowerCase().includes('mother mary'));
  }
  return allSchools;
}
