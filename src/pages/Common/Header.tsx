import { Button } from "antd";
import Logo from "../../assets/icons/logo/EVar_logo.png";

const Header = () => {
  return (
    <>
      <div className="bg-white border-b border-gray-200 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="logo" className="w-[52px]" />
          <span className="text-[#406AB9] text-xl font-semibold">EVar</span>
        </div>
        <Button type="primary" className="bg-blue-500">
          chưa biết để gì vào đây cả
        </Button>
      </div>
    </>
  );
};

export default Header;
