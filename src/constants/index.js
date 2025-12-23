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
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ezpark.dev/api/admin/';

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
  'Bãi đỗ xe tập trung',
  'Bãi đỗ xe ven đường',
];

export const TYPE_OPTIONS = [
  { value: "parking hub", label: "Bãi đỗ xe tập trung" },
  { value: "on street parking", label: "Bãi đỗ xe ven đường" },
];

export const RESTRICTED_TYPE_OPTIONS = [
  { value: "no parking", label: "Cấm đỗ" },
  { value: "no stopping", label: "Cấm dừng" },
  { value: "alternate days", label: "Cấm đỗ chẵn lẻ" },
];

export const RESTRICTED_SIDE_OPTIONS = [
  { value: "odd", label: "Bên lẻ" },
  { value: "even", label: "Bên chẵn" },
  { value: "both", label: "Cả hai bên" },
];


// Loại cấm
export const RESTRICTED_TYPES = [
  'Cấm đỗ',
  'Cấm dừng',
  'Cấm ngày chẵn/lẻ'
];

// Bên cấm
export const RESTRICTED_SIDES = [
  'Bên trái',
  'Bên phải',
  'Cả hai bên',
];

// Từ ngữ vi phạm (để cảnh báo trong feedback)
export const INAPPROPRIATE_WORDS = [
  // Tiếng Việt - Từ thô tục
  'đồ chó',
  'con chó',
  'thằng chó',
  'đồ ngu',
  'ngu ngốc',
  'ngu dốt',
  'đần độn',
  'ngu si',
  'đồ khốn',
  'khốn nạn',
  'đồ súc sinh',
  'súc vật',
  'đồ điên',
  'thằng điên',
  'con điên',
  'đồ ngốc',
  'đồ dốt',
  'thằng dốt',
  'con dốt',
  'đồ ranh',
  'thằng ranh',
  'đồ hèn',
  'đồ nhát',
  'đồ hèn hạ',
  'đồ mất dạy',
  'vô dạy',
  'dốt nát',
  'ngu như bò',
  'ngu như lợn',
  
  // Tiếng Việt - Từ xúc phạm gia đình
  'đồ con',
  'thằng con',
  'mẹ mày',
  'bố mày',
  'cha mày',
  'cút mẹ',
  'cút cha',
  'đụ mẹ',
  'địt mẹ',
  'đéo mẹ',
  'vãi đạn',
  'vãi',
  'đm',
  'dm',
  'vcl',
  'đcm',
  'dcm',
  'clm',
  'đkm',
  'dkm',
  
  // Tiếng Việt - Từ thô tục khác
  'cặc',
  'lồn',
  'buồi',
  'đéo',
  'địt',
  'đụ',
  'đĩ',
  'chó',
  'lol',
  'óc chó',
  'óc lồn',
  'đồ lừa đảo',
  'lừa đảo',
  'bịp bợm',
  'đồ bịp',
  'thằng lừa',
  'con lừa',
  'thối nát',
  'rác rưởi',
  'đồ rác',
  'phế vật',
  
  // Tiếng Anh
  'fuck',
  'fucking',
  'motherfucker',
  'shit',
  'bullshit',
  'bitch',
  'bastard',
  'asshole',
  'damn',
  'hell',
  'crap',
  'piss',
  'dick',
  'cock',
  'pussy',
  'retard',
  'idiot',
  'stupid',
  'dumb',
  'moron',
  'fool',
  'loser',
  'scam',
  'fraud',
  'garbage',
  'trash',
  'wtf',
  'stfu',
  
  // Viết tắt và biến thể
  'f*ck',
  'sh*t',
  'b*tch',
  'fck',
  'fuk',
  'fuc',
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

// Giới hạn vùng Đà Nẵng (dùng để validate tọa độ)
export const DA_NANG_BOUNDS = {
  north: 16.125,
  south: 15.975,
  east: 108.28,
  west: 108.1,
};

export const DA_NANG_REGION = {
  latitude: (DA_NANG_BOUNDS.north + DA_NANG_BOUNDS.south) / 2,
  longitude: (DA_NANG_BOUNDS.east + DA_NANG_BOUNDS.west) / 2,
  latitudeDelta: DA_NANG_BOUNDS.north - DA_NANG_BOUNDS.south,
  longitudeDelta: DA_NANG_BOUNDS.east - DA_NANG_BOUNDS.west,
};
