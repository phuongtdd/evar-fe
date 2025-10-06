import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Book3d from "../../../assets/icons/dashboard/Book3D.svg";

const Banner = () => {
  return (
    <div>
      {" "}
      <div className="bg-[#406AB9] text-white mb-[120px] rounded-2xl border-none p-10 ">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[20px] opacity-90 mb-2">Thứ 6, 20/12/2025</p>
            <h1 className="text-[48px] font-semibold mb-2">
              Một ngày một bước, tri thức vững chắc.
            </h1>
            <p className="text-[16px] opacity-90 mb-4">
              Sẵn sàng chinh phục cùng nhau chưa, Đạt?
            </p>
          </div>
          <img src={Book3d} alt="book src"></img>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-6 text-[16px]">
            <span>Thời gian đã học: 12h40p</span>
            <span>Quiz đã tạo: 5</span>
          </div>
          <div className="flex gap-3">
            <Button
              type="default"
              icon={<PlusOutlined />}
              className="bg-white border-none"
            >
              Tạo phòng
            </Button>
            <Button
              type="default"
              className="bg-blue-400 text-white border-none"
            >
              Tạo Quiz với AI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
