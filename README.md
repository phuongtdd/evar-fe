# 🎓 EVAR - Educational Virtual Assessment & Resources

<div align="center">


![EVAR Logo](./public/logo.png)

**A Modern AI-Powered Learning Management System**

[![React](https://img.shields.io/badge/React-18.3.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.14-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📖 About Project

**EVAR** (Educational Virtual Assessment & Resources) is a comprehensive, AI-powered learning management platform designed to revolutionize online education. Built with modern web technologies, EVAR provides educators and students with powerful tools for creating, managing, and taking assessments while leveraging cutting-edge AI capabilities for enhanced learning experiences.

The platform combines traditional LMS features with innovative AI-driven functionalities, including intelligent tutoring, automated exam generation, face recognition for anti-cheating, and real-time collaboration tools.

---

## ✨ Key Highlights

🤖 **AI-Powered Learning** - Intelligent tutoring system with RAG-based chatbot and automated flashcard generation

🎯 **Smart Assessment** - AI-driven exam creation and automated grading with detailed analytics

👁️ **Anti-Cheating System** - Real-time face detection and monitoring during exams using face-api.js

📄 **OCR & PDF Processing** - Advanced document processing with automatic content extraction and knowledge base creation

🎥 **Video Conferencing** - Integrated Zego Cloud SDK for real-time video/audio communication

📊 **Rich Analytics** - Comprehensive dashboards with interactive charts and performance tracking

🎨 **Modern UI/UX** - Beautiful, responsive interface with smooth animations and 3D graphics

🔒 **Secure & Scalable** - Role-based access control with enterprise-grade security

---

## 🚀 Features

### 🧠 AI-Powered Features
- **AI Tutor (EVAR Tutor)**
  - RAG-based chatbot for intelligent Q&A
  - Context-aware responses based on uploaded materials
  - Automatic flashcard generation from PDF content
  - Knowledge base management with vector search
  
- **AI Exam Generation**
  - Automated question creation from learning materials
  - Multiple question types (MCQ, True/False, Essay)
  - Difficulty level customization
  - Smart question distribution

### 📝 Assessment & Examination
- **Quiz Management**
  - Create and manage quizzes with various question types
  - Timed assessments with auto-submission
  - Instant feedback and scoring
  - Practice mode with unlimited attempts

- **Exam System**
  - Secure exam environment with monitoring
  - Face detection for identity verification
  - Screen monitoring and anti-cheating measures
  - Detailed result analysis and reporting

### 📚 Learning Resources
- **PDF Upload & Processing**
  - OCR technology for text extraction
  - Automatic knowledge base creation
  - Real-time processing status tracking
  - Support for multiple file formats

- **Study Materials**
  - Organized resource library
  - Category-based filtering
  - Search and discovery features
  - Collaborative resource sharing

### 👥 Collaboration & Communication
- **Virtual Rooms**
  - Real-time video conferencing with Zego Cloud
  - Screen sharing capabilities
  - Participant management
  - Chat integration

- **Real-Time Chat**
  - WebSocket-based messaging (STOMP protocol)
  - Group and private conversations
  - File sharing support
  - Message history

### 🎯 Productivity Tools
- **Pomodoro Timer**
  - Focus session management
  - Break reminders
  - Productivity tracking
  - Customizable intervals

### 📊 Analytics & Reporting
- **Dashboard**
  - Performance metrics visualization
  - Progress tracking
  - Interactive charts with Recharts
  - Personalized insights

- **User Profiles**
  - Comprehensive profile management
  - Face image upload for verification
  - Learning history
  - Achievement tracking

### 🔐 Security Features
- **Face Recognition**
  - Identity verification using face-api.js
  - Anti-cheating during exams
  - Secure authentication
  - Privacy-focused implementation

- **Access Control**
  - Role-based permissions (Admin, Teacher, Student)
  - Protected routes
  - Session management
  - Secure API communication

---

## 🏗️ Architecture

### **Feature-Based Structure**
EVAR follows a modular, feature-based architecture where each module is self-contained with its own components, hooks, services, types, and utilities.

```
evar-fe/
├── src/
│   ├── pages/              # Feature modules
│   │   ├── EvarTutor/     # AI Tutor module
│   │   ├── ExamManage/    # Exam management
│   │   ├── Quiz/          # Quiz system
│   │   ├── Room/          # Video conferencing
│   │   ├── Dashboard/     # Analytics
│   │   └── ...
│   ├── services/          # API integration layer
│   ├── hooks/             # Reusable custom hooks
│   ├── context/           # Global state management
│   ├── routes/            # Routing configuration
│   ├── utils/             # Helper functions
│   └── configs/           # App configuration
```

### **Data Flow Pattern**
```
User Interaction (Component)
        ↓
Custom Hook (Business Logic)
        ↓
Service Layer (API Call)
        ↓
Axios Config (HTTP Client)
        ↓
Backend API
        ↓
Response → Hook → Component → UI Update
```

### **Design Patterns**
- **Separation of Concerns**: Components, hooks, services, and types are clearly separated
- **Component Composition**: Atomic design principles with reusable components
- **Protected Routes**: Authentication and role-based access control
- **Custom Hooks**: Business logic abstraction for reusability
- **Service Layer**: Centralized API communication

---

## 🛠️ Tech Stack

### **Core Framework**
- **React 18.3.0** - Modern UI library with concurrent features
- **TypeScript 5.9.3** - Type-safe development
- **Vite 7.1.7** - Lightning-fast build tool and dev server

### **UI Framework & Styling**
- **TailwindCSS 4.1.14** - Utility-first CSS framework
- **Ant Design 5.27.4** - Enterprise-level component library
- **Framer Motion 12.23.24** - Production-ready animation library
- **React Bootstrap 2.10.10** - Bootstrap components for React
- **Heroicons & React Icons** - Beautiful icon libraries

### **State Management**
- **React Context API** - Global state management
- **Custom Hooks** - Local state and business logic

### **Routing**
- **React Router DOM 7.9.3** - Declarative routing for React

### **Real-time Communication**
- **@stomp/stompjs 7.2.1** - WebSocket communication (STOMP protocol)
- **sockjs-client 1.6.1** - WebSocket fallback support
- **Zego Cloud SDK** - Video conferencing integration

### **3D Graphics & Visualization**
- **Three.js 0.180.0** - 3D rendering engine
- **@react-three/fiber 8.18.0** - React renderer for Three.js
- **@react-three/drei 9.122.0** - Useful helpers for R3F
- **maath 0.10.8** - Math utilities for 3D

### **AI & Computer Vision**
- **face-api.js 0.22.2** - Face detection and recognition for anti-cheating

### **File Handling & Processing**
- **react-pdf 10.2.0** - PDF viewer component
- **pdfjs-dist 5.4.296** - PDF.js library for document processing

### **Cloud Services**
- **cloudinary-react 1.8.1** - Image and video upload/management
- **cloudinary-core 2.14.0** - Cloudinary core library

### **Data Visualization**
- **recharts 3.3.0** - Composable charting library

### **HTTP Client**
- **axios 1.12.2** - Promise-based HTTP client

### **Development Tools**
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Vite Plugin SVGR** - SVG as React components

---

## 🌍 Supported Languages

- **Vietnamese** (vi) - Primary language

The application supports internationalization (i18n) with easy language switching capabilities.

---

## 👥 Team

<div align="center">

**Meet the passionate developers behind EVAR**

*We're a dedicated team committed to revolutionizing education through technology*

<br>

### 💻 Core Development Team

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/phuongtdd">
        <img src="https://github.com/phuongtdd.png" width="100px;" alt="Trương Nguyễn Tiến Đạt"/>
        <br />
        <sub><b>Trần Đình Duy Phương</b></sub>
      </a>
      <br />
      <sub>Full-stack Developer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/BaoKhanh04">
        <img src="https://github.com/BaoKhanh04.png" width="100px;" alt="Nguyễn Minh Thắng"/>
        <br />
        <sub><b>Hoàng Võ Bảo Khánh</b></sub>
      </a>
      <br />
      <sub>Front-end Developer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/nauthen">
        <img src="https://github.com/nauthen.png" width="100px;" alt="Nguyễn Hữu Anh Tuấn"/>
        <br />
        <sub><b>Trịnh Nam Thuận</b></sub>
      </a>
      <br />
      <sub>Backend Developer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/NguyendatGH">
        <img src="https://github.com/NguyendatGH.png" width="100px;" alt="Nguyễn Hữu Anh Tuấn"/>
        <br />
        <sub><b>Nguyễn Tấn Đạt</b></sub>
      </a>
      <br />
      <sub>Full-Stack Developer</sub>
    </td>
  </tr>
</table>
</div>
<br>

### 🎯 Team Responsibilities

| Team | Focus Areas |
|------|------------|
| 🏗️ **Architecture** | System design, scalability, and performance optimization |
| 🎨 **Frontend** | UI/UX design, React development, and responsive interfaces |
| ⚙️ **Backend** | API development, database management, and server logic |
| 🤖 **AI/ML** | Machine learning models, RAG system, and AI integration |
| 🔒 **Security** | Security audits, data protection, and compliance |
| 📊 **DevOps** | CI/CD pipelines, deployment, and infrastructure |

<br>

## 📈 Project Status

🚧 **Active Development** - The project is under active development with regular updates and new features being added.

### Current Version: 0.0.0

### Recent Updates:
- ✅ AI Tutor integration with RAG-based chatbot
- ✅ Face detection for exam monitoring
- ✅ PDF upload and OCR processing
- ✅ Real-time video conferencing
- ✅ Automated flashcard generation
- ✅ Enhanced dashboard analytics

---

## 🙏 Acknowledgments

We would like to thank the following open-source projects and services that made EVAR possible:

- **React Team** - For the amazing React library
- **Vite Team** - For the blazing-fast build tool
- **TailwindCSS** - For the utility-first CSS framework
- **Ant Design** - For the comprehensive component library
- **face-api.js** - For face detection capabilities
- **Zego Cloud** - For video conferencing infrastructure
- **Cloudinary** - For media management services
- **Three.js** - For 3D graphics capabilities
- **PDF.js** - For PDF processing
- **All contributors** - For their valuable contributions

Special thanks to the education technology community for inspiration and support.

---

## 📞 Contact

For questions, suggestions, or support:

- **GitHub Issues**: [Create an issue](https://github.com/phuongtdd/evar-fe/issues)
- **Documentation**: [View full documentation](./docs)

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/phuongtdd/evar-fe.git
   cd evar/evar-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.development
   # Edit .env.development with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

### Development Guidelines

- **Code Style**: Follow the existing code style and ESLint rules
- **TypeScript**: Use TypeScript for all new code
- **Components**: Create reusable, well-documented components
- **Testing**: Write tests for new features (when applicable)
- **Commits**: Use clear, descriptive commit messages
- **Pull Requests**: Provide detailed descriptions of changes

### Contribution Areas

- 🐛 **Bug Fixes** - Help us squash bugs
- ✨ **New Features** - Propose and implement new features
- 📚 **Documentation** - Improve documentation and examples
- 🎨 **UI/UX** - Enhance user interface and experience
- ♿ **Accessibility** - Make the app more accessible
- 🌍 **Translations** - Add support for more languages
- ⚡ **Performance** - Optimize performance and bundle size

### Pull Request Process

1. Create a feature branch from `dev`
2. Make your changes with clear commit messages
3. Update documentation if needed
4. Test your changes thoroughly
5. Submit a pull request with a detailed description
6. Wait for code review and address feedback

### Code of Conduct

Please be respectful and constructive in all interactions. We are committed to providing a welcoming and inclusive environment for all contributors.

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 EVAR Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📚 Additional Resources

- [Backend Repository](https://github.com/phuongtdd/evar-be.git) - EVAR Backend API
- [Component Library](./docs/COMPONENTS.md) - Reusable components guide
- [Architecture Guide](./docs/ARCHITECTURE.md) - Detailed architecture overview

---

<div align="center">

**Made with ❤️ by the EVAR Team**

⭐ Star us on GitHub if you find this project useful!

[Website](https://evar.edu) • [Documentation](./docs) • [Report Bug](https://github.com/your-repo/evar/issues) • [Request Feature](https://github.com/your-repo/evar/issues)


![Footer](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer)
</div>




