import { CloseOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import React from "react";
import { FileShare } from "../../types";

interface ChatProps{
    showDetails: boolean,
    setShowDetails: (value: boolean) => void,
    sharedFiles: FileShare[]
}


const TabChatDetail = ({showDetails, setShowDetails, sharedFiles} :ChatProps) => {
  return (
    <>
      <div
        className={`absolute right-0 top-0 z-20 h-full w-96 transform bg-white shadow-2xl transition-transform duration-300 ${
          showDetails ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-bold">Chi tiết hội thoại</h2>
            <button
              onClick={() => setShowDetails(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-50"
            >
              <CloseOutlined className="text-lg" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h3 className="mb-4 text-base font-semibold">File đã chia sẻ</h3>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2">
                  <Input placeholder="Tìm file" className="flex-1 p-0" />
                  <button className="flex h-8 w-8 items-center justify-center rounded bg-blue-500 text-white hover:bg-blue-600">
                    <SearchOutlined />
                  </button>
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200">
                  <FilterOutlined />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {sharedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="h-12 rounded-lg bg-blue-100 hover:bg-blue-200 cursor-pointer transition-colors"
                  >
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-base font-semibold">Tùy chọn</h3>
              <div className="flex flex-col gap-3">
                <Button
                  size="large"
                  className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 font-medium"
                >
                  Xóa lịch sử trò chuyện
                </Button>
                <Button
                  size="large"
                  className="w-full rounded-lg bg-red-600 hover:bg-red-700 font-medium"
                >
                  Xóa liên hệ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TabChatDetail;
