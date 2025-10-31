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
import CustomCard from "./CustomCard";
import type { GetProps } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllRooms } from "../../Room/services/roomService";
import { RoomResponse } from "../../Room/types";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
  console.log(info?.source, value);

const RoomSection = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        const list = await getAllRooms(0, 8);
        setRooms(list);
      } catch (e) {
        console.error("Failed to load rooms", e);
      } finally {
        setLoading(false);
      }
    };
    loadRooms();
  }, []);

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
        <div className="bg-white rounded-2xl  border border-gray-200 p-12">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Spin size="large" />
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center text-gray-500 py-10">Chưa có phòng nào hoạt động.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {rooms.map((room) => (
                <CustomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RoomSection;
