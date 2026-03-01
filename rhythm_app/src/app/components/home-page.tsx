import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import svgPaths from "../../imports/home-icons-svg-paths";
import { loadSessionState, type SessionState } from "../lib/sessionStore";

// ── State definitions ──────────────────────────────────────────────
type CapacityState = "aligned" | "drifting" | "depleted";

const stateConfig: Record<
  CapacityState,
  {
    label: string;
    headline: string;
    description: string;
    bg: string;
    dotBg: string;
    dotColor: string;
    labelColor: string;
  }
> = {
  aligned: {
    label: "Aligned",
    headline: "Your capacity looks good today",
    description:
      "Signals are tracking close to your usual baseline. A good day to take on demanding work.",
    bg: "#e8f5e9",
    dotBg: "rgba(200,230,201,0.6)",
    dotColor: "#4A7C59",
    labelColor: "#4A7C59",
  },
  drifting: {
    label: "Drifting",
    headline: "Your recovery load is higher than usual",
    description:
      "Two signals are running below your baseline. Your body is asking for less, not more.",
    bg: "#fdf8e7",
    dotBg: "rgba(255,224,178,0.6)",
    dotColor: "#A67C37",
    labelColor: "#A67C37",
  },
  depleted: {
    label: "Watch Closely",
    headline: "Signs of building fatigue",
    description:
      "Three signals are below your personal baseline. Rhythm has seen this pattern before a crash.",
    bg: "#fbe9e7",
    dotBg: "rgba(255,204,188,0.6)",
    dotColor: "#C4453E",
    labelColor: "#C4453E",
  },
};

// ── Contributing signal data ───────────────────────────────────────
interface ContributingSignal {
  name: string;
  status: string;
  statusType: "warning" | "danger" | "neutral" | "good";
  dotColor: string;
  detail: string;
}

const contributingSignals: ContributingSignal[] = [
  {
    name: "Sleep quality",
    status: "Lighter than usual",
    statusType: "warning",
    dotColor: "#C97B6B",
    detail:
      "You got 7.2h of sleep but deep sleep was only 1.2h — about 30% below your baseline. REM was also shorter. This often happens in the second half of the luteal phase when progesterone peaks.",
  },
  {
    name: "HRV",
    status: "Trending down",
    statusType: "danger",
    dotColor: "#C4453E",
    detail:
      "Your HRV dropped to 38ms overnight — down 14% from your 30-day average of 44ms. This reflects higher sympathetic load. Luteal phase typically lowers your baseline HRV by about 8%, so the remaining dip may be stress or under-recovery.",
  },
  {
    name: "Resting heart rate",
    status: "Within range",
    statusType: "neutral",
    dotColor: "#8A8680",
    detail:
      "Resting HR was 59 bpm last night, which is within 2 bpm of your 30-day average. No notable deviation here.",
  },
  {
    name: "Active energy",
    status: "On track",
    statusType: "good",
    dotColor: "#4A7C59",
    detail:
      "You burned 384 kcal active energy yesterday and hit 8,432 steps. Both are within your normal range for this cycle phase.",
  },
];

const statusBadgeStyles: Record<string, { bg: string; text: string; border: string }> = {
  warning: { bg: "#FFF3E0", text: "#A67C37", border: "#FFE0B2" },
  danger: { bg: "#FBE9E7", text: "#C4453E", border: "#FFCCBC" },
  neutral: { bg: "#F0EBE5", text: "#8A8680", border: "#E8DFD5" },
  good: { bg: "#E8F5E9", text: "#4A7C59", border: "#C8E6C9" },
};

// ── Week ahead data ────────────────────────────────────────────────
const weekAhead = [
  {
    label: "Recovery\nwindow",
    labelSingle: "Recovery window",
    date: "Mar 3–5",
    value: "62%",
    subtitle: "capacity predicted",
    color: "#565656",
  },
  {
    label: "Focus quality",
    labelSingle: "Focus quality",
    date: "Mar 6–8",
    value: "84%",
    subtitle: "your follicular baseline",
    color: "#4A7C59",
  },
];

// ── Energy check-in emojis ─────────────────────────────────────────
const energyEmojis = [
  { emoji: "😣", label: "Struggling" },
  { emoji: "😐", label: "Low" },
  { emoji: "🙂", label: "Okay" },
  { emoji: "😊", label: "Good" },
  { emoji: "⚡", label: "Great" },
];

