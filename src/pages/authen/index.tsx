import React from "react";
import AuthLayout from "./components/layout/AuthLayout";
import { useLocation } from "react-router-dom";
import Login from "./components/layout/login";
import Register from "./components/layout/register";

const AuthPage = () => {
  const location = useLocation();
  const isLogin = location.pathname === "/auth/login";
  return (
    <AuthLayout
      title={isLogin ? "Chào mừng" : " Tạo tài khoản"}
      subtitle={
        isLogin
          ? "Vui lòng nhập phương thức đăng nhập của bạn"
          : "Điền thông tin để tạo tài khoản mới"
      }
    >
      {isLogin ? <Login /> : <Register />}
    </AuthLayout>
  );
};

export default AuthPage;
