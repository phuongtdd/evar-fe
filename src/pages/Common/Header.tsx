import { Input, Badge, Avatar, Dropdown, MenuProps } from 'antd';
import { 
  SearchOutlined, 
  BellOutlined, 
  UserOutlined, 
  DownOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  QuestionCircleOutlined,
  ClockCircleOutlined,
  KeyOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChangePasswordModal } from '../ChangePassword';
import { BuyTimeModal } from '../BuyTime';
import { getUserById } from '../userProfile/services';
import { getUserIdFromToken } from '../userProfile/utils/auth';
import { clearToken } from '../authen/services/authService';
import './Header.css';

interface HeaderProps {
  activeMenu?: string;
}

const { Search } = Input;

// Function to get page title from path
const getPageTitle = (pathname: string) => {
  const path = pathname.split('/').filter(Boolean).pop() || 'home';
  const titles: { [key: string]: string } = {
    '': 'Trang chủ',
    'home': 'Trang chủ',
    'profile': 'Hồ sơ cá nhân',
    'settings': 'Cài đặt',
    'room': 'Phòng học',
    'class': 'Lớp học',
    'quiz': 'Bài kiểm tra',
    'result': 'Kết quả',
    'help': 'Trợ giúp'
  };
  
  return titles[path] || path.charAt(0).toUpperCase() + path.slice(1);
};

const menuLabels: { [key: string]: string } = {
  'home': 'Trang chủ',
  'room': 'Phòng của tôi',
  'pomodoro': 'Pomodoro',
  'chat': 'Trò chuyện',
  'chat-ai': 'Evar Tutor',
  'tutor': 'Evar Tutor',
  'material': 'Material',
  'flashcard': 'Flash Card',
  'create-quiz': 'Tạo quiz từ ảnh',
  'test-room': 'Phòng kiểm tra',
  'account': 'Thông tin tài khoản',
  'about': 'Giới thiệu',
  'help': 'Trợ giúp & Hỗ trợ'
};

