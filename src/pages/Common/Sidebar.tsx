import React, { useEffect, useState } from "react";
import { Layout, Menu, Tooltip } from "antd";
import {
  HomeOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  CameraOutlined,
  EditOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getToken, clearToken} from "../authen/services/authService"
import type { MenuProps } from "antd";
import MenuOpen from "../../assets/icons/sidebar/MenuOpen.svg";
import MenuCollapse from "../../assets/icons/sidebar/MenuFold.svg";
const { Sider } = Layout;

interface SidebarProps {
  selectedKey: string;
  onMenuSelect: (key: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

type MenuItem = Required<MenuProps>["items"][number];

const Sidebar: React.FC<SidebarProps> = ({
  selectedKey,
  onMenuSelect,
  collapsed,
  onToggle,
}) => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getToken());

  useEffect(() => {
    const onAuthChanged = () => setIsAuthenticated(!!getToken());
    window.addEventListener("auth-changed", onAuthChanged);
    return () => window.removeEventListener("auth-changed", onAuthChanged);
  }, []);

  const menuItems: MenuItem[] = [
    {
      key: "home",
      icon: <HomeOutlined className="text-2xl" />,
      label: "Trang chủ",
    },
    {
      key: "room",
      icon: <PlayCircleOutlined className="text-2xl" />,
      label: "Phòng của tôi",
    },
    {
      key: "pomodoro",
      icon: <ClockCircleOutlined className="text-2xl"/>,
      label: "Podoromo",
    },
    {
      key: "chat",
      icon: <MessageOutlined className="text-2xl"/>,
      label: "Trò chuyện",
    },
    {
      key: "create-quiz",
      icon: <CameraOutlined className="text-2xl"/>,
      label: "Tạo quiz từ ảnh",
    },
    {
      key: "quiz",
      icon: <EditOutlined className="text-2xl"/>,
      label: "Quản lí quiz",
    },
    {
      key: "account",
      icon: <UserOutlined className="text-2xl"/>,
      label: "Thông tin tài khoản",
    },
    {
      type: "divider" as const,
    },
    isAuthenticated
      ? {
          key: "logout",
          icon: <LogoutOutlined className="text-red-500 text-2xl" />,
          label: <span className="text-red-500">Đăng xuất</span>,
        }
      : {
          key: "login",
          icon: <UserOutlined className="text-2xl" />,
          label: <span className="text-green-600">Đăng nhập</span>,
        },
  ];

  const items: MenuItem[] = menuItems.map((item) => {
    if (item && item.type === "divider") {
      return item;
    }

    const menuItem = item as any;
    return {
      ...menuItem,
      label: collapsed ? (
        <Tooltip title={menuItem.label} placement="right">
          <span>{menuItem.label}</span>
        </Tooltip>
      ) : (
        menuItem.label
      ),
    } as MenuItem;
  });

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    onMenuSelect(e.key);
    switch (e.key) {
      case "home":
        navigate("/dashboard");
        break;

      case "room":
        navigate("/room");
        break;
      case "pomodoro":
        navigate("/pomodoro");
        break;
      case "chat":
        navigate("/chat");
        break;
      case "create-quiz":
        window.dispatchEvent(new CustomEvent("reset-quiz-info"));
        navigate("/createQuiz-AI");
        break;
      case "quiz":
        navigate("/quiz");
        break;
      case "account":
        navigate("/account");
        break;
      case "logout":
        try {
          clearToken();
        } catch (e) {
          console.error(e)
        }
        window.dispatchEvent(new Event("auth-changed"));
        navigate("/auth/login");
        break;
      case "login":
        navigate("/auth/login");
        break;
      default:
        break;
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={240}
      className="bg-white shadow-sm"
      onCollapse={onToggle}
      collapsedWidth={80}
      theme="light"
    >
      <div className="flex flex-col h-full">
        <div className="p-6 flex items-center justify-center border-b border-gray-200">
          <div
            className="w-6 flex items-center justify-center border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={onToggle}
          >
            {collapsed ? (
              <img src={MenuOpen} alt="iconSidebar" />
            ) : (
              <img src={MenuCollapse} alt="iconSidebar" />
            )}
          </div>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultSelectedKeys={["dashboard"]}
          onClick={handleMenuClick}
          items={items}
          className="border-none bg-gray-50 flex-1"
          style={{ fontSize: "15px" }}
        />
      </div>
    </Sider>
  );
};

export default Sidebar;
