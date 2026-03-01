import { useNavigate } from "react-router";
import { motion } from "motion/react";
import svgPaths from "../../imports/svg-76kz06h3ab";
import askRhythmSvg from "../../imports/svg-bm02j0sq5d";

// ── State definitions ──────────────────────────────────────────────
type CapacityState = "aligned" | "drifting" | "depleted";

const stateConfig: Record<
  CapacityState,
  {
    label: string;
    headline: string;
    description: string;
    accent: string;
    faintBg: string;
    pillBg: string;
    pillBorder: string;
  }
> = {
  aligned: {
    label: "ALIGNED",
    headline: "Your rhythm is on track",
    description:
      "Signals are tracking close to your usual baseline. A good day to take on demanding work.",
    accent: "#5C8A6E",
    faintBg: "#EBF4EF",
    pillBg: "rgba(92,138,110,0.10)",
    pillBorder: "rgba(92,138,110,0.30)",
  },
  drifting: {
    label: "DRIFTING",
    headline: "Your recovery load is higher than usual",
    description:
      "HRV has pulled below your luteal baseline for 3 nights. Sleep efficiency is lighter.",
    accent: "#C4785A",
    faintBg: "#FAF0EB",
    pillBg: "rgba(196,120,90,0.10)",
    pillBorder: "rgba(196,120,90,0.30)",
  },
  depleted: {
    label: "WATCH CLOSELY",
    headline: "Signs of building fatigue",
    description:
      "Three signals are below your personal baseline. Rhythm has seen this pattern before a crash.",
    accent: "#C49A4A",
    faintBg: "#FBF5E8",
    pillBg: "rgba(196,154,74,0.10)",
    pillBorder: "rgba(196,154,74,0.30)",
  },
};

// Wave data per state
const waveData: Record<CapacityState, { baseline: number[]; actual: number[] }> = {
  aligned: {
    baseline: [52, 48, 54, 50, 53, 49, 51],
    actual: [50, 49, 55, 51, 54, 50, 52],
  },
  drifting: {
    baseline: [52, 48, 54, 50, 53, 49, 51],
    actual: [50, 47, 48, 44, 42, 38, 35],
  },
  depleted: {
    baseline: [52, 48, 54, 50, 53, 49, 51],
    actual: [48, 42, 38, 33, 28, 24, 20],
  },
};

const metricData: Record<CapacityState, { hrv: string; hrvDelta: string; hrvDown: boolean; sleep: string; sleepDelta: string; sleepDown: boolean; phase: string; phaseDay: string }> = {
  aligned: { hrv: "48 ms", hrvDelta: "→ On baseline", hrvDown: false, sleep: "81%", sleepDelta: "→ On baseline", sleepDown: false, phase: "Luteal", phaseDay: "Day 4" },
  drifting: { hrv: "38 ms", hrvDelta: "↓ −11% from baseline", hrvDown: true, sleep: "68%", sleepDelta: "↓ −6% from baseline", sleepDown: true, phase: "Luteal", phaseDay: "Day 4" },
  depleted: { hrv: "31 ms", hrvDelta: "↓ −28% from baseline", hrvDown: true, sleep: "59%", sleepDelta: "↓ −15% from baseline", sleepDown: true, phase: "Luteal", phaseDay: "Day 4" },
};

// ── Contributing signal data ───────────────────────────────────────
interface ContributingSignal {
  name: string;
  status: string;
  statusType: "warning" | "danger" | "neutral" | "good";
  dotColor: string;
  sparkline: number[];
}

const contributingSignals: ContributingSignal[] = [
  { name: "Sleep quality", status: "Lighter than usual", statusType: "warning", dotColor: "#C4A04A", sparkline: [6, 5, 4, 5, 3, 4, 3] },
  { name: "HRV", status: "Trending down", statusType: "danger", dotColor: "#C4785A", sparkline: [7, 6, 6, 5, 4, 3, 2] },
  { name: "Resting HR", status: "Within range", statusType: "neutral", dotColor: "#8A8680", sparkline: [5, 4, 6, 5, 5, 6, 5] },
  { name: "Active energy", status: "On track", statusType: "good", dotColor: "#5C8A6E", sparkline: [4, 5, 6, 5, 6, 7, 6] },
];

