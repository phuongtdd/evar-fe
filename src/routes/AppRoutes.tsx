import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import MainLayout from "../pages/Common/MainLayout";
import Dashboard from "../pages/Dashboard";
import Promotion from "../pages/Promotion";
import Room from "../pages/Room";
import NotFound from "../pages/404";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound/>} />
        <Route path="room" element={<Room />} />
      </Route>
      <Route path="promotion" element={<Promotion />} />
    </Routes>
  );
};

export default AppRoutes;
