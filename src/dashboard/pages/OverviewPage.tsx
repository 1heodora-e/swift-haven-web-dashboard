import { StatCards } from '../components/StatCards';
import { PadUsageChart } from '../components/PadUsageChart';
import { SchoolTable } from '../components/SchoolTable';
import { HavenCirclesChart } from '../components/HavenCirclesChart';
import { DownloadButton } from '../components/DownloadButton';
import { LiveActivityFeed } from '../components/LiveActivityFeed';
import { KigaliMap } from '../components/KigaliMap';
import { InvestmentSlider } from '../components/InvestmentSlider';
import { OverviewSpotlight } from '../components/OverviewSpotlight';
import { PageHeader } from '../components/shared/PageHeader';

export function OverviewPage() {
  return (
    <>
      <section className="overview-hero-panel animate-in">
        <PageHeader
          title="Impact Overview"
          subtitle="Real-time menstrual health impact across partner schools"
          action={<DownloadButton />}
        />
        <div className="overview-hero-grid">
          <div data-tour="stats" className="overview-stats-col">
            <StatCards />
          </div>
          <OverviewSpotlight />
        </div>
      </section>
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
