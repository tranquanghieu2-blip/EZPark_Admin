import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ping, logout } from '../services/authService';
import { ROUTES } from '../constants';

// Thời gian timeout (15 phút = 900000 ms)
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 phút
// Khoảng thời gian ping (mỗi 5 phút)
const PING_INTERVAL = 5 * 60 * 1000; // 5 phút

export const useActivityTracker = () => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const pingIntervalRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  // Hàm logout khi hết thời gian
  const handleInactivityLogout = useCallback(async () => {
    try {
      await logout();
      toast.warning('Phiên đăng nhập đã hết hạn do không có hoạt động!');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Auto logout error:', error);
      navigate(ROUTES.LOGIN);
    }
  }, [navigate]);

  // Hàm ping server để kiểm tra session
  const checkSession = useCallback(async () => {
    try {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      
      // Nếu đã quá 15 phút không hoạt động, logout ngay
      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        await handleInactivityLogout();
        return;
      }

      // Gọi ping API
      await ping();
    } catch (error) {
      // Nếu ping fail (401 hoặc lỗi khác), logout
      if (error.response?.status === 401) {
        await handleInactivityLogout();
      }
    }
  }, [handleInactivityLogout]);

  // Reset timeout khi có hoạt động
  const resetTimeout = useCallback(() => {
    lastActivityRef.current = Date.now();

    // Clear timeout cũ
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Tạo timeout mới
    timeoutRef.current = setTimeout(() => {
      handleInactivityLogout();
    }, INACTIVITY_TIMEOUT);
  }, [handleInactivityLogout]);

  useEffect(() => {
    // Các sự kiện để theo dõi hoạt động người dùng
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Reset timeout khi có hoạt động
    const handleActivity = () => {
      resetTimeout();
    };

    // Đăng ký event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Bắt đầu timeout và ping interval
    resetTimeout();
    
    // Ping server mỗi 5 phút để kiểm tra session
    pingIntervalRef.current = setInterval(() => {
      checkSession();
    }, PING_INTERVAL);

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [resetTimeout, checkSession]);

  return null;
};
