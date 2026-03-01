import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Sparkles, ChevronRight, Plus } from "lucide-react";

const dmSans = { fontFamily: "'DM Sans', sans-serif" } as const;

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

interface ChatHistoryEntry {
  id: string;
  title: string;
  createdAt: string;
  threadKey: string;
  messages: Message[];
}

const HISTORY_STORAGE_KEY = "rhythm-chat-history";

function loadHistoryEntries(): ChatHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "Unknown time";
  }
}

export function ChatPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<ChatHistoryEntry[]>([]);

  useEffect(() => {
    setEntries(loadHistoryEntries());
  }, []);

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [entries]
  );

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[rgba(139,110,90,0.1)] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#8B6E5A]" />
          </div>
          <div>
            <p className="text-[24px] leading-[36px] text-[#2D2A26]" style={{ fontFamily: "'IBM Plex Serif', serif" }}>
              Rhythm AI
            </p>
            <p className="text-[13px] text-[#8A8680]" style={{ ...dmSans, fontWeight: 400 }}>
              Chat History
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/chat/live")}
          className="h-8 px-2.5 rounded-full bg-[rgba(45,42,38,0.05)] text-[#2D2A26] text-[11px] flex items-center gap-1"
          style={{ ...dmSans, fontWeight: 600 }}
        >
          <Plus className="w-3.5 h-3.5" />
          New Chat
        </button>
      </div>

      <div>
        {sortedEntries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[rgba(45,42,38,0.08)] p-4">
            <p className="text-[13px] text-[#8A8680]" style={{ ...dmSans, fontWeight: 400 }}>
              No chat history yet. Start your first conversation.
            </p>
          </div>
        ) : (
          sortedEntries.map((entry, idx) => (
            <motion.button
              key={entry.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => navigate(`/chat/live?history=${encodeURIComponent(entry.id)}`)}
              className="w-full text-left"
            >
              {idx > 0 && <div className="h-px" style={{ backgroundColor: "rgba(45,42,38,0.07)" }} />}
              <div className="flex items-center gap-3 py-4">
                <span className="w-2 h-2 rounded-full bg-[#C97B6B] shrink-0" />

                <div className="flex-1 min-w-0">
                  <p
                    className="text-[14px] leading-[1.4] text-[#2A2825] truncate"
                    style={{ ...dmSans, fontWeight: 600, fontVariationSettings: "'opsz' 14" }}
                  >
                    {entry.title}
                  </p>
                  <p className="text-[11px] text-[#8A8680] mt-0.5" style={{ ...dmSans, fontWeight: 400 }}>
                    {formatDate(entry.createdAt)} · {entry.messages.length} msgs
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-[#B5B0AA] shrink-0" />
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}
