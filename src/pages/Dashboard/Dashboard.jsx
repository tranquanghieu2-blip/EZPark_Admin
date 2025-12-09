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
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { getDashboardStatistics, getFeedbackStatistics, getParkingRouteStatistics, getUserStatistics } from '../../services/dashboardService';
import { ROUTES } from '../../constants';
import socket from '../../socket';
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
  const [feedbackData, setFeedbackData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [parkingRouteData, setParkingRouteData] = useState([]);
  const [userData, setUserData] = useState([]);
  

  useEffect(() => {
    fetchDashboardData();
    fetchFeedbackStatistics();
    fetchParkingRouteStatistics();
    fetchUserStatistics();
  }, []);

  useEffect(() => {
  const handleFeedbackChanged = (payload) => {
    console.log("📥 Realtime feedback:", payload);
    
    // Luôn reload thống kê khi có feedback mới / update / delete
    fetchDashboardData();
    fetchFeedbackStatistics(selectedYear);
  };

  const handleUserUpdated = (payload) => {
    console.log("👤 Realtime user updated:", payload);

    // Luôn reload thống kê khi có user update
    fetchDashboardData();
    fetchUserStatistics(selectedYear);
  };

  socket.on('newFeedback', handleFeedbackChanged);
  socket.on('feedbackStatus', handleFeedbackChanged);
  socket.on('userUpdated', handleUserUpdated);

  return () => {
    socket.off('newFeedback', handleFeedbackChanged);
    socket.off('feedbackStatus', handleFeedbackChanged);
    socket.off('userUpdated', handleUserUpdated);
  };

}, []); // <-- chạy đúng 1 lần duy nhất


  const fetchDashboardData = async () => {
    try {
      const stats = await getDashboardStatistics();
      setStatistics({
        totalParkingLots: stats.data.totalParkingSpots,
        totalRestrictedZones: stats.data.totalNoParkingRoutes,
        totalFeedback: stats.data.totalFeedbacks,
        totalUsers: stats.data.totalUsers,
      });

      setLoading(false);
    } catch (error) {
      toast.error('Không thể tải dữ liệu dashboard');
      setLoading(false);
    }
  };

  const fetchFeedbackStatistics = async (year = selectedYear) => {
    try {
      const response = await getFeedbackStatistics(year);
      if (response.success && response.data) {
        // Chuyển đổi dữ liệu từ API sang format cho chart
        const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        const chartData = response.data.map(item => ({
          month: monthNames[parseInt(item.month.replace('T', '')) - 1],
          positive: item.highRating,
          negative: item.lowRating,
          total: item.highRating + item.lowRating
        }));
        setFeedbackData(chartData);
      }
    } catch (error) {
      console.error('Error fetching feedback statistics:', error);
      toast.error('Không thể tải dữ liệu thống kê phản hồi');
    }
  };

  const fetchParkingRouteStatistics = async (year = selectedYear) => {
    try {
      const response = await getParkingRouteStatistics(year);
      if (response.success && response.data) {
        const formattedData = response.data.map(item => ({
          month: `${item.month}`,
          parkingLots: item.parkingSpot,
          restrictedZones: item.noParkingRoute,
        }));
        setParkingRouteData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching parking route statistics:', error);
      toast.error('Không thể tải dữ liệu thống kê tuyến cấm');
    }
  };

  const fetchUserStatistics = async (year = selectedYear) => {
    try {
      const response = await getUserStatistics(year);
      if (response.success && response.data) {
        const formattedData = response.data.map(item => ({
          month: item.month,
          users: item.user
        }));
        setUserData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      toast.error('Không thể tải dữ liệu thống kê người dùng');
    }
  };

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    fetchFeedbackStatistics(year);
    fetchParkingRouteStatistics(year);
    fetchUserStatistics(year);
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

      {/* Year Filter */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'center',
        marginTop: '24px',
        marginBottom: '16px',
        gap: '12px'
      }}>
        <span style={{ fontWeight: '600', fontSize: '15px', color: '#333' }}>Lọc theo năm:</span>
        <select 
          value={selectedYear} 
          onChange={handleYearChange}
          style={{
            padding: '10px 20px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            backgroundColor: '#fff',
            color: '#333',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            minWidth: '120px'
          }}
          onMouseOver={(e) => {
            e.target.style.borderColor = '#4A90E2';
            e.target.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.2)';
          }}
          onMouseOut={(e) => {
            e.target.style.borderColor = '#e0e0e0';
            e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
          }}
        >
          {Array.from({ length: new Date().getFullYear() - 2025 + 1 }, (_, i) => 2025 + i).reverse().map(year => (
            <option key={year} value={year}>Năm {year}</option>
          ))}
        </select>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <Card title="Thống kê số lượng bãi đỗ và tuyến cấm" className="chart-card">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={parkingRouteData}>
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

        <Card title="Thống kê phản hồi" className="chart-card">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={feedbackData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="positive" fill="#06D6A0" name="Đánh giá cao (4-5 sao)" />
              <Bar dataKey="negative" fill="#EF476F" name="Đánh giá thấp (1-3 sao)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* User Growth Chart - Full Width */}
      <div style={{ marginTop: '24px' }}>
        <Card title = "Thống kê số lượng người dùng đăng ký" className="chart-card">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={userData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#118AB2" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#118AB2" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#118AB2" 
                strokeWidth={3}
                dot={{ fill: '#118AB2', r: 5 }}
                activeDot={{ r: 7 }}
                name="Số người dùng"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