const statusBadgeStyles: Record<string, { bg: string; text: string }> = {
  warning: { bg: "#FFF3E0", text: "#A67C37" },
  danger: { bg: "#FBE9E7", text: "#C4453E" },
  neutral: { bg: "#F0EBE5", text: "#8A8680" },
  good: { bg: "#E8F5E9", text: "#4A7C59" },
};

// ── Week ahead data ────────────────────────────────────────────────
const weekAhead = [
  { labelSingle: "Recovery window", date: "Mar 3–5", value: "62%", subtitle: "capacity predicted", color: "#565656" },
  { labelSingle: "Focus quality", date: "Mar 6–8", value: "84%", subtitle: "your follicular baseline", color: "#4A7C59" },
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

// ── SVG Icon Components (from Figma) ───────────────────────────────

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none">
      <path d={svgPaths.p660c780} stroke="#8A8680" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.667" />
      <path d={svgPaths.p13035b80} stroke="#8A8680" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.667" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none">
      <path d={svgPaths.p23aebf00} stroke="#8A8680" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.166" />
    </svg>
  );
}

function ThumbsUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path d="M4.17554 6.17255V14.1695" stroke="#2D2A26" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
      <path d={svgPaths.p19932b80} stroke="#2D2A26" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
    </svg>
  );
}

function ThumbsDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path d="M10.8397 8.83821V0.841248" stroke="#2D2A26" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
      <path d={svgPaths.p2697de00} stroke="#2D2A26" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
    </svg>
  );
}

// ── Sparkline SVG ──────────────────────────────────────────────────

function Sparkline({ data, color, width = 48, height = 24 }: { data: number[]; color: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const coords = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return { x, y };
  });
  const points = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const last = coords[coords.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <polyline points={points} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={last.x} cy={last.y} r="3" fill={color} opacity={0.35} />
      <circle cx={last.x} cy={last.y} r="1.8" fill={color} />
    </svg>
  );
}

// ── Wave Visualization ─────────────────────────────────────────────

