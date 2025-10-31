# Flash Card Module

Module quản lý và học tập với flashcards - Sử dụng Ant Design thuần túy.

## 📁 Cấu trúc

```
FlashCard/
├── components/
│   ├── layout/
│   │   └── FlashCardLayout.tsx      # Layout chính
│   └── ui/
│       ├── CreateFlashCardModal.tsx # Modal tạo/sửa flashcard
│       ├── FlashCardItem.tsx        # Card hiển thị flashcard
│       └── StudyMode.tsx            # Chế độ học flashcard (style giống Material)
├── constants/
│   └── index.ts                     # Hằng số (độ khó, danh mục, màu sắc)
├── hooks/
│   └── useFlashCards.ts             # Custom hook quản lý flashcards
├── services/
│   └── flashcardService.ts          # API service (mock data với localStorage)
├── types/
│   └── index.ts                     # TypeScript interfaces
├── utils/
│   └── index.ts                     # Helper functions
└── index.tsx                        # Entry point

```

## ✨ Tính năng

### 1. **Quản lý Flashcard**
- ✅ Tạo flashcard mới với câu hỏi/trả lời
- ✅ Chỉnh sửa flashcard
- ✅ Xóa flashcard
- ✅ Phân loại theo danh mục (Toán, Lý, Hóa, Sinh, Anh...)
- ✅ Đánh dấu độ khó (Dễ, Trung bình, Khó)
- ✅ Thêm tags cho flashcard

### 2. **Chế độ học (Study Mode)**
- ✅ Lật thẻ để xem câu trả lời
- ✅ Đánh giá đúng/sai
- ✅ Tự động cập nhật mức độ thành thạo
- ✅ Theo dõi tiến độ học tập
- ✅ Hiển thị kết quả sau khi hoàn thành

### 3. **Thống kê & Theo dõi**
- ✅ Tổng số thẻ
- ✅ Số thẻ đã thành thạo
- ✅ Số thẻ đang học
- ✅ Số thẻ mới học
- ✅ Progress bar cho từng thẻ

### 4. **Tìm kiếm & Lọc**
- ✅ Tìm kiếm theo nội dung/tags
- ✅ Lọc theo độ khó
- ✅ Lọc theo danh mục

## 🎯 Cách sử dụng

### Tạo Flashcard mới
1. Click nút "Tạo Flashcard"
2. Nhập câu hỏi (mặt trước)
3. Nhập câu trả lời (mặt sau)
4. Chọn danh mục và độ khó
5. Thêm tags (optional)
6. Click "Lưu"

### Học Flashcard
1. Click nút "Bắt đầu học"
2. Đọc câu hỏi
3. Click để lật thẻ và xem câu trả lời
4. Đánh giá bản thân: Đúng/Sai
5. Hệ thống tự động cập nhật mức độ thành thạo

### Mức độ thành thạo (Mastery Level)
- **0-25%**: Mới học (đỏ)
- **26-50%**: Đang học (cam)
- **51-75%**: Quen thuộc (xanh dương)
- **76-100%**: Thành thạo (xanh lá)

## 🔧 Technical Details

### Data Storage
- Sử dụng **localStorage** để lưu trữ dữ liệu
- Key: `evar_flashcards`
- Dữ liệu được persist giữa các sessions

### State Management
- Custom hook `useFlashCards` quản lý state
- Auto-fetch data khi component mount
- Optimistic UI updates

### Algorithms
- **Shuffle algorithm**: Fisher-Yates shuffle cho chế độ học
- **Mastery calculation**: 
  - Đúng: +10%
  - Sai: -5%
  - Min: 0%, Max: 100%

## 📊 Data Model

### FlashCard
```typescript
{
  id: string;
  front: string;           // Câu hỏi
  back: string;            // Câu trả lời
  category: string;        // Danh mục
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  lastReviewed?: string;
  reviewCount: number;
  masteryLevel: number;    // 0-100
  tags: string[];
}
```

## 🚀 Future Enhancements

- [ ] Kết nối với backend API
- [ ] Spaced Repetition Algorithm (SRS)
- [ ] Export/Import flashcards
- [ ] Shared flashcard sets
- [ ] Statistics dashboard
- [ ] Gamification (streaks, achievements)
- [ ] Audio pronunciation
- [ ] Image support for cards

