"use client"

import type React from "react"
import type { Activity } from "../types"
import "../styles/ActivitiesTable.css"

interface ActivitiesTableProps {
  activities: Activity[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const ActivitiesTable: React.FC<ActivitiesTableProps> = ({ activities, currentPage, totalPages, onPageChange }) => {
  return (
    <div className="activities-table">
      <h6 className="activities-title">
        Hoạt động gần đây
      </h6>
      
      {/* Bảng hoạt động */}
      <div className="table-container">
        <table className="activities-table-element">
          <thead>
            <tr className="table-header">
              <th className="table-header-cell">Hoạt động</th>
              <th className="table-header-cell">Thời gian</th>
              <th className="table-header-cell">Loại</th>
              <th className="table-header-cell">Môn học</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr key={activity.id} className="table-row">
                <td className="table-cell">{activity.name}</td>
                <td className="table-cell-time">{activity.time}</td>
                <td className="table-cell">
                  <span 
                    className="type-badge"
                    style={{ backgroundColor: activity.typeColor }}
                  >
                    {activity.type}
                  </span>
                </td>
                <td className="table-cell">
                  <span 
                    className="subject-badge"
                    style={{ backgroundColor: activity.subjectColor }}
                  >
                    {activity.subject}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="pagination-container">
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`pagination-button ${currentPage === page ? 'active' : 'inactive'}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="pagination-button arrow"
        >
          →
        </button>
      </div>
    </div>
  )
}

export default ActivitiesTable
