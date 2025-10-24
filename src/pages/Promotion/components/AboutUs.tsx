import { Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function AboutSection() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 px-6  text-center">
      <Title level={2} className="!text-3xl sm:!text-4xl md:!text-5xl !font-bold !mb-4">
        Về chúng tôi
      </Title>

      <Paragraph className="!text-base sm:!text-lg !text-gray-600 max-w-3xl mx-auto">
        Chúng tôi mang sứ mệnh đưa giáo dục chất lượng đến với mọi người thông qua công nghệ đổi mới.
      </Paragraph>

      <div className="mt-20 max-w-4xl text-left">
        <Title level={4} className="!font-bold !text-xl sm:!text-2xl !mb-4">
          Sứ mệnh của chúng tôi
        </Title>
        <Paragraph className="!text-sm sm:!text-base !text-gray-700 leading-relaxed">
          Chúng tôi tin rằng giáo dục là nền tảng của sự tiến bộ. Nền tảng của chúng tôi kết hợp công nghệ AI tiên tiến
          với thiết kế trực quan để tạo ra trải nghiệm học tập hấp dẫn, hiệu quả và dễ tiếp cận cho học sinh và giáo viên
          trên toàn thế giới. Chúng tôi cam kết xóa bỏ rào cản đối với giáo dục chất lượng và trao quyền cho giáo viên
          bằng các công cụ giúp tiết kiệm thời gian và nâng cao kết quả học tập.
        </Paragraph>
      </div>
    </div>
  );
}
