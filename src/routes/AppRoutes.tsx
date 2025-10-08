import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import MainLayout from "../pages/Common/MainLayout";
import Dashboard from "../pages/Dashboard";
import Promotion from "../pages/Promotion";
import NotFound from "../pages/404";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound/>} />
      </Route>
      <Route path="promotion" element={<Promotion />} />
    </Routes>
  );
};

export default AppRoutes;
