import apiClient from "../../../configs/axiosConfig";
import { API_ENDPOINT } from "../constants";
import { loginPayload, registerPayload } from "../types";


export const login  = async (loginPayload: loginPayload) => {
    try{
        const res = await apiClient.post(API_ENDPOINT.login, loginPayload) ;
        if(res.status !== 200){
            throw new Error(`Error login: ${res.statusText}`);
        }
        return res.data;
    }catch(error){
        console.error("Failed to login", error);
        throw error;
    }
}


export const register = async (registerPayload: registerPayload) => {
  console.log("register payload: " + JSON.stringify(registerPayload, null, 0));
  try {
    const res = await apiClient.post(API_ENDPOINT.register, registerPayload);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(res.data?.message || `Error Register: ${res.statusText}`);
    }
  } catch (error) {
    console.error("Failed to register", error);
    throw error;
  }
};



export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('evartoken_remember');
};

export const setToken = (token :string , remember = false) => {
  localStorage.setItem("token", token);
  if (remember) localStorage.setItem("evartoken_remember", "1");
};

export const getToken = () => {
  return localStorage.getItem("token") || null;
};

export const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("evartoken_remember");
};
