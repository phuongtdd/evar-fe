"use client";
import type React from "react";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useLoginHandler } from "../../hooks/authCustomHook";
import "../ui/login.css";
import SocialLogin from "../ui/SocialLogin";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const { handleSubmit, loading, errorMsg } = useLoginHandler();

  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSubmit(email, password, rememberMe);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <>
      <SocialLogin handleFunction={handleSocialLogin} flag="login"/>

      <div className="divider mb-4">
        <span>Hoặc</span>
      </div>

      <Form onSubmit={onSubmit}>
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
            {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
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

        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

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
            navigate("/auth/register");
          }}
        >
          Đăng ký ngay
        </a>
      </p>
    </>
  );
};

export default Login;