function WaveChart({ state }: { state: CapacityState }) {
  const config = stateConfig[state];
  const data = waveData[state];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const W = 295;
  const H = 110;
  const padX = 8;
  const padTop = 20;
  const padBot = 10;
  const chartH = H - padTop - padBot;

  const allVals = [...data.baseline, ...data.actual];
  const maxV = Math.max(...allVals);
  const minV = Math.min(...allVals);
  const range = maxV - minV || 1;

  const toX = (i: number) => padX + (i / 6) * (W - padX * 2);
  const toY = (v: number) => padTop + chartH - ((v - minV) / range) * chartH;

  const baselinePath = data.baseline.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ");
  const actualPath = data.actual.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ");

  // Fill between baseline and actual
  const fillPath =
    data.actual.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ") +
    " " +
    data.baseline.map((v, i) => `L${toX(6 - i)},${toY(data.baseline[6 - i])}`).join(" ") +
    " Z";

  const todayX = toX(6);
  const todayY = toY(data.actual[6]);

  return (
    <div className="relative mt-3 mb-1">
      <svg width="100%" viewBox={`0 0 ${W} ${H + 30}`} preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((frac) => (
          <line
            key={frac}
            x1={padX}
            y1={padTop + chartH * (1 - frac)}
            x2={W - padX}
            y2={padTop + chartH * (1 - frac)}
            stroke="#E8E4DC"
            strokeWidth="0.8"
            strokeDasharray="3 4"
          />
        ))}

        {/* Deviation fill */}
        <path d={fillPath} fill={config.accent} opacity={0.1} />

        {/* Baseline dashed */}
        <path d={baselinePath} stroke="#B5B0AA" strokeWidth="1.5" strokeDasharray="5 4" fill="none" />

        {/* Baseline label */}
        <text x={toX(0)} y={toY(data.baseline[0]) - 8} fill="#B5B0AA" fontSize="8.5" fontFamily="'DM Sans', sans-serif">
          your baseline
        </text>

        {/* Actual solid */}
        <path d={actualPath} stroke={config.accent} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* History dots */}
        {data.actual.slice(0, 6).map((v, i) => (
          <circle key={i} cx={toX(i)} cy={toY(v)} r="2.5" fill={config.accent} opacity={0.35} />
        ))}

        {/* TODAY marker */}
        <circle cx={todayX} cy={todayY} r="7" fill={config.accent} opacity={0.15} />
        <circle cx={todayX} cy={todayY} r="4" fill={config.accent} />
        <circle cx={todayX} cy={todayY} r="2" fill="white" />
        <text
          x={todayX}
          y={todayY - 14}
          textAnchor="middle"
          fill={config.accent}
          fontSize="9"
          fontFamily="'DM Sans', sans-serif"
          fontWeight="700"
        >
          TODAY
        </text>

        {/* Day labels */}
        {days.map((d, i) => (
          <text
            key={i}
            x={toX(i)}
            y={H + 22}
            textAnchor="middle"
            fill={i === 6 ? config.accent : "#B5B0AA"}
            fontSize="9"
            fontFamily="'DM Sans', sans-serif"
            fontWeight={i === 6 ? "700" : "400"}
          >
            {d}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ── Capacity Card ──────────────────────────────────────────────────

function CapacityCard({ state }: { state: CapacityState }) {
  const config = stateConfig[state];
  const metrics = metricData[state];

  return (
    <motion.div
      key={state}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-[22px] overflow-hidden"
      style={{
        backgroundColor: "#FAFAF8",
        border: `1.5px solid ${config.accent}20`,
        boxShadow: `0 2px 20px ${config.accent}14`,
      }}
    >
      {/* Corner gradient */}
      <div
        className="absolute top-0 right-0 w-[120px] h-[120px] pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${config.accent}1F, transparent 70%)`,
        }}
      />

      <div className="p-5">
        {/* Status pill */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-2"
          style={{ backgroundColor: config.pillBg, border: `1px solid ${config.pillBorder}` }}
        >
          <span className="w-[7px] h-[7px] rounded-full" style={{ backgroundColor: config.accent }} />
          <span
            className="text-[11px] tracking-[0.05em] uppercase"
            style={{ color: config.accent, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
          >
            {config.label}
          </span>
        </div>

        {/* Headline */}
        <p
          className="text-[17px] leading-[1.3] text-[#2A2825] mt-1.5"
          style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 500 }}
        >
          {config.headline}
        </p>

        {/* Body copy */}
        <p
          className="text-[12px] leading-[1.5] text-[#6B6660] mt-1 max-w-[320px]"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}
        >
          {config.description}
        </p>

        {/* Wave visualization */}
        <WaveChart state={state} />

        {/* Divider */}
        <div className="h-px bg-[#E8E4DC] my-3" />

        {/* Three metric anchors */}
        <div className="flex items-start">
          {/* HRV */}
          <div className="flex-1 text-center">
            <p className="text-[18px] text-[#2A2825]" style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 700 }}>
              {metrics.hrv}
            </p>
            <p className="text-[10px] tracking-[0.06em] uppercase text-[#6B6660] mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
              HRV
            </p>
            <p className="text-[10px] mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, color: metrics.hrvDown ? "#C4785A" : "#5C8A6E" }}>
              {metrics.hrvDelta}
            </p>
          </div>

          {/* Separator */}
          <div className="w-px h-[48px] bg-[#E8E4DC] self-center" />

          {/* Sleep */}
          <div className="flex-1 text-center">
            <p className="text-[18px] text-[#2A2825]" style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 700 }}>
              {metrics.sleep}
            </p>
            <p className="text-[10px] tracking-[0.06em] uppercase text-[#6B6660] mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
              SLEEP
            </p>
            <p className="text-[10px] mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, color: metrics.sleepDown ? "#C4785A" : "#5C8A6E" }}>
              {metrics.sleepDelta}
            </p>
          </div>

          {/* Separator */}
          <div className="w-px h-[48px] bg-[#E8E4DC] self-center" />

          {/* Phase */}
          <div className="flex-1 text-center">
            <p className="text-[18px]" style={{ color: config.accent }}>◑</p>
            <p className="text-[10px] tracking-[0.06em] uppercase text-[#6B6660] mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
              PHASE
            </p>
            <p className="text-[10px] text-[#6B6660] mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>
              {metrics.phase}
            </p>
            <p className="text-[10px] text-[#B5B0AA]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>
              {metrics.phaseDay}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── What's Contributing section ────────────────────────────────────

