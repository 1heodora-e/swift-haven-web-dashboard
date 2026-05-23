import { StatCards } from '../components/StatCards';
import { PadUsageChart } from '../components/PadUsageChart';
import { SchoolTable } from '../components/SchoolTable';
import { HavenCirclesChart } from '../components/HavenCirclesChart';
import { DownloadButton } from '../components/DownloadButton';
import { LiveActivityFeed } from '../components/LiveActivityFeed';
import { KigaliMap } from '../components/KigaliMap';
import { InvestmentSlider } from '../components/InvestmentSlider';
import { PageHeader } from '../components/shared/PageHeader';

export function OverviewPage() {
  return (
    <>
      <PageHeader
        title="Impact Overview"
        subtitle="Real-time menstrual health impact across partner schools"
        action={<DownloadButton />}
      />
      <div data-tour="stats">
        <StatCards />
      </div>
      <LiveActivityFeed />
      <div className="overview-grid">
        <KigaliMap />
        <InvestmentSlider />
      </div>
      <PadUsageChart />
      <div className="charts-bottom-row">
        <SchoolTable />
        <HavenCirclesChart />
      </div>
    </>
  );
}
