import { ExportOutlined } from "@ant-design/icons";
import { Badge, Button, Card } from "antd";
import Live from "../../../assets/icons/dashboard/Scan_alt_2.svg";
import { RoomResponse } from "../../Room/types";
import User from "../../../assets/icons/dashboard/group_add_fill.png";
import Timer from "../../../assets/icons/dashboard/Alarmclock_fill.png";
type Props = {
  room: RoomResponse;
};

const CustomCard = ({ room }: Props) => {
  return (
    <>
      <Card
        key={room.id}
        className="rounded-[24px] transition-all relative overflow-visible !p-[20px]"
        style={{
          border: '2px solid #d1d5db',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
          e.currentTarget.style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div className="absolute top-6 left-10 ">
          <div className="flex items-center gap-1 bg-[#4CAF50] text-white px-3 py-1 rounded-[12px] text-xs font-medium flex flex-row item-center">
            <img src={Live} alt="live img" />
            <span className="font-bold text-[14px] flex-shrink-0">Đang hoạt động</span>
          </div>
        </div>

        <div className="pt-8">
          <h3 className="text-[24px] font-semibold text-gray-900 mb-2">
            {room.roomName}
          </h3>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">
              Người sở hữu:{" "}
              <span className="text-blue-600 font-semibold text-[14px]">{room.createdBy || room.ownerId}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 mb-[100px]">
            <span className="flex items-center gap-1.5 text-sm text-gray-700">
              {/* <UserOutlined className="text-blue-600" />
               */}
               <img src={User} alt="" />
              <span className="font-bold text-[14px]">{room.members?.length ?? 0} người</span>
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-700">
              {/* <ClockCircleOutlined className="text-amber-500" /> */}
              <img src={Timer} alt="" />
              <span className="font-bold text-[14px]">{room.subject?.subjectName || "Không rõ môn"}</span>
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