function ContributingSection({ signals, state }: { signals: ContributingSignal[]; state: CapacityState }) {
  const navigate = useNavigate();

  const synthesizedInsight =
    state === "aligned"
      ? "All signals are within your normal range — your nervous system is well-regulated."
      : state === "drifting"
      ? "Sleep and HRV are both running below your usual baseline."
      : "Multiple signals are declining together — this pattern often precedes a crash.";

  // Map statusType to text color (no background pill)
  const statusTextColor: Record<string, string> = {
    warning: "#A67C37",
    danger: "#C4453E",
    neutral: "#8A8680",
    good: "#4A7C59",
  };

  return (
    <div className="mb-6">
      <p
        className="text-[11px] leading-[16.5px] tracking-[0.275px] uppercase text-[#6B6660] mb-2.5"
        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontVariationSettings: "'opsz' 14" }}
      >
        What's Contributing
      </p>

      {/* Card */}
      <div
        className="relative rounded-[22px] overflow-hidden bg-white"
        style={{
          border: "1px solid rgba(45,42,38,0.08)",
          boxShadow: "0px 2px 16px 0px rgba(0,0,0,0.04)",
        }}
      >
        {/* Top section — insight text */}
        <div className="px-5 pt-5 pb-4">
          <p
            className="text-[14px] leading-[20px] text-[#2A2825]"
            style={{ fontFamily: "'IBM Plex Serif', serif", fontWeight: 500 }}
          >
            {synthesizedInsight}
          </p>
        </div>

        {/* Signal rows */}
        <div className="px-5">
          {signals.map((signal) => (
            <div key={signal.name}>
              <div className="h-px" style={{ backgroundColor: "rgba(45,42,38,0.06)" }} />
              <div className="flex items-center gap-3 py-[15px]">
                {/* Dot */}
                <span className="w-[10px] h-[10px] rounded-full shrink-0" style={{ backgroundColor: signal.dotColor }} />
                {/* Name */}
                <span
                  className="text-[15px] leading-[22px] text-[#2A2825] whitespace-nowrap"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontVariationSettings: "'opsz' 14" }}
                >
                  {signal.name}
                </span>
                {/* Sparkline — fills remaining space */}
                <div className="flex-1 flex justify-center">
                  <Sparkline data={signal.sparkline} color={signal.dotColor} width={72} height={28} />
                </div>
                {/* Status text (no pill) */}
                <span
                  className="text-[13px] leading-[18px] shrink-0"
                  style={{
                    color: statusTextColor[signal.statusType] || "#8A8680",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontVariationSettings: "'opsz' 14",
                  }}
                >
                  {signal.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Ask Rhythm button */}
        <div className="px-5 pb-5 pt-2">
          <button
            onClick={() => navigate("/chat")}
            className="w-full flex items-center justify-center gap-2 py-[14px] rounded-2xl transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#C4785A" }}
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 20 20" fill="none">
              <path d={askRhythmSvg.pfe10000} fill="white" />
              <path d={askRhythmSvg.p3b1cd030} fill="white" />
            </svg>
            <span
              className="text-[15px] leading-[18px] text-white"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
            >
              Ask Rhythm
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Week ahead / Suggestion / Energy (unchanged) ───────────────────

