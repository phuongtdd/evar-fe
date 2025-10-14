import { post } from "./config";

export const loginByGoogle = (email, name) =>
  post("/auth/google", { email, name });

export const loginWithUsernameOrEmail = (identifier, password) =>
  post("/auth/login", { identifier, password });

export const loginWithAdmin = (email, password) =>
  post("/auth/login", { email, password });

export const register = (fullName, email, password) =>
  post("/auth/register", { fullName, email, password });

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('evartoken');
  localStorage.removeItem('evartoken_remember');
};

export const setToken = (token, remember = false) => {
  localStorage.setItem("token", token);
  localStorage.setItem("evartoken", token);
  if (remember) localStorage.setItem("evartoken_remember", "1");
};

export const getToken = () => {
  return localStorage.getItem("token") || localStorage.getItem("evartoken") || null;
};

export const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("evartoken");
  localStorage.removeItem("evartoken_remember");
};
