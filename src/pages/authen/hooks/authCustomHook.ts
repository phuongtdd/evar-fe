import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../services/authService";
import { setToken } from "../services/authService";
import { registerPayload } from "../types";

export const useLoginHandler = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (email: string, password: string, rememberMe: boolean) => {
    setErrorMsg("");
    const userEmail = email.trim();
    const inputPass  = password.trim();
    if (!userEmail || !password) {
      setErrorMsg("Vui lòng nhập email và password.");
      return;
    }

    setLoading(true);
    try {
      const loginPayload = { identifier: userEmail, password: inputPass };
      let data: any = await login(loginPayload);
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (e) {
            console.error("error: " +e)
        }
      }
      console.debug("Login response:", data);

      const token = data?.result?.token || data?.token || data?.data?.token || data?.access_token || data?.result?.accessToken || data?.result?.access_token;
      if (token) {
        setToken(token, rememberMe);
        window.dispatchEvent(new Event("auth-changed"));
        navigate("/dashboard", { replace: true });
      } else {
        const debugText = JSON.stringify(data || {});
        setErrorMsg(`Không nhận được token từ server. Response: ${debugText}`);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err?.name === "AbortError") {
        setErrorMsg("Yêu cầu quá thời gian (timeout). Vui lòng thử lại.");
      } else if (err?.message && err.message.includes("Failed to fetch")) {
        setErrorMsg("Không kết nối được đến server. Kiểm tra server đang chạy / hoặc CORS.");
      } else {
        setErrorMsg(err?.message || "Lỗi khi đăng nhập");
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading, errorMsg };
};


export const useRegisterHandler = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

const handleSubmit = async (
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  agreeTerms: boolean
) => {
  setErrorMsg("");
  const trimmedUsername = username.trim();
  const trimmedFirstName = firstName.trim();
  const trimmedLastName = lastName.trim();
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();
  const trimmedConfirmPassword = confirmPassword.trim();

  if (!trimmedUsername || !trimmedFirstName || !trimmedLastName || !trimmedEmail || !trimmedPassword) {
    setErrorMsg("Vui lòng điền đầy đủ thông tin.");
    return;
  }

  if (trimmedPassword !== trimmedConfirmPassword) {
    setErrorMsg("Mật khẩu xác nhận không khớp.");
    return;
  }

  if (!agreeTerms) {
    setErrorMsg("Vui lòng đồng ý với điều khoản dịch vụ.");
    return;
  }

  setLoading(true);
  try {
    const registerPayload: registerPayload = {
      user: {
        username: trimmedUsername,
        email: trimmedEmail,
        password: trimmedPassword,
      },
      person: {
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
      },
    };
    let data: any = await register(registerPayload);
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error("Error parsing register response:", e);
        setErrorMsg("Dữ liệu trả về từ server không hợp lệ.");
        return;
      }
    }
    console.debug("Register response:", data);

    if (data && (data.code === 1000 || data.code === "1000")) {
      navigate("/auth/login", { replace: true });
    } else {
      const msg = (data && (data.message || data.error)) || "Lỗi khi đăng ký";
      setErrorMsg(msg);
    }
  } catch (err: any) {
    console.error("Register error:", err);
    if (err?.name === "AbortError") {
      setErrorMsg("Yêu cầu quá thời gian (timeout). Vui lòng thử lại.");
    } else if (err?.response) {
      console.error(err?.response);
      switch (err.response.status) {
        case 400:
          setErrorMsg("Dữ liệu gửi đi không hợp lệ.");
          break;
        case 409:
          setErrorMsg("Email hoặc tên người dùng đã tồn tại.");
          break;
        case 500:
          setErrorMsg("Lỗi server. Vui lòng thử lại sau.");
          break;
        default:
          setErrorMsg("Lỗi không xác định. Vui lòng thử lại.");
      }
    } else if (err?.message && err.message.includes("Failed to fetch")) {
      setErrorMsg("Không kết nối được đến server. Kiểm tra server đang chạy / hoặc CORS.");
    } else {
      setErrorMsg(err?.message || "Lỗi khi đăng ký");
    }
  } finally {
    setLoading(false);
  }
};

  return { handleSubmit, loading, errorMsg };
};
