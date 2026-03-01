import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Sparkles, ChevronRight } from "lucide-react";

const dmSans = { fontFamily: "'DM Sans', sans-serif" } as const;

interface ChatThread {
  id: string;
  topic: string;
  date: string;
  unread?: boolean;
}

const chatThreads: ChatThread[] = [
  {
    id: "recovery-load",
    topic: "Recovery load is higher than usual",
    date: "Today",
    unread: true,
  },
  {
    id: "sleep-pattern",
    topic: "Sleep architecture shifting",
    date: "Yesterday",
  },
  {
    id: "period-prediction",
    topic: "Period prediction update",
    date: "Feb 28",
  },
  {
    id: "hrv-cycle-pattern",
    topic: "Your HRV follows your cycle",
    date: "Feb 25",
  },
  {
    id: "movement-mood",
    topic: "Movement supports your mood",
    date: "Feb 22",
  },
];

export function ChatHistoryPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[rgba(139,110,90,0.1)] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#8B6E5A]" />
        </div>
        <div>
          <p
            className="text-[24px] leading-[36px] text-[#2D2A26]"
            style={{ fontFamily: "'IBM Plex Serif', serif" }}
          >
            Rhythm AI
          </p>
          <p
            className="text-[13px] text-[#8A8680]"
            style={{ ...dmSans, fontWeight: 400 }}
          >
            Your personal rhythm companion
          </p>
        </div>
      </div>

      {/* Thread list */}
      <div>
        {chatThreads.map((thread, idx) => (
          <motion.button
            key={thread.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            onClick={() => navigate(`/chat/${thread.id}`)}
            className="w-full text-left"
          >
            {idx > 0 && <div className="h-px" style={{ backgroundColor: "rgba(45,42,38,0.07)" }} />}
            <div className="flex items-center gap-3 py-4">
              {/* Unread dot */}
              {thread.unread ? (
                <span className="w-2 h-2 rounded-full bg-[#C97B6B] shrink-0" />
              ) : (
                <span className="w-2 h-2 shrink-0" />
              )}

              {/* Topic + date */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[14px] leading-[1.4] text-[#2A2825] truncate"
                  style={{ ...dmSans, fontWeight: thread.unread ? 600 : 500, fontVariationSettings: "'opsz' 14" }}
                >
                  {thread.topic}
                </p>
                <p
                  className="text-[11px] text-[#8A8680] mt-0.5"
                  style={{ ...dmSans, fontWeight: 400 }}
                >
                  {thread.date}
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-4 h-4 text-[#B5B0AA] shrink-0" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}