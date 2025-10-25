"use client"

import { useState, useEffect } from "react"
import type { Activity } from "../types"
import { getActivities } from "../services"

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const totalPages = 5

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        const data = await getActivities(currentPage)
        setActivities(data)
      } catch (err) {
        console.error("Failed to load activities")
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [currentPage])

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return { activities, loading, currentPage, totalPages, goToPage }
}
