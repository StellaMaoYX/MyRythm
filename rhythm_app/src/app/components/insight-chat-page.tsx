import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { Send, Sparkles, ChevronLeft, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { insightCards, heartRateData, sleepData, temperatureData, activityData } from "./mock-data";
import { postCoachChat } from "../lib/api";
import { loadSessionState } from "../lib/sessionStore";

// ── Insight-specific AI conversation data ──────────────────────────

interface InsightConvoData {
  explanation: string;
  dataLabel: string;
  chartData: { day: string; baseline: number; current: number }[];
  chartUnit: string;
  followUp: string;
  quickSuggestion: string;
}

const insightConversations: Record<number, InsightConvoData> = {
  1: {
    explanation:
      "Over the past 3 months, I tracked your HRV nightly and mapped it against your cycle phases. During your follicular phase (days 6–13), your average HRV sits around 48ms. Once you enter luteal phase, it consistently drops to 38–42ms — that's about a 15–20% decline.\n\nThis isn't random. Progesterone rises after ovulation and increases your sympathetic nervous system tone, which directly lowers HRV. Your body is doing exactly what it should — the pattern is strong and reliable across 5 of your last 6 cycles.",
    dataLabel: "HRV: Baseline vs Current Cycle",
    chartData: heartRateData.weekly.map((d) => ({
      day: d.day,
      baseline: 46,
      current: d.hrv,
    })),
    chartUnit: "ms",
    followUp:
      "Knowing this, your current HRV of 42ms is actually right where I'd expect you to be on cycle day 18. Is there anything you'd like to do to support your nervous system during this phase?",
    quickSuggestion:
      "I noticed your calendar has back-to-back meetings from 10am–2pm today. Since your recovery capacity is lower right now, try taking a 5-minute walk between your 11:30 and 12pm calls. Even brief movement resets the sympathetic load that builds during focused work. Your HRV usually responds well to these micro-breaks.",
  },
  2: {
    explanation:
      "I compared your deep sleep data against your next-day energy check-ins over the past 2 months. The pattern is clear: when you get more than 1.8 hours of deep sleep, you report 'Energized' or 'Content' moods about 72% of the time. When deep sleep drops below 1.4 hours, you check in as 'Tired' or 'Low energy' about 65% of the time.\n\nDeep sleep is when your body does most of its physical and cognitive restoration. The quality of those hours matters more than total sleep time.",
    dataLabel: "Deep Sleep: Baseline vs This Week",
    chartData: sleepData.weekly.map((d) => ({
      day: d.day,
      baseline: 1.8,
      current: d.deep,
    })),
    chartUnit: "hrs",
    followUp:
      "Your deep sleep has been averaging 1.7h this week — just slightly below your sweet spot. Small adjustments can make a difference. Would you like some ideas for tonight?",
    quickSuggestion:
      "Tonight, try avoiding screens 45 minutes before bed and keep your room a bit cooler — around 65–67°F. Your data shows these conditions correlate with your best deep sleep nights. Also, avoiding caffeine after 2pm has been linked to a 20% improvement in your deep sleep duration over the past month.",
  },
  3: {
    explanation:
      "I've been tracking your wrist temperature alongside your cycle data for the past 6 cycles. In 5 of those 6 cycles, your temperature started rising 0.2–0.4°C about 3 days before your period began. This happens because progesterone drops right before menstruation, which shifts your body's thermoregulation.\n\nRight now your temperature has been at +0.3°C above baseline for 2 days, which fits the pattern. Based on this, I'd estimate your period starting around March 11th.",
    dataLabel: "Wrist Temperature: Baseline vs Current",
    chartData: temperatureData.weekly.map((d) => ({
      day: d.day,
      baseline: 36.6,
      current: d.temp,
    })),
    chartUnit: "°C",
    followUp:
      "This temperature signal is one of your most reliable predictors. Would you like to prepare for the upcoming transition in any way?",
    quickSuggestion:
      "Since your period is likely 3 days out, this might be a good window to stock up on comfort items and lighten your schedule on March 11–12 if possible. Your previous cycles show day 1–2 tend to be your heaviest, and you've reported lower energy those days. Building in a bit of buffer now can make that transition feel easier.",
  },
  4: {
    explanation:
      "Looking at your check-in data alongside your step count, there's a clear relationship. On days when you hit 8,000+ steps, you check in as 'Calm' or 'Energized' about 60% of the time. On lower-activity days (under 5,000 steps), those positive moods drop to about 25%.\n\nThis holds even during your luteal phase, when your baseline mood and energy typically dip. Movement doesn't erase the hormonal effects, but it seems to buffer them — the dip is smaller on active days.",
    dataLabel: "Steps: Baseline vs This Week",
    chartData: activityData.weekly.map((d) => ({
      day: d.day,
      baseline: 8000,
      current: d.steps,
    })),
    chartUnit: "steps",
    followUp:
      "You're at 8,432 steps today, which is right at the threshold. Even a short walk later could push you into that positive zone. Would you like a suggestion, or do you want to decide for yourself?",
    quickSuggestion:
      "Your afternoon is fairly open between 3–4pm. A 20-minute walk outside would comfortably get you past 9,000 steps. Based on your data, that's the range where the mood benefit is strongest. Even a 10-minute walk around the block can help — it doesn't need to be a workout.",
  },
};

const mockCalendarEventsByDate: Record<string, string[]> = {
  "2026-03-01": [
    "08:30 Morning planning",
    "10:00 Project sync",
    "11:30 Deep work block (feature implementation)",
    "13:00 Lunch with teammate",
    "15:00 Presentation prep",
    "17:30 Gym session",
    "20:00 Wind-down / reading",
  ],
  "2026-03-02": [
    "09:00 Standup",
    "10:30 User interview",
    "12:00 Lunch break",
    "14:00 Product review",
    "16:30 Focus sprint",
    "19:00 Dinner with friends",
  ],
  "2026-03-03": [
    "08:00 Weekly planning",
    "09:30 Cross-team sync",
    "12:30 Walk + recovery",
    "14:00 Demo rehearsal",
    "16:00 1:1 mentor check-in",
    "21:30 Early sleep target",
  ],
};

// ── Types ──────────────────────────────────────────────────────────

type ConvoPhase = "initial" | "explained" | "asked" | "chose-suggestion" | "chose-self" | "done";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  showChart?: boolean;
  buttons?: { label: string; action: string }[];
}