function WeekAheadCard({ item }: { item: (typeof weekAhead)[0] }) {
  return (
    <div className="flex-1 relative bg-white rounded-2xl min-h-[142px]">
      <div className="absolute inset-0 rounded-2xl border border-[rgba(45,42,38,0.08)] pointer-events-none" />
      <div className="p-4 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between">
          <p className="text-[13px] leading-[16.25px] text-[#2D2A26] max-w-[56px]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontVariationSettings: "'opsz' 9" }}>
            {item.labelSingle}
          </p>
          <span className="text-[11px] leading-[16.5px] text-[#292929] bg-[#F0EBE5] px-2 py-[3px] rounded" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontVariationSettings: "'opsz' 9" }}>
            {item.date}
          </span>
        </div>
        <div>
          <p className="text-[28px] leading-[42px]" style={{ fontFamily: "'IBM Plex Serif', serif", color: item.color }}>
            {item.value}
          </p>
          <p className="text-[11px] leading-[16.5px] text-[#8A8680]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontVariationSettings: "'opsz' 9" }}>
            {item.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function TodaySuggestion() {
  return (
    <div className="relative rounded-2xl" style={{ backgroundColor: "rgba(201,123,107,0.12)" }}>
      <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ border: "0.5px solid rgba(201,123,107,0.2)" }} />
      <div className="px-5 py-5">
        <p className="text-[11px] leading-[16.5px] tracking-[0.275px] uppercase text-[#C97B6B] mb-3" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontVariationSettings: "'opsz' 9" }}>
          Today's Suggestion
        </p>
        <p className="text-[13px] leading-[21px] text-[#3a3a3a] max-w-[320px] mb-5" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontVariationSettings: "'opsz' 14" }}>
          Consider moving your high-intensity workout to tomorrow — your recovery signal is lower than your usual Sunday.
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[12px] leading-[18px] text-[#8A8680]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontVariationSettings: "'opsz' 9" }}>
            Based on HRV + sleep + phase
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
        <p className="text-[14px] leading-[21px] text-[#2D2A26] mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontVariationSettings: "'opsz' 14" }}>
          How's your energy?
        </p>
        <p className="text-[12px] leading-[18px] text-[#8A8680] mb-3" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontVariationSettings: "'opsz' 9" }}>
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
  const capacityState = computeCapacityState(contributingSignals);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[13px] leading-[19.5px] text-[#8A8680] mb-0" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontVariationSettings: "'opsz' 9" }}>
            Sunday, March 1
          </p>
          <p className="text-[24px] leading-[36px] text-[#2D2A26]" style={{ fontFamily: "'IBM Plex Serif', serif" }}>
            Good morning, Aria
          </p>
        </div>
        <button className="relative w-10 h-10 rounded-full bg-white border border-[rgba(45,42,38,0.08)] flex items-center justify-center">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C97B6B] rounded-full" />
        </button>
      </div>

      {/* Capacity Card */}
      <div className="mb-6">
        <CapacityCard state={capacityState} />
      </div>

      {/* What's Contributing */}
      <ContributingSection signals={contributingSignals} state={capacityState} />

      {/* Week Ahead */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] leading-[16.5px] tracking-[0.275px] uppercase text-[#1e1e1e]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontVariationSettings: "'opsz' 14" }}>
            Week Ahead
          </p>
          <button className="flex items-center text-[11px] leading-[16.5px] tracking-[0.275px] uppercase text-[#1e1e1e] hover:text-[#2D2A26] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontVariationSettings: "'opsz' 14" }}>
            See all <ChevronRightIcon className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
        <div className="flex gap-3">
          {weekAhead.map((item) => (
            <WeekAheadCard key={item.labelSingle} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}