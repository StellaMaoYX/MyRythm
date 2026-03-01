import { useState } from "react";
import { useNavigate } from "react-router";
import { TrendingDown, TrendingUp, Minus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  heartRateData,
  sleepData,
  activityData,
  temperatureData,
  insightCards,
} from "./mockData";
import svgPaths from "../../imports/svg-yaadcsgjcs";

// ── Figma SVG Icons for insight cards ──────────────────────────────

function HeartIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 13.9927 13.9927" fill="none">
      <path
        d={svgPaths.p155f6c00}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.166"
      />
    </svg>
  );
}

function MoonIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 13.9927 13.9927" fill="none">
      <path
        d={svgPaths.pd91fe00}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.166"
      />
    </svg>
  );
}

function ThermometerIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 13.9927 13.9927" fill="none">
      <path
        d={svgPaths.p1ef6c00}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.166"
      />
    </svg>
  );
}

function BoltIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 13.9927 13.9927" fill="none">
      <path
        d={svgPaths.p3b973880}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.166"
      />
    </svg>
  );
}

function ChevronDownSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 9.328 5.330" fill="none">
      <path
        d={svgPaths.p3a7099c0}
        stroke="#8A8680"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.333"
      />
    </svg>
  );
}

const insightIcons: Record<string, (color: string) => React.ReactNode> = {
  Pattern: (c) => <HeartIcon color={c} />,
  Correlation: (c) => <MoonIcon color={c} />,
  Prediction: (c) => <ThermometerIcon color={c} />,
};

// Use the bolt icon for the second Correlation card
function getInsightIcon(card: { category: string; color: string; id: number }) {
  if (card.id === 4) return <BoltIcon color={card.color} />;
  const fn = insightIcons[card.category];
  return fn ? fn(card.color) : <HeartIcon color={card.color} />;
}

// ── Chart components ───────────────────────────────────────────────

function MiniTrend({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-[#C97B6B]" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-[#7BA7A0]" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
}

function HeartRateChart() {
  return (
    <div className="bg-white rounded-2xl relative">
      <div className="absolute inset-0 rounded-2xl border border-[rgba(45,42,38,0.08)] pointer-events-none" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[14px] text-[#2D2A26]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Heart Rate & HRV</p>
          <MiniTrend trend="stable" />
        </div>
        <div className="flex gap-4 mb-3">
          <div>
            <span className="text-[22px] text-[#2D2A26]" style={{ fontFamily: "'IBM Plex Serif', serif" }}>{heartRateData.resting}</span>
            <span className="text-[11px] text-[#8A8680] ml-1">bpm resting</span>
          </div>
          <div>
            <span className="text-[22px] text-[#2D2A26]" style={{ fontFamily: "'IBM Plex Serif', serif" }}>{heartRateData.hrv}</span>
            <span className="text-[11px] text-[#8A8680] ml-1">ms HRV</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={heartRateData.weekly}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,42,38,0.06)" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8A8680" }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[30, 80]} />
            <Tooltip contentStyle={{ background: "#fff", border: "1px solid rgba(45,42,38,0.08)", borderRadius: "8px", fontSize: "12px" }} />
            <Line type="monotone" dataKey="rhr" stroke="#C97B6B" strokeWidth={2} dot={{ fill: "#C97B6B", r: 3 }} name="RHR" />
            <Line type="monotone" dataKey="hrv" stroke="#7BA7A0" strokeWidth={2} dot={{ fill: "#7BA7A0", r: 3 }} name="HRV" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SleepChart() {
  return (
    <div className="bg-white rounded-2xl relative">
      <div className="absolute inset-0 rounded-2xl border border-[rgba(45,42,38,0.08)] pointer-events-none" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[14px] text-[#2D2A26]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Sleep Quality</p>
          <MiniTrend trend="up" />
        </div>
        <div className="flex gap-4 mb-3">
          <div>
            <span className="text-[22px] text-[#2D2A26]" style={{ fontFamily: "'IBM Plex Serif', serif" }}>{sleepData.lastNight.total}</span>
            <span className="text-[11px] text-[#8A8680] ml-1">hours</span>
          </div>
          <div>
            <span className="text-[22px] text-[#2D2A26]" style={{ fontFamily: "'IBM Plex Serif', serif" }}>{sleepData.lastNight.score}</span>
            <span className="text-[11px] text-[#8A8680] ml-1">score</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={sleepData.weekly} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,42,38,0.06)" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8A8680" }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[0, 10]} />
            <Tooltip contentStyle={{ background: "#fff", border: "1px solid rgba(45,42,38,0.08)", borderRadius: "8px", fontSize: "12px" }} />
            <Bar dataKey="deep" stackId="sleep" fill="#A3B5D6" name="Deep" />
            <Bar dataKey="rem" stackId="sleep" fill="#D4A7B9" name="REM" />
            <Bar dataKey="total" stackId="sleep" fill="#E8DFD5" radius={[4, 4, 0, 0]} name="Light" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ActivityChart() {
  return (
    <div className="bg-white rounded-2xl relative">
      <div className="absolute inset-0 rounded-2xl border border-[rgba(45,42,38,0.08)] pointer-events-none" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[14px] text-[#2D2A26]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Activity</p>
          <MiniTrend trend="down" />
        </div>
        <div className="flex gap-4 mb-3">
          <div>
            <span className="text-[22px] text-[#2D2A26]" style={{ fontFamily: "'IBM Plex Serif', serif" }}>{activityData.steps.toLocaleString()}</span>
            <span className="text-[11px] text-[#8A8680] ml-1">steps</span>
          </div>
          <div>
            <span className="text-[22px] text-[#2D2A26]" style={{ fontFamily: "'IBM Plex Serif', serif" }}>{activityData.calories}</span>
            <span className="text-[11px] text-[#8A8680] ml-1">kcal</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={activityData.weekly}>
            <defs>
              <linearGradient id="stepsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7BA7A0" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#7BA7A0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,42,38,0.06)" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8A8680" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: "#fff", border: "1px solid rgba(45,42,38,0.08)", borderRadius: "8px", fontSize: "12px" }} />
            <Area type="monotone" dataKey="steps" stroke="#7BA7A0" strokeWidth={2} fill="url(#stepsGrad)" name="Steps" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TemperatureChart() {
  return (
    <div className="bg-white rounded-2xl relative">
      <div className="absolute inset-0 rounded-2xl border border-[rgba(45,42,38,0.08)] pointer-events-none" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[14px] text-[#2D2A26]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Wrist Temperature</p>
          <MiniTrend trend="up" />
        </div>
        <div className="mb-3">
          <span className="text-[22px] text-[#2D2A26]" style={{ fontFamily: "'IBM Plex Serif', serif" }}>+{temperatureData.deviation}°C</span>
          <span className="text-[11px] text-[#8A8680] ml-1">from baseline</span>
        </div>
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart data={temperatureData.weekly}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4A7B9" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#D4A7B9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8A8680" }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[36.3, 37.2]} />
            <Tooltip contentStyle={{ background: "#fff", border: "1px solid rgba(45,42,38,0.08)", borderRadius: "8px", fontSize: "12px" }} formatter={(value: number) => [`${value}°C`, "Temp"]} />
            <Area type="monotone" dataKey="temp" stroke="#D4A7B9" strokeWidth={2} fill="url(#tempGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Pattern Insight Card ───────────────────────────────────────────

function PatternInsightCard({
  card,
  index,
}: {
  card: (typeof insightCards)[0];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white rounded-2xl relative"
    >
      <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ border: "0.636px solid rgba(45,42,38,0.08)" }} />

      {/* Collapsed row — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-4 text-left"
      >
        {/* Icon circle */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: card.color + "17" }}
        >
          {getInsightIcon(card)}
        </div>

        {/* Tag + header */}
        <div className="flex-1 min-w-0">
          <span
            className="inline-block text-[10px] leading-[15px] px-2 py-[2px] rounded-full mb-[2px]"
            style={{
              backgroundColor: card.color + "14",
              color: card.color,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            {card.category}
          </span>
          <p
            className="text-[13px] leading-[17.875px] text-[#2D2A26]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            {card.title}
          </p>
        </div>

        {/* Chevron */}
        <div className={`shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}>
          <ChevronDownSvg />
        </div>
      </button>

      {/* Expanded section */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <p
                className="text-[13px] leading-[21px] text-[#8A8680] mb-4"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontVariationSettings: "'opsz' 9",
                }}
              >
                {card.description}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/chat/insight/${card.id}`);
                }}
                className="inline-flex items-center gap-2 bg-[#4A7C59] text-white rounded-full px-5 py-2.5 hover:bg-[#3d6a4b] transition-colors"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: "13px",
                  fontVariationSettings: "'opsz' 14",
                }}
              >
                Get my rhythm
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────

export function InsightsPage() {
  const [activeSection, setActiveSection] = useState<"insights" | "charts">("insights");

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-6">
      {/* Header */}
      <div className="mb-5">
        <p
          className="text-[24px] leading-[36px] text-[#2D2A26]"
          style={{ fontFamily: "'IBM Plex Serif', serif" }}
        >
          Insights
        </p>
        <p
          className="text-[13px] leading-[19.5px] text-[#8A8680] mt-0.5"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontVariationSettings: "'opsz' 9",
          }}
        >
          Your bio-signals, visualized and synthesized
        </p>
      </div>

      {/* Toggle — Pattern Insights first */}
      <div className="bg-[#F0EBE5] rounded-2xl p-1 flex gap-1 mb-5">
        <button
          onClick={() => setActiveSection("insights")}
          className={`flex-1 py-2 rounded-xl text-[13px] transition-all ${
            activeSection === "insights"
              ? "bg-white text-[#2D2A26] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.1)]"
              : "text-[#8A8680]"
          }`}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontVariationSettings: "'opsz' 14",
          }}
        >
          Pattern Insights
        </button>
        <button
          onClick={() => setActiveSection("charts")}
          className={`flex-1 py-2 rounded-xl text-[13px] transition-all ${
            activeSection === "charts"
              ? "bg-white text-[#2D2A26] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.1)]"
              : "text-[#8A8680]"
          }`}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontVariationSettings: "'opsz' 14",
          }}
        >
          Charts
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeSection === "insights" ? (
          <motion.div
            key="insights"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2.5"
          >
            {insightCards.map((card, index) => (
              <PatternInsightCard key={card.id} card={card} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="charts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <HeartRateChart />
            <SleepChart />
            <ActivityChart />
            <TemperatureChart />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}