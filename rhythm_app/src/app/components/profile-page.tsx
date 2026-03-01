import { useState } from "react";
import {
  Heart,
  Moon,
  Droplets,
  ClipboardCheck,
  ChevronRight,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Smartphone,
  Clock,
} from "lucide-react";
import { motion } from "motion/react";
import { profileData } from "./mock-data";

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
}

function SettingItem({ icon, label, value, onClick, danger }: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 px-1 border-b border-border last:border-0"
    >
      <span className={danger ? "text-destructive" : "text-muted-foreground"}>
        {icon}
      </span>
      <span
        className={`flex-1 text-left text-[14px] ${
          danger ? "text-destructive" : "text-foreground"
        }`}
      >
        {label}
      </span>
      {value && (
        <span className="text-[13px] text-muted-foreground">{value}</span>
      )}
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit: string;
  color: string;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-3.5">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ backgroundColor: color + "20", color }}
        >
          {icon}
        </div>
        <span className="text-[12px] text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[20px] text-foreground" style={{ fontFamily: "'DM Serif Display', serif" }}>
          {value}
        </span>
        <span className="text-[12px] text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-[#D4A7B9]/30 flex items-center justify-center">
          <span className="text-[24px] text-primary" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {profileData.name[0]}
          </span>
        </div>
        <div>
          <h1 className="text-foreground" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {profileData.name}
          </h1>
          <p className="text-[13px] text-muted-foreground">
            {profileData.cyclesTracked} cycles tracked · {profileData.streak}-day
            streak
          </p>
        </div>
      </div>

      {/* Period Data */}
      <div className="mb-5">
        <h3 className="text-foreground mb-3 flex items-center gap-2">
          <Droplets className="w-4 h-4 text-[#C97B6B]" />
          Period Data
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          <StatCard
            icon={<Clock className="w-3.5 h-3.5" />}
            label="Avg Cycle"
            value={profileData.cycleAvg}
            unit="days"
            color="#C97B6B"
          />
          <StatCard
            icon={<Droplets className="w-3.5 h-3.5" />}
            label="Avg Period"
            value={profileData.periodAvg}
            unit="days"
            color="#D4A7B9"
          />
        </div>
      </div>

      {/* Heart Data */}
      <div className="mb-5">
        <h3 className="text-foreground mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#C97B6B]" />
          Heart Data
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          <StatCard
            icon={<Heart className="w-3.5 h-3.5" />}
            label="Avg Resting HR"
            value={profileData.avgRHR}
            unit="bpm"
            color="#C97B6B"
          />
          <StatCard
            icon={<Heart className="w-3.5 h-3.5" />}
            label="Avg HRV"
            value={profileData.avgHRV}
            unit="ms"
            color="#7BA7A0"
          />
        </div>
      </div>

      {/* Sleep Data */}
      <div className="mb-5">
        <h3 className="text-foreground mb-3 flex items-center gap-2">
          <Moon className="w-4 h-4 text-[#A3B5D6]" />
          Sleep Data
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          <StatCard
            icon={<Moon className="w-3.5 h-3.5" />}
            label="Avg Sleep"
            value={profileData.avgSleep}
            unit="hours"
            color="#A3B5D6"
          />
          <StatCard
            icon={<Moon className="w-3.5 h-3.5" />}
            label="Avg Deep Sleep"
            value={profileData.avgDeepSleep}
            unit="hours"
            color="#B8A088"
          />
        </div>
      </div>

      {/* Check-in Stats */}
      <div className="mb-6">
        <h3 className="text-foreground mb-3 flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-[#7BA7A0]" />
          Check-in Activity
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          <StatCard
            icon={<ClipboardCheck className="w-3.5 h-3.5" />}
            label="Total Check-ins"
            value={profileData.checkIns}
            unit="entries"
            color="#7BA7A0"
          />
          <StatCard
            icon={<Clock className="w-3.5 h-3.5" />}
            label="Current Streak"
            value={profileData.streak}
            unit="days"
            color="#B8A088"
          />
        </div>
      </div>

      {/* Settings */}
      <div className="bg-card rounded-xl border border-border px-4">
        <SettingItem
          icon={<Bell className="w-4.5 h-4.5" />}
          label="Notifications"
          value={notificationsEnabled ? "On" : "Off"}
          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
        />
        <SettingItem
          icon={<Smartphone className="w-4.5 h-4.5" />}
          label="Connected Devices"
          value="Apple Watch"
        />
        <SettingItem
          icon={<Shield className="w-4.5 h-4.5" />}
          label="Privacy & Data"
        />
        <SettingItem
          icon={<HelpCircle className="w-4.5 h-4.5" />}
          label="Help & Support"
        />
        <SettingItem
          icon={<LogOut className="w-4.5 h-4.5" />}
          label="Sign Out"
          danger
        />
      </div>

      <p className="text-center text-[11px] text-muted-foreground mt-6">
        Rhythm v1.0 · Your data stays on your device
      </p>
    </div>
  );
}
