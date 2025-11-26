import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaLock } from 'react-icons/fa';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import { login } from '../../services/authService';
import { ROUTES } from '../../constants';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await login(formData.username, formData.password);
      if (response.success === true) {
        toast.success('Đăng nhập thành công!');
        navigate(ROUTES.DASHBOARD);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng!';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-shape shape-1"></div>
        <div className="login-shape shape-2"></div>
        <div className="login-shape shape-3"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">EZ</div>
          </div>
          <h1 className="login-title">EZPark Admin</h1>
          <p className="login-subtitle">Quản lý bãi đỗ xe - Đà Nẵng</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <Input
            label="Tên đăng nhập"
            type="text"
            placeholder="Nhập tên đăng nhập"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            error={errors.username}
            icon={<FaUser />}
            required
          />

          <Input
            label="Mật khẩu"
            type="password"
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            icon={<FaLock />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
          >
            Đăng nhập
          </Button>
        </form>

        <div className="login-footer">
          <p>© 2025 EZPark. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
