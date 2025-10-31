import React from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Divider, 
  Tag, 
  Space,
  Descriptions,
  Statistic,
  Timeline,
  Avatar
} from 'antd';
import { 
  RocketOutlined, 
  BulbOutlined, 
  TeamOutlined, 
  SafetyOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  BarChartOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const About: React.FC = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Row gutter={[32, 32]} style={{ marginBottom: '32px' }}>
        <Col span={24}>
          <Card style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Title level={1} style={{ marginBottom: '16px', color: '#1890ff' }}>
                🎓 EVAR - Educational Virtual Assessment & Resources
              </Title>
              <Paragraph style={{ fontSize: '20px', marginBottom: '8px', fontWeight: 500 }}>
                A Modern AI-Powered Learning Management System
              </Paragraph>
              <Space size="large">
                <Tag color="blue">React 18.3.0</Tag>
                <Tag color="geekblue">TypeScript 5.9.3</Tag>
                <Tag color="purple">Vite 7.1.7</Tag>
                <Tag color="cyan">TailwindCSS 4.1.14</Tag>
                <Tag color="green">MIT License</Tag>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      {/* About Project */}
      <Row gutter={[32, 32]}>
        <Col span={24}>
          <Card 
            title={<Title level={2} style={{ margin: 0 }}>📖 Về Dự Án</Title>}
            bordered={false}
            style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              <strong>EVAR</strong> (Educational Virtual Assessment & Resources) là một nền tảng quản lý học tập toàn diện, 
              được trang bị AI, được thiết kế để cách mạng hóa giáo dục trực tuyến. Được xây dựng bằng các công nghệ web hiện đại, 
              EVAR cung cấp cho giáo viên và học sinh các công cụ mạnh mẽ để tạo, quản lý và thực hiện đánh giá trong khi tận dụng 
              các khả năng AI tiên tiến để nâng cao trải nghiệm học tập.
            </Paragraph>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Nền tảng này kết hợp các tính năng LMS truyền thống với các chức năng sáng tạo được AI hỗ trợ, bao gồm hệ thống gia sư thông minh, 
              tạo đề thi tự động, nhận diện khuôn mặt để chống gian lận và các công cụ cộng tác thời gian thực.
            </Paragraph>
          </Card>
        </Col>

        {/* Key Highlights */}
        <Col span={24}>
          <Card 
            title={<Title level={2} style={{ margin: 0 }}>✨ Điểm Nổi Bật</Title>}
            bordered={false}
            style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} lg={6}>
                <Card 
                  hoverable
                  style={{ 
                    textAlign: 'center', 
                    height: '100%',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                  bodyStyle={{ padding: '32px 24px' }}
                >
                  <BulbOutlined style={{ fontSize: '56px', color: '#fff', marginBottom: '16px' }} />
                  <Title level={4} style={{ color: '#fff', marginBottom: '12px' }}>AI-Powered Learning</Title>
                  <Paragraph style={{ color: '#fff', margin: 0 }}>
                    Intelligent tutoring system with RAG-based chatbot
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card 
                  hoverable
                  style={{ 
                    textAlign: 'center', 
                    height: '100%',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                  }}
                  bodyStyle={{ padding: '32px 24px' }}
                >
                  <RocketOutlined style={{ fontSize: '56px', color: '#fff', marginBottom: '16px' }} />
                  <Title level={4} style={{ color: '#fff', marginBottom: '12px' }}>Smart Assessment</Title>
                  <Paragraph style={{ color: '#fff', margin: 0 }}>
                    AI-driven exam creation and automated grading
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card 
                  hoverable
                  style={{ 
                    textAlign: 'center', 
                    height: '100%',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                  }}
                  bodyStyle={{ padding: '32px 24px' }}
                >
                  <EyeOutlined style={{ fontSize: '56px', color: '#fff', marginBottom: '16px' }} />
                  <Title level={4} style={{ color: '#fff', marginBottom: '12px' }}>Anti-Cheating</Title>
                  <Paragraph style={{ color: '#fff', margin: 0 }}>
                    Real-time face detection and monitoring
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card 
                  hoverable
                  style={{ 
                    textAlign: 'center', 
                    height: '100%',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                  }}
                  bodyStyle={{ padding: '32px 24px' }}
                >
                  <VideoCameraOutlined style={{ fontSize: '56px', color: '#fff', marginBottom: '16px' }} />
                  <Title level={4} style={{ color: '#fff', marginBottom: '12px' }}>Collaboration</Title>
                  <Paragraph style={{ color: '#fff', margin: 0 }}>
                    Real-time video conferencing integration
                  </Paragraph>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Features Section */}
        <Col span={24}>
          <Card 
            title={<Title level={2} style={{ margin: 0 }}>🚀 Tính Năng Chính</Title>}
            bordered={false}
            style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12} lg={8}>
                <Card 
                  size="small"
                  hoverable
                  style={{ height: '100%', borderRadius: '12px' }}
                  title={<Text strong>🧠 AI-Powered Features</Text>}
                >
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    <li>AI Tutor (EVA Tutor)</li>
                    <li>RAG-based chatbot</li>
                    <li>Automatic flashcard generation</li>
                    <li>AI Exam Generation</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Card 
                  size="small"
                  hoverable
                  style={{ height: '100%', borderRadius: '12px' }}
                  title={<Text strong>📝 Assessment & Examination</Text>}
                >
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    <li>Quiz Management</li>
                    <li>Secure Exam System</li>
                    <li>Face detection verification</li>
                    <li>Auto-submission</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Card 
                  size="small"
                  hoverable
                  style={{ height: '100%', borderRadius: '12px' }}
                  title={<Text strong>📚 Learning Resources</Text>}
                >
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    <li>PDF Upload & Processing</li>
                    <li>OCR technology</li>
                    <li>Knowledge base creation</li>
                    <li>Study Materials library</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Card 
                  size="small"
                  hoverable
                  style={{ height: '100%', borderRadius: '12px' }}
                  title={<Text strong>👥 Collaboration</Text>}
                >
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    <li>Virtual Rooms</li>
                    <li>Real-time chat</li>
                    <li>Screen sharing</li>
                    <li>File sharing</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Card 
                  size="small"
                  hoverable
                  style={{ height: '100%', borderRadius: '12px' }}
                  title={<Text strong>🎯 Productivity Tools</Text>}
                >
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    <li>Pomodoro Timer</li>
                    <li>Focus sessions</li>
                    <li>Productivity tracking</li>
                    <li>Break reminders</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Card 
                  size="small"
                  hoverable
                  style={{ height: '100%', borderRadius: '12px' }}
                  title={<Text strong>📊 Analytics</Text>}
                >
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    <li>Performance metrics</li>
                    <li>Interactive charts</li>
                    <li>Progress tracking</li>
                    <li>Detailed reports</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Team Section */}
        <Col span={24}>
          <Card 
            title={<Title level={2} style={{ margin: 0 }}>👥 Đội Ngũ Phát Triển</Title>}
            bordered={false}
            style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            <Row gutter={[32, 32]}>
              <Col xs={24} md={12}>
                <Title level={3}>💻 Core Development Team</Title>
                <Row gutter={[16, 24]}>
                  <Col span={12}>
                    <Card hoverable style={{ borderRadius: '12px', textAlign: 'center' }}>
                      <Avatar size={64} src="https://github.com/phuongtdd.png" style={{ marginBottom: '12px' }} />
                      <Title level={5} style={{ marginBottom: '4px' }}>Trần Đình Duy Phương</Title>
                      <Tag color="blue">Full-stack Developer</Tag>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card hoverable style={{ borderRadius: '12px', textAlign: 'center' }}>
                      <Avatar size={64} src="https://github.com/BaoKhanh04.png" style={{ marginBottom: '12px' }} />
                      <Title level={5} style={{ marginBottom: '4px' }}>Hoàng Võ Bảo Khánh</Title>
                      <Tag color="geekblue">Front-end Developer</Tag>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card hoverable style={{ borderRadius: '12px', textAlign: 'center' }}>
                      <Avatar size={64} src="https://github.com/nauthen.png" style={{ marginBottom: '12px' }} />
                      <Title level={5} style={{ marginBottom: '4px' }}>Trịnh Nam Thuận</Title>
                      <Tag color="orange">Back-end Developer</Tag>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card hoverable style={{ borderRadius: '12px', textAlign: 'center' }}>
                      <Avatar size={64} src="https://github.com/NguyendatGH.png" style={{ marginBottom: '12px' }} />
                      <Title level={5} style={{ marginBottom: '4px' }}>Nguyễn Tấn Đạt</Title>
                      <Tag color="purple">Full-stack Developer</Tag>
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} md={12}>
                <Title level={3}>🎯 Trách Nhiệm Đội Ngũ</Title>
                <Descriptions 
                  column={1} 
                  bordered 
                  size="small"
                  style={{ background: '#fff' }}
                >
                  <Descriptions.Item label="🏗️ Architecture">
                    System design, scalability, and performance optimization
                  </Descriptions.Item>
                  <Descriptions.Item label="🎨 Frontend">
                    UI/UX design, React development, and responsive interfaces
                  </Descriptions.Item>
                  <Descriptions.Item label="⚙️ Backend">
                    API development, database management, and server logic
                  </Descriptions.Item>
                  <Descriptions.Item label="🤖 AI/ML">
                    Machine learning models, RAG system, and AI integration
                  </Descriptions.Item>
                  <Descriptions.Item label="🔒 Security">
                    Security audits, data protection, and compliance
                  </Descriptions.Item>
                  <Descriptions.Item label="📊 DevOps">
                    CI/CD pipelines, deployment, and infrastructure
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Project Status */}
        <Col span={24}>
          <Card 
            title={<Title level={2} style={{ margin: 0 }}>📈 Trạng Thái Dự Án</Title>}
            bordered={false}
            style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            <Row gutter={[32, 32]}>
              <Col span={24}>
                <Paragraph style={{ fontSize: '16px', marginBottom: '24px' }}>
                  🚧 <strong>Active Development</strong> - The project is under active development with regular updates 
                  and new features being added.
                </Paragraph>
                <div style={{ marginBottom: '24px' }}>
                  <Title level={4}>Recent Updates:</Title>
                  <Timeline>
                    <Timeline.Item color="green">
                      <Text strong>AI Tutor integration</Text> with RAG-based chatbot
                    </Timeline.Item>
                    <Timeline.Item color="green">
                      <Text strong>Face detection</Text> for exam monitoring
                    </Timeline.Item>
                    <Timeline.Item color="green">
                      <Text strong>PDF upload and OCR</Text> processing
                    </Timeline.Item>
                    <Timeline.Item color="green">
                      <Text strong>Real-time video</Text> conferencing
                    </Timeline.Item>
                    <Timeline.Item color="green">
                      <Text strong>Automated flashcard</Text> generation
                    </Timeline.Item>
                    <Timeline.Item color="green">
                      <Text strong>Enhanced dashboard</Text> analytics
                    </Timeline.Item>
                  </Timeline>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Statistic 
                  title="Technology Stack" 
                  value="25+" 
                  suffix="Libraries"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Statistic 
                  title="Active Developers" 
                  value={4} 
                  suffix="Members"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Statistic 
                  title="Version" 
                  value="0.0.0" 
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default About;
