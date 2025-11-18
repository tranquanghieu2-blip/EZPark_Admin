import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { createParkingLot, updateParkingLot, getParkingLotById } from '../../../services/parkingService';
import { PARKING_TYPES, ROUTES } from '../../../constants';
import './ParkingForm.css';

const ParkingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    address: '',
    description: '',
    lat: '',
    lng: '',
  });
  const [errors, setErrors] = useState({});
  const [parkingTypes, setParkingTypes] = useState(PARKING_TYPES);
  const [showAddType, setShowAddType] = useState(false);
  const [newType, setNewType] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchParkingLot();
    }
  }, [id]);

  const fetchParkingLot = async () => {
    try {
      // Dữ liệu mẫu
      const mockData = {
        id: 1,
        name: 'Bãi đỗ xe TTTM Indochina',
        type: 'Bãi đỗ công cộng',
        capacity: 200,
        address: '234 Trần Phú, Hải Châu, Đà Nẵng',
        description: 'Bãi đỗ xe rộng rãi, an toàn',
        lat: 16.0471,
        lng: 108.2068,
      };
      setFormData(mockData);
    } catch (error) {
      toast.error('Không thể tải thông tin bãi đỗ xe');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập tên bãi đỗ';
    if (!formData.type) newErrors.type = 'Vui lòng chọn loại bãi đỗ';
    if (!formData.capacity) newErrors.capacity = 'Vui lòng nhập sức chứa';
    if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!formData.lat) newErrors.lat = 'Vui lòng nhập vĩ độ';
    if (!formData.lng) newErrors.lng = 'Vui lòng nhập kinh độ';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEdit) {
        await updateParkingLot(id, formData);
        toast.success('Cập nhật bãi đỗ xe thành công!');
      } else {
        await createParkingLot(formData);
        toast.success('Thêm bãi đỗ xe mới thành công!');
      }
      navigate(ROUTES.PARKING_LIST);
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleAddType = () => {
    if (newType.trim()) {
      setParkingTypes(prev => [...prev, newType]);
      setFormData(prev => ({ ...prev, type: newType }));
      setNewType('');
      setShowAddType(false);
      toast.success('Đã thêm loại bãi đỗ mới!');
    }
  };

  return (
    <div className="parking-form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {isEdit ? 'Chỉnh sửa bãi đỗ xe' : 'Thêm bãi đỗ xe mới'}
          </h1>
          <p className="page-subtitle">
            {isEdit ? 'Cập nhật thông tin bãi đỗ xe' : 'Nhập thông tin bãi đỗ xe mới'}
          </p>
        </div>
        <Button 
          variant="ghost" 
          icon={<FaArrowLeft />}
          onClick={() => navigate(ROUTES.PARKING_LIST)}
        >
          Quay lại
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card title="Thông tin cơ bản">
          <div className="form-grid">
            <Input
              label="Tên bãi đỗ"
              placeholder="Nhập tên bãi đỗ xe"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              required
            />

            <div className="input-group">
              <label className="input-label">
                Loại bãi đỗ <span className="input-required">*</span>
              </label>
              <select
                className={`input-field ${errors.type ? 'input-error' : ''}`}
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <option value="">Chọn loại bãi đỗ</option>
                {parkingTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
              {errors.type && <span className="input-error-text">{errors.type}</span>}
              <button
                type="button"
                className="btn-add-type"
                onClick={() => setShowAddType(!showAddType)}
              >
                + Thêm loại mới
              </button>
            </div>

            {showAddType && (
              <div className="add-type-container">
                <Input
                  label="Loại bãi đỗ mới"
                  placeholder="Nhập tên loại mới"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                />
                <Button size="small" onClick={handleAddType}>
                  Thêm
                </Button>
              </div>
            )}

            <Input
              label="Tổng sức chứa"
              type="number"
              placeholder="Nhập số lượng xe"
              value={formData.capacity}
              onChange={(e) => handleChange('capacity', e.target.value)}
              error={errors.capacity}
              required
            />

            <Input
              label="Địa chỉ"
              placeholder="Nhập địa chỉ chi tiết"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              error={errors.address}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Mô tả</label>
            <textarea
              className="input-field"
              placeholder="Nhập mô tả về bãi đỗ xe"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
            />
          </div>
        </Card>

        <Card title="Vị trí địa lý">
          <div className="form-grid">
            <Input
              label="Vĩ độ (Latitude)"
              type="number"
              step="any"
              placeholder="VD: 16.0471"
              value={formData.lat}
              onChange={(e) => handleChange('lat', e.target.value)}
              error={errors.lat}
              required
            />

            <Input
              label="Kinh độ (Longitude)"
              type="number"
              step="any"
              placeholder="VD: 108.2068"
              value={formData.lng}
              onChange={(e) => handleChange('lng', e.target.value)}
              error={errors.lng}
              required
            />
          </div>
          <p className="form-hint">
            💡 Mẹo: Bạn có thể lấy tọa độ từ Google Maps bằng cách nhấp chuột phải vào vị trí
          </p>
        </Card>

        <div className="form-actions">
          <Button 
            variant="ghost" 
            type="button"
            onClick={() => navigate(ROUTES.PARKING_LIST)}
          >
            Hủy
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            icon={<FaSave />}
            loading={loading}
          >
            {isEdit ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ParkingForm;
