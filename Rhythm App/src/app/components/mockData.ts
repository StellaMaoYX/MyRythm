// Mock bio-signal data simulating Apple Health / Apple Watch data

export const cycleData = {
  currentDay: 18,
  cycleLength: 28,
  phase: "Luteal" as const,
  nextPeriod: "Mar 11",
  daysUntilPeriod: 10,
  ovulationDay: 14,
  lastPeriodStart: "Feb 11",
  phases: [
    { name: "Menstrual", start: 1, end: 5, color: "#C97B6B" },
    { name: "Follicular", start: 6, end: 13, color: "#7BA7A0" },
    { name: "Ovulation", start: 14, end: 16, color: "#D4A7B9" },
    { name: "Luteal", start: 17, end: 28, color: "#B8A088" },
  ],
};

export const heartRateData = {
  current: 72,
  resting: 58,
  hrv: 42,
  trend: "stable" as const,
  weekly: [
    { day: "Mon", hr: 71, rhr: 57, hrv: 44 },
    { day: "Tue", hr: 68, rhr: 56, hrv: 46 },
    { day: "Wed", hr: 74, rhr: 59, hrv: 40 },
    { day: "Thu", hr: 69, rhr: 57, hrv: 43 },
    { day: "Fri", hr: 76, rhr: 60, hrv: 38 },
    { day: "Sat", hr: 65, rhr: 55, hrv: 48 },
    { day: "Sun", hr: 72, rhr: 58, hrv: 42 },
  ],
};

export const sleepData = {
  lastNight: {
    total: 7.2,
    deep: 1.8,
    rem: 1.5,
    light: 3.4,
    awake: 0.5,
    score: 82,
    wristTemp: 0.3,
  },
  weekly: [
    { day: "Mon", total: 7.5, deep: 2.0, rem: 1.6, score: 86 },
    { day: "Tue", total: 6.8, deep: 1.5, rem: 1.3, score: 74 },
    { day: "Wed", total: 7.0, deep: 1.7, rem: 1.4, score: 78 },
    { day: "Thu", total: 7.8, deep: 2.1, rem: 1.8, score: 88 },
    { day: "Fri", total: 6.2, deep: 1.2, rem: 1.1, score: 68 },
    { day: "Sat", total: 8.1, deep: 2.3, rem: 2.0, score: 92 },
    { day: "Sun", total: 7.2, deep: 1.8, rem: 1.5, score: 82 },
  ],
};

export const activityData = {
  steps: 8432,
  stepsGoal: 10000,
  calories: 384,
  caloriesGoal: 500,
  weekly: [
    { day: "Mon", steps: 9200, calories: 420 },
    { day: "Tue", steps: 7800, calories: 360 },
    { day: "Wed", steps: 10500, calories: 480 },
    { day: "Thu", steps: 6300, calories: 290 },
    { day: "Fri", steps: 11200, calories: 510 },
    { day: "Sat", steps: 5400, calories: 250 },
    { day: "Sun", steps: 8432, calories: 384 },
  ],
};

export const temperatureData = {
  baseline: 36.6,
  current: 36.9,
  deviation: 0.3,
  weekly: [
    { day: "Mon", temp: 36.5 },
    { day: "Tue", temp: 36.6 },
    { day: "Wed", temp: 36.7 },
    { day: "Thu", temp: 36.8 },
    { day: "Fri", temp: 36.9 },
    { day: "Sat", temp: 36.9 },
    { day: "Sun", temp: 36.9 },
  ],
};

export const morningNudges = [
  {
    id: 1,
    type: "cycle" as const,
    title: "Luteal phase, day 4",
    message: "Your body may crave more rest today. Progesterone peaks around now — gentle movement and warm foods can help.",
    icon: "moon",
    color: "#B8A088",
  },
  {
    id: 2,
    type: "sleep" as const,
    title: "Sleep was lighter than usual",
    message: "You got 7.2h but deep sleep dipped. This is common in the luteal phase. Consider winding down earlier tonight.",
    icon: "bed",
    color: "#A3B5D6",
  },
  {
    id: 3,
    type: "hrv" as const,
    title: "HRV trending down",
    message: "Your HRV has dropped 12% this week. Your nervous system may need extra recovery — try breathwork or a rest day.",
    icon: "heart",
    color: "#C97B6B",
  },
];

export const cyclePredictions = [
  {
    id: 1,
    date: "Mar 11",
    event: "Period expected",
    confidence: 87,
    note: "Based on your 28-day average cycle",
  },
  {
    id: 2,
    date: "Mar 7–9",
    event: "PMS window",
    confidence: 79,
    note: "Your HRV typically drops and temp rises 3 days before",
  },
  {
    id: 3,
    date: "Mar 25",
    event: "Next ovulation window",
    confidence: 82,
    note: "Estimated based on your follicular phase length",
  },
];

