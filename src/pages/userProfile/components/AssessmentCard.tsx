import type React from "react"
import type { Assessment } from "../types"
import "../styles/AssessmentCard.css"

interface AssessmentCardProps {
  assessments: Assessment[]
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessments }) => {
  // Hàm lấy class cho thanh tiến trình dựa vào màu
  const getProgressBarClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      "#6392e9": "progress-bar-blue",
      "#4caf50": "progress-bar-green",
      "#ffc107": "progress-bar-yellow",
      "#ff8800": "progress-bar-orange",
    }
    return colorMap[color] || "progress-bar"
  }

  return (
    <div className="assessment-card">
      <h6 className="assessment-title">
        Đánh giá chung
      </h6>
      <div className="assessment-list">
        {assessments.map((assessment, index) => {
          const percentage = (assessment.value / assessment.max) * 100
          return (
            <div key={index} className="assessment-item">
              <span className="assessment-label">{assessment.label}</span>
              <div 
                className={`progress-bar ${getProgressBarClass(assessment.color)}`}
                style={{ '--percentage': `${percentage}%` } as React.CSSProperties}
              />
              <span className="assessment-value">
                {assessment.value}/{assessment.max}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AssessmentCard
