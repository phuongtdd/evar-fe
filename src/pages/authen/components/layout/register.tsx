"use client";
import type React from "react";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { Modal, Typography } from "antd";
import { useRegisterHandler } from "../../hooks/authCustomHook";
import "../ui/Register.css";
import SocialLogin from "../ui/SocialLogin";

const { Title, Paragraph } = Typography;

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const { handleSubmit, loading, errorMsg } = useRegisterHandler();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword((s) => !s);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((s) => !s);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSubmit(
      username,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      agreeTerms
    );
  };

  const handleSocialRegister = (provider: string) => {
    console.log(`Register with ${provider}`);
  };

  return (
    <>
      <div className="flex flex-col item-center justify-center">

      <SocialLogin handleFunction={handleSocialRegister} flag="register" />
        <div className="divider mb-4">
          <span>Hoặc</span>
        </div>

        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3 d-flex gap-3" style={{ width: '100%' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <Form.Label>Họ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Họ"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="register-input"
                disabled={loading}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <Form.Label>Tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tên"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="register-input"
                disabled={loading}
                style={{ width: '100%' }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3 d-flex gap-3" style={{ width: '100%' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập địa chỉ email của bạn..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="register-input"
                disabled={loading}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="register-input"
                disabled={loading}
                style={{ width: '100%' }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3 d-flex gap-3" style={{ width: '100%' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <Form.Label>Mật khẩu</Form.Label>
              <div className="position-relative" style={{ width: '100%' }}>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="register-input password-input"
                  disabled={loading}
                  style={{ width: '100%' }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                  disabled={loading}
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <Form.Label>Xác nhận mật khẩu</Form.Label>
              <div className="position-relative" style={{ width: '100%' }}>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="register-input password-input"
                  disabled={loading}
                  style={{ width: '100%' }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label="Toggle confirm password visibility"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </Form.Group>

          <Form.Group className="mb-3 d-flex align-items-center">
            <Form.Check
              type="checkbox"
              id="agree-terms"
              label={
                <span>
                  Tôi đồng ý với{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTermsModal(true);
                    }}
                    style={{ color: "#1890ff", textDecoration: "underline", cursor: "pointer" }}
                  >
                    điều khoản dịch vụ
                  </a>
                </span>
              }
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="agree-terms"
              disabled={loading}
            />
          </Form.Group>

          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

          <Button type="submit" className="register-button w-100 mb-3" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>
        </Form>

        <p className="signup-text text-center mb-0">
          Đã có tài khoản ?{" "}
          <a
            href="#"
            className="signup-link"
            onClick={(e) => {
              e.preventDefault();
              navigate("/auth/login");
            }}
          >
            Đăng nhập
          </a>
        </p>
      </div>

      <Modal
        title="Điều khoản dịch vụ"
        open={showTermsModal}
        onCancel={() => setShowTermsModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowTermsModal(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
        centered
      >
        <div style={{ maxHeight: "70vh", overflowY: "auto", padding: "0 8px" }}>
          <Typography>
            <Title level={4}>1. Chấp nhận điều khoản</Title>
            <Paragraph>
              Bằng việc đăng ký và sử dụng dịch vụ, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện này. 
              Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, bạn không được phép sử dụng dịch vụ.
            </Paragraph>

            <Title level={4}>2. Tài khoản người dùng</Title>
            <Paragraph>
              <strong>2.1.</strong> Bạn phải cung cấp thông tin chính xác, đầy đủ và cập nhật khi đăng ký tài khoản.
              <br />
              <strong>2.2.</strong> Bạn chịu trách nhiệm bảo mật mật khẩu và tất cả các hoạt động diễn ra dưới tài khoản của bạn.
              <br />
              <strong>2.3.</strong> Bạn không được chia sẻ tài khoản với người khác hoặc sử dụng tài khoản của người khác.
              <br />
              <strong>2.4.</strong> Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản của bạn nếu vi phạm các điều khoản này.
            </Paragraph>

            <Title level={4}>3. Sử dụng dịch vụ</Title>
            <Paragraph>
              <strong>3.1.</strong> Bạn được phép sử dụng dịch vụ cho mục đích học tập và giáo dục hợp pháp.
              <br />
              <strong>3.2.</strong> Bạn không được sử dụng dịch vụ để:
              <ul>
                <li>Vi phạm pháp luật hoặc quy định nào đó</li>
                <li>Gây hại, đe dọa hoặc quấy rối người khác</li>
                <li>Phát tán nội dung vi phạm bản quyền hoặc bất hợp pháp</li>
                <li>Thực hiện bất kỳ hoạt động gian lận nào</li>
              </ul>
            </Paragraph>

            <Title level={4}>4. Quyền truy cập thiết bị và phương tiện</Title>
            <Paragraph>
              <strong>4.1. Quyền truy cập Webcam/Microphone:</strong>
              <br />
              Để sử dụng các tính năng của nền tảng, bạn cần cấp quyền truy cập webcam và microphone của thiết bị:
              <ul>
                <li><strong>Xác thực khuôn mặt:</strong> Nền tảng sử dụng webcam để xác thực danh tính của bạn trước khi làm bài thi/kiểm tra. Đây là tính năng bắt buộc để đảm bảo tính công bằng và chống gian lận thi cử.</li>
                <li><strong>Giám sát trong khi thi:</strong> Webcam có thể được sử dụng để giám sát bạn trong quá trình làm bài thi nhằm phát hiện các hành vi gian lận.</li>
                <li><strong>Phòng học nhóm trực tuyến:</strong> Webcam và microphone được sử dụng cho các buổi học nhóm, họp nhóm, và trao đổi trực tuyến.</li>
              </ul>
              <strong>4.2. Quyền chia sẻ màn hình:</strong>
              <br />
              Khi tham gia phòng học nhóm, bạn có thể cần cấp quyền chia sẻ màn hình để trình bày tài liệu hoặc làm việc nhóm.
              <br />
              <strong>4.3. Quyền từ chối:</strong>
              <br />
              Bạn có quyền từ chối cấp quyền truy cập, tuy nhiên việc từ chối có thể làm hạn chế hoặc không thể sử dụng một số tính năng của nền tảng (đặc biệt là các tính năng thi/kiểm tra và phòng học nhóm).
            </Paragraph>

            <Title level={4}>5. Quyền thu thập và xử lý dữ liệu sinh trắc học</Title>
            <Paragraph>
              <strong>5.1. Upload ảnh chân dung (Face ID Image):</strong>
              <br />
              Khi đăng ký tài khoản, bạn cần cung cấp một bức ảnh chân dung rõ mặt (tương tự như ảnh thẻ CMND/CCCD) để sử dụng làm ảnh tham chiếu (Reference Image) cho hệ thống xác thực khuôn mặt.
              <br />
              <strong>5.2. Xử lý dữ liệu khuôn mặt:</strong>
              <br />
              <ul>
                <li>Nền tảng sử dụng công nghệ AI (face-api.js) để xử lý và nhận diện khuôn mặt của bạn.</li>
                <li>Ảnh khuôn mặt của bạn sẽ được chuyển đổi thành vector (mã hóa số) để so sánh và xác thực danh tính.</li>
                <li><strong>Bảo mật:</strong> Toàn bộ quá trình xử lý AI diễn ra trên trình duyệt của bạn (client-side), đảm bảo dữ liệu sinh trắc học nhạy cảm không được gửi lên server AI bên ngoài.</li>
              </ul>
              <strong>5.3. Lưu trữ ảnh tham chiếu:</strong>
              <br />
              Ảnh chân dung của bạn sẽ được lưu trữ an toàn trong hệ thống và chỉ được sử dụng cho mục đích xác thực danh tính trong các kỳ thi/kiểm tra.
              <br />
              <strong>5.4. Mục đích sử dụng:</strong>
              <ul>
                <li>Xác thực danh tính trước khi bắt đầu làm bài thi/kiểm tra</li>
                <li>Chống gian lận thi cử, đặc biệt là phòng chống "thi hộ"</li>
                <li>Đảm bảo tính công bằng và minh bạch trong quá trình đánh giá</li>
              </ul>
              <strong>5.5. Yêu cầu về ảnh:</strong>
              <ul>
                <li>Ảnh phải là ảnh chân dung rõ mặt, nhìn thẳng</li>
                <li>Ảnh phải được chụp trong điều kiện ánh sáng tốt</li>
                <li>Không sử dụng ảnh có filter, kính râm che mắt, hoặc khẩu trang che mặt</li>
                <li>Ảnh phải là của chính bạn và phản ánh đúng diện mạo hiện tại</li>
              </ul>
            </Paragraph>

            <Title level={4}>6. Quyền upload và xử lý tài liệu học tập</Title>
            <Paragraph>
              <strong>6.1. Upload tài liệu PDF:</strong>
              <br />
              Bạn có thể upload các file PDF tài liệu học tập lên nền tảng để sử dụng với EVarTutor (Trợ lý học tập AI).
              <br />
              <strong>6.2. Xử lý tài liệu:</strong>
              <br />
              Khi bạn upload tài liệu PDF, nền tảng sẽ:
              <ul>
                <li>Sử dụng công nghệ OCR (Optical Character Recognition) để trích xuất văn bản từ tài liệu</li>
                <li>Áp dụng kỹ thuật Chunking để chia nhỏ tài liệu thành các đoạn thông tin</li>
                <li>Sử dụng Embedding Model để chuyển đổi nội dung thành vector và lưu trữ trong hệ thống (pgvector)</li>
                <li>Tạo Knowledge Base từ tài liệu của bạn</li>
              </ul>
              <strong>6.3. Tính năng tự động từ tài liệu:</strong>
              <br />
              Dựa trên tài liệu bạn upload, nền tảng có thể tự động tạo:
              <ul>
                <li><strong>Flashcard:</strong> Thẻ ghi nhớ để ôn tập</li>
                <li><strong>Keynote (Ý chính):</strong> Tóm tắt các điểm quan trọng trong tài liệu</li>
                <li><strong>Study Guide (Lộ trình học tập):</strong> Gợi ý lộ trình ôn luyện hiệu quả</li>
                <li><strong>Trả lời câu hỏi:</strong> EVarTutor sử dụng RAG (Retrieval-Augmented Generation) để trả lời câu hỏi dựa trên nội dung tài liệu của bạn</li>
              </ul>
              <strong>6.4. Bản quyền tài liệu:</strong>
              <br />
              Bạn đảm bảo rằng bạn có quyền upload các tài liệu mà bạn chia sẻ và việc upload không vi phạm bản quyền của bên thứ ba.
              <br />
              <strong>6.5. Lưu trữ tài liệu:</strong>
              <br />
              Tài liệu bạn upload sẽ được lưu trữ trong hệ thống và chỉ bạn (và những người được bạn chia sẻ) mới có thể truy cập.
            </Paragraph>

            <Title level={4}>7. Bảo mật thông tin</Title>
            <Paragraph>
              <strong>7.1.</strong> Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo Chính sách Bảo mật.
              <br />
              <strong>7.2.</strong> Bạn đồng ý rằng chúng tôi có thể thu thập, lưu trữ và sử dụng thông tin của bạn 
              theo quy định trong Chính sách Bảo mật.
              <br />
              <strong>7.3. Bảo mật dữ liệu sinh trắc học:</strong>
              <ul>
                <li>Dữ liệu khuôn mặt của bạn được mã hóa và xử lý một cách an toàn</li>
                <li>Xử lý AI diễn ra trên client-side (trình duyệt của bạn) để đảm bảo bảo mật tối đa</li>
                <li>Ảnh tham chiếu chỉ được sử dụng cho mục đích xác thực, không được chia sẻ với bên thứ ba</li>
              </ul>
            </Paragraph>

            <Title level={4}>8. Sở hữu trí tuệ</Title>
            <Paragraph>
              <strong>8.1.</strong> Tất cả nội dung trên nền tảng, bao gồm nhưng không giới hạn văn bản, hình ảnh, 
              logo, phần mềm, đều thuộc sở hữu của chúng tôi hoặc được cấp phép cho chúng tôi.
              <br />
              <strong>8.2.</strong> Bạn không được sao chép, phân phối, sửa đổi hoặc tạo ra các tác phẩm phái sinh 
              từ nội dung mà không có sự cho phép bằng văn bản từ chúng tôi.
            </Paragraph>

            <Title level={4}>9. Quyền giám sát và chống gian lận</Title>
            <Paragraph>
              <strong>9.1. Giám sát trong quá trình thi:</strong>
              <br />
              Nền tảng có thể sử dụng các công nghệ giám sát để phát hiện gian lận, bao gồm:
              <ul>
                <li>Giám sát webcam để đảm bảo đúng người đang làm bài</li>
                <li>Giám sát thao tác trên màn hình để phát hiện hành vi gian lận</li>
                <li>Phát hiện các hoạt động đáng ngờ trong quá trình thi</li>
              </ul>
              <strong>9.2. Xử lý vi phạm:</strong>
              <br />
              Nếu phát hiện hành vi gian lận, nền tảng có quyền:
              <ul>
                <li>Tạm dừng hoặc chấm dứt phiên làm bài của bạn</li>
                <li>Hủy kết quả thi/kiểm tra</li>
                <li>Ghi nhận vi phạm vào lịch sử tài khoản</li>
                <li>Áp dụng các biện pháp kỷ luật khác theo quy định</li>
              </ul>
              <strong>9.3. Cam kết của người dùng:</strong>
              <br />
              Bạn cam kết thực hiện bài thi/kiểm tra một cách trung thực, không sử dụng bất kỳ phương tiện gian lận nào.
            </Paragraph>

            <Title level={4}>10. Trách nhiệm pháp lý</Title>
            <Paragraph>
              <strong>10.1.</strong> Dịch vụ được cung cấp "như hiện tại" và "như có sẵn" mà không có bất kỳ bảo đảm nào.
              <br />
              <strong>10.2.</strong> Chúng tôi không chịu trách nhiệm về bất kỳ tổn thất hoặc thiệt hại nào phát sinh 
              từ việc sử dụng hoặc không thể sử dụng dịch vụ.
              <br />
              <strong>10.3.</strong> Bạn chịu trách nhiệm cho tất cả nội dung mà bạn tải lên hoặc chia sẻ trên nền tảng.
            </Paragraph>

            <Title level={4}>11. Chấm dứt dịch vụ</Title>
            <Paragraph>
              Chúng tôi có quyền chấm dứt hoặc tạm ngưng quyền truy cập của bạn vào dịch vụ bất cứ lúc nào, 
              vì bất kỳ lý do nào, mà không cần thông báo trước, nếu bạn vi phạm các điều khoản này.
            </Paragraph>

            <Title level={4}>12. Thay đổi điều khoản</Title>
            <Paragraph>
              Chúng tôi có quyền sửa đổi các điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay sau khi 
              được đăng tải trên nền tảng. Việc bạn tiếp tục sử dụng dịch vụ sau khi có thay đổi được coi là bạn 
              chấp nhận các điều khoản mới.
            </Paragraph>

            <Title level={4}>13. Liên hệ</Title>
            <Paragraph>
              Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi qua email hoặc 
              các kênh hỗ trợ chính thức của nền tảng.
            </Paragraph>

            <Paragraph style={{ marginTop: "24px", fontStyle: "italic", color: "#666" }}>
              <strong style={{ color: "#ff4d4f", fontWeight: "bold" }}>Lưu ý:</strong> Bằng việc đánh dấu vào ô "Tôi đồng ý với điều khoản dịch vụ", bạn xác nhận 
              rằng bạn đã đọc, hiểu và đồng ý với tất cả các điều khoản và điều kiện nêu trên.
            </Paragraph>
          </Typography>
        </div>
      </Modal>
    </>
  );
};

export default Register;