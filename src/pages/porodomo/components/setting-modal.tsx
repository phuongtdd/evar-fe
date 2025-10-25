"use client";

import { useState } from "react";
import { Modal, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import type { TimerSettings } from "..";
import "../style/settings-modal.css";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: TimerSettings) => void;
  currentSettings: TimerSettings;
}

export function SettingsModal({
  isOpen,
  onClose,
  onSave,
  currentSettings,
}: SettingsModalProps) {
  const [settings, setSettings] = useState<TimerSettings>(currentSettings);

  const handleSave = () => {
    onSave(settings);
  };

  const handleCancel = () => {
    setSettings(currentSettings);
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold text-gray-900">
            Cài đặt thời gian
          </span>
          <button
            onClick={handleCancel}
            className="text-red-500 hover:text-red-600 text-xl"
          >
            <CloseOutlined />
          </button>
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={500}
      centered
      wrapClassName="settings-modal-wrapper"
    >
      <div className="space-y-6">
        <p className="text-gray-600 text-sm">
          Tùy chỉnh thời lượng bổ đêm thời gian
        </p>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            Thời gian tập trung
          </label>
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  focus: Math.max(1, settings.focus - 1),
                })
              }
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
            >
              −
            </button>
            <span className="text-2xl font-semibold text-gray-900 min-w-16 text-center">
              {settings.focus}
              <span className="text-gray-500 ml-3">phút</span>
            </span>
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  focus: settings.focus + 1,
                })
              }
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors ml-auto"
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Nghỉ ngắn</label>
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  shortBreak: Math.max(1, settings.shortBreak - 1),
                })
              }
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
            >
              −
            </button>
            <span className="text-2xl font-semibold text-gray-900 min-w-16 text-center">
              {settings.shortBreak}
               <span className="text-gray-500 ml-3">phút</span>
            </span>
           
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  shortBreak: settings.shortBreak + 1,
                })
              }
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors ml-auto"
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Nghỉ dài</label>
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  longBreak: Math.max(1, settings.longBreak - 1),
                })
              }
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
            >
              −
            </button>
            <span className="text-2xl font-semibold text-gray-900 min-w-16 text-center">
              {settings.longBreak}
                 <span className="text-gray-500 ml-3">phút</span>
            </span>
         
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  longBreak: settings.longBreak + 1,
                })
              }
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors ml-auto"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={handleCancel} className="settings-btn-cancel flex-1">
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            className="settings-btn-primary flex-1"
          >
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </Modal>
  );
}