// ── Capacity state computed from signals ───────────────────────────
function computeCapacityState(signals: ContributingSignal[]): CapacityState {
  const dangerCount = signals.filter((s) => s.statusType === "danger").length;
  const warningCount = signals.filter((s) => s.statusType === "warning").length;
  const negativeCount = dangerCount + warningCount;

  if (negativeCount >= 3 || dangerCount >= 2) return "depleted";
  if (negativeCount >= 1) return "drifting";
  return "aligned";
}

function mapStressCodeToCapacityState(stressCode?: number): CapacityState | null {
  if (stressCode === 0) return "aligned";
  if (stressCode === 1) return "drifting";
  if (stressCode === 2) return "depleted";
  return null;
}

function mapStressLabelToEnglish(label?: string): string {
  if (!label) return "Unknown";
  const map: Record<string, string> = {
    "放松": "Relaxed",
    "正常": "Normal",
    "有压力": "Stressed",
  };
  return map[label] ?? label;
}

function mapMoodLabelToEnglish(label?: string): string {
  if (!label) return "Unknown";
  const map: Record<string, string> = {
    "差": "Low",
    "中": "Neutral",
    "好": "Good",
  };
  return map[label] ?? label;
}

// ── SVG Icon Components (from Figma) ───────────────────────────────

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d={svgPaths.p660c780}
        stroke="#8A8680"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.667"
      />
      <path
        d={svgPaths.p13035b80}
        stroke="#8A8680"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.667"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path
        d={svgPaths.pdb996c0}
        stroke="#8A8680"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.333"
      />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none">
      <path
        d={svgPaths.p23aebf00}
        stroke="#8A8680"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.166"
      />
    </svg>
  );
}

function ThumbsUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path
        d="M4.17554 6.17255V14.1695"
        stroke="#2D2A26"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.333"
      />
      <path
        d={svgPaths.p19932b80}
        stroke="#2D2A26"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.333"
      />
    </svg>
  );
}

function ThumbsDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path
        d="M10.8397 8.83821V0.841248"
        stroke="#2D2A26"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.333"
      />
      <path
        d={svgPaths.p2697de00}
        stroke="#2D2A26"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.333"
      />
    </svg>
  );
}

// ── Components ─────────────────────────────────────────────────────

