/** Daily pad dispensing — higher mid-week, lower Fri–Sun, upward trend over 30 days */
export function generatePadUsageData(): { date: string; pads: number; label: string }[] {
  const data: { date: string; pads: number; label: string }[] = [];
  const start = new Date(2026, 3, 22); // Apr 22, 2026

  for (let i = 29; i >= 0; i--) {
    const d = new Date(start);
    d.setDate(d.getDate() - i);
    const day = d.getDay();
    const isWeekend = day === 0 || day === 6;
    const isFriday = day === 5;
    const weekProgress = (29 - i) / 29;

    let base = 118 + weekProgress * 42;
    if (isFriday) base *= 0.78;
    if (isWeekend) base *= 0.55;
    if (day === 2 || day === 3) base *= 1.12;

    const noise = Math.sin(i * 2.7) * 8 + Math.cos(i * 1.3) * 5;
    const pads = Math.round(base + noise);

    data.push({
      date: d.toISOString().slice(0, 10),
      pads,
      label: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    });
  }

  return data;
}
