# EZPark Admin Dashboard

Hệ thống quản lý bãi đỗ xe và tuyến cấm tại thành phố Đà Nẵng dành cho Admin.

## 🚀 Tính năng

### ✅ Đã hoàn thiện

1. **Đăng nhập**
   - Xác thực tài khoản admin
   - Bảo mật với JWT Token
   - Giao diện gradient cam đỏ đẹp mắt

2. **Dashboard**
   - Thống kê tổng quan (Bãi đỗ xe, Tuyến cấm, Feedback, Users)
   - Biểu đồ trực quan (Area Chart, Bar Chart)
   - Danh sách hoạt động gần đây
   - Responsive design

3. **Quản lý Bãi đỗ xe**
   - Xem danh sách bãi đỗ xe
   - Thêm mới bãi đỗ xe
   - Chỉnh sửa thông tin
   - Xóa bãi đỗ xe
   - Tìm kiếm theo tên, địa chỉ
   - Quản lý loại bãi đỗ (có thể thêm loại mới)
   - Nhập tọa độ (Latitude, Longitude)

4. **Quản lý Tuyến cấm**
   - Xem danh sách tuyến cấm
   - Thêm/Sửa/Xóa tuyến cấm
   - Quản lý thời gian cấm (nhiều mốc thời gian)
   - Tìm kiếm theo tên đường

5. **Quản lý Feedback**
   - Xem danh sách feedback từ người dùng
   - Phát hiện từ ngữ không phù hợp (cảnh báo màu đỏ)
   - Xóa feedback vi phạm
   - Tìm kiếm theo bãi đỗ hoặc người dùng

6. **Quản lý Người dùng**
   - Xem danh sách người dùng
   - Chặn/Mở chặn tài khoản
   - Xóa người dùng
   - Tìm kiếm theo tên, email

## 🎨 Thiết kế

