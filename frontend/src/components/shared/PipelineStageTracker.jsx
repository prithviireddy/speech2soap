import { CheckCircle2, XCircle, Circle } from "lucide-react";

/**
 * PipelineStageTracker
 *
 * Visualises the multi-stage AI processing pipeline as a vertical stepper.
 * Each stage derives its state (pending / active / done / failed) from the
 * current progress percentage and current_stage label returned by the backend.
 *
 * Stages are ordered by the progress threshold at which they become active.
 */

const STAGES = [
  { key: "uploaded",      label: "Audio Uploaded",         description: "File received and saved.",                threshold: 0  },
  { key: "loading",       label: "Loading Whisper Model",  description: "Initialising speech-to-text engine.",     threshold: 10 },
  { key: "transcribing",  label: "Transcribing Speech",    description: "Converting audio to raw text.",           threshold: 20 },
  { key: "aligning",      label: "Aligning Words",         description: "Mapping words to precise timestamps.",    threshold: 40 },
  { key: "diarization",   label: "Speaker Diarization",    description: "Separating doctor and patient voices.",   threshold: 55 },
  { key: "assigning",     label: "Assigning Speakers",     description: "Labelling each segment by speaker.",      threshold: 70 },
  { key: "merging",       label: "Processing Dialogue",    description: "Cleaning and merging conversation turns.", threshold: 82 },
  { key: "generating",    label: "Generating Report",      description: "LLM creating structured clinical notes.", threshold: 90 },
  { key: "complete",      label: "Complete",               description: "Processing finished.",                    threshold: 100 },
];

const stageState = (stage, progress, status) => {
  if (status === "FAILED") {
    // Everything at or below current progress is failed, rest pending
    return progress >= stage.threshold ? "failed" : "pending";
  }
  if (progress === 100 || status === "REVIEW_PENDING" || status === "APPROVED") {
    return "done";
  }
  // Active: this stage's threshold was crossed but the next hasn't been
  const nextStage = STAGES.find((s) => s.threshold > stage.threshold);
  if (nextStage) {
    return progress >= stage.threshold && progress < nextStage.threshold
      ? "active"
      : progress >= stage.threshold
      ? "done"
      : "pending";
  }
  return progress >= stage.threshold ? "done" : "pending";
};

const StageIcon = ({ state }) => {
  if (state === "done") {
    return (
      <span className="animate-check-pop">
        <CheckCircle2 size={22} className="text-success shrink-0" />
      </span>
    );
  }
  if (state === "failed") {
    return <XCircle size={22} className="text-danger shrink-0" />;
  }
  if (state === "active") {
    return (
      <span className="relative flex h-[22px] w-[22px] shrink-0 items-center justify-center">
        <span className="absolute h-full w-full rounded-full bg-brand-primary opacity-20 animate-ping" />
        <span className="h-3 w-3 rounded-full bg-brand-primary" />
      </span>
    );
  }
  // pending
  return <Circle size={22} className="text-border-strong shrink-0" />;
};

export const PipelineStageTracker = ({ progress = 0, status = "UPLOADED" }) => {
  return (
    <div className="space-y-1">
      {STAGES.map((stage, idx) => {
        const state = stageState(stage, progress, status);
        const isActive = state === "active";
        const isDone   = state === "done";
        const isFailed = state === "failed";

        return (
          <div key={stage.key} className="flex items-start gap-4">
            {/* Left — icon + connector line */}
            <div className="flex flex-col items-center">
              <StageIcon state={state} />
              {idx < STAGES.length - 1 && (
                <div
                  className={`w-px flex-1 mt-1 mb-1 min-h-[24px] rounded-full transition-colors duration-500 ${
                    isDone ? "bg-success" : "bg-border-default"
                  }`}
                />
              )}
            </div>

            {/* Right — labels */}
            <div className={`pb-4 ${idx === STAGES.length - 1 ? "pb-0" : ""}`}>
              <p
                className={`text-sm font-semibold leading-[22px] ${
                  isActive
                    ? "text-brand-primary"
                    : isDone
                    ? "text-text-primary"
                    : isFailed
                    ? "text-danger"
                    : "text-text-muted"
                }`}
              >
                {stage.label}
                {isActive && (
                  <span className="ml-2 inline-flex items-center gap-1 text-xs font-normal text-brand-primary">
                    <span className="w-1 h-1 rounded-full bg-brand-primary animate-pulse-dot" />
                    In progress
                  </span>
                )}
              </p>
              <p
                className={`text-xs mt-0.5 ${
                  isActive ? "text-text-secondary" : "text-text-muted"
                }`}
              >
                {stage.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
