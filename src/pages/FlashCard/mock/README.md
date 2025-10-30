# FlashCard Mock Data

Folder này chứa dữ liệu giả (mock data) cho module FlashCard.

## 📁 File Structure

```
mock/
├── mockData.ts      # 6 FlashCard items mẫu
└── README.md        # File này
```

## 📝 Mock Data Contents

Hiện tại có **6 FlashCards** mẫu bao gồm:

### 1️⃣ **React** (Lập trình - Easy)
- Giải thích React là gì
- Mastery: 80%
- Reviews: 5 lần

### 2️⃣ **Photosynthesis** (Sinh học - Medium)
- Giải thích quá trình quang hợp
- Mastery: 45%
- Reviews: 3 lần

### 3️⃣ **Phương trình bậc 2** (Toán học - Medium)
- Công thức nghiệm phương trình bậc 2
- Mastery: 65%
- Reviews: 8 lần

### 4️⃣ **Newton's First Law** (Vật lý - Easy)
- Định luật Newton thứ nhất
- Mastery: 90%
- Reviews: 10 lần

### 5️⃣ **JavaScript Closure** (Lập trình - Hard)
- Giải thích closure trong JavaScript
- Mastery: 25%
- Reviews: 2 lần

### 6️⃣ **Định lý Pythagoras** (Toán học - Easy)
- Định lý Pythagoras trong tam giác vuông
- Mastery: 85%
- Reviews: 12 lần

## 🔧 Cách sử dụng

Mock data được tự động load trong `flashcardService.ts`:

```typescript
import { mockFlashCards } from '../mock/mockData';

const getMockFlashCards = (): FlashCard[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockFlashCards));
  return mockFlashCards;
};
```

## ➕ Thêm FlashCards mới

Để thêm flashcard mẫu, edit file `mockData.ts`:

```typescript
export const mockFlashCards: FlashCard[] = [
  // ... existing cards
  {
    id: 'mock-7',
    front: 'Câu hỏi mới?',
    back: 'Câu trả lời mới',
    category: 'Danh mục',
    difficulty: 'easy', // 'easy' | 'medium' | 'hard'
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    masteryLevel: 0,
    tags: ['tag1', 'tag2'],
  },
];
```

## 🔄 Reset về Mock Data

Để reset về mock data gốc, xóa localStorage:

```javascript
// Trong Console (F12)
localStorage.removeItem('evar_flashcards');
// Sau đó reload trang
```

## 📊 Data Structure

Mỗi FlashCard có cấu trúc:

```typescript
interface FlashCard {
  id: string;              // Unique ID
  front: string;           // Mặt trước (câu hỏi)
  back: string;            // Mặt sau (câu trả lời)
  category: string;        // Danh mục
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;       // ISO timestamp
  reviewCount: number;     // Số lần ôn tập
  masteryLevel: number;    // 0-100
  tags: string[];          // Tags
}
```