- **Màu chủ đạo**: Gradient cam đỏ (#FF6B35 → #E63946)
- **Giao diện**: Hiện đại, thân thiện, dễ sử dụng
- **Dashboard**: Đẹp mắt với cards, charts, animations
- **Responsive**: Hỗ trợ mobile, tablet, desktop

## 🛠️ Công nghệ sử dụng

- **React 18** - UI Library
- **React Router v6** - Routing
- **Axios** - HTTP Client
- **Recharts** - Charts & Graphs
- **React Icons** - Icons
- **React Toastify** - Notifications
- **Vite** - Build Tool

## 📦 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## 🔧 Cấu hình API

Tất cả các API đã được tích hợp sẵn ở thư mục `src/services/`.

**Quan trọng**: Hiện tại đang sử dụng dữ liệu mẫu (mock data). 

Để kết nối với API thực, hãy:

1. Mở file `src/constants/index.js`
2. Thay đổi `API_BASE_URL` thành URL API backend của bạn:
   ```javascript
   export const API_BASE_URL = 'http://your-api-url.com/api';
   ```

### 📝 API Endpoints đã tích hợp

#### Authentication
- `POST /auth/login` - Đăng nhập
- `POST /auth/change-password` - Đổi mật khẩu
- `GET /auth/verify` - Verify token

#### Parking Lots
- `GET /parking-lots` - Lấy danh sách
- `GET /parking-lots/:id` - Lấy chi tiết
- `POST /parking-lots` - Tạo mới
- `PUT /parking-lots/:id` - Cập nhật
- `DELETE /parking-lots/:id` - Xóa
- `GET /parking-lots/statistics` - Thống kê
- `GET /parking-lots/types` - Lấy danh sách loại
- `POST /parking-lots/types` - Thêm loại mới

#### Restricted Zones
- `GET /restricted-zones` - Lấy danh sách
- `GET /restricted-zones/:id` - Lấy chi tiết
- `POST /restricted-zones` - Tạo mới
- `PUT /restricted-zones/:id` - Cập nhật
- `DELETE /restricted-zones/:id` - Xóa
- `GET /restricted-zones/statistics` - Thống kê

#### Feedback
- `GET /feedback` - Lấy danh sách
- `GET /feedback/:id` - Lấy chi tiết
- `GET /feedback/parking-lot/:id` - Lấy theo bãi đỗ
- `DELETE /feedback/:id` - Xóa
- `POST /feedback/check-content` - Kiểm tra nội dung
- `GET /feedback/statistics` - Thống kê

#### Users
- `GET /users` - Lấy danh sách
- `GET /users/:id` - Lấy chi tiết
- `POST /users` - Tạo mới
- `PUT /users/:id` - Cập nhật
- `DELETE /users/:id` - Xóa
- `PATCH /users/:id/status` - Đổi trạng thái
- `GET /users/statistics` - Thống kê

#### Dashboard
- `GET /dashboard/statistics` - Thống kê tổng quan
- `GET /dashboard/activities` - Hoạt động gần đây
- `GET /dashboard/charts` - Dữ liệu biểu đồ

## 📁 Cấu trúc thư mục

```
Admin/
├── public/
├── src/
│   ├── components/
│   │   ├── common/          # Components tái sử dụng
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Table/
│   │   │   └── Modal/
│   │   └── layout/          # Layout components
│   │       ├── Sidebar/
│   │       ├── Navbar/
│   │       └── Layout/
│   ├── pages/               # Các trang chính
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   ├── ParkingLot/
│   │   │   ├── ParkingList/
│   │   │   └── ParkingForm/
│   │   ├── RestrictedZone/
│   │   ├── Feedback/
│   │   └── User/
│   ├── services/            # API services
│   │   ├── axios.js
│   │   ├── authService.js
│   │   ├── parkingService.js
│   │   ├── restrictedZoneService.js
│   │   ├── feedbackService.js
│   │   ├── userService.js
│   │   └── dashboardService.js
│   ├── utils/               # Utility functions
│   │   └── helpers.js
│   ├── constants/           # Constants & configs
│   │   └── index.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Hướng dẫn sử dụng

### Đăng nhập
1. Truy cập `/login`
2. Nhập tên đăng nhập và mật khẩu
3. Hệ thống sẽ chuyển đến Dashboard

### Quản lý Bãi đỗ xe
1. Click "Bãi đỗ xe" trên sidebar
2. Click "Thêm bãi đỗ mới" để tạo mới
3. Điền đầy đủ thông tin (tên, loại, sức chứa, địa chỉ, tọa độ)
4. Có thể thêm loại bãi đỗ mới nếu chưa có trong dropdown
5. Click "Lưu" để hoàn tất

### Quản lý Feedback
1. Click "Feedback" trên sidebar
2. Hệ thống tự động phát hiện feedback có từ ngữ vi phạm (icon cảnh báo đỏ)
3. Click icon thùng rác để xóa feedback vi phạm

### Quản lý User
1. Click "Người dùng" trên sidebar
2. Click icon cấm để chặn/mở chặn user
3. Click icon thùng rác để xóa user

## 🔐 Authentication

Hệ thống sử dụng JWT token để xác thực:
- Token được lưu trong localStorage
- Tự động thêm vào header của mỗi request
- Tự động logout khi token hết hạn (401)

## 🎨 Customization

### Thay đổi màu sắc
Mở file `src/constants/index.js` và chỉnh sửa object `COLORS`:

```javascript
export const COLORS = {
  primary: '#FF6B35',
  primaryDark: '#E63946',
  // ... các màu khác
};
```

### Thêm menu mới
Mở file `src/components/layout/Sidebar/Sidebar.jsx` và thêm vào array `menuItems`

## 📱 Responsive

- **Desktop**: > 768px - Hiển thị đầy đủ
- **Tablet**: 768px - 1024px - Tối ưu hóa
- **Mobile**: < 768px - Sidebar ẩn, menu hamburger

## 🐛 Lưu ý

1. Hiện tại dùng mock data, cần kết nối API thực
2. Một số tính năng cần API backend hỗ trợ:
   - Upload hình ảnh bãi đỗ
   - Map integration (Google Maps/Leaflet)
   - Real-time notifications
   - Export reports

## 👨‍💻 Developer

Được phát triển bởi lập trình viên chuyên nghiệp cho dự án EZPark Đà Nẵng.

## 📄 License

Private - Capstone Project 2025
