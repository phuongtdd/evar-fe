import React from "react";
import SectionContainer from "./SectionContainer";
import {
  PlayCircleOutlined,
  CloudServerOutlined,
  EyeInvisibleOutlined,
  TeamOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";

const Features: React.FC = () => {
  return (
    <SectionContainer className="py-14">
      <h2 className="text-center text-2xl md:text-3xl font-semibold mb-8">Tính năng nổi bật</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="rounded-xl border-2 border-blue-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <PlayCircleOutlined className="text-2xl text-blue-600" />
            <div>
              <div className="font-semibold mb-1">Phòng học ảo</div>
              <p className="text-gray-600 text-sm">
                Học trực tiếp qua video HD, chia sẻ màn hình, bảng trắng trong nền tảng an toàn và hiệu quả.
              </p>
              <ul className="mt-3 text-sm text-gray-700 list-disc ml-5 space-y-1">
                <li>HD video</li>
                <li>Ghi hình</li>
                <li>Trò chuyện trong phòng học</li>
                <li>Chấm giảng tiện</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-xl border-2 border-green-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <CloudServerOutlined className="text-2xl text-green-600" />
            <div>
              <div className="font-semibold mb-1">Bộ chuyển đổi Quiz AI OCR</div>
              <p className="text-gray-600 text-sm">
                Tải tệp ảnh hoặc PDF, hệ thống sẽ tạo quiz tự động nhờ OCR kết hợp AI.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border-2 border-blue-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <EyeInvisibleOutlined className="text-2xl text-blue-600" />
            <div>
              <div className="font-semibold mb-1">Giám sát thông minh</div>
              <p className="text-gray-600 text-sm">
                Phát hiện bất thường bằng AI để đảm bảo tính minh bạch khi kiểm tra.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border-2 border-emerald-200 bg-white p-5 xl:col-span-2">
          <div className="flex items-start gap-3">
            <TeamOutlined className="text-2xl text-emerald-600" />
            <div>
              <div className="font-semibold mb-1">Nhóm học tập</div>
              <p className="text-gray-600 text-sm">
                Tổ chức nhóm học linh hoạt, điểm bày tỏ, lưu vết và phân quyền cho thành viên.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border-2 border-amber-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <FieldTimeOutlined className="text-2xl text-amber-600" />
            <div>
              <div className="font-semibold mb-1">Thời gian thực</div>
              <p className="text-gray-600 text-sm">Tương tác thời gian thực giúp lớp học sôi động và hiệu quả.</p>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default Features;


