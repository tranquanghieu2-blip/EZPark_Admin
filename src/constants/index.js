// Màu sắc chủ đạo - Gradient Cam Đỏ
export const COLORS = {
  primary: '#FF6B35',
  primaryDark: '#E63946',
  primaryLight: '#FF8C42',
  secondary: '#FFA07A',
  success: '#06D6A0',
  warning: '#FFD166',
  danger: '#EF476F',
  info: '#118AB2',
  dark: '#073B4C',
  light: '#F7F7F7',
  white: '#FFFFFF',
  gray: '#6C757D',
  lightGray: '#E9ECEF',
  
  // Gradients
  gradient: {
    primary: 'linear-gradient(135deg, #FF6B35 0%, #E63946 100%)',
    secondary: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
    soft: 'linear-gradient(135deg, #FFA07A 0%, #FF8C42 100%)',
    dark: 'linear-gradient(135deg, #E63946 0%, #A4161A 100%)',
  },
  
  // Shadow colors
  shadow: 'rgba(230, 57, 70, 0.2)',
  shadowLight: 'rgba(255, 107, 53, 0.1)',
};

// API Base URL (lấy từ biến môi trường)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ezpark-9gnn.onrender.com/api/';

// Routes
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  PROFILE: '/profile',
  
  // Parking Lots
  PARKING_LIST: '/parking-spots',
  PARKING_DETAIL: '/parking-spots/:id',
  PARKING_CREATE: '/parking-spots/new',
  PARKING_EDIT: '/parking-spots/:id/edit',
  
  // Restricted Zones
  RESTRICTED_LIST: '/restricted-zones',
  RESTRICTED_DETAIL: '/restricted-zones/:id',
  RESTRICTED_CREATE: '/restricted-zones/new',
  RESTRICTED_EDIT: '/restricted-zones/:id/edit',
  
  // Feedback
  FEEDBACK_LIST: '/feedback',
  FEEDBACK_DETAIL: '/feedback/:id',
  
  // Users
  USER_LIST: '/users',
  USER_DETAIL: '/users/:id',
};

// Loại bãi đỗ xe
export const PARKING_TYPES = [
  'Bãi đỗ công cộng',
  'Bãi đỗ tư nhân',
  'Bãi đỗ ven đường',
  'Bãi đỗ trong nhà',
  'Bãi đỗ ngoài trời',
  'Bãi đỗ xe máy',
  'Bãi đỗ ô tô',
  'Bãi đỗ hỗn hợp',
];

// Loại cấm
export const RESTRICTED_TYPES = [
  'Cấm đỗ',
  'Cấm dừng',
  'Cấm đỗ theo giờ',
  'Cấm dừng đỗ',
  'Cấm theo ngày',
];

// Bên cấm
export const RESTRICTED_SIDES = [
  'Bên trái',
  'Bên phải',
  'Cả hai bên',
  'Giữa đường',
];

// Từ ngữ vi phạm (để cảnh báo trong feedback)
export const INAPPROPRIATE_WORDS = [
  'đồ chó',
  'fuck',
  'shit',
  'damn',
  'ngu',
  'dốt',
  'thằng',
  'con',
  // Thêm các từ ngữ vi phạm khác
];

// Pagination
export const ITEMS_PER_PAGE = 10;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'ezpark_admin_token',
  USER: 'ezpark_admin_user',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// Status
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  BLOCKED: 'blocked',
};
