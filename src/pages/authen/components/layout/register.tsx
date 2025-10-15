"use client";
import type React from "react";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { Space } from "antd";
import { useRegisterHandler } from "../../hooks/authCustomHook";
import "../ui/Register.css";
import SocialLogin from "../ui/SocialLogin";

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
          <Space>
            <Form.Group className="mb-3 d-flex gap-2">
              <div style={{ flex: 1 }}>
                <Form.Label>Họ</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Họ"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="register-input"
                  disabled={loading}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Form.Label>Tên</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Tên"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="register-input"
                  disabled={loading}
                />
              </div>
            </Form.Group>
          </Space>
          <Space>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập địa chỉ email của bạn..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="register-input"
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="register-input"
                disabled={loading}
              />
            </Form.Group>
          </Space>

          <Space>
            <Form.Group className="mb-3 position-relative">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="register-input password-input"
                disabled={loading}
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
            </Form.Group>

            <Form.Group className="mb-3 position-relative">
              <Form.Label>Xác nhận mật khẩu</Form.Label>
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="register-input password-input"
                disabled={loading}
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
            </Form.Group>
          </Space>

          <Form.Group className="mb-3 d-flex align-items-center">
            <Form.Check
              type="checkbox"
              id="agree-terms"
              label={
                <span>
                  Tôi đồng ý với <a href="#terms">điều khoản dịch vụ</a>
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
    </>
  );
};

export default Register;