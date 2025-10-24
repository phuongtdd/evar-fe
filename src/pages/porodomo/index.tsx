"use client";

import { useState } from "react";
import { Tabs } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { TimerDisplay } from "./components/timer-display";
import { TimerControls } from "./components/timer-control";
import { SettingsModal } from "./components/setting-modal";
import "./style/pomodoro.css";

export type SessionType = "focus" | "shortBreak" | "longBreak";

export interface TimerSettings {
  focus: number;
  shortBreak: number;
  longBreak: number;
}

const PomodoroModule = () => {
  const [activeTab, setActiveTab] = useState<SessionType>("focus");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [settings, setSettings] = useState<TimerSettings>({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  const handleTabChange = (key: string) => {
    setActiveTab(key as SessionType);
    setIsRunning(false);

    const timeMap: Record<SessionType, number> = {
      focus: settings.focus * 60,
      shortBreak: settings.shortBreak * 60,
      longBreak: settings.longBreak * 60,
    };
    setTimeLeft(timeMap[key as SessionType]);
  };

  const handleSettingsSave = (newSettings: TimerSettings) => {
    setSettings(newSettings);

    const timeMap: Record<SessionType, number> = {
      focus: newSettings.focus * 60,
      shortBreak: newSettings.shortBreak * 60,
      longBreak: newSettings.longBreak * 60,
    };
    setTimeLeft(timeMap[activeTab]);
    setIsSettingsOpen(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    const timeMap: Record<SessionType, number> = {
      focus: settings.focus * 60,
      shortBreak: settings.shortBreak * 60,
      longBreak: settings.longBreak * 60,
    };
    setTimeLeft(timeMap[activeTab]);
  };

  const getSessionLabel = (): string => {
    const labels: Record<SessionType, string> = {
      focus: "Giai đoạn tập trung",
      shortBreak: "Giai đoạn nghỉ ngắn",
      longBreak: "Giai đoạn nghỉ dài",
    };
    return labels[activeTab];
  };

  return (
    <>
      <div className="w-full h-screen">
        <div className="flex justify-between w-full items-center  mt-5 mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Podomomo</h1>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <SettingOutlined className="text-2xl text-gray-600" />
          </button>
        </div>

        <div className="flex-1 w-full h-screen bg-gradient-to-br flex flex-col">
          <div className="mx-auto w-full flex flex-col gap-12">
            <div className="mb-12  w-full flex flex-col items-center">
              <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                items={[
                  { key: "focus", label: "Tập trung" },
                  { key: "shortBreak", label: "Nghỉ ngắn" },
                  { key: "longBreak", label: "Nghỉ dài" },
                ]}
                className="pomodoro-tabs"
              />
            </div>

            <TimerDisplay
              timeLeft={timeLeft}
              sessionLabel={getSessionLabel()}
            />

            <TimerControls
              isRunning={isRunning}
              onPlayPause={() => setIsRunning(!isRunning)}
              onReset={handleReset}
              timeLeft={timeLeft}
              onTimeChange={setTimeLeft}
              totalTime={
                activeTab === "focus"
                  ? settings.focus * 60
                  : activeTab === "shortBreak"
                  ? settings.shortBreak * 60
                  : settings.longBreak * 60
              }
            />

            <div className="text-center mt-12 text-gray-600">
              Giai đoạn tập trung
            </div>
          </div>
        </div>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSettingsSave}
          currentSettings={settings}
        />
      </div>
    </>
  );
};

export default PomodoroModule;
