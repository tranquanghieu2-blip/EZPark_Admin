import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaParking, 
  FaBan, 
  FaComments, 
  FaUsers,
  FaEye,
  FaEdit,
  FaTrash,
  FaChartLine 
} from 'react-icons/fa';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { getDashboardStatistics, getRecentActivities } from '../../services/dashboardService';
import { ROUTES } from '../../constants';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalParkingLots: 0,
    totalRestrictedZones: 0,
    totalFeedback: 0,
    totalUsers: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);

  // Dữ liệu mẫu cho biểu đồ
  const chartData = [
    { month: 'T1', parkingLots: 15, restrictedZones: 8 },
    { month: 'T2', parkingLots: 18, restrictedZones: 10 },
    { month: 'T3', parkingLots: 22, restrictedZones: 12 },
    { month: 'T4', parkingLots: 25, restrictedZones: 15 },
    { month: 'T5', parkingLots: 28, restrictedZones: 18 },
    { month: 'T6', parkingLots: 32, restrictedZones: 20 },
  ];

  const feedbackChartData = [
    { day: 'T2', positive: 45, negative: 10 },
    { day: 'T3', positive: 52, negative: 8 },
    { day: 'T4', positive: 38, negative: 12 },
    { day: 'T5', positive: 60, negative: 5 },
    { day: 'T6', positive: 55, negative: 7 },
    { day: 'T7', positive: 48, negative: 6 },
    { day: 'CN', positive: 42, negative: 4 },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Dữ liệu mẫu - bạn sẽ thay bằng API thực
      setStatistics({
        totalParkingLots: 145,
        totalRestrictedZones: 89,
        totalFeedback: 1234,
        totalUsers: 5678,
      });

      setRecentActivities([
        { id: 1, type: 'parking', action: 'Thêm mới', name: 'Bãi đỗ xe TTTM Indochina', time: '5 phút trước' },
        { id: 2, type: 'restricted', action: 'Cập nhật', name: 'Tuyến cấm đường Lê Duẩn', time: '15 phút trước' },
        { id: 3, type: 'feedback', action: 'Xóa', name: 'Feedback vi phạm', time: '30 phút trước' },
        { id: 4, type: 'user', action: 'Chặn', name: 'Người dùng vi phạm', time: '1 giờ trước' },
      ]);

      setLoading(false);
    } catch (error) {
      toast.error('Không thể tải dữ liệu dashboard');
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Bãi đỗ xe',
      value: statistics.totalParkingLots,
      icon: <FaParking />,
      color: '#FF6B35',
      route: ROUTES.PARKING_LIST,
    },
    {
      title: 'Tuyến cấm',
      value: statistics.totalRestrictedZones,
      icon: <FaBan />,
      color: '#E63946',
      route: ROUTES.RESTRICTED_LIST,
    },
    {
      title: 'Feedback',
      value: statistics.totalFeedback,
      icon: <FaComments />,
      color: '#06D6A0',
      route: ROUTES.FEEDBACK_LIST,
    },
    {
      title: 'Người dùng',
      value: statistics.totalUsers,
      icon: <FaUsers />,
      color: '#118AB2',
      route: ROUTES.USER_LIST,
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Đang tải dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Tổng quan hệ thống quản lý bãi đỗ xe Đà Nẵng</p>
        </div>
        <Button variant="primary" icon={<FaChartLine />}>
          Xuất báo cáo
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className="stat-card"
            style={{ '--stat-color': stat.color }}
            onClick={() => navigate(stat.route)}
          >
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.title}</p>
            </div>
            <div className="stat-arrow">→</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <Card title="Thống kê theo tháng" className="chart-card">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorParking" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRestricted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E63946" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#E63946" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="parkingLots" 
                stroke="#FF6B35" 
                fillOpacity={1} 
                fill="url(#colorParking)"
                name="Bãi đỗ xe"
              />
              <Area 
                type="monotone" 
                dataKey="restrictedZones" 
                stroke="#E63946" 
                fillOpacity={1} 
                fill="url(#colorRestricted)"
                name="Tuyến cấm"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Phản hồi trong tuần" className="chart-card">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={feedbackChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="positive" fill="#06D6A0" name="Tích cực" />
              <Bar dataKey="negative" fill="#EF476F" name="Tiêu cực" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card title="Hoạt động gần đây">
        <div className="activities-list">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className={`activity-icon activity-${activity.type}`}>
                {activity.type === 'parking' && <FaParking />}
                {activity.type === 'restricted' && <FaBan />}
                {activity.type === 'feedback' && <FaComments />}
                {activity.type === 'user' && <FaUsers />}
              </div>
              <div className="activity-content">
                <p className="activity-text">
                  <span className="activity-action">{activity.action}</span> {activity.name}
                </p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
