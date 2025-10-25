"use client"

import { useEffect } from "react"
import { PlayCircleOutlined, ReloadOutlined } from "@ant-design/icons"
import startIcon from "../../../assets/icons/Arrow_drop_down_big.png"
interface TimerControlsProps {
  isRunning: boolean
  onPlayPause: () => void
  onReset: () => void
  timeLeft: number
  onTimeChange: (time: number) => void
  totalTime: number
}

export function TimerControls({ isRunning, onPlayPause, onReset, timeLeft, onTimeChange }: TimerControlsProps) {
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return

    const interval = setInterval(() => {
      onTimeChange(timeLeft - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, onTimeChange])

  return (
    <div className="flex justify-center items-center gap-8">
      <button onClick={onReset} className="p-3 !hover:bg-white rounded-full transition-colors">
        <ReloadOutlined className="text-2xl text-gray-600" />
      </button>

      <button
        onClick={onPlayPause}
        className="w-24 h-24 !rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg"
      >
        <img src={startIcon} alt="startIcon"/>
      </button>
    </div>
  )
}
