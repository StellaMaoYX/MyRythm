import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { postCoachChat, type CoachResponse } from "../lib/api";
import { loadSessionState } from "../lib/sessionStore";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "When is my period expected?",
  "Why is my HRV dropping?",
  "How's my sleep this week?",
  "Am I in my PMS window?",
];

const aiResponses: Record<string, string> = {
  "When is my period expected?":
    "Based on your current cycle data and bio-signal patterns, I estimate your next period will start around March 11th. Your wrist temperature has risen +0.3°C and HRV has been declining — both consistent with your typical late-luteal pattern. You're currently on day 18 of a 28-day cycle.",
  "Why is my HRV dropping?":
    "Your HRV has decreased from 48ms to 38ms over the past 5 days. This 21% decline is consistent with what I've observed in your previous luteal phases. Rising progesterone levels typically increase sympathetic nervous system activity, which lowers HRV. This is normal for your pattern — it usually recovers within 2-3 days of your period starting.",
  "How's my sleep this week?":
    "This week has been mixed. Your best night was Saturday (8.1h, score 92) with excellent deep sleep. Friday was your lowest (6.2h, score 68). Overall, your deep sleep has averaged 1.7h — slightly below your 3-month average of 1.8h. The decline in deep sleep correlates with the luteal phase pattern I've seen in your data. Consider limiting screen time and caffeine after 2pm this week.",
  "Am I in my PMS window?":
    "Not quite yet, but you're approaching it. Based on your history, your PMS symptoms typically emerge around cycle days 25-28. You're currently on day 18. However, your bio-signals are already shifting — elevated RHR, declining HRV, and rising temperature. I'll flag when the window opens, likely around March 7-9.",
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

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [didAutoLoad, setDidAutoLoad] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (didAutoLoad) return;
    setDidAutoLoad(true);

    const runInitialCoachMessage = async () => {
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
          calendar_events: ["10:00 project sync", "15:00 presentation prep", "17:30 gym"],
          message: "Give me today's full rhythm summary.",
          chat_history: [],
        });

        const response = formatCoachMessage(coach);
        setMessages((prev) => [...prev, { id: prev.length + 1, role: "assistant", content: response }]);
      } catch (err) {
        setBackendError(err instanceof Error ? err.message : "Backend chat failed");
      } finally {
        setIsTyping(false);
      }
    };

    runInitialCoachMessage();
  }, [didAutoLoad]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const prompt = text.trim();
    const userMsg: Message = {
      id: messages.length + 1,
      role: "user",
      content: prompt,
    };
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
        calendar_events: ["10:00 project sync", "15:00 presentation prep", "17:30 gym"],
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

    // Fallback to local response if backend is unavailable.
    setTimeout(() => {
      const response =
        aiResponses[prompt] ||
        "I couldn't reach the live model just now, so I'm using local fallback context. Try again after a fresh Check-in for personalized guidance.";

      const aiMsg: Message = { id: messages.length + 2, role: "assistant", content: response };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 pt-6 pb-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-foreground" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Rhythm AI
            </h2>
            <p className="text-[12px] text-muted-foreground">
              Your personal rhythm companion
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
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
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border text-foreground rounded-bl-md"
              }`}
            >
              <p className="text-[13px] leading-relaxed whitespace-pre-line">{msg.content}</p>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Suggested questions */}
        {messages.length <= 4 && !isTyping && (
          <div className="pt-2">
            <p className="text-[11px] text-muted-foreground mb-2 flex items-center gap-1">
              <ArrowDown className="w-3 h-3" /> Ask me about your rhythm
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[12px] px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-border hover:bg-accent transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2 bg-input-background rounded-full px-4 py-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about your patterns..."
            className="flex-1 bg-transparent outline-none text-[14px] text-foreground placeholder:text-muted-foreground"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center disabled:opacity-40 transition-opacity"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
