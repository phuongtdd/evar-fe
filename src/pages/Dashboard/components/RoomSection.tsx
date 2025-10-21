import {
  ClockCircleOutlined,
  ExportOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  SoundOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Input, Spin } from "antd";
import { mockRooms } from "../mock/mockData";
import CustomCard from "./CustomCard";
import type { GetProps } from "antd";
import { useNavigate } from "react-router-dom";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
  console.log(info?.source, value);

const RoomSection = () => {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
   navigate("/room")
    
  }
  return (
    <>
      <div className="mb-[120px] flex flex-col ">
        <div className="mb-2">
          <h4 className="text-[18px] !font-extrabold mb-1">
            Phòng đang hoạt động
          </h4>
          <p className="text-sm text-gray-500">
            Tham gia hoặc lên lịch các buổi học
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 mb-2 w-full">
          <div className="flex flex-row item-center gap-3 mb-1">
            <Search
              placeholder="Tìm kiếm"
              onSearch={onSearch}
              enterButton
              className="flex-1"
            />
            <Button icon={<FilterOutlined />} />
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="bg-blue-600 hover:bg-blue-700 rounded-lg"
            onClick={() => handleCreateRoom()}
          >
            Tạo phòng
          </Button>
        </div>
        <div className="w-full flex flex-row item-center justify-end">
          <Button
            type="link"
            className="!text-blue-600 !hover:text-blue-700 flex items-end"
          >
            Xem tất cả »
          </Button>
        </div>
        <div className="bg-gray-50 rounded-2xl  border-[1.2px] border-solid border-[#e3e3e3] p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {mockRooms.map((room) => (
              <CustomCard room={room} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomSection;
