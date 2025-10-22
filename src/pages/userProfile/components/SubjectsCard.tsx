import type React from "react"
import type { Subject } from "../types"
import "../styles/SubjectsCard.css"

interface SubjectsCardProps {
  subjects: Subject[]
}

const SubjectsCard: React.FC<SubjectsCardProps> = ({ subjects }) => {
  // Trả về giao diện khung các môn đã khám phá
  return (
    <div className="subjects-card">
      <h6 className="subjects-title">
        Các môn đã khám phá
      </h6>
      <div className="subjects-list">
        {subjects.map((subject, index) => (
          <span 
            key={index} 
            className="subject-tag"
            style={{ backgroundColor: subject.color }}
          >
            {subject.name}
          </span>
        ))}
        <span className="subject-tag-more">
          +12
        </span>
      </div>
    </div>
  )
}

export default SubjectsCard