// ── Mini chart for inline display ──────────────────────────────────

function InlineChart({
  data,
  label,
  unit,
}: {
  data: { day: string; baseline: number; current: number }[];
  label: string;
  unit: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mt-3 bg-[#F5F2EE] rounded-xl overflow-hidden">
      <button
        onClick={() => setVisible(!visible)}
        className="w-full flex items-center justify-between px-3 py-2.5"
      >
        <span
          className="text-[12px] text-[#2D2A26]"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
        >
          {label}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#8A8680] transition-transform ${visible ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3">
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,42,38,0.06)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#8A8680" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid rgba(45,42,38,0.08)", borderRadius: "8px", fontSize: "11px" }}
                    formatter={(value: number) => [`${value} ${unit}`, ""]}
                  />
                  <Line type="monotone" dataKey="baseline" stroke="#8A8680" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Baseline" />
                  <Line type="monotone" dataKey="current" stroke="#8B6E5A" strokeWidth={2} dot={{ fill: "#8B6E5A", r: 2.5 }} name="Current" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-0 border-t border-dashed border-[#8A8680]" />
                  <span className="text-[10px] text-[#8A8680]">Baseline</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-0 border-t-2 border-[#8B6E5A]" />
                  <span className="text-[10px] text-[#8A8680]">Current</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────

export function InsightChatPage() {
  const { insightId } = useParams();
  const navigate = useNavigate();
  const id = Number(insightId);
  const card = insightCards.find((c) => c.id === id);
  const convoData = insightConversations[id];

  const [messages, setMessages] = useState<Message[]>([]);
  const [phase, setPhase] = useState<ConvoPhase>("initial");
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  }, []);

  const addTypingResponse = useCallback(
    (msg: Omit<Message, "id">, delay: number, callback?: () => void) => {
      setIsTyping(true);
      scrollToBottom();
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { ...msg, id: prev.length + 1 }]);
        scrollToBottom();
        callback?.();
      }, delay);
    },
    [scrollToBottom]
  );

  useEffect(() => {
    const isMobile = () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(max-width: 767px)").matches;

    const updateKeyboardInset = () => {
      if (!isMobile() || !isInputFocused || typeof window === "undefined" || !window.visualViewport) {
        setKeyboardInset(0);
        return;
      }
      const vv = window.visualViewport;
      const inset = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));
      setKeyboardInset(inset);
    };

    const isFormField = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName.toLowerCase();
      return tag === "input" || tag === "textarea" || el.isContentEditable;
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (isMobile() && isFormField(event.target)) {
        setIsInputFocused(true);
      }
    };

    const handleFocusOut = () => {
      window.setTimeout(() => {
        const active = document.activeElement;
        setIsInputFocused(isMobile() && isFormField(active));
      }, 0);
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    window.visualViewport?.addEventListener("resize", updateKeyboardInset);
    window.visualViewport?.addEventListener("scroll", updateKeyboardInset);
    updateKeyboardInset();

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      window.visualViewport?.removeEventListener("resize", updateKeyboardInset);
      window.visualViewport?.removeEventListener("scroll", updateKeyboardInset);
    };
  }, [isInputFocused]);

  // Auto-start conversation
  useEffect(() => {
    if (!card || !convoData || phase !== "initial") return;

    const userMsg: Message = { id: 1, role: "user", content: "Tell me more how this insight is formed" };
    setMessages([userMsg]);
    // Show assistant typing bubble immediately on page load.
    setIsTyping(true);

    const run = async () => {
      const session = loadSessionState();
      if (!session?.checkin || !session?.prediction) {
        throw new Error("No session check-in/prediction found. Please submit Check-in first.");
      }
      const coach = await postCoachChat({
        user_id: session.userId,
        date: session.date,
        checkin: session.checkin,
        prediction: session.prediction,
        calendar_events:
          mockCalendarEventsByDate[session.date] ?? [
            "09:00 Standup",
            "11:00 Work session",
            "14:00 Project meeting",
            "18:00 Personal time",
          ],
        message: "Tell me more how this insight is formed",
        chat_history: [],
      });
      addTypingResponse(
        {
          role: "assistant",
          content: `${coach.explanation}\n\n${coach.anticipation}`,
          showChart: true,
        },
        1200,
        () => {
          addTypingResponse(
            {
              role: "assistant",
              content: coach.assistant_reply,
              buttons: [
                { label: coach.prepare_suggestion[0] || "Give me a quick suggestion", action: "suggestion" },
                { label: "I'll figure it out myself", action: "self" },
              ],
            },
            900,
            () => setPhase("asked")
          );
        }
      );
      setPhase("explained");
    };

    run().catch((err) => {
      setBackendError(err instanceof Error ? err.message : "Failed to call backend coach.");
      // Fallback to local mock convo.
      addTypingResponse(
        {
          role: "assistant",
          content: convoData.explanation,
          showChart: true,
        },
        1200,
        () => {
          addTypingResponse(
            {
              role: "assistant",
              content: convoData.followUp,
              buttons: [
                { label: "Give me a quick suggestion", action: "suggestion" },
                { label: "I'll figure it out myself", action: "self" },
              ],
            },
            900,
            () => setPhase("asked")
          );
        }
      );
      setPhase("explained");
    });
  }, [card, convoData, phase, addTypingResponse]);

  const handleButtonAction = (action: string) => {
    if (action === "suggestion") {
      handleSendMessage("Give me a quick suggestion for today.");
      return;
    }
    if (action === "self") {
      handleSendMessage("I'd like to choose my own plan. Help me think it through briefly.");
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    const prompt = text.trim();
    setMessages((prev) => [...prev, { id: prev.length + 1, role: "user", content: prompt }]);
    setInput("");
    setIsTyping(true);
    setBackendError(null);

    try {
      const session = loadSessionState();
      if (!session?.checkin || !session?.prediction) {
        throw new Error("No session check-in/prediction found. Please submit Check-in first.");
      }
      const coach = await postCoachChat({
        user_id: session.userId,
        date: session.date,
        checkin: session.checkin,
        prediction: session.prediction,
        calendar_events:
          mockCalendarEventsByDate[session.date] ?? [
            "09:00 Standup",
            "11:00 Work session",
            "14:00 Project meeting",
            "18:00 Personal time",
          ],
        message: prompt,
        chat_history: messages.map((m) => ({ role: m.role, content: m.content })),
      });
      const response = (coach.assistant_reply || "").trim() || coach.explanation;
      setMessages((prev) => [...prev, { id: prev.length + 1, role: "assistant", content: response }]);
      setIsTyping(false);
      return;
    } catch (err) {
      setBackendError(err instanceof Error ? err.message : "Backend unavailable.");
    }

    // Fallback response when backend is unavailable.
    addTypingResponse(
      {
        role: "assistant",
        content: "I couldn't reach the live model just now. Try again in a moment, and I'll continue from your latest rhythm context.",
      },
      800
    );
  };

  const handleSaveJournal = () => {
    if (!journalEntry.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, role: "user", content: journalEntry.trim() },
    ]);
    setJournalEntry("");
    addTypingResponse(
      {
        role: "assistant",
        content:
          "Noted! I've saved this to your rhythm journal. We'll check back on it next week. You've got this.",
      },
      1200
    );
  };

  if (!card || !convoData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#8A8680]">Insight not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F5]">
      <div className="flex flex-col h-[100dvh] max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[rgba(45,42,38,0.08)] bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/insights")}
            className="w-8 h-8 rounded-full bg-[#F0EBE5] flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4 text-[#2D2A26]" />
          </button>
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-9 h-9 rounded-full bg-[#8B6E5A]/10 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-[#8B6E5A]" />
            </div>
            <div>
              <p
                className="text-[15px] text-[#2D2A26]"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
              >
                Rhythm AI
              </p>
              <p
                className="text-[11px] text-[#8A8680]"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}
              >
                {card.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 pb-[calc(96px+env(safe-area-inset-bottom))] space-y-3"
      >
        {backendError && (
          <div className="bg-[#FDF8E7] border border-[#FFE0B2] rounded-xl px-3 py-2 text-[12px] text-[#A67C37]">
            Backend unavailable. Showing fallback response. ({backendError})
          </div>
        )}
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-[#8B6E5A] text-white rounded-br-md"
                  : "bg-white border border-[rgba(45,42,38,0.08)] text-[#2D2A26] rounded-bl-md"
              }`}
            >
              <p
                className="text-[13px] leading-[21px] whitespace-pre-line"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontVariationSettings: "'opsz' 9",
                }}
              >
                {msg.content}
              </p>

              {/* Inline chart toggle */}
              {msg.showChart && (
                <InlineChart
                  data={convoData.chartData}
                  label={convoData.dataLabel}
                  unit={convoData.chartUnit}
                />
              )}

              {/* Preset buttons */}
              {msg.buttons && phase === "asked" && (
                <div className="flex flex-col gap-2 mt-3">
                  {msg.buttons.map((btn) => (
                    <button
                      key={btn.action}
                      onClick={() => handleButtonAction(btn.action)}
                      className={`text-left text-[13px] px-4 py-2.5 rounded-xl transition-colors ${
                        btn.action === "suggestion"
                          ? "bg-[#4A7C59] text-white hover:bg-[#3d6a4b]"
                          : "bg-[#F0EBE5] text-[#2D2A26] hover:bg-[#E8DFD5]"
                      }`}
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 500,
                        fontVariationSettings: "'opsz' 14",
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white border border-[rgba(45,42,38,0.08)] rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#8A8680]/40 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-[#8A8680]/40 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-[#8A8680]/40 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Journal entry for "I'll figure it out myself" path */}
        {phase === "done" && messages.some((m) => m.content === "I'll figure it out myself") && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pt-1">
            <div className="bg-white rounded-2xl border border-[rgba(45,42,38,0.08)] p-4">
              <p
                className="text-[13px] text-[#2D2A26] mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
              >
                Your action note
              </p>
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="What would you like to try?"
                className="w-full bg-[#F5F2EE] rounded-xl p-3 text-[13px] text-[#2D2A26] placeholder:text-[#8A8680] outline-none resize-none h-20 mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}
              />
              <button
                onClick={handleSaveJournal}
                disabled={!journalEntry.trim()}
                className="w-full py-2.5 rounded-xl bg-[#8B6E5A] text-white disabled:opacity-40 transition-opacity text-[13px]"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
              >
                Save to rhythm journal
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div
        className="fixed left-0 right-0 z-40 border-t border-[rgba(45,42,38,0.08)] bg-white"
        style={{ bottom: keyboardInset }}
      >
        <div className="max-w-lg mx-auto p-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-2 bg-[#F5F2EE] rounded-full px-4 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-[14px] text-[#2D2A26] placeholder:text-[#8A8680]"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}
            />
            <button
              onClick={() => handleSendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="w-8 h-8 rounded-full bg-[#8B6E5A] flex items-center justify-center disabled:opacity-40 transition-opacity"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