const Header: React.FC<HeaderProps> = ({ activeMenu = 'home' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState('');
  const [remainingTime, setRemainingTime] = useState(7200); // 2 hours in seconds
  const [isPremium, setIsPremium] = useState(false);
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      message: 'Bạn có một cuộc họp mới vào lúc 14:00',
      time: '10 phút trước',
      isRead: false,
      type: 'meeting'
    },
    {
      id: 2,
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      message: 'Nguyễn Văn A đã chấp nhận lời mời kết bạn',
      time: '1 giờ trước',
      isRead: false,
      type: 'friend'
    },
    {
      id: 3,
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      message: 'Bạn có 3 thông báo mới từ nhóm Lập trình viên',
      time: '3 giờ trước',
      isRead: true,
      type: 'group'
    },
    {
      id: 4,
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      message: 'Nhắc nhở: Cuộc họp hàng tuần bắt đầu sau 30 phút',
      time: '5 giờ trước',
      isRead: true,
      type: 'reminder'
    }
  ]);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showBuyTimeModal, setShowBuyTimeModal] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Người dùng');
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const currentPageTitle = getPageTitle(location.pathname);

  // Kiểm tra xem người dùng có đang trong cuộc họp dựa trên route hiện tại
  useEffect(() => {
    const meetingRoutes = ['/meeting', '/room/'];
    const isMeetingPage = meetingRoutes.some(route => location.pathname.startsWith(route));
    setIsInMeeting(isMeetingPage);
  }, [location.pathname]);

  // Cập nhật thời gian còn lại chỉ khi đang trong cuộc họp
  useEffect(() => {
    if (isPremium || !isInMeeting) return;
    
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          // Có thể hiển thị thông báo khi hết thời gian
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPremium, isInMeeting]);

  // Load user profile khi component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userId = getUserIdFromToken();
        if (userId) {
          const userProfile = await getUserById(userId);
          setUserAvatar(userProfile.avatar || null);
          setUserName(userProfile.name || 'Người dùng');
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    };

    loadUserProfile();
  }, []);

  // Lắng nghe sự kiện cập nhật avatar
  useEffect(() => {
    const handleAvatarUpdate = (event: any) => {
      setUserAvatar(event.detail.avatar);
      if (event.detail.name) {
        setUserName(event.detail.name);
      }
    };

    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    return () => {
      window.removeEventListener('avatarUpdated', handleAvatarUpdate);
    };
  }, []);

  const markAsRead = (id?: number) => {
    if (id) {
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } else {
      // Đánh dấu tất cả là đã đọc
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    }
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    // Thêm logic điều hướng dựa trên loại thông báo nếu cần
  };

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'account',
      icon: <UserOutlined className="text-blue-500" />,
      label: 'Hồ sơ cá nhân',
      onClick: () => navigate('/account')
    },
    {
      key: 'change-password',
      icon: <KeyOutlined className="text-green-500" />,
      label: 'Đổi mật khẩu',
      onClick: () => setShowChangePasswordModal(true)
    },
    {
      key: 'buy-time',
      icon: <ClockCircleOutlined className="text-purple-500" />,
      label: 'Mua thêm giờ',
      onClick: () => setShowBuyTimeModal(true)
    },
    {
      key: 'about',
      icon: <InfoCircleOutlined className="text-blue-500" />,
      label: 'Giới thiệu',
      onClick: () => navigate('/about')
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined className="text-orange-500" />,
      label: 'Trợ giúp & Hỗ trợ',
      onClick: () => navigate('/help')
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined className="text-red-500" />,
      label: <span className="text-red-500">Đăng xuất</span>,
      onClick: () => {
        try {
          clearToken();
        } catch (e) {
          console.error(e);
        }
        window.dispatchEvent(new Event('auth-changed'));
        navigate('/auth/login');
      },
    },
  ];

  return (
    <header className="header">
      <div className="header-container">
        {/* Left Section - Active Menu */}
        <div className="left-section">
          <h1 className="page-title flex items-center text-lg font-medium text-gray-800">
            {menuLabels[activeMenu] || 'Trang chủ'}
          </h1>
        </div>

        {/* Center Section - Search */}
        <div className="search-wrapper">
          <div className="search-input">
            <SearchOutlined className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input-field"
            />
            {searchText && (
              <span 
                className="clear-icon"
                onClick={() => setSearchText('')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.09 15.33C16.38 15.62 16.38 16.1 16.09 16.39C15.94 16.54 15.75 16.61 15.56 16.61C15.37 16.61 15.18 16.54 15.03 16.39L12 13.36L8.97 16.39C8.82 16.54 8.63 16.61 8.44 16.61C8.25 16.61 8.06 16.54 7.91 16.39C7.62 16.1 7.62 15.62 7.91 15.33L10.94 12.3L7.91 9.27C7.62 8.98 7.62 8.5 7.91 8.21C8.2 7.92 8.68 7.92 8.97 8.21L12 11.24L15.03 8.21C15.32 7.92 15.8 7.92 16.09 8.21C16.38 8.5 16.38 8.98 16.09 9.27L13.06 12.3L16.09 15.33Z" fill="#64748B"/>
                </svg>
              </span>
            )}
          </div>
        </div>

        {/* Right Section - User Actions */}
        <div className="user-actions">
          {/* Remaining Meeting Time */}
          <div 
            className="meeting-time flex items-center gap-1 text-sm font-medium"
            onClick={(e) => {
              e.preventDefault();
              if (!isPremium) {
                setShowBuyTimeModal(true);
              } else {
                window.location.href = '/premium';
              }
            }}
            style={{ 
              cursor: 'pointer',
              color: isInMeeting 
                ? (remainingTime < 300 ? '#ef4444' : (remainingTime < 1800 ? '#f59e0b' : '#10b981'))
                : '#6b7280' // Gray when not in meeting
            }}
            title={
              isPremium 
                ? 'Tài khoản Premium - Không giới hạn thời gian' 
                : 'Mua thêm thời gian meeting'
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                fill={isInMeeting ? 'currentColor' : 'none'}
                fillOpacity="0.1"
              />
              <path d="M12 6V12L16 14" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            {isPremium ? 'Không giới hạn' : formatTime(remainingTime)}
          </div>

          {/* Upgrade Button */}
          <button 
            className="upgrade-btn"
            onClick={() => setShowBuyTimeModal(true)}
          >
            Nâng cấp
          </button>
          
          {/* Notifications */}
          <Dropdown 
            overlayClassName="notification-dropdown"
            trigger={['click']}
            placement="bottomRight"
            overlay={
              <div className="w-[420px] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[70vh]">
                <div className="p-3 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Thông báo</h3>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-nowrap overflow-hidden">
                      <button 
                        onClick={() => setShowAllNotifications(true)}
                        className={`px-4 py-1.5 text-sm font-medium whitespace-nowrap ${
                          showAllNotifications 
                            ? 'text-blue-600 border-b-2 border-blue-600' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Tất cả
                      </button>
                      <button 
                        onClick={() => setShowAllNotifications(false)}
                        className={`px-4 py-1.5 text-sm font-medium whitespace-nowrap ${
                          !showAllNotifications 
                            ? 'text-blue-600 border-b-2 border-blue-600' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Chưa đọc
                      </button>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead();
                      }}
                      className="text-sm text-blue-500 hover:text-blue-600 hover:underline whitespace-nowrap px-2 py-1"
                    >
                      Đánh dấu đã đọc tất cả
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto divide-y divide-gray-100">
                  {notifications
                    .filter(n => showAllNotifications ? true : !n.isRead)
                    .map(notification => (
                      <div 
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50' : 'bg-white'}`}
                      >
                        <div className="flex items-start">
                          <img 
                            src={notification.avatar} 
                            alt="" 
                            className="w-8 h-8 rounded-full mr-3 mt-0.5 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 leading-tight">{notification.message}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-400">{notification.time}</span>
                              {!notification.isRead && (
                                <span className="ml-2 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  {notifications.length === 0 && (
                    <div className="p-6 text-center text-gray-400 text-sm">
                      <div className="flex flex-col items-center justify-center py-4">
                        <BellOutlined className="text-2xl mb-2 text-gray-300" />
                        <p>Không có thông báo mới</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-gray-100 text-center bg-gray-50">
                  <a href="/notifications" className="text-blue-500 text-xs font-medium hover:underline">
                    Xem tất cả thông báo
                  </a>
                </div>
              </div>
            }
          >
            <div className="notification-badge relative">
              <Badge count={unreadCount} size="small" className="cursor-pointer">
                <BellOutlined className="text-xl" />
              </Badge>
            </div>
          </Dropdown>

          {/* User Profile */}
          <Dropdown 
            menu={{ items: userMenuItems }} 
            trigger={['click']} 
            overlayClassName="user-dropdown-menu"
            placement="bottomRight"
          >
            <div className="user-profile">
              <Avatar 
                size={36} 
                className="user-avatar"
                src={userAvatar || undefined}
                icon={<UserOutlined />}
              />
              <div className="user-info hidden md:block">
                <span className="user-name">{userName}</span>
                <span className="user-plan">Free Plan</span>
              </div>
              <DownOutlined className="user-dropdown-arrow" />
            </div>
          </Dropdown>
        </div>
      </div>

      {/* Modals */}
      <ChangePasswordModal
        show={showChangePasswordModal}
        onHide={() => setShowChangePasswordModal(false)}
      />
      <BuyTimeModal
        show={showBuyTimeModal}
        onHide={() => setShowBuyTimeModal(false)}
      />
    </header>
  );
};

export default Header;
