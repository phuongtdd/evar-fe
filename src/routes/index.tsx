import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "../pages/Common/MainLayout";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/404";
import Login from "../pages/authen/login/login";
import Register from "../pages/authen/register/Register";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound/>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
