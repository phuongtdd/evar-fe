import { Button } from "antd";
import Logo from "../../assets/icons/logo/EVar_logo.png";

const Header = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-4xl w-full mx-auto px-3 md:px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="logo" className="w-[40px]" />
          <span className="text-[#406AB9] text-lg font-semibold">EVar</span>
        </div>
        <Button type="primary" className="bg-blue-500">
          chưa biết để gì vào đây cả
        </Button>
      </div>
    </div>
  );
};

export default Header;
