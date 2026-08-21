import { LoadingSpinner } from "./LoadingSpinner";

/**
 * TranscriptPanel
 *
 * Displays the diarized speaker-attributed conversation that produced
 * the AI clinical report. Each segment is colour-coded by speaker role.
 *
 * Props:
 *   segments  — array of { speaker, text, start?, end? }
 *   loading   — show spinner while fetching
 *   error     — error message string
 */

const formatTime = (seconds) => {
  if (seconds == null) return null;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

const speakerStyle = (speaker = "") => {
  const upper = speaker.toUpperCase();
  if (upper.includes("DOCTOR") || upper === "SPEAKER_0") {
    return {
      border: "border-l-brand-primary",
      label: "text-brand-primary",
      bg: "bg-brand-primary-light",
      name: "DOCTOR",
    };
  }
  return {
    border: "border-l-medical",
    label: "text-medical",
    bg: "bg-medical-light",
    name: "PATIENT",
  };
};

export const TranscriptPanel = ({ segments = [], loading = false, error = "" }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-danger-light border border-danger/20">
        <p className="text-sm text-danger">{error}</p>
      </div>
    );
  }

  if (segments.length === 0) {
    return (
      <div className="p-4 text-center text-text-muted text-sm">
        Transcript not available yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
      {segments.map((seg, idx) => {
        const style = speakerStyle(seg.speaker);
        const time = formatTime(seg.start);

        return (
          <div
            key={idx}
            className={`rounded-lg border-l-4 ${style.border} ${style.bg} px-4 py-3 animate-fade-in-up`}
            style={{ animationDelay: `${Math.min(idx * 20, 300)}ms` }}
          >
            <div className="flex items-baseline justify-between mb-1">
              <span className={`text-xs font-bold tracking-widest uppercase ${style.label}`}>
                {style.name}
              </span>
              {time && (
                <span className="text-xs text-text-muted font-mono">{time}</span>
              )}
            </div>
            <p className="text-sm text-text-primary leading-relaxed">
              {seg.text}
            </p>
          </div>
        );
      })}
    </div>
  );
};
