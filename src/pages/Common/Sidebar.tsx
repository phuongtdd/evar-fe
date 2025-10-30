import React, { useEffect, useState, useRef } from "react";
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
  LeftOutlined,
  RightOutlined,
  SettingOutlined,
  DeliveredProcedureOutlined,
  BookOutlined,
  CreditCardOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getToken, clearToken } from "../authen/services/authService";
import { useRoleAccess } from "../../hooks/useRoleAccess";
import type { MenuProps } from "antd";
import Logo from "../../assets/icons/logo/EVar_logo.png";
import "./Sidebar.css";

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
  const [isHovered, setIsHovered] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!getToken()
  );
  const { isAdmin } = useRoleAccess();

  useEffect(() => {
    const onAuthChanged = () => setIsAuthenticated(!!getToken());
    window.addEventListener("auth-changed", onAuthChanged);
    return () => window.removeEventListener("auth-changed", onAuthChanged);
  }, []);

  // Menu items khác nhau cho Admin và User
  const userMenuItems: MenuItem[] = [
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
      icon: <ClockCircleOutlined className="text-2xl" />,
      label: "Podoromo",
    },
    {
      key: "chat",
      icon: <MessageOutlined className="text-2xl" />,
      label: "Trò chuyện",
    },
    {
      key: "chat-ai",
      icon: <RobotOutlined className="text-2xl" />,
      label: "Evar Tutor",
    },
    {
      key: "material",
      icon: <BookOutlined className="text-2xl" />,
      label: "Material",
    },
    {
      key: "flashcard",
      icon: <CreditCardOutlined className="text-2xl" />,
      label: "Flash Card",
    },
    {
      key: "create-quiz",
      icon: <CameraOutlined className="text-2xl" />,
      label: "Tạo quiz từ ảnh",
    },
    {
      key: "quiz",
      icon: <EditOutlined className="text-2xl" />,
      label: "Luyện đề",
    },
    {
      key: "account",
      icon: <UserOutlined className="text-2xl" />,
      label: "Thông tin tài khoản",
    },
  ];

  const adminMenuItems: MenuItem[] = [
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
      icon: <ClockCircleOutlined className="text-2xl" />,
      label: "Podoromo",
    },
    {
      key: "chat",
      icon: <MessageOutlined className="text-2xl" />,
      label: "Trò chuyện",
    },
    {
      key: "tutor",
      icon: <DeliveredProcedureOutlined className="text-2xl" />,
      label: "Evar Tutor",
    },
    {
      key: "create-exam-ai",
      icon: <CameraOutlined className="text-2xl" />,
      label: "Tạo đề thi với AI",
    },
    {
      key: "quiz",
      icon: <EditOutlined className="text-2xl" />,
      label: "Luyện đề",
    },
    {
      key: "learning-resources",
      icon: <BookOutlined className="text-2xl" />,
      label: "Tài nguyên học tập",
    },
    {
      key: "account",
      icon: <UserOutlined className="text-2xl" />,
      label: "Thông tin tài khoản",
    },
  ];

  const menuItems: MenuItem[] = isAdmin ? adminMenuItems : userMenuItems;

  const finalMenuItems: MenuItem[] = [
    ...menuItems,
    ...(isAdmin
      ? [
          {
            type: "divider" as const,
          },
          {
            key: "admin",
            icon: <SettingOutlined className="text-2xl text-purple-600" />,
            label: (
              <span className="text-purple-600 font-medium">
                Quản trị hệ thống
              </span>
            ),
          },
        ]
      : []),
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

  const items: MenuItem[] = finalMenuItems.map((item) => {
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
      case "chat-ai":
        navigate("/chat-ai");
        break;
      case "create-exam-ai":
        window.dispatchEvent(new CustomEvent("reset-quiz-info"));
        navigate("/createExam-AI");
        break;
      case "quiz":
        navigate("/quiz");
        break;
      case "learning-resources":
        navigate("/learning-resources");
        break;
      case "tutor":
        navigate("/evar-turtor");
        break;
      case "material":
        navigate("/material");
        break;
      case "flashcard":
        navigate("/flashcard");
        break;
      case "account":
        navigate("/account");
        break;
      case "admin":
        navigate("/admin");
        break;
      case "logout":
        try {
          clearToken();
        } catch (e) {
          console.error(e);
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
    <div
      className="sidebar-container relative h-screen flex group"
      ref={sidebarRef}
    >
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220} /* Giảm từ 250px xuống 220px */
        className="h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300"
      >
        {/* Logo with hover effect */}
        <div
          className="relative flex items-center justify-between pt-10 pb-4 px-4 h-20 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          onClick={onToggle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center justify-center">
              <div
                className="transition-all duration-300 ease-in-out"
                style={{
                  width: collapsed ? "80px" : "110px",
                  height: collapsed ? "80px" : "110px",
                  minWidth: collapsed ? "80px" : "110px",
                  minHeight: collapsed ? "80px" : "110px",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <img
                  src={Logo}
                  alt="EVar Logo"
                  className="w-full h-full object-contain"
                  style={{
                    transition: "all 0.3s ease-in-out",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Collapse/Expand arrow - Only show on hover */}
          <div
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            {collapsed ? (
              <RightOutlined className="text-gray-500 text-sm" />
            ) : (
              <LeftOutlined className="text-gray-500 text-sm" />
            )}
          </div>
        </div>
        <div className="flex flex-col h-full">
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            items={items}
            className="flex-1 border-none pt-2"
          />
        </div>
      </Sider>
    </div>
  );
};

export default Sidebar;
