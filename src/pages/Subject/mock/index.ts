import type { Subject } from "../types"

export const generateMockSubjects = (): Subject[] => {
  const subjects = [
    {
      id: "1",
      subject_name: "Mathematics",
      description: "Advanced calculus and algebra concepts",
      grade: 95,
      create_at: new Date("2024-01-15"),
      create_by: "Admin User",
      update_at: new Date("2024-10-20"),
      update_by: "Admin User",
    },
    {
      id: "2",
      subject_name: "Physics",
      description: "Classical mechanics and thermodynamics",
      grade: 88,
      create_at: new Date("2024-02-10"),
      create_by: "Admin User",
      update_at: new Date("2024-10-18"),
      update_by: "Admin User",
    },
    {
      id: "3",
      subject_name: "Chemistry",
      description: "Organic and inorganic chemistry fundamentals",
      grade: 92,
      create_at: new Date("2024-03-05"),
      create_by: "Admin User",
      update_at: new Date("2024-10-19"),
      update_by: "Admin User",
    },
    {
      id: "4",
      subject_name: "Biology",
      description: "Cell biology and genetics",
      grade: 85,
      create_at: new Date("2024-01-20"),
      create_by: "Admin User",
      update_at: new Date("2024-10-17"),
      update_by: "Admin User",
    },
    {
      id: "5",
      subject_name: "English Literature",
      description: "Classic and contemporary literature analysis",
      grade: 90,
      create_at: new Date("2024-02-28"),
      create_by: "Admin User",
      update_at: new Date("2024-10-20"),
      update_by: "Admin User",
    },
    {
      id: "6",
      subject_name: "History",
      description: "World history and civilization studies",
      grade: 87,
      create_at: new Date("2024-03-12"),
      create_by: "Admin User",
      update_at: new Date("2024-10-16"),
      update_by: "Admin User",
    },
  ]

  return subjects
}
