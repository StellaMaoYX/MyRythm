import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Send, Sparkles, ArrowDown, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { chatMessages as initialMessages } from "./mockData";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const threadInitialMessages: Record<string, Message[]> = {
  "recovery-load": initialMessages,
  "sleep-pattern": [
    { id: 1, role: "assistant", content: "I noticed your sleep architecture has been shifting over the past 4 nights." },
    { id: 2, role: "assistant", content: "Your deep sleep has decreased by 18%, from an average of 2.1h to 1.7h. Combined with a rising wrist temperature of +0.3\u00b0C, this suggests your body is entering the late luteal phase. REM sleep has also shortened slightly." },
    { id: 3, role: "user", content: "Should I be worried?" },
    { id: 4, role: "assistant", content: "Not at all \u2014 this is a pattern I\u2019ve consistently seen in your data during the luteal phase. Progesterone rises during this phase and can reduce deep sleep duration by 10-20%. Your body is responding normally. Try winding down 30 minutes earlier and limiting screen time after 9pm." },
  ],
  "period-prediction": [
    { id: 1, role: "assistant", content: "Based on your current cycle data and bio-signal patterns, I estimate your next period will start around March 11th." },
    { id: 2, role: "assistant", content: "Your wrist temperature has risen +0.3\u00b0C and HRV has been declining \u2014 both consistent with your typical late-luteal pattern. You\u2019re currently on day 18 of a 28-day cycle. The PMS window typically opens around March 7-9 based on your history." },
  ],
  "hrv-cycle-pattern": [
    { id: 1, role: "assistant", content: "I\u2019ve identified a strong pattern in your HRV data over the past 3 months." },
    { id: 2, role: "assistant", content: "Your HRV consistently drops 15-20% during the luteal phase and peaks during the follicular phase. This is a reliable, repeating pattern \u2014 it\u2019s held for 5 of your last 6 cycles. During follicular, your average HRV is 52ms. During luteal, it drops to around 38-42ms." },
  ],
  "movement-mood": [
    { id: 1, role: "assistant", content: "I found an interesting correlation between your movement and mood check-ins." },
    { id: 2, role: "assistant", content: "On days when your step count exceeds 8,000, you\u2019re 60% more likely to check in with \u2018Calm\u2019 or \u2018Energized\u2019 moods. This holds even during luteal phase dips. It doesn\u2019t have to be intense \u2014 a 30-minute walk seems to have the same effect." },
  ],
};

const suggestedQuestions = [
  "When is my period expected?",
  "Why is my HRV dropping?",
  "How's my sleep this week?",
  "Am I in my PMS window?",
];

const aiResponses: Record<string, string> = {
  "When is my period expected?":
    "Based on your current cycle data and bio-signal patterns, I estimate your next period will start around March 11th. Your wrist temperature has risen +0.3\u00b0C and HRV has been declining \u2014 both consistent with your typical late-luteal pattern. You\u2019re currently on day 18 of a 28-day cycle.",
  "Why is my HRV dropping?":
    "Your HRV has decreased from 48ms to 38ms over the past 5 days. This 21% decline is consistent with what I\u2019ve observed in your previous luteal phases. Rising progesterone levels typically increase sympathetic nervous system activity, which lowers HRV. This is normal for your pattern \u2014 it usually recovers within 2-3 days of your period starting.",
  "How's my sleep this week?":
    "This week has been mixed. Your best night was Saturday (8.1h, score 92) with excellent deep sleep. Friday was your lowest (6.2h, score 68). Overall, your deep sleep has averaged 1.7h \u2014 slightly below your 3-month average of 1.8h. The decline in deep sleep correlates with the luteal phase pattern I\u2019ve seen in your data.",
  "Am I in my PMS window?":
    "Not quite yet, but you\u2019re approaching it. Based on your history, your PMS symptoms typically emerge around cycle days 25-28. You\u2019re currently on day 18. However, your bio-signals are already shifting \u2014 elevated RHR, declining HRV, and rising temperature. I\u2019ll flag when the window opens, likely around March 7-9.",
};

export function ChatConversationPage() {
  const navigate = useNavigate();
  const { threadId } = useParams();
  const initMsgs = threadInitialMessages[threadId || "recovery-load"] || initialMessages;
  const [messages, setMessages] = useState<Message[]>(initMsgs);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: messages.length + 1, role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response =
        aiResponses[text.trim()] ||
        "I\u2019ve analyzed your recent bio-signals. Your heart rate, HRV, sleep patterns, and temperature data all suggest your body is in a typical late-luteal transition. I don\u2019t see any unusual deviations from your baseline patterns. Would you like me to dive deeper into any specific signal?";
      const aiMsg: Message = { id: messages.length + 2, role: "assistant", content: response };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto bg-[#FAF8F5]">
      {/* Header with back button */}
      <div className="px-4 pt-4 pb-3 border-b bg-white" style={{ borderColor: "rgba(45,42,38,0.08)" }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/chat")}
            className="w-9 h-9 rounded-full bg-[rgba(45,42,38,0.05)] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[#2D2A26]" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[rgba(139,110,90,0.1)] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#8B6E5A]" />
          </div>
          <div>
            <p
              className="text-[15px] text-[#2D2A26]"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
            >
              Rhythm AI
            </p>
            <p
              className="text-[11px] text-[#8A8680]"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}
            >
              Your personal rhythm companion
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
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
                  ? "bg-[#8B6E5A] text-white rounded-br-md"
                  : "bg-white border rounded-bl-md"
              }`}
              style={msg.role === "assistant" ? { borderColor: "rgba(45,42,38,0.08)" } : undefined}
            >
              <p
                className="text-[13px] leading-relaxed"
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

        {messages.length <= 4 && !isTyping && (
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

      {/* Input */}
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
