"use client";
import type React from "react";
import { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Layout } from "antd";
import Header from "../../Common/Header";
import Sidebar from "../../Common/Sidebar";
// Footer removed
import {
  loginWithUsernameOrEmail as apiLogin,
  setToken,
} from "../../../configs/authen";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const identifier = email.trim();
    if (!identifier || !password) {
      setErrorMsg("Vui lòng nhập username/email và password.");
      return;
    }

    setLoading(true);
    try {
      // use centralized auth helper (fetch inside authen.js)
      let data: any = await apiLogin(identifier, password);
      // if backend helper returned a raw JSON string, try to parse it
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (e) {
          // leave as string; will be handled below
        }
      }
      // debug log full response
      console.debug("Login response:", data);

      // accept token from several common fields to be tolerant to backend shape
      // also support backend responses like { code: 1000, data: { token: '...' } }
      const token =
        data?.result?.token ||
        data?.token ||
        data?.data?.token ||
        data?.access_token ||
        data?.result?.accessToken ||
        data?.result?.access_token;
      if (token) {
        setToken(token, rememberMe);
        // notify other components and redirect to home
        window.dispatchEvent(new Event("auth-changed"));
        // navigate using react-router so BrowserRouter picks it up
        navigate("/dashboard", { replace: true });
      } else {
        // show helpful diagnostic when server returns an unexpected shape
        const debugText = JSON.stringify(data || {});
        setErrorMsg(`Không nhận được token từ server. Response: ${debugText}`);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      // AbortError from timeout
      if (err?.name === "AbortError") {
        setErrorMsg("Yêu cầu quá thời gian (timeout). Vui lòng thử lại.");
      } else if (err?.message && err.message.includes("Failed to fetch")) {
        setErrorMsg(
          "Không kết nối được đến server. Kiểm tra server đang chạy / hoặc CORS."
        );
      } else {
        setErrorMsg(err?.message || "Lỗi khi đăng nhập");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <Layout className="h-screen">
      <Sidebar
        selectedKey={"home"}
        onMenuSelect={() => {}}
        collapsed={false}
        onToggle={() => {}}
      />
      <Layout>
        <Header />
        <Layout.Content className="overflow-auto">
          <div className="login-page content-with-sidebar">
            <div className="login-content">
              <div className="decorative-element rocket-1" aria-hidden="true">
                <img
                  src="/3d-rocket-blue-orange-flying.jpg"
                  alt=""
                  aria-hidden="true"
                />
              </div>
              <div className="decorative-element globe" aria-hidden="true">
                <img
                  src="/3d-globe-earth-on-platform-blue.jpg"
                  alt=""
                  aria-hidden="true"
                />
              </div>
              <div className="decorative-element candy" aria-hidden="true">
                <img
                  src="/3d-graduation-cap-wrapped-blue-orange.png"
                  alt=""
                  aria-hidden="true"
                />
              </div>
              <div className="decorative-element cards" aria-hidden="true">
                <img
                  src="/3d-credit-cards-blue-pink.jpg"
                  alt=""
                  aria-hidden="true"
                />
              </div>
              <div className="decorative-element rocket-2" aria-hidden="true">
                <img
                  src="/3d-rocket-small-blue-pink.jpg"
                  alt=""
                  aria-hidden="true"
                />
              </div>

              <Container>
                <Row className="justify-content-center">
                  <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                    <Card className="login-card">
                      <Card.Body className="p-4 p-md-5">
                        <div className="text-center mb-4">
                          <div className="login-icon mb-3">
                            <img
                              src="/square.png"
                              alt="decorative square"
                              className="icon-square-img"
                            />
                          </div>
                          <h2 className="login-title mb-2">Chào mừng</h2>
                          <p className="login-subtitle text-muted">
                            Vui lòng nhập phương thức đăng nhập của bạn
                          </p>
                        </div>

                        <div className="social-login mb-4">
                          <button
                            type="button"
                            className="social-btn"
                            onClick={() => handleSocialLogin("Microsoft")}
                            aria-label="Login with Microsoft"
                          >
                            <img src="/microsoft-logo.png" alt="Microsoft" />
                          </button>
                          <button
                            type="button"
                            className="social-btn"
                            onClick={() => handleSocialLogin("Google")}
                            aria-label="Login with Google"
                          >
                            <img src="/google-logo.png" alt="Google" />
                          </button>
                          <button
                            type="button"
                            className="social-btn"
                            onClick={() => handleSocialLogin("Telegram")}
                            aria-label="Login with Telegram"
                          >
                            <img src="/telegram-logo-blue.png" alt="Telegram" />
                          </button>
                        </div>

                        <div className="divider mb-4">
                          <span>Hoặc</span>
                        </div>

                        <Form onSubmit={handleSubmit}>
                          <Form.Group className="mb-3">
                            <Form.Label>Username hoặc Email</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Nhập Username hoặc Email của bạn..."
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="login-input"
                            />
                          </Form.Group>

                          <Form.Group className="mb-3 position-relative">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••••••••••••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="login-input password-input"
                            />
                            <button
                              type="button"
                              className="password-toggle"
                              onClick={togglePasswordVisibility}
                              aria-label="Toggle password visibility"
                            >
                              {showPassword ? (
                                <EyeSlash size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </Form.Group>

                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <Form.Check
                              type="checkbox"
                              id="remember-me"
                              label="Giữ đăng nhập"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="remember-me"
                            />
                            <a href="#forgot" className="forgot-password">
                              Quên mật khẩu ?
                            </a>
                          </div>

                          {errorMsg && (
                            <div className="alert alert-danger">{errorMsg}</div>
                          )}
                          <Button
                            type="submit"
                            className="login-button w-100 mb-3"
                            disabled={loading}
                          >
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                          </Button>
                        </Form>

                        <p className="signup-text text-center mb-0">
                          Chưa có tài khoản ?{" "}
                          <a
                            href="#"
                            className="signup-link"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate("/register");
                            }}
                          >
                            Đăng ký ngay
                          </a>
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default Login;
