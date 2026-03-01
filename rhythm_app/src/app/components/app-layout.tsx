import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import svgPaths from "../../imports/svg-ndbywbamvi";
import { postCheckin, postPredictDaily } from "../lib/api";
import { saveSessionState } from "../lib/sessionStore";
import { activityData, heartRateData, sleepData, temperatureData } from "./mock-data";
import { CheckInSheet, type SelectedEmotion } from "./check-in-sheet";

// ── Nav SVG Icons (from Figma) ─────────────────────────────────────

function HomeIcon({ active }: { active: boolean }) {
  const color = active ? "#8B6E5A" : "#8A8680";
  return (
    <svg width="20" height="20" viewBox="0 0 19.9964 19.9964" fill="none">
      <path d={svgPaths.p382dfa80} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.666" />
      <path d={svgPaths.p161bb3c0} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.666" />
    </svg>
  );
}

function ChatIcon({ active }: { active: boolean }) {
  const color = active ? "#8B6E5A" : "#8A8680";
  return (
    <svg width="20" height="20" viewBox="0 0 19.9964 19.9964" fill="none">
      <path d={svgPaths.p2f35b900} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.666" />
    </svg>
  );
}

function InsightsIcon({ active }: { active: boolean }) {
  const color = active ? "#8B6E5A" : "#8A8680";
  return (
    <svg width="20" height="20" viewBox="0 0 19.9964 19.9964" fill="none">
      <path d={svgPaths.p30afd550} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.666" />
      <path d="M14.9973 14.1641V7.49863" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.666" />
      <path d="M10.8314 14.1641V4.16591" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.666" />
      <path d="M6.66545 14.1641V11.6645" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.666" />
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  const color = active ? "#8B6E5A" : "#8A8680";
  return (
    <svg width="20" height="20" viewBox="0 0 19.9964 19.9964" fill="none">
      <path d={svgPaths.p116f5500} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.666" />
      <path d={svgPaths.p15824f00} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.666" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 4V16" stroke="#8B6E5A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M4 10H16" stroke="#8B6E5A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

// ── Nav item config ────────────────────────────────────────────────

const navItems = [
  { path: "/", label: "Home", Icon: HomeIcon },
  { path: "/chat", label: "Chat", Icon: ChatIcon },
  { path: "/insights", label: "Insights", Icon: InsightsIcon },
  { path: "/signals", label: "Profile", Icon: ProfileIcon },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [checkInOpen, setCheckInOpen] = useState(false);

  const handleCheckInSubmit = async (emotions: SelectedEmotion[], note: string) => {
    const userId = "u_demo";
    const date = new Date().toISOString().slice(0, 10);
    const moodText = emotions.map((e) => `${e.emoji} ${e.label} (${e.intensity ?? "unknown"})`).join(", ");

    const iwatchFeatures = {
      hr_mean: heartRateData.current,
      hr_std: 7,
      hrv_mean: heartRateData.hrv,
      wrist_temp: temperatureData.current,
      steps: activityData.steps,
      sleep_hours: sleepData.lastNight.total,
      resting_hr: heartRateData.resting,
      respiratory_rate: 15,
    };

    const checkin = await postCheckin({
      user_id: userId,
      date,
      mood_text: moodText,
      life_event_text: note || "",
      life_events: [],
    });

    const daily = await postPredictDaily({
      user_id: userId,
      date,
      use_personal: true,
      predict_mood: true,
      global_weight: 0.7,
      checkin,
      iwatch_features: iwatchFeatures,
    });

    saveSessionState({
      userId,
      date,
      checkin,
      prediction: daily.prediction,
    });
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F5]">
      <div className="h-[100dvh] overflow-y-auto pb-[calc(72px+env(safe-area-inset-bottom)+16px)]">
        <Outlet />
      </div>

      {/* Bottom navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white"
        style={{ borderTop: "0.612px solid rgba(45,42,38,0.08)" }}
      >
        <div className="flex items-center justify-between px-[10px] max-w-lg mx-auto pb-[env(safe-area-inset-bottom)]">
          {/* Left 2 nav items */}
          {navItems.slice(0, 2).map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-[2px] py-[10px] px-3"
              >
                <item.Icon active={active} />
                <span
                  className="text-[10px] leading-[15px]"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontVariationSettings: "'opsz' 14",
                    color: active ? "#8B6E5A" : "#8A8680",
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Center floating "+" button */}
          <div className="relative flex items-center justify-center" style={{ width: 46, height: 57 }}>
            <button
              onClick={() => setCheckInOpen(true)}
              className="absolute -top-[18px] w-[46px] h-[47px] bg-white rounded-full flex items-center justify-center"
              style={{
                boxShadow: "0px 4px 4px rgba(145,145,145,0.25)",
              }}
            >
              <PlusIcon />
            </button>
          </div>

          {/* Right 2 nav items */}
          {navItems.slice(2, 4).map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-[2px] py-[10px] px-3"
              >
                <item.Icon active={active} />
                <span
                  className="text-[10px] leading-[15px]"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontVariationSettings: "'opsz' 14",
                    color: active ? "#8B6E5A" : "#8A8680",
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Check-in bottom sheet */}
      <CheckInSheet
        open={checkInOpen}
        onClose={() => setCheckInOpen(false)}
        onSubmit={handleCheckInSubmit}
      />
    </div>
  );
}
