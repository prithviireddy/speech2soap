import { CheckCircle2, XCircle, Circle } from "lucide-react";

/**
 * PipelineStageTracker
 *
 * Visualises the multi-stage AI processing pipeline as a vertical stepper.
 * Each stage derives its state (pending / active / done / failed) from the
 * current progress percentage and status returned by the backend.
 */

const STAGES = [
  { key: "uploaded",      label: "Audio Uploaded",         description: "File received and saved.",                 threshold: 0  },
  { key: "loading",       label: "Loading Whisper Model",  description: "Initialising speech-to-text engine.",      threshold: 10 },
  { key: "transcribing",  label: "Transcribing Speech",    description: "Converting audio to raw text.",            threshold: 20 },
  { key: "aligning",      label: "Aligning Words",         description: "Mapping words to precise timestamps.",     threshold: 40 },
  { key: "diarization",   label: "Speaker Diarization",    description: "Separating doctor and patient voices.",    threshold: 55 },
  { key: "assigning",     label: "Assigning Speakers",     description: "Labelling each segment by speaker.",       threshold: 70 },
  { key: "merging",       label: "Processing Dialogue",    description: "Cleaning and merging conversation turns.",  threshold: 82 },
  { key: "generating",    label: "Generating Report",      description: "LLM creating structured clinical notes.",  threshold: 90 },
  { key: "complete",      label: "Complete",               description: "Processing finished.",                     threshold: 100 },
];

const stageState = (stage, progress, status) => {
  if (status === "FAILED") {
    return progress >= stage.threshold ? "failed" : "pending";
  }
  if (progress === 100 || status === "REVIEW_PENDING" || status === "APPROVED") {
    return "done";
  }
  
  // Find next stage threshold
  const nextStage = STAGES.find((s) => s.threshold > stage.threshold);
  if (nextStage) {
    if (progress >= stage.threshold && progress < nextStage.threshold) {
      return "active";
    }
    if (progress >= nextStage.threshold) {
      return "done";
    }
    return "pending";
  }
  return progress >= stage.threshold ? "done" : "pending";
};

const StageIcon = ({ state }) => {
  if (state === "done") {
    return (
      <span className="animate-check-pop">
        <CheckCircle2 size={22} className="text-emerald-500 shrink-0" />
      </span>
    );
  }
  if (state === "failed") {
    return <XCircle size={22} className="text-danger shrink-0" />;
  }
  if (state === "active") {
    return (
      <span className="relative flex h-[22px] w-[22px] shrink-0 items-center justify-center">
        <span className="absolute h-full w-full rounded-full bg-brand-primary opacity-25 animate-ping" />
        <span className="h-3 w-3 rounded-full bg-brand-primary shadow-xs" />
      </span>
    );
  }
  // pending
  return <Circle size={22} className="text-border-strong shrink-0 opacity-40" />;
};

export const PipelineStageTracker = ({ progress = 0, currentStage = "", status = "UPLOADED" }) => {
  const numericProgress = Number(progress) || 0;

  return (
    <div className="space-y-1">
      {STAGES.map((stage, idx) => {
        const state = stageState(stage, numericProgress, status);
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
                  className={`w-px flex-1 mt-1 mb-1 min-h-[26px] rounded-full transition-colors duration-500 ${
                    isDone ? "bg-emerald-500" : "bg-border-default"
                  }`}
                />
              )}
            </div>

            {/* Right — labels */}
            <div className={`pb-4 ${idx === STAGES.length - 1 ? "pb-0" : ""}`}>
              <p
                className={`text-sm font-semibold leading-[22px] ${
                  isActive
                    ? "text-brand-primary font-bold"
                    : isDone
                    ? "text-text-primary"
                    : isFailed
                    ? "text-danger"
                    : "text-text-muted opacity-60"
                }`}
              >
                {stage.label}
                {isActive && (
                  <span className="ml-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-primary-light text-brand-primary text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                    In progress
                  </span>
                )}
                {isDone && (
                  <span className="ml-2 text-[11px] font-normal text-emerald-600 dark:text-emerald-400 font-mono">
                    ✓ Done
                  </span>
                )}
              </p>
              <p
                className={`text-xs mt-0.5 ${
                  isActive ? "text-text-secondary font-medium" : "text-text-muted"
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
