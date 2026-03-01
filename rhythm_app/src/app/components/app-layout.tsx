import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import svgPaths from "../../imports/nav-icons-svg-paths";

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

function CheckInIcon({ active }: { active: boolean }) {
  const color = active ? "#8B6E5A" : "#8A8680";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 4V16" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.666" />
      <path d="M4 10H16" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.666" />
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

// ── Nav item config ────────────────────────────────────────────────

const navItems = [
  { path: "/", label: "Home", Icon: HomeIcon },
  { path: "/chat", label: "Chat", Icon: ChatIcon },
  { path: "/checkin", label: "Check In", Icon: CheckInIcon },
  { path: "/insights", label: "Insights", Icon: InsightsIcon },
  { path: "/signals", label: "Profile", Icon: ProfileIcon },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    const isFormField = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName.toLowerCase();
      return tag === "input" || tag === "textarea" || el.isContentEditable;
    };
    const isMobile = () =>
      typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia("(max-width: 767px)").matches
        : false;

    const handleFocusIn = (event: FocusEvent) => {
      if (isMobile() && isFormField(event.target)) {
        setIsInputFocused(true);
      }
    };

    const handleFocusOut = () => {
      window.setTimeout(() => {
        setIsInputFocused(isMobile() && isFormField(document.activeElement));
      }, 0);
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const hideBottomNav = isInputFocused;

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F5]">
      <div className="h-[100dvh] overflow-y-auto pb-[calc(64px+env(safe-area-inset-bottom)+12px)]">
        <Outlet />
      </div>

      {/* Bottom navigation */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white transition-transform duration-200 ${
          hideBottomNav ? "translate-y-full pointer-events-none" : "translate-y-0"
        }`}
        style={{ borderTop: "0.612px solid rgba(45,42,38,0.08)" }}
      >
        <div className="flex items-center justify-around px-[6px] max-w-lg mx-auto pb-[env(safe-area-inset-bottom)]">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-[2px] py-[10px] px-2"
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
    </div>
  );
}
