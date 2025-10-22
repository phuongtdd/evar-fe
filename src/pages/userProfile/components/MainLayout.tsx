import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import StatsCard from './StatsCard';
import ProfileCard from './ProfileCard';
import AssessmentCard from './AssessmentCard';
import SubjectsCard from './SubjectsCard';
import ActivitiesTable from './ActivitiesTable';
import type { UserProfile, Assessment, Subject, Activity } from '../types';
import '../styles/MainLayout.css';

interface MainLayoutProps {
  profile: UserProfile
  assessments: Assessment[]
  subjects: Subject[]
  activities: Activity[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const MainLayout: React.FC<MainLayoutProps> = ({
  profile,
  assessments,
  subjects,
  activities,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <Container fluid className="main-layout">
      {/* Khu vực trên cùng */}
      <Row className="top-section">
        <Col xs={12} md={4} className="mb-3 mb-md-0">
          <ProfileCard profile={profile} />
        </Col>
        <Col xs={12} md={8}>
          <Row className="mb-3">
            <Col xs={12}>
              <AssessmentCard assessments={assessments} />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={8} className="mb-3 mb-md-0">
              <SubjectsCard subjects={subjects} />
            </Col>
            <Col xs={12} md={4}>
              <StatsCard />
            </Col>
          </Row>
        </Col>
      </Row>
      {/* Khu vực hoạt động gần đây */}
      <Row>
        <Col xs={12}>
          <ActivitiesTable
            activities={activities}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default MainLayout
