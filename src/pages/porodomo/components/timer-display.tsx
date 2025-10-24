"use client"

interface TimerDisplayProps {
  timeLeft: number
  sessionLabel: string
}

export function TimerDisplay({ timeLeft, sessionLabel }: TimerDisplayProps) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const formatTime = (num: number) => String(num).padStart(2, "0")

  return (
    <div className="text-center mb-12">
      <p className="text-gray-600 mb-6 text-lg">{sessionLabel}</p>
      <div className="text-9xl font-black text-gray-900 tracking-tight">
        {formatTime(minutes)}:{formatTime(seconds)}
      </div>
    </div>
  )
}