function CapacityCard({ state }: { state: CapacityState }) {
  const config = stateConfig[state];

  return (
    <motion.div
      key={state}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-2xl overflow-hidden"
      style={{ backgroundColor: config.bg }}
    >
      {/* Subtle border overlay */}
      <div className="absolute inset-0 rounded-2xl border border-[rgba(45,42,38,0.08)] pointer-events-none" />

      <div className="flex flex-col gap-3 px-3.5 py-4">
        {/* State label row */}
        <div className="flex items-center gap-2 pl-[14px]">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: config.dotBg }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: config.dotColor }}
            />
          </div>
          <span
            className="text-[12px] tracking-[0.3px] uppercase"
            style={{
              color: config.labelColor,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontVariationSettings: "'opsz' 9",
            }}
          >
            {config.label}
          </span>
        </div>

        {/* Headline */}
        <div className="pl-[14px]">
          <p
            className="text-[17px] leading-[27px] text-[#2D2A26]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            {config.headline}
          </p>
        </div>

        {/* Description */}
        <div className="pl-[14px]">
          <p
            className="text-[13px] leading-[21px] text-[#3a3a3a] max-w-[330px]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontVariationSettings: "'opsz' 9",
            }}
          >
            {config.description}
          </p>
        </div>

        {/* Phase context badge */}
        <div className="px-3">
          <div className="inline-flex items-center gap-1.5 bg-white/70 rounded-full px-3 py-1.5">
            <span
              className="text-[11px] text-[#353535]"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontVariationSettings: "'opsz' 9",
              }}
            >
              ›
            </span>
            <span
              className="text-[12px] text-[#363636]"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontVariationSettings: "'opsz' 9",
              }}
            >
              Luteal phase, day 4 · factored in
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ContributingSignalRow({
  signal,
  isLast,
}: {
  signal: ContributingSignal;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const badge = statusBadgeStyles[signal.statusType];

  return (
    <div className="relative">
      {/* Bottom border (not on last item) */}
      {!isLast && (
        <div className="absolute bottom-0 left-0 right-0 border-b border-[#d4d4d4]" style={{ borderBottomWidth: "0.5px" }} />
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 h-[53px] text-left"
      >
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: signal.dotColor }}
        />
        <span
          className="flex-1 text-[14px] leading-[21px] text-[#2D2A26]"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontVariationSettings: "'opsz' 14",
          }}
        >
          {signal.name}
        </span>
        <span
          className="text-[11px] leading-[16.5px] px-[10.5px] py-[4px] rounded-full shrink-0"
          style={{
            backgroundColor: badge.bg,
            color: badge.text,
            border: `0.5px solid ${badge.border}`,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontVariationSettings: "'opsz' 14",
          }}
        >
          {signal.status}
        </span>
        <div
          className={`w-4 h-4 shrink-0 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        >
          <ChevronDownIcon className="w-4 h-4" />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p
              className="text-[13px] leading-[21px] text-[#3a3a3a] pb-4 pl-[22px] pr-2"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontVariationSettings: "'opsz' 9",
              }}
            >
              {signal.detail}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WeekAheadCard({ item }: { item: (typeof weekAhead)[0] }) {
  return (
    <div className="flex-1 relative bg-white rounded-2xl min-h-[142px]">
      {/* Subtle border */}
      <div className="absolute inset-0 rounded-2xl border border-[rgba(45,42,38,0.08)] pointer-events-none" />

      <div className="p-4 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between">
          <p
            className="text-[13px] leading-[16.25px] text-[#2D2A26] max-w-[56px]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontVariationSettings: "'opsz' 9",
            }}
          >
            {item.labelSingle}
          </p>
          <span
            className="text-[11px] leading-[16.5px] text-[#292929] bg-[#F0EBE5] px-2 py-[3px] rounded"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontVariationSettings: "'opsz' 9",
            }}
          >
            {item.date}
          </span>
        </div>
        <div>
          <p
            className="text-[28px] leading-[42px]"
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "normal",
              color: item.color,
            }}
          >
            {item.value}
          </p>
          <p
            className="text-[11px] leading-[16.5px] text-[#8A8680]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontVariationSettings: "'opsz' 9",
            }}
          >
            {item.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function TodaySuggestion({
  suggestionText,
  sourceText,
}: {
  suggestionText: string;
  sourceText: string;
}) {
  return (
    <div className="relative rounded-2xl" style={{ backgroundColor: "rgba(201,123,107,0.12)" }}>
      {/* Subtle border */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ border: "0.5px solid rgba(201,123,107,0.2)" }}
      />

      <div className="px-5 py-5">
        {/* Section label */}
        <p
          className="text-[11px] leading-[16.5px] tracking-[0.275px] uppercase text-[#C97B6B] mb-3"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontVariationSettings: "'opsz' 9",
          }}
        >
          Today's Suggestion
        </p>

        {/* Suggestion text */}
        <p
          className="text-[13px] leading-[21px] text-[#3a3a3a] max-w-[320px] mb-5"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontVariationSettings: "'opsz' 14",
          }}
        >
          {suggestionText}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span
            className="text-[12px] leading-[18px] text-[#8A8680]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontVariationSettings: "'opsz' 9",
            }}
          >
            {sourceText}
          </span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
              <ThumbsUpIcon className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
              <ThumbsDownIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EnergyCheckIn() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="relative bg-white rounded-2xl">
      <div className="absolute inset-0 rounded-2xl border border-[rgba(45,42,38,0.08)] pointer-events-none" />
      <div className="p-4">
        <p
          className="text-[14px] leading-[21px] text-[#2D2A26] mb-0.5"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontVariationSettings: "'opsz' 14",
          }}
        >
          How's your energy?
        </p>
        <p
          className="text-[12px] leading-[18px] text-[#8A8680] mb-3"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontVariationSettings: "'opsz' 9",
          }}
        >
          30 sec · helps Rhythm calibrate
        </p>
        <div className="flex items-center gap-2">
          {energyEmojis.map((e, i) => (
            <button
              key={e.label}
              onClick={() => setSelected(i)}
              className={`flex-1 aspect-square rounded-xl flex items-center justify-center text-[22px] transition-all ${
                selected === i
                  ? "bg-[#8B6E5A]/10 border-2 border-[#8B6E5A] scale-110"
                  : "bg-[#F0EBE5]/50 border-2 border-transparent hover:bg-[#F0EBE5]"
              }`}
            >
              {e.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────

export function HomePage() {
  const [session, setSession] = useState<SessionState | null>(null);
  useEffect(() => {
    setSession(loadSessionState());
  }, []);

  const modelCapacityState = mapStressCodeToCapacityState(session?.prediction?.stress_pred_code);
  const capacityState = modelCapacityState ?? computeCapacityState(contributingSignals);

  const moodLabel = mapMoodLabelToEnglish(session?.prediction?.mood_pred_label);
  const stressLabel = mapStressLabelToEnglish(session?.prediction?.stress_pred_label);
  const suggestionText =
    session?.prediction
      ? `Based on today's model result (${stressLabel ?? "unknown"} stress, ${moodLabel ?? "unknown"} mood), protect your high-focus window and avoid stacking heavy social + cognitive tasks back-to-back.`
      : "Consider moving your high-intensity workout to tomorrow — your recovery signal is lower than your usual Sunday.";
  const sourceText =
    session?.prediction
      ? `Model source: ${session.prediction.stress_model_source}${session.prediction.mood_model_source ? ` + ${session.prediction.mood_model_source}` : ""}`
      : "Based on HRV + sleep + phase";

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p
            className="text-[13px] leading-[19.5px] text-[#8A8680] mb-0"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontVariationSettings: "'opsz' 9",
            }}
          >
            Sunday, March 1
          </p>
          <p
            className="text-[24px] leading-[36px] text-[#2D2A26]"
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "normal",
            }}
          >
            Good morning, Aria
          </p>
        </div>
        <button className="relative w-10 h-10 rounded-full bg-white border border-[rgba(45,42,38,0.08)] flex items-center justify-center">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C97B6B] rounded-full" />
        </button>
      </div>

      {/* Daily Insights heading + Capacity Card */}
      <div className="flex flex-col gap-3 mb-6">
        <p
          className="text-[18px] leading-[27px] text-[#2D2A26]"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontVariationSettings: "'opsz' 14",
          }}
        >
          Daily Insights
        </p>
        <CapacityCard state={capacityState} />
        {session?.prediction && (
          <div className="bg-white rounded-xl border border-[rgba(45,42,38,0.08)] px-3 py-2">
            <p className="text-[12px] text-[#8A8680]">
              Latest model: Stress <span className="text-[#2D2A26]">{stressLabel}</span> · Mood{" "}
              <span className="text-[#2D2A26]">{moodLabel ?? "N/A"}</span>
            </p>
          </div>
        )}
      </div>

      {/* What's Contributing */}
      <div className="mb-6">
        <p
          className="text-[11px] leading-[16.5px] tracking-[0.275px] uppercase text-[#1e1e1e] mb-2"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontVariationSettings: "'opsz' 14",
          }}
        >
          What's Contributing
        </p>
        <div className="relative bg-white rounded-2xl">
          <div className="absolute inset-0 rounded-2xl border border-[rgba(45,42,38,0.08)] pointer-events-none" />
          <div className="px-4">
            {contributingSignals.map((signal, i) => (
              <ContributingSignalRow
                key={signal.name}
                signal={signal}
                isLast={i === contributingSignals.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Week Ahead */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p
            className="text-[11px] leading-[16.5px] tracking-[0.275px] uppercase text-[#1e1e1e]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Week Ahead
          </p>
          <button className="flex items-center text-[11px] leading-[16.5px] tracking-[0.275px] uppercase text-[#1e1e1e] hover:text-[#2D2A26] transition-colors"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            See all{" "}
            <ChevronRightIcon className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
        <div className="flex gap-3">
          {weekAhead.map((item) => (
            <WeekAheadCard key={item.labelSingle} item={item} />
          ))}
        </div>
      </div>

      {/* Today's Suggestion */}
      <div className="mb-6">
        <TodaySuggestion suggestionText={suggestionText} sourceText={sourceText} />
      </div>

    </div>
  );
}
