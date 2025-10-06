import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Footer } from "antd/es/layout/layout";
import Header from "./Header";

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") {
      setSelectedMenu("home");
    } else if (path === "/my-room") {
      setSelectedMenu("my-room");
    } else if (path === "/pomodoro") {
      setSelectedMenu("pomodoro");
    } else if (path === "/chat") {
      setSelectedMenu("chat");
    } else if (path === "/create-quiz") {
      setSelectedMenu("create-quiz");
    } else if (path === "/test-room") {
      setSelectedMenu("test-room");
    } else if (path === "/account") {
      setSelectedMenu("account");
    }
  }, [location]);

  const handleMenuSelect = (key: string) => {
    setSelectedMenu(key);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="h-screen">
      <Sidebar
        selectedKey={selectedMenu}
        onMenuSelect={handleMenuSelect}
        collapsed={collapsed}
        onToggle={toggleSidebar}
      />
      <Layout>
        <Header />
        <Content className="overflow-auto">
          <Outlet />
          <Footer>demo footer</Footer>
        </Content>
        
      </Layout>
    </Layout>
  );
};

export default MainLayout;