export const deviationAlerts = [
  {
    id: 1,
    severity: "attention" as const,
    title: "Resting heart rate elevated",
    detail: "Your RHR has been 3 bpm above your 30-day average for 3 consecutive days. This pattern has previously correlated with your pre-menstrual phase.",
    biosignals: ["RestingHeartRate", "HRV"],
    timestamp: "2h ago",
  },
  {
    id: 2,
    severity: "prepare" as const,
    title: "Sleep architecture shifting",
    detail: "Deep sleep has decreased by 18% over the past 4 nights. Combined with rising wrist temperature, this suggests your body is entering the late luteal phase.",
    biosignals: ["SleepAnalysis", "WristTemperature"],
    timestamp: "This morning",
  },
  {
    id: 3,
    severity: "insight" as const,
    title: "Activity dip detected",
    detail: "Your step count has been 30% below your weekly average. This correlates with previous luteal-phase patterns. This is normal for you.",
    biosignals: ["StepCount", "ActiveEnergy"],
    timestamp: "Yesterday",
  },
];

export const checkInHistory = [
  {
    date: "Mar 1",
    time: "9:15 AM",
    emotions: [
      { label: "Calm", emoji: "😌", intensity: "moderate" as const },
      { label: "Content", emoji: "😊", intensity: "low" as const },
    ],
    note: "Felt grounded today",
  },
  {
    date: "Feb 28",
    time: "8:40 AM",
    emotions: [
      { label: "Tired", emoji: "😴", intensity: "high" as const },
      { label: "Anxious", emoji: "😟", intensity: "moderate" as const },
    ],
    note: "Didn't sleep well",
  },
  {
    date: "Feb 27",
    time: "7:50 AM",
    emotions: [
      { label: "Energized", emoji: "⚡", intensity: "high" as const },
    ],
    note: "Great workout",
  },
  {
    date: "Feb 26",
    time: "10:20 AM",
    emotions: [
      { label: "Anxious", emoji: "😟", intensity: "high" as const },
      { label: "Frustrated", emoji: "😤", intensity: "moderate" as const },
      { label: "Tired", emoji: "😴", intensity: "low" as const },
    ],
    note: "Stressful meeting",
  },
  {
    date: "Feb 25",
    time: "9:00 AM",
    emotions: [
      { label: "Content", emoji: "😊", intensity: "moderate" as const },
    ],
    note: "",
  },
];

export const moodOptions = [
  { emoji: "😌", label: "Calm" },
  { emoji: "⚡", label: "Energized" },
  { emoji: "😴", label: "Tired" },
  { emoji: "😟", label: "Anxious" },
  { emoji: "😊", label: "Content" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😤", label: "Frustrated" },
  { emoji: "🥰", label: "Loved" },
];

export const chatMessages = [
  {
    id: 1,
    role: "assistant" as const,
    content: "Good morning. I noticed a few things in your rhythm overnight that I'd like to share with you.",
  },
  {
    id: 2,
    role: "assistant" as const,
    content: "Your resting heart rate was 61 bpm last night — about 3 bpm above your 30-day baseline. Your HRV also dipped to 38ms, which is on the lower end for you. Combined with a wrist temperature rise of +0.3°C, this pattern closely matches what I've seen in your late luteal phase before.",
  },
  {
    id: 3,
    role: "user" as const,
    content: "Does that mean my period is coming soon?",
  },
  {
    id: 4,
    role: "assistant" as const,
    content: "Based on your cycle history and these bio-signal patterns, I estimate your period will start around March 11th — that's about 10 days from now. However, the pre-menstrual window (where you might feel PMS symptoms) typically starts about 3 days before, around March 7–9. Your body is already showing early signs of the shift.",
  },
];

export const insightCards = [
  {
    id: 1,
    title: "Your HRV follows your cycle",
    description: "Over the past 3 months, your HRV consistently drops 15-20% during the luteal phase and peaks during the follicular phase. This is a strong, reliable pattern.",
    category: "Pattern",
    color: "#7BA7A0",
  },
  {
    id: 2,
    title: "Sleep quality predicts next-day energy",
    description: "When your deep sleep exceeds 1.8 hours, you report 40% higher energy levels the following day. Prioritizing sleep hygiene on cycle days 20-28 could help.",
    category: "Correlation",
    color: "#A3B5D6",
  },
  {
    id: 3,
    title: "Temperature rise precedes period by 3 days",
    description: "Your wrist temperature consistently rises 0.2-0.4°C approximately 3 days before menstruation begins. This has been accurate for 5 of your last 6 cycles.",
    category: "Prediction",
    color: "#D4A7B9",
  },
  {
    id: 4,
    title: "Movement supports your mood",
    description: "On days when your step count exceeds 8,000, you're 60% more likely to check in with 'Calm' or 'Energized' moods. Even during luteal phase dips.",
    category: "Correlation",
    color: "#C97B6B",
  },
];

export const profileData = {
  name: "Aria",
  cycleAvg: 28,
  periodAvg: 5,
  cyclesTracked: 8,
  avgRHR: 57,
  avgHRV: 44,
  avgSleep: 7.3,
  avgDeepSleep: 1.8,
  checkIns: 42,
  streak: 7,
};