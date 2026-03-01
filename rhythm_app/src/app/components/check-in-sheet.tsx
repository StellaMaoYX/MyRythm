import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { moodOptions } from "./mock-data";

type Intensity = "high" | "moderate" | "low";

export interface SelectedEmotion {
  label: string;
  emoji: string;
  intensity: Intensity | null;
}

const intensityConfig: Record<Intensity, { label: string; color: string; bg: string }> = {
  high: { label: "High", color: "#C97B6B", bg: "rgba(201,123,107,0.12)" },
  moderate: { label: "Moderate", color: "#B8A088", bg: "rgba(184,160,136,0.12)" },
  low: { label: "Low", color: "#7BA7A0", bg: "rgba(123,167,160,0.12)" },
};

const dmSans = { fontFamily: "'DM Sans', sans-serif" } as const;

export function CheckInSheet({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit?: (emotions: SelectedEmotion[], note: string) => Promise<void> | void;
}) {
  const [selectedEmotions, setSelectedEmotions] = useState<SelectedEmotion[]>([]);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const toggleEmotion = (label: string, emoji: string) => {
    setValidationError(null);
    setSelectedEmotions((prev) => {
      const exists = prev.find((e) => e.label === label);
      if (exists) return prev.filter((e) => e.label !== label);
      return [...prev, { label, emoji, intensity: "moderate" }];
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

  const handleSubmit = async () => {
    if (selectedEmotions.length === 0) {
      setValidationError("Please select at least one emotion.");
      return;
    }
    if (!allHaveIntensity) {
      setValidationError("Please set an intensity for each selected emotion.");
      return;
    }
    setValidationError(null);
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onSubmit?.(selectedEmotions, note);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelectedEmotions([]);
        setNote("");
        onClose();
      }, 1800);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to sync with backend");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedEmotions([]);
    setNote("");
    setSubmitted(false);
    setSubmitError(null);
    setValidationError(null);
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={handleClose}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#FAF8F5] rounded-t-3xl max-h-[88vh] overflow-y-auto"
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#D5D0CA]" />
            </div>

            <div className="max-w-lg mx-auto px-4 pb-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-[rgba(123,167,160,0.12)] flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7BA7A0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <p className="text-[15px] text-[#2D2A26]" style={{ ...dmSans, fontWeight: 500 }}>
                    Check-in recorded
                  </p>
                  <p className="text-[13px] text-[#8A8680] mt-1" style={{ ...dmSans, fontWeight: 400 }}>
                    Your emotions have been logged
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4 pt-1">
                    <p
                      className="text-[18px] leading-[27px] text-[#2D2A26]"
                      style={{ fontFamily: "'IBM Plex Serif', serif" }}
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

                  <button
                    onClick={handleSubmit}
                    disabled={!allHaveIntensity || isSubmitting}
                    className="w-full py-3 rounded-2xl bg-[#8B6E5A] text-white disabled:opacity-30 transition-opacity text-[14px]"
                    style={{ ...dmSans, fontWeight: 500, fontVariationSettings: "'opsz' 14" }}
                  >
                    {isSubmitting ? "Syncing..." : "Log my emotions"}
                  </button>
                  {submitError && (
                    <p
                      className="mt-2 text-[12px] text-[#C4453E]"
                      style={{ ...dmSans, fontWeight: 400 }}
                    >
                      Backend sync failed: {submitError}
                    </p>
                  )}
                  {validationError && (
                    <p
                      className="mt-2 text-[12px] text-[#A67C37]"
                      style={{ ...dmSans, fontWeight: 400 }}
                    >
                      {validationError}
                    </p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
