import { LoadingSpinner } from "./LoadingSpinner";
import { Mic, User, Stethoscope, Clock, FileText } from "lucide-react";

/**
 * TranscriptPanel
 *
 * Displays the diarized speaker-attributed conversation that produced
 * the AI clinical report. Each segment is colour-coded by speaker role.
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
      bg: "bg-brand-primary-light/40 dark:bg-brand-primary-light/20",
      badgeBg: "bg-brand-primary text-white",
      name: "DOCTOR",
      icon: Stethoscope,
    };
  }
  return {
    border: "border-l-cyan-500",
    label: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10 dark:bg-cyan-950/30",
    badgeBg: "bg-cyan-600 text-white",
    name: "PATIENT",
    icon: User,
  };
};

export const TranscriptPanel = ({
  transcript,
  segments: propSegments,
  loading = false,
  error = "",
}) => {
  const rawSegments =
    Array.isArray(propSegments) && propSegments.length > 0
      ? propSegments
      : Array.isArray(transcript?.segments)
      ? transcript.segments
      : Array.isArray(transcript)
      ? transcript
      : [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 bg-bg-secondary rounded-2xl border border-border-default">
        <LoadingSpinner size="sm" />
        <p className="text-xs text-text-muted">Loading consultation transcript...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-2xl bg-danger-light/30 border border-danger/20 text-center">
        <p className="text-xs text-danger font-medium">{error}</p>
      </div>
    );
  }

  if (rawSegments.length === 0) {
    return (
      <div className="p-6 text-center text-text-muted bg-bg-secondary/60 rounded-2xl border border-border-default">
        <Mic size={24} className="mx-auto mb-2 opacity-30 text-text-muted" />
        <p className="text-xs font-medium text-text-primary">Transcript Processing</p>
        <p className="text-[11px] text-text-muted mt-0.5">
          Audio transcription is either in progress or no transcript was attached to this report.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
          <Mic size={14} className="text-brand-primary" />
          <span>Diarized Dialogue ({rawSegments.length} turns)</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[calc(100vh-260px)] pr-1.5 scrollbar-thin">
        {rawSegments.map((seg, idx) => {
          const style = speakerStyle(seg.speaker);
          const time = formatTime(seg.start);
          const Icon = style.icon;

          return (
            <div
              key={idx}
              className={`rounded-2xl border-l-[3px] ${style.border} ${style.bg} border border-border-subtle p-3.5 transition-all hover:border-brand-primary/30`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider ${style.badgeBg}`}
                  >
                    <Icon size={10} />
                    <span>{style.name}</span>
                  </span>
                </div>
                {time && (
                  <span className="text-[10px] text-text-muted font-mono flex items-center gap-1">
                    <Clock size={10} />
                    {time}
                  </span>
                )}
              </div>
              <p className="text-xs text-text-primary leading-relaxed whitespace-pre-wrap">
                {seg.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
