import {
  ClockCircleOutlined,
  ExportOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  SoundOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, Button, Card, Input } from "antd";
import React from "react";
import { mockRooms } from "../mock/mockData";
import CustomCard from "./CustomCard";

const RoomSection = () => {
  return (
    <>
      <div className="mb-[120px] ">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Phòng đang hoạt động
          </h2>
          <p className="text-sm text-gray-500">
            Tham gia hoặc lên lịch các buổi học
          </p>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Input
            placeholder="Tìm kiếm phòng"
            className="flex-1 max-w-sm rounded-lg"
            size="large"
          />
          <Button
            icon={<SearchOutlined />}
            type="primary"
            size="large"
            className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6"
          ></Button>
          <Button
            icon={<FilterOutlined />}
            size="large"
            className="bg-gray-100 border-none hover:bg-gray-200 rounded-lg"
          ></Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Tạo phòng
          </Button>
          <Button
            type="link"
            className="text-blue-600 hover:text-blue-700 ml-auto"
          >
            Xem tất cả »
          </Button>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 border-[1.2px] border-solid border-[#D0CDCD] p-[40px]">
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
