import React, { useState, useEffect } from "react";
import { Layout, FloatButton } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
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
    } else if (path === "/room") {
      setSelectedMenu("room");
    } else if (path === "/pomodoro") {
      setSelectedMenu("pomodoro");
    } else if (path === "/chat") {
      setSelectedMenu("chat");
    } else if (path === "/chat-ai") {
      setSelectedMenu("chat-ai");
    } else if (path === "/evar-turtor") {
      setSelectedMenu("tutor");
    } else if (path === "/material") {
      setSelectedMenu("material");
    } else if (path === "/flashcard") {
      setSelectedMenu("flashcard");
    } else if (path === "/create-quiz") {
      setSelectedMenu("create-quiz");
    } else if (path === "/test-room") {
      setSelectedMenu("test-room");
    } else if (path === "/account") {
      setSelectedMenu("account");
    } else if (path === "/about") {
      setSelectedMenu("about");
    } else if (path === "/help") {
      setSelectedMenu("help");
    }
  }, [location]);

  const handleMenuSelect = (key: string) => {
    setSelectedMenu(key);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="h-screen overflow-hidden">
      <Sidebar
        selectedKey={selectedMenu}
        onMenuSelect={handleMenuSelect}
        collapsed={collapsed}
        onToggle={toggleSidebar}
      />
      <Layout className="h-full flex flex-col">
        <Header activeMenu={selectedMenu} />
        <Content className="flex-1 overflow-auto relative">
          <div style={{zoom: 0.8}} className="!px-12">
            <Outlet />
          </div>
          <FloatButton.Group
            trigger="hover"
            type="primary"
            style={{ right: 24, bottom: 24 }}
          >
            <FloatButton
              tooltip="Lên đầu trang"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
            <FloatButton
              tooltip="Xuống cuối trang"
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            />
          </FloatButton.Group>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
