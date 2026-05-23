import { X, ChevronRight, Play } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { PITCH_TOUR_STEPS } from '../lib/pitchTourSteps';
import '../Dashboard.css';

/** Lives in the sidebar where “Start pitch tour” sits — never covers main content */
export function PitchTourPanel() {
  const { pitchTour, startPitchTour, stopPitchTour, nextTourStep } = useDashboard();

  if (!pitchTour.active) {
    return (
      <button type="button" className="btn-pitch-tour" onClick={startPitchTour}>
        <Play size={16} />
        Start pitch tour
      </button>
    );
  }

  const step = PITCH_TOUR_STEPS[pitchTour.stepIndex];
  const isLast = pitchTour.stepIndex >= PITCH_TOUR_STEPS.length - 1;

  return (
    <div className="tour-card-sidebar" role="dialog" aria-label="Pitch tour">
      <button type="button" className="tour-close" onClick={stopPitchTour} aria-label="End tour">
        <X size={16} />
      </button>
      <span className="tour-step-count">
        Step {pitchTour.stepIndex + 1} of {PITCH_TOUR_STEPS.length}
      </span>
      <h3 className="tour-title font-serif">{step.title}</h3>
      <p className="tour-body">{step.body}</p>
      <p className="tour-hint">Pink highlight →</p>
      <div className="tour-actions tour-actions-stacked">
        <button type="button" className="btn-soft btn-tour-sm" onClick={stopPitchTour}>
          Skip
        </button>
        <button type="button" className="btn-gradient btn-tour-sm" onClick={nextTourStep}>
          {isLast ? 'Finish' : 'Next'}
          {!isLast && <ChevronRight size={14} />}
        </button>
      </div>
    </div>
  );
}
