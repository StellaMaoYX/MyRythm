import { useState } from "react";
import { Check, Clock, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { moodOptions, checkInHistory, heartRateData, sleepData, activityData, temperatureData } from "./mock-data";
import { postCheckin, postPredictDaily } from "../lib/api";
import { saveSessionState } from "../lib/sessionStore";

type Intensity = "high" | "moderate" | "low";

interface SelectedEmotion {
  label: string;
  emoji: string;
  intensity: Intensity | null;
}

const intensityConfig: Record<Intensity, { label: string; color: string; bg: string; dot: string }> = {
  high: { label: "High", color: "#C97B6B", bg: "rgba(201,123,107,0.12)", dot: "#C97B6B" },
  moderate: { label: "Moderate", color: "#B8A088", bg: "rgba(184,160,136,0.12)", dot: "#B8A088" },
  low: { label: "Low", color: "#7BA7A0", bg: "rgba(123,167,160,0.12)", dot: "#7BA7A0" },
};

const dmSans = { fontFamily: "'DM Sans', sans-serif" } as const;

// ── History Card ───────────────────────────────────────────────────

function HistoryCard({ entry }: { entry: (typeof checkInHistory)[0] }) {
  return (
    <div className="bg-white rounded-2xl relative">
      <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ border: "0.636px solid rgba(45,42,38,0.08)" }} />
      <div className="p-3.5">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Clock className="w-3 h-3 text-[#8A8680]" />
          <span className="text-[11px] text-[#8A8680]" style={{ ...dmSans, fontWeight: 400 }}>
            {entry.date} · {entry.time}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {entry.emotions.map((em) => {
            const ic = intensityConfig[em.intensity];
            return (
              <span
                key={em.label}
                className="inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-full"
                style={{ backgroundColor: ic.bg, color: ic.color, ...dmSans, fontWeight: 500, fontVariationSettings: "'opsz' 14" }}
              >
                <span className="text-[13px]">{em.emoji}</span>
                {em.label}
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ic.dot }} />
                <span className="text-[10px] opacity-70">{ic.label}</span>
              </span>
            );
          })}
        </div>

        {entry.note && (
          <p className="text-[12px] text-[#8A8680] leading-[18px]" style={{ ...dmSans, fontWeight: 400, fontVariationSettings: "'opsz' 9" }}>
            "{entry.note}"
          </p>
        )}
      </div>
    </div>
  );
}

// ── Bottom Sheet ───────────────────────────────────────────────────

