import {
  ClockCircleOutlined,
  ExportOutlined,
  SoundOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, Button, Card } from "antd";
import Live from "../../../assets/icons/dashboard/Scan_alt_2.svg";
import { Room } from "../types";

type Props = {
  room: Room;
};

const CustomCard = ({ room }: Props) => {
  return (
    <>
      <Card
        key={room.id}
        className="rounded-[24px] border-none shadow-sm hover:shadow-md transition-all relative overflow-visible !p-[20px]"
      >
        <div className="absolute top-4 left-10 max-w-[140px]">
          <div className="flex items-center gap-1 bg-[#4CAF50] text-white px-3 py-1 rounded-[12px] text-xs font-medium">
            <img src={Live} alt="live img" />
            Đang hoạt động
          </div>
        </div>

        <div className="pt-8">
          <h3 className="text-[24px] font-semibold text-gray-900 mb-2">
            Nhóm học Toán nâng cao
          </h3>
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">
              Người sở hữu:{" "}
              <span className="text-blue-600 font-medium">Ai mà biết</span>
            </p>
          </div>

          <div className="flex items-center gap-4 mb-[100px]">
            <span className="flex items-center gap-1.5 text-sm text-gray-700">
              <UserOutlined className="text-blue-600" />
              <span className="font-medium">5 người</span>
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-700">
              <ClockCircleOutlined className="text-amber-500" />
              <span className="font-medium">60 phút</span>
            </span>
          </div>

          <Button
            type="primary"
            block
            size="large"
            className="bg-[#6392E9] hover:bg-[#2d5cb4] rounded-lg font-medium h-11"
          >
            Vào học
            <ExportOutlined className="ml-2" />
          </Button>
        </div>
      </Card>
    </>
  );
};

export default CustomCard;
