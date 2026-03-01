import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Send, Sparkles, ArrowDown, ArrowLeft, Plus } from "lucide-react";
import { motion } from "motion/react";
import { postCoachChat, type CoachResponse } from "../lib/api";
import { loadSessionState } from "../lib/sessionStore";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const threadPrompts: Record<string, { title: string; starter: string }> = {
  "recovery-load": {
    title: "Recovery load is higher than usual",
    starter: "Give me today's full rhythm summary with key risks and what I should prioritize.",
  },
  "sleep-pattern": {
    title: "Sleep architecture shifting",
    starter: "Analyze my recent sleep pattern and explain what changed and why.",
  },
  "period-prediction": {
    title: "Period prediction update",
    starter: "Give me my current cycle and period prediction update with confidence.",
  },
  "hrv-cycle-pattern": {
    title: "Your HRV follows your cycle",
    starter: "Explain how my HRV is tracking against my cycle baseline right now.",
  },
  "movement-mood": {
    title: "Movement supports your mood",
    starter: "Explain how my activity patterns may be affecting mood and stress this week.",
  },
};

const fallbackReplies: Record<string, string> = {
  "When is my period expected?": "I couldn't reach the live model right now. Please retry in a moment for the latest personalized prediction.",
  "Why is my HRV dropping?": "I couldn't reach the live model right now. Please retry in a moment and I'll analyze your HRV trend.",
  "How's my sleep this week?": "I couldn't reach the live model right now. Please retry in a moment for your latest sleep analysis.",
  "Am I in my PMS window?": "I couldn't reach the live model right now. Please retry in a moment and I'll check your PMS window from the latest context.",
};

const suggestedQuestions = [
  "When is my period expected?",
  "Why is my HRV dropping?",
  "How's my sleep this week?",
  "Am I in my PMS window?",
];

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

function formatCoachMessage(coach: CoachResponse): string {
  const suggestionLines = (coach.prepare_suggestion || [])
    .slice(0, 3)
    .map((item, idx) => `${idx + 1}. ${item}`)
    .join("\n\n");

  return [
    coach.explanation,
    "",
    coach.anticipation,
    "",
    suggestionLines,
    "",
    coach.assistant_reply,
  ].join("\n");
}

export function ChatConversationPage() {
  const navigate = useNavigate();
  const { threadId } = useParams();
  const threadKey = threadId || "recovery-load";
  const thread = threadPrompts[threadKey] || threadPrompts["recovery-load"];

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [chatSeed, setChatSeed] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const loadIdRef = useRef(0);

  useEffect(() => {
    setMessages([]);
    setBackendError(null);
    setInput("");
    setIsTyping(false);
    setChatSeed(0);
  }, [threadKey]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const runInitialCoachMessage = async () => {
      loadIdRef.current += 1;
      const loadId = loadIdRef.current;
      setIsTyping(true);
      setBackendError(null);
      try {
        const session = loadSessionState();
        if (!session?.checkin || !session?.prediction) {
          throw new Error("No model session found. Submit a Check-in first.");
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
          message: thread.starter,
          chat_history: [],
        });

        if (loadId !== loadIdRef.current) return;
        const response = (coach.assistant_reply || "").trim() || formatCoachMessage(coach);
        setMessages([{ id: 1, role: "assistant", content: response }]);
      } catch (err) {
        if (loadId !== loadIdRef.current) return;
        const errorMessage = err instanceof Error ? err.message : "Backend chat failed";
        setBackendError(errorMessage);
        setMessages([
          {
            id: 1,
            role: "assistant",
            content: "I couldn't reach the live model for the opening summary. Please retry after a fresh Check-in.",
          },
        ]);
      } finally {
        if (loadId !== loadIdRef.current) return;
        setIsTyping(false);
      }
    };

    runInitialCoachMessage();
  }, [thread.starter, chatSeed]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const prompt = text.trim();
    const userMsg: Message = { id: messages.length + 1, role: "user", content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setBackendError(null);

    try {
      const session = loadSessionState();
      if (!session?.checkin || !session?.prediction) {
        throw new Error("No model session found. Submit a Check-in first.");
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

      const response = (coach.assistant_reply || "").trim() || formatCoachMessage(coach);
      const aiMsg: Message = { id: messages.length + 2, role: "assistant", content: response };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      return;
    } catch (err) {
      setBackendError(err instanceof Error ? err.message : "Backend chat failed");
    }

    setTimeout(() => {
      const response =
        fallbackReplies[prompt] ||
        "I couldn't reach the live model just now. Please try again in a moment for a real-time personalized answer.";
      const aiMsg: Message = { id: messages.length + 2, role: "assistant", content: response };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleBack = () => {
    if (threadId) {
      navigate("/chat");
      return;
    }
    navigate("/");
  };

  const handleNewChat = () => {
    if (isTyping) return;
    setMessages([]);
    setInput("");
    setBackendError(null);
    setChatSeed((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto bg-[#FAF8F5]">
      <div className="px-4 pt-4 pb-3 border-b bg-white" style={{ borderColor: "rgba(45,42,38,0.08)" }}>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-full bg-[rgba(45,42,38,0.05)] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[#2D2A26]" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[rgba(139,110,90,0.1)] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#8B6E5A]" />
          </div>
          <div>
            <p className="text-[15px] text-[#2D2A26]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
              Rhythm AI
            </p>
            <p className="text-[11px] text-[#8A8680]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>
              {thread.title}
            </p>
          </div>
          <button
            onClick={handleNewChat}
            disabled={isTyping}
            className="ml-auto h-8 px-2.5 rounded-full bg-[rgba(45,42,38,0.05)] text-[#2D2A26] text-[11px] flex items-center gap-1 disabled:opacity-40"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
          >
            <Plus className="w-3.5 h-3.5" />
            New Chat
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {backendError && (
          <div className="text-[12px] bg-[#FDF8E7] border border-[#FFE0B2] text-[#A67C37] rounded-xl px-3 py-2">
            Live backend unavailable: {backendError}
          </div>
        )}

        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index < 4 ? index * 0.05 : 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === "user" ? "bg-[#8B6E5A] text-white rounded-br-md" : "bg-white border rounded-bl-md"
              }`}
              style={msg.role === "assistant" ? { borderColor: "rgba(45,42,38,0.08)" } : undefined}
            >
              <p
                className="text-[13px] leading-relaxed whitespace-pre-line"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: msg.role === "user" ? "white" : "#2D2A26",
                }}
              >
                {msg.content}
              </p>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white border rounded-2xl rounded-bl-md px-4 py-3" style={{ borderColor: "rgba(45,42,38,0.08)" }}>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#8A8680]/40 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-[#8A8680]/40 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-[#8A8680]/40 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </motion.div>
        )}

        {messages.length <= 2 && !isTyping && (
          <div className="pt-2">
            <p className="text-[11px] text-[#8A8680] mb-2 flex items-center gap-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <ArrowDown className="w-3 h-3" /> Ask me about your rhythm
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[12px] px-3 py-1.5 rounded-full bg-white text-[#2D2A26] hover:bg-[#F0EBE5] transition-colors"
                  style={{ border: "1px solid rgba(45,42,38,0.08)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-white" style={{ borderColor: "rgba(45,42,38,0.08)" }}>
        <div className="flex items-center gap-2 bg-[#F5F2EE] rounded-full px-4 py-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about your patterns..."
            className="flex-1 bg-transparent outline-none text-[14px] text-[#2D2A26] placeholder:text-[#8A8680]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 rounded-full bg-[#8B6E5A] flex items-center justify-center disabled:opacity-40 transition-opacity"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
