import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { 
  FaUserCircle, 
  FaCamera, 
  FaSave, 
  FaLock,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Modal from '../../components/common/Modal/Modal';
import { getCurrentUser } from '../../services/authService';
import { updateProfile, updateAvatar, changePassword } from '../../services/profileService';
import { useTheme } from '../../context/ThemeContext';
import './Profile.css';

const Profile = () => {
  const { theme, toggleTheme } = useTheme();
  const user = getCurrentUser();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [errors, setErrors] = useState({});

  // Password Change Modal
  const [passwordModal, setPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    setPasswordErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh!');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB!');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      // Mock upload - thay bằng API thực
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Cập nhật avatar thành công!');
      
      // Khi có API thực, uncomment:
      // await updateAvatar(formData);
    } catch (error) {
      toast.error('Không thể cập nhật avatar');
      setAvatarPreview(user?.avatar || null);
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (profileData.phone && !/^(0|\+84)[0-9]{9}$/.test(profileData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setLoading(true);
    try {
      // Mock update - thay bằng API thực
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Cập nhật localStorage
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem('ezpark_admin_user', JSON.stringify(updatedUser));
      
      toast.success('Cập nhật thông tin thành công!');
      
      // Khi có API thực, uncomment:
      // await updateProfile(profileData);
    } catch (error) {
      toast.error('Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.oldPassword) {
      newErrors.oldPassword = 'Vui lòng nhập mật khẩu cũ';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (passwordData.oldPassword === passwordData.newPassword) {
      newErrors.newPassword = 'Mật khẩu mới phải khác mật khẩu cũ';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setPasswordLoading(true);
    try {
      // Mock change password - thay bằng API thực
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Đổi mật khẩu thành công!');
      setPasswordModal(false);
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Khi có API thực, uncomment:
      // await changePassword(passwordData.oldPassword, passwordData.newPassword);
    } catch (error) {
      toast.error('Mật khẩu cũ không đúng hoặc có lỗi xảy ra');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Thông tin cá nhân</h1>
          <p className="page-subtitle">Quản lý thông tin và cài đặt tài khoản</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* Avatar Card */}
        <Card title="Ảnh đại diện" className="avatar-card">
          <div className="avatar-container">
            <div className="avatar-wrapper" onClick={handleAvatarClick}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="avatar-image" />
              ) : (
                <FaUserCircle className="avatar-placeholder" />
              )}
              <div className="avatar-overlay">
                <FaCamera />
                <span>Thay đổi</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
            <div className="avatar-info">
              <h3>{user?.name || 'Admin'}</h3>
              <p>{user?.role || 'Administrator'}</p>
            </div>
          </div>
          <p className="avatar-hint">
            💡 Click vào ảnh để thay đổi. Định dạng: JPG, PNG. Tối đa 5MB.
          </p>
        </Card>

        {/* Theme Settings */}
        <Card title="Giao diện" className="theme-card">
          <div className="theme-container">
            <div className="theme-info">
              <div className="theme-icon">
                {theme === 'light' ? <FaSun /> : <FaMoon />}
              </div>
              <div>
                <h4>Chế độ {theme === 'light' ? 'Sáng' : 'Tối'}</h4>
                <p>Thay đổi giao diện ứng dụng</p>
              </div>
            </div>
            <button className="theme-toggle" onClick={toggleTheme}>
              <span className="toggle-slider" data-active={theme === 'dark'}></span>
            </button>
          </div>
        </Card>
      </div>

      {/* Profile Information */}
      <form onSubmit={handleProfileSubmit}>
        <Card title="Thông tin cá nhân">
          <div className="form-grid">
            <Input
              label="Họ và tên"
              placeholder="Nhập họ tên"
              value={profileData.name}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              error={errors.name}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="Nhập email"
              value={profileData.email}
              onChange={(e) => handleProfileChange('email', e.target.value)}
              error={errors.email}
              required
            />

            <Input
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              value={profileData.phone}
              onChange={(e) => handleProfileChange('phone', e.target.value)}
              error={errors.phone}
            />
          </div>

          <div className="form-actions">
            <Button 
              variant="primary" 
              type="submit"
              icon={<FaSave />}
              loading={loading}
            >
              Lưu thay đổi
            </Button>
          </div>
        </Card>
      </form>

      {/* Security Settings */}
      <Card title="Bảo mật">
        <div className="security-item">
          <div className="security-info">
            <FaLock className="security-icon" />
            <div>
              <h4>Mật khẩu</h4>
              <p>Thay đổi mật khẩu của bạn</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setPasswordModal(true)}>
            Đổi mật khẩu
          </Button>
        </div>
      </Card>

      {/* Change Password Modal */}
      <Modal
        isOpen={passwordModal}
        onClose={() => {
          setPasswordModal(false);
          setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
          setPasswordErrors({});
        }}
        title="Đổi mật khẩu"
        size="small"
      >
        <form onSubmit={handlePasswordSubmit}>
          <Input
            label="Mật khẩu cũ"
            type="password"
            placeholder="Nhập mật khẩu cũ"
            value={passwordData.oldPassword}
            onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
            error={passwordErrors.oldPassword}
            required
          />

          <Input
            label="Mật khẩu mới"
            type="password"
            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
            value={passwordData.newPassword}
            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
            error={passwordErrors.newPassword}
            required
          />

          <Input
            label="Xác nhận mật khẩu mới"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={passwordData.confirmPassword}
            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
            error={passwordErrors.confirmPassword}
            required
          />

          <div className="modal-actions">
            <Button 
              variant="ghost" 
              type="button"
              onClick={() => {
                setPasswordModal(false);
                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                setPasswordErrors({});
              }}
            >
              Hủy
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              loading={passwordLoading}
            >
              Đổi mật khẩu
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
