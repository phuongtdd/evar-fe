"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

// Staggered animation hook for list items
export const useStaggerAnimation = (itemCount: number, delay = 100) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(Array(itemCount).fill(false))

  useEffect(() => {
    const timers = Array.from({ length: itemCount }).map((_, i) =>
      setTimeout(() => {
        setVisibleItems((prev) => {
          const newState = [...prev]
          newState[i] = true
          return newState
        })
      }, i * delay),
    )
    return () => timers.forEach((t) => clearTimeout(t))
  }, [itemCount, delay])

  return visibleItems
}

// Intersection observer hook for scroll animations
export const useInViewAnimation = (options?: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, ...options },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [options])

  return { ref, isInView }
}

// Animated text component with character-level animations
export const AnimatedText: React.FC<{
  text: string
  className?: string
  delay?: number
}> = ({ text, className = "", delay = 0 }) => {
  const [visibleChars, setVisibleChars] = useState(0)

  useEffect(() => {
    if (visibleChars < text.length) {
      const timer = setTimeout(() => {
        setVisibleChars((prev) => prev + 1)
      }, 30 + delay)
      return () => clearTimeout(timer)
    }
  }, [visibleChars, text.length, delay])

  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className={`inline-block transition-all duration-300 ${i < visibleChars ? "opacity-100" : "opacity-0"}`}
        >
          {char}
        </span>
      ))}
    </span>
  )
}

// Floating animation component
export const FloatingElement: React.FC<{
  children: React.ReactNode
  delay?: number
  duration?: number
  distance?: number
}> = ({ children, delay = 0, duration = 3, distance = 20 }) => {
  return (
    <div
      style={{
        animation: `float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-${distance}px);
          }
        }
      `}</style>
    </div>
  )
}

// Gradient shift animation component
export const GradientShift: React.FC<{
  children: React.ReactNode
  colors: string[]
  duration?: number
}> = ({ children, colors, duration = 6 }) => {
  const gradientStops = colors.join(", ")
  return (
    <div
      style={{
        background: `linear-gradient(90deg, ${gradientStops})`,
        backgroundSize: "200% 200%",
        animation: `gradientShift ${duration}s ease infinite`,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  )
}

// Pulse scale animation
export const PulseScale: React.FC<{
  children: React.ReactNode
  delay?: number
}> = ({ children, delay = 0 }) => {
  return (
    <div
      style={{
        animation: `pulseScale 2s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes pulseScale {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}
