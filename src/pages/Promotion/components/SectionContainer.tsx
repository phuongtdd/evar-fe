import type React from "react"

type SectionContainerProps = {
  children: React.ReactNode
  className?: string
}

const SectionContainer: React.FC<SectionContainerProps> = ({ children, className }) => (
  <section className={`max-w-7xl mx-auto px-6 md:px-8 ${className || ""}`}>{children}</section>
)

export default SectionContainer