function CheckInSheet({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (emotions: SelectedEmotion[], note: string) => void;
}) {
  const [selectedEmotions, setSelectedEmotions] = useState<SelectedEmotion[]>([]);
  const [note, setNote] = useState("");

  const toggleEmotion = (label: string, emoji: string) => {
    setSelectedEmotions((prev) => {
      const exists = prev.find((e) => e.label === label);
      if (exists) return prev.filter((e) => e.label !== label);
      return [...prev, { label, emoji, intensity: null }];
    });
  };

  const setEmotionIntensity = (label: string, intensity: Intensity) => {
    setSelectedEmotions((prev) =>
      prev.map((e) => (e.label === label ? { ...e, intensity } : e))
    );
  };

  const removeEmotion = (label: string) => {
    setSelectedEmotions((prev) => prev.filter((e) => e.label !== label));
  };

  const allHaveIntensity =
    selectedEmotions.length > 0 && selectedEmotions.every((e) => e.intensity !== null);

  const handleSubmit = () => {
    if (!allHaveIntensity) return;
    onSubmit(selectedEmotions, note);
    setSelectedEmotions([]);
    setNote("");
  };

  const handleClose = () => {
    onClose();
    setSelectedEmotions([]);
    setNote("");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={handleClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#FAF8F5] rounded-t-3xl max-h-[88vh] overflow-y-auto"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#D5D0CA]" />
            </div>

            <div className="max-w-lg mx-auto px-4 pb-8">
              {/* Sheet header */}
              <div className="flex items-center justify-between mb-4 pt-1">
                <p
                  className="text-[18px] leading-[27px] text-[#2D2A26]"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  New Check-in
                </p>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-[rgba(45,42,38,0.06)] flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-[#8A8680]" />
                </button>
              </div>

              {/* Emotion grid */}
              <p
                className="text-[15px] leading-[22.5px] text-[#2D2A26] mb-3"
                style={{ ...dmSans, fontWeight: 500, fontVariationSettings: "'opsz' 14" }}
              >
                How are you feeling?
              </p>

              <div className="grid grid-cols-4 gap-2 mb-1">
                {moodOptions.map((mood) => {
                  const isSelected = selectedEmotions.some((e) => e.label === mood.label);
                  return (
                    <button
                      key={mood.label}
                      onClick={() => toggleEmotion(mood.label, mood.emoji)}
                      className={`flex flex-col items-center gap-1 py-3 px-1 rounded-2xl transition-all ${
                        isSelected
                          ? "bg-[#8B6E5A]/10 border-2 border-[#8B6E5A]"
                          : "bg-white border-2 border-transparent"
                      }`}
                    >
                      <span className="text-[20px] leading-[30px]">{mood.emoji}</span>
                      <span
                        className={`text-[11px] leading-[16.5px] ${isSelected ? "text-[#8B6E5A]" : "text-[#8A8680]"}`}
                        style={{ ...dmSans, fontWeight: 500, fontVariationSettings: "'opsz' 14" }}
                      >
                        {mood.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-[#8A8680] mb-3" style={{ ...dmSans, fontWeight: 400 }}>
                Select one or more emotions
              </p>

              {/* Per-emotion intensity */}
              <AnimatePresence>
                {selectedEmotions.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2.5 mb-4">
                      {selectedEmotions.map((emotion) => (
                        <motion.div
                          key={emotion.label}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="bg-white rounded-xl p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[15px]">{emotion.emoji}</span>
                              <span
                                className="text-[13px] text-[#2D2A26]"
                                style={{ ...dmSans, fontWeight: 500, fontVariationSettings: "'opsz' 14" }}
                              >
                                {emotion.label}
                              </span>
                            </div>
                            <button
                              onClick={() => removeEmotion(emotion.label)}
                              className="w-5 h-5 rounded-full bg-[rgba(45,42,38,0.06)] flex items-center justify-center"
                            >
                              <X className="w-3 h-3 text-[#8A8680]" />
                            </button>
                          </div>

                          <div className="flex gap-2">
                            {(["high", "moderate", "low"] as Intensity[]).map((level) => {
                              const config = intensityConfig[level];
                              const isActive = emotion.intensity === level;
                              return (
                                <button
                                  key={level}
                                  onClick={() => setEmotionIntensity(emotion.label, level)}
                                  className={`flex-1 py-2 rounded-lg text-[12px] transition-all border-[1.5px] ${
                                    isActive ? "border-current" : "border-transparent"
                                  }`}
                                  style={{
                                    backgroundColor: isActive ? config.bg : "#F5F2EE",
                                    color: isActive ? config.color : "#8A8680",
                                    ...dmSans,
                                    fontWeight: 500,
                                    fontVariationSettings: "'opsz' 14",
                                  }}
                                >
                                  {config.label}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Note */}
              <div className="mb-4">
                <p
                  className="text-[13px] leading-[19.5px] text-[#2D2A26] mb-2"
                  style={{ ...dmSans, fontWeight: 400, fontVariationSettings: "'opsz' 9" }}
                >
                  Notes <span className="text-[#8A8680]">(optional)</span>
                </p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Anything on your mind..."
                  className="w-full bg-white rounded-xl p-3 text-[13px] text-[#2D2A26] placeholder:text-[#B5B0A8] outline-none resize-none h-[72px]"
                  style={{ ...dmSans, fontWeight: 400, fontVariationSettings: "'opsz' 9" }}
                />
              </div>

              {/* Log button */}
              <button
                onClick={handleSubmit}
                disabled={!allHaveIntensity}
                className="w-full py-3 rounded-2xl bg-[#8B6E5A] text-white disabled:opacity-30 transition-opacity text-[14px]"
                style={{ ...dmSans, fontWeight: 500, fontVariationSettings: "'opsz' 14" }}
              >
                Log my emotions
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Main Page ──────────────────────────────────────────────────────

export function CheckInPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [history, setHistory] = useState(checkInHistory);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const handleSubmit = async (emotions: SelectedEmotion[], note: string) => {
    const newEntry = {
      date: "Mar 1",
      time: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      emotions: emotions.map((e) => ({
        label: e.label,
        emoji: e.emoji,
        intensity: e.intensity as Intensity,
      })),
      note,
    };
    setHistory((prev) => [newEntry, ...prev]);
    setSheetOpen(false);
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 2500);

    // Send check-in to backend and trigger model2 prediction for today's state.
    const userId = "u_demo";
    const date = new Date().toISOString().slice(0, 10);
    const moodText = emotions.map((e) => `${e.emoji} ${e.label} (${e.intensity ?? "unknown"})`).join(", ");
    const lifeEventText = note || "";

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

    setIsSyncing(true);
    setSyncError(null);
    try {
      const checkin = await postCheckin({
        user_id: userId,
        date,
        mood_text: moodText,
        life_event_text: lifeEventText,
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
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : "Failed to sync with backend");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24 relative min-h-full">
      {/* Header */}
      <div className="mb-5">
        <p
          className="text-[24px] leading-[36px] text-[#2D2A26]"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Check In
        </p>
        <p
          className="text-[13px] leading-[19.5px] text-[#8A8680] mt-0.5"
          style={{ ...dmSans, fontWeight: 400, fontVariationSettings: "'opsz' 9" }}
        >
          Track your emotional patterns over time
        </p>
      </div>

      {/* Success toast */}
      <AnimatePresence>
        {justSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-white rounded-2xl relative p-4 mb-4 flex items-center gap-3"
          >
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ border: "0.636px solid rgba(45,42,38,0.08)" }}
            />
            <div className="w-9 h-9 rounded-full bg-[rgba(123,167,160,0.12)] flex items-center justify-center shrink-0">
              <Check className="w-4.5 h-4.5 text-[#7BA7A0]" />
            </div>
            <div>
              <p
                className="text-[14px] text-[#2D2A26]"
                style={{ ...dmSans, fontWeight: 500, fontVariationSettings: "'opsz' 14" }}
              >
                Check-in recorded
              </p>
              <p
                className="text-[12px] text-[#8A8680]"
                style={{ ...dmSans, fontWeight: 400 }}
              >
                Your emotions have been logged
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isSyncing && (
        <div className="bg-white rounded-xl p-3 mb-3 border border-[rgba(45,42,38,0.08)] text-[12px] text-[#8A8680]">
          Syncing check-in with AI backend...
        </div>
      )}
      {syncError && (
        <div className="bg-[#FBE9E7] rounded-xl p-3 mb-3 border border-[#FFCCBC] text-[12px] text-[#C4453E]">
          Backend sync failed: {syncError}
        </div>
      )}

      {/* History */}
      <div className="flex items-center justify-between mb-3">
        <p
          className="text-[15px] leading-[22.5px] text-[#2D2A26]"
          style={{ ...dmSans, fontWeight: 500, fontVariationSettings: "'opsz' 14" }}
        >
          Past Check-ins
        </p>
        <span className="text-[12px] text-[#8A8680]" style={{ ...dmSans, fontWeight: 400 }}>
          {history.length} entries
        </span>
      </div>

      <div className="space-y-2.5">
        {history.map((entry, idx) => (
          <motion.div
            key={`${entry.date}-${entry.time}-${idx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
          >
            <HistoryCard entry={entry} />
          </motion.div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-[#8B6E5A] rounded-full flex items-center justify-center z-30"
        style={{ boxShadow: "0px 4px 12px rgba(139,110,90,0.35)" }}
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Check-in Bottom Sheet */}
      <CheckInSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onSubmit={handleSubmit} />
    </div>
  );
}
