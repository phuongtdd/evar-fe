# Admin Dashboard

A modern, responsive admin dashboard built with React, TypeScript, Ant Design, and Tailwind CSS.

## Features

### Layout Components
- **AdminLayout**: Main layout wrapper with sidebar navigation and header
- **DashboardCards**: Dashboard overview with statistics and navigation cards

### Key Features
- 🎨 Modern, elegant white design with gradient accents
- 📱 Fully responsive layout
- 🚀 Smooth animations and transitions
- 📊 **Real-time statistics from actual data** (Subjects & Exams)
- 🧭 Intuitive navigation cards for main features
- 🔔 Notification system
- 👤 User profile dropdown
- 📈 **Live activity feed from real data**
- ⚡ **Loading states and error handling**
- 🔄 **Automatic data refresh from API**

### Navigation Options
- **Dashboard**: Main overview page
- **Manage Subjects**: Create and manage educational subjects
- **Manage Exams**: Design and schedule examinations
- **Manage Quizzes**: Build interactive quizzes
- **User Management**: Monitor user accounts
- **Analytics**: View detailed analytics
- **Promotions**: Manage promotional content
- **Settings**: System configuration

### Design System
- **Colors**: Blue and purple gradient theme
- **Typography**: Clean, modern font hierarchy
- **Spacing**: Consistent spacing using Tailwind CSS
- **Components**: Ant Design components with custom styling
- **Icons**: Ant Design icons for consistency

### Responsive Breakpoints
- **Mobile**: xs (24 columns)
- **Tablet**: sm (12 columns), lg (6 columns)
- **Desktop**: xl (6 columns)

## Usage

```tsx
import { AdminLayout, DashboardCards } from './components';

const AdminPage = () => (
  <AdminLayout>
    <DashboardCards />
  </AdminLayout>
);
```

## File Structure

```
admin/
├── components/
│   ├── AdminLayout.tsx      # Main layout component
│   ├── DashboardCards.tsx   # Dashboard cards with real data
│   ├── DemoDashboard.tsx    # Demo dashboard component
│   └── index.ts            # Component exports
├── services/
│   ├── dashboardService.ts  # Real data fetching service
│   └── index.ts            # Service exports
├── types/
│   └── index.ts            # TypeScript interfaces
└── index.tsx               # Main admin page
```

## Data Integration

The dashboard now fetches real data from:
- **Subject Service**: `/subject/all` endpoint for subject statistics
- **Exam Service**: `/exam/all` endpoint for exam statistics
- **Real-time Activity**: Generated from actual subject and exam updates
- **Fallback Data**: Graceful degradation if API calls fail

### API Endpoints Used
- `GET /subject/all?page=0&pageSize=100` - Fetch all subjects
- `GET /exam/all?page=0&pageSize=100` - Fetch all exams
