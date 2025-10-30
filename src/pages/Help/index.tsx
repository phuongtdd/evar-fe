import React from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Collapse, 
  Tag, 
  Divider,
  Timeline,
  Steps,
  Alert,
  Space,
  Descriptions
} from 'antd';
import { 
  QuestionCircleOutlined, 
  BookOutlined, 
  VideoCameraOutlined,
  FileTextOutlined,
  SafetyOutlined,
  MessageOutlined,
  RocketOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text, Link } = Typography;
const { Panel } = Collapse;

const Help: React.FC = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Row gutter={[32, 32]}>
        <Col span={24}>
          <Card style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <QuestionCircleOutlined style={{ fontSize: '64px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={1} style={{ marginBottom: '16px', color: '#1890ff' }}>
                Trợ Giúp & Hỗ Trợ
              </Title>
              <Paragraph style={{ fontSize: '18px', margin: 0 }}>
                Tìm câu trả lời cho các câu hỏi thường gặp về EVAR
              </Paragraph>
            </div>
          </Card>
        </Col>

        {/* Getting Started */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <RocketOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <Title level={2} style={{ margin: 0 }}>Bắt Đầu Sử Dụng</Title>
              </Space>
            }
            bordered={false}
            style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            <Collapse 
              ghost
              items={[
                {
                  key: '1',
                  label: <Text strong style={{ fontSize: '16px' }}>Làm thế nào để đăng ký tài khoản?</Text>,
                  children: (
                    <div>
                      <Alert
                        message="Hướng dẫn đăng ký"
                        description={
                          <div>
                            <Paragraph>
                              Để đăng ký tài khoản mới trên EVAR, bạn có thể thực hiện theo các bước sau:
                            </Paragraph>
                            <Steps
                              direction="vertical"
                              size="small"
                              items={[
                                {
                                  title: 'Truy cập trang đăng ký',
                                  description: 'Nhấn vào nút "Đăng ký" ở trang chủ',
                                  status: 'finish',
                                  icon: <CheckCircleOutlined />
                                },
                                {
                                  title: 'Điền thông tin',
                                  description: 'Nhập đầy đủ thông tin cá nhân, email và mật khẩu',
                                  status: 'finish',
                                  icon: <CheckCircleOutlined />
                                },
                                {
                                  title: 'Xác nhận email',
                                  description: 'Kiểm tra email và xác nhận tài khoản',
                                  status: 'finish',
                                  icon: <CheckCircleOutlined />
                                },
                                {
                                  title: 'Bắt đầu sử dụng',
                                  description: 'Đăng nhập và khám phá các tính năng của EVAR',
                                  status: 'finish',
                                  icon: <CheckCircleOutlined />
                                }
                              ]}
                            />
                          </div>
                        }
                        type="info"
                        showIcon
                      />
                    </div>
                  )
                },
                {
                  key: '2',
                  label: <Text strong style={{ fontSize: '16px' }}>Tôi có thể đăng nhập bằng cách nào?</Text>,
                  children: (
                    <div>
                      <Paragraph>
                        EVAR hỗ trợ nhiều phương thức đăng nhập:
                      </Paragraph>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                          <Card size="small" style={{ borderRadius: '8px' }}>
                            <Title level={5}>Email & Password</Title>
                            <Paragraph>Sử dụng email và mật khẩu đã đăng ký</Paragraph>
                          </Card>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Card size="small" style={{ borderRadius: '8px' }}>
                            <Title level={5}>Google Account</Title>
                            <Paragraph>Đăng nhập nhanh bằng tài khoản Google</Paragraph>
                          </Card>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Card size="small" style={{ borderRadius: '8px' }}>
                            <Title level={5}>Microsoft Account</Title>
                            <Paragraph>Đăng nhập bằng tài khoản Microsoft</Paragraph>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  )
                },
                {
                  key: '3',
                  label: <Text strong style={{ fontSize: '16px' }}>Làm thế nào để đổi mật khẩu?</Text>,
                  children: (
                    <div>
                      <Paragraph>
                        Để đổi mật khẩu tài khoản EVAR:
                      </Paragraph>
                      <ol style={{ paddingLeft: '24px' }}>
                        <li>Click vào avatar của bạn ở góc trên bên phải</li>
                        <li>Chọn "<strong>Đổi mật khẩu</strong>" từ dropdown menu</li>
                        <li>Nhập mật khẩu hiện tại và mật khẩu mới (tối thiểu 6 ký tự)</li>
                        <li>Xác nhận mật khẩu mới và nhấn "Đổi mật khẩu"</li>
                      </ol>
                      <Alert message="Lưu ý" description="Mật khẩu mới phải khác mật khẩu hiện tại và có độ dài tối thiểu 6 ký tự" type="warning" style={{ marginTop: '16px' }} />
                    </div>
                  )
                }
              ]}
            />
          </Card>
        </Col>

        {/* Features */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <BookOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                <Title level={2} style={{ margin: 0 }}>Tính Năng & Hướng Dẫn</Title>
              </Space>
            }
            bordered={false}
            style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            <Collapse ghost>
              <Panel header={<Text strong style={{ fontSize: '16px' }}>AI Tutor (EVA Tutor) là gì và cách sử dụng?</Text>} key="1">
                <div>
                  <Paragraph>
                    <strong>AI Tutor</strong> là hệ thống gia sư thông minh sử dụng công nghệ RAG (Retrieval-Augmented Generation) 
                    để cung cấp câu trả lời chính xác dựa trên tài liệu học tập của bạn.
                  </Paragraph>
                  <Divider />
                  <Title level={4}>✨ Các tính năng chính:</Title>
                  <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                    <Col xs={24} sm={12}>
                      <Tag color="blue" style={{ padding: '8px 16px', fontSize: '14px' }}>
                        RAG-based chatbot
                      </Tag>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Tag color="green" style={{ padding: '8px 16px', fontSize: '14px' }}>
                        Context-aware responses
                      </Tag>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Tag color="orange" style={{ padding: '8px 16px', fontSize: '14px' }}>
                        Automatic flashcard generation
                      </Tag>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Tag color="purple" style={{ padding: '8px 16px', fontSize: '14px' }}>
                        Vector search
                      </Tag>
                    </Col>
                  </Row>
                  <Title level={4}>📝 Cách sử dụng:</Title>
                  <Timeline
                    items={[
                      { children: 'Tải lên tài liệu PDF hoặc văn bản vào hệ thống' },
                      { children: 'Hệ thống tự động xử lý và tạo cơ sở tri thức' },
                      { children: 'Đặt câu hỏi trong chat AI Tutor' },
                      { children: 'Nhận câu trả lời thông minh dựa trên tài liệu' }
                    ]}
                  />
                </div>
              </Panel>
              <Panel header={<Text strong style={{ fontSize: '16px' }}>Làm thế nào để tạo Flashcard từ PDF?</Text>} key="2">
                <div>
                  <Paragraph>
                    EVAR hỗ trợ tạo flashcard tự động từ tài liệu PDF sử dụng công nghệ OCR và AI.
                  </Paragraph>
                  <Steps
                    current={-1}
                    items={[
                      { title: 'Upload PDF', description: 'Vào module Material và upload file PDF của bạn' },
                      { title: 'Processing', description: 'Hệ thống tự động xử lý và trích xuất nội dung' },
                      { title: 'Generate', description: 'Chọn "Tạo Flashcard" sau khi xử lý hoàn tất' },
                      { title: 'Review', description: 'Kiểm tra và chỉnh sửa flashcard nếu cần thiết' },
                      { title: 'Study', description: 'Bắt đầu học với flashcard của bạn' }
                    ]}
                  />
                  <Alert message="Lưu ý" description="Kích thước file PDF không được vượt quá 50MB. Định dạng file phải là PDF hợp lệ." type="info" style={{ marginTop: '16px' }} />
                </div>
              </Panel>
              <Panel header={<Text strong style={{ fontSize: '16px' }}>Cách tham gia và tạo phòng meeting?</Text>} key="3">
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card 
                      title="📤 Tạo Phòng" 
                      bordered={false}
                      style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                      headStyle={{ color: '#fff', border: 'none' }}
                      bodyStyle={{ color: '#fff' }}
                    >
                      <ol style={{ color: '#fff' }}>
                        <li>Vào "Phòng của tôi"</li>
                        <li>Nhấn "Tạo phòng"</li>
                        <li>Điền thông tin phòng</li>
                        <li>Chia sẻ link với người tham gia</li>
                        <li>Cho phép camera và microphone</li>
                      </ol>
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card 
                      title="📥 Tham Gia Phòng" 
                      bordered={false}
                      style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
                      headStyle={{ color: '#fff', border: 'none' }}
                      bodyStyle={{ color: '#fff' }}
                    >
                      <ol style={{ color: '#fff' }}>
                        <li>Click vào link phòng được chia sẻ</li>
                        <li>Cho phép truy cập camera</li>
                        <li>Cho phép truy cập microphone</li>
                        <li>Nhấn "Tham gia"</li>
                        <li>Bắt đầu meeting</li>
                      </ol>
                    </Card>
                  </Col>
                </Row>
              </Panel>
              <Panel header={<Text strong style={{ fontSize: '16px' }}>Làm thế nào để tạo quiz từ ảnh?</Text>} key="4">
                <div>
                  <Paragraph>
                    Tính năng "Tạo quiz từ ảnh" sử dụng công nghệ OCR (Optical Character Recognition) 
                    để nhận diện nội dung từ ảnh và tạo câu hỏi tự động.
                  </Paragraph>
                  <Alert 
                    message="Công nghệ sử dụng" 
                    description="OCR, Computer Vision, AI Question Generation"
                    type="success"
                    style={{ marginBottom: '16px' }}
                    showIcon
                  />
                  <Paragraph strong>Hướng dẫn chi tiết:</Paragraph>
                  <ol style={{ paddingLeft: '24px' }}>
                    <li>Vào module "Tạo quiz từ ảnh"</li>
                    <li>Upload ảnh chứa câu hỏi hoặc nội dung cần tạo quiz</li>
                    <li>Chờ hệ thống xử lý và nhận diện nội dung</li>
                    <li>Xem trước và chỉnh sửa các câu hỏi được tạo</li>
                    <li>Lưu quiz và sử dụng cho việc học/thi</li>
                  </ol>
                </div>
              </Panel>
            </Collapse>
          </Card>
        </Col>

        {/* Security */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <SafetyOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                <Title level={2} style={{ margin: 0 }}>Bảo Mật & Chống Gian Lận</Title>
              </Space>
            }
            bordered={false}
            style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            <Collapse ghost>
              <Panel header={<Text strong style={{ fontSize: '16px' }}>Hệ thống chống gian lận hoạt động như thế nào?</Text>} key="1">
                <Paragraph>
                  EVAR sử dụng công nghệ nhận diện khuôn mặt tiên tiến (<strong>face-api.js</strong>) để đảm bảo 
                  tính minh bạch và công bằng trong các kỳ thi trực tuyến.
                </Paragraph>
                <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                  <Col xs={24} sm={12} md={6}>
                    <Card size="small" style={{ textAlign: 'center', borderRadius: '8px' }}>
                      <CheckCircleOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
                      <Title level={5}>Xác minh danh tính</Title>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card size="small" style={{ textAlign: 'center', borderRadius: '8px' }}>
                      <CheckCircleOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
                      <Title level={5}>Phát hiện hành vi</Title>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card size="small" style={{ textAlign: 'center', borderRadius: '8px' }}>
                      <CheckCircleOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
                      <Title level={5}>Giám sát liên tục</Title>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card size="small" style={{ textAlign: 'center', borderRadius: '8px' }}>
                      <CheckCircleOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
                      <Title level={5}>Tự động cảnh báo</Title>
                    </Card>
                  </Col>
                </Row>
              </Panel>
              <Panel header={<Text strong style={{ fontSize: '16px' }}>Dữ liệu của tôi có được bảo mật không?</Text>} key="2">
                <Alert 
                  message="Bảo mật cao nhất" 
                  description={
                    <div>
                      <Paragraph>EVAR tuân thủ các tiêu chuẩn bảo mật quốc tế:</Paragraph>
                      <ul>
                        <li><strong>Mã hóa dữ liệu:</strong> Tất cả dữ liệu được mã hóa end-to-end</li>
                        <li><strong>Lưu trữ an toàn:</strong> Dữ liệu được lưu trữ trên server bảo mật</li>
                        <li><strong>Không chia sẻ:</strong> Chúng tôi không chia sẻ thông tin với bên thứ ba</li>
                        <li><strong>GDPR Compliant:</strong> Tuân thủ quy định bảo vệ dữ liệu cá nhân</li>
                      </ul>
                    </div>
                  }
                  type="success"
                  showIcon
                />
              </Panel>
            </Collapse>
          </Card>
        </Col>

        {/* Contact */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <MessageOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <Title level={2} style={{ margin: 0 }}>Liên Hệ Hỗ Trợ</Title>
              </Space>
            }
            bordered={false}
            style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Card 
                  title="📞 Thông Tin Liên Hệ" 
                  bordered={false}
                  style={{ borderRadius: '12px', height: '100%' }}
                >
                  <Divider />
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="GitHub Issues">
                      <Link href="https://github.com/phuongtdd/evar-fe/issues" target="_blank">
                        Tạo issue mới
                      </Link>
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      <Link href="mailto:support@evar.edu">support@evar.edu</Link>
                    </Descriptions.Item>
                    <Descriptions.Item label="Website">
                      <Link href="https://evar.edu" target="_blank">https://evar.edu</Link>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card 
                  title="🔗 Tài Nguyên & Liên Kết" 
                  bordered={false}
                  style={{ borderRadius: '12px', height: '100%' }}
                >
                  <Divider />
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Link href="/about" style={{ fontSize: '16px' }}>
                      📖 Giới thiệu về EVAR
                    </Link>
                    <Divider style={{ margin: '8px 0' }} />
                    <Link href="https://github.com/phuongtdd/evar-fe" target="_blank" style={{ fontSize: '16px' }}>
                      💻 GitHub Repository (Frontend)
                    </Link>
                    <Divider style={{ margin: '8px 0' }} />
                    <Link href="https://github.com/phuongtdd/evar-be.git" target="_blank" style={{ fontSize: '16px' }}>
                      ⚙️ Backend Repository
                    </Link>
                    <Divider style={{ margin: '8px 0' }} />
                    <Link href="./docs" style={{ fontSize: '16px' }}>
                      📚 Xem tài liệu đầy đủ
                    </Link>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Troubleshooting */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <FileTextOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />
                <Title level={2} style={{ margin: 0 }}>Khắc Phục Sự Cố</Title>
              </Space>
            }
            bordered={false}
            style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            <Collapse ghost>
              <Panel header={<Text strong style={{ fontSize: '16px' }}>Tôi không thể upload file PDF</Text>} key="1">
                <Alert 
                  message="Giải pháp khắc phục" 
                  description={
                    <ul>
                      <li>Kiểm tra kích thước file (tối đa 50MB)</li>
                      <li>Đảm bảo file ở định dạng PDF hợp lệ</li>
                      <li>Kiểm tra kết nối internet ổn định</li>
                      <li>Thử refresh trang hoặc đăng xuất/đăng nhập lại</li>
                      <li>Xóa cache trình duyệt và thử lại</li>
                    </ul>
                  }
                  type="warning"
                  showIcon
                />
              </Panel>
              <Panel header={<Text strong style={{ fontSize: '16px' }}>Video meeting bị lag hoặc mất tiếng</Text>} key="2">
                <Alert 
                  message="Cải thiện chất lượng video" 
                  description={
                    <ul>
                      <li><strong>Kiểm tra internet:</strong> Yêu cầu tốc độ tối thiểu 5 Mbps</li>
                      <li><strong>Đóng ứng dụng:</strong> Đóng các ứng dụng không cần thiết</li>
                      <li><strong>Reset thiết bị:</strong> Tắt và bật lại camera/microphone</li>
                      <li><strong>Refresh trang:</strong> Làm mới trang web</li>
                      <li><strong>Wifi:</strong> Chuyển sang mạng WiFi thay vì mobile data</li>
                    </ul>
                  }
                  type="info"
                  showIcon
                />
              </Panel>
              <Panel header={<Text strong style={{ fontSize: '16px' }}>Câu trả lời của AI Tutor không chính xác</Text>} key="3">
                <Alert 
                  message="Nâng cao độ chính xác" 
                  description={
                    <ul>
                      <li><strong>Chất lượng tài liệu:</strong> Upload file có chất lượng tốt, rõ ràng</li>
                      <li><strong>Nội dung liên quan:</strong> Đảm bảo tài liệu liên quan đến câu hỏi</li>
                      <li><strong>Diễn đạt rõ ràng:</strong> Đặt câu hỏi cụ thể và có ngữ cảnh</li>
                      <li><strong>Re-upload:</strong> Thử upload lại nếu quá trình xử lý trước đó có lỗi</li>
                    </ul>
                  }
                  type="success"
                  showIcon
                />
              </Panel>
              <Panel header={<Text strong style={{ fontSize: '16px' }}>Không thể đăng nhập vào tài khoản</Text>} key="4">
                <Alert 
                  message="Khắc phục lỗi đăng nhập" 
                  description={
                    <ul>
                      <li>Kiểm tra lại email và mật khẩu có đúng không</li>
                      <li>Thử <Link href="#forgot-password">quên mật khẩu</Link> nếu cần thiết</li>
                      <li>Xóa cache và cookies của trình duyệt</li>
                      <li>Thử đăng nhập bằng trình duyệt khác</li>
                      <li>Liên hệ support nếu vấn đề vẫn tiếp tục</li>
                    </ul>
                  }
                  type="error"
                  showIcon
                />
              </Panel>
            </Collapse>
          </Card>
        </Col>

        {/* Footer */}
        <Col span={24}>
          <Card style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Title level={4} style={{ marginBottom: '8px' }}>
                Made with ❤️ by the EVAR Team
              </Title>
              <Paragraph>
                ⭐ Star us on GitHub if you find this project useful!
              </Paragraph>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Help;
