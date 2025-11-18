import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { createRestrictedZone, updateRestrictedZone, getRestrictedZoneById } from '../../../services/restrictedZoneService';
import { RESTRICTED_TYPES, RESTRICTED_SIDES, ROUTES } from '../../../constants';
import './RestrictedForm.css';

const RestrictedForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    streetName: '',
    side: '',
    description: '',
    startLat: '',
    startLng: '',
    endLat: '',
    endLng: '',
    timeRestrictions: [
      {
        startTime: '',
        endTime: '',
        days: [],
      },
    ],
  });
  const [errors, setErrors] = useState({});

  const daysOfWeek = [
    { value: 'monday', label: 'T2' },
    { value: 'tuesday', label: 'T3' },
    { value: 'wednesday', label: 'T4' },
    { value: 'thursday', label: 'T5' },
    { value: 'friday', label: 'T6' },
    { value: 'saturday', label: 'T7' },
    { value: 'sunday', label: 'CN' },
  ];

  useEffect(() => {
    if (isEdit) {
      fetchRestrictedZone();
    }
  }, [id]);

  const fetchRestrictedZone = async () => {
    try {
      // Dữ liệu mẫu
      const mockData = {
        id: 1,
        type: 'Cấm đỗ',
        streetName: 'Đường Lê Duẩn',
        side: 'Cả hai bên',
        description: 'Cấm đỗ xe toàn tuyến',
        startLat: 16.0544,
        startLng: 108.2022,
        endLat: 16.0678,
        endLng: 108.2209,
        timeRestrictions: [
          {
            startTime: '06:00',
            endTime: '22:00',
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          },
        ],
      };
      setFormData(mockData);
    } catch (error) {
      toast.error('Không thể tải thông tin tuyến cấm');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleTimeRestrictionChange = (index, field, value) => {
    const newRestrictions = [...formData.timeRestrictions];
    newRestrictions[index][field] = value;
    setFormData(prev => ({ ...prev, timeRestrictions: newRestrictions }));
  };

  const handleDayToggle = (index, day) => {
    const newRestrictions = [...formData.timeRestrictions];
    const currentDays = newRestrictions[index].days || [];
    
    if (currentDays.includes(day)) {
      newRestrictions[index].days = currentDays.filter(d => d !== day);
    } else {
      newRestrictions[index].days = [...currentDays, day];
    }
    
    setFormData(prev => ({ ...prev, timeRestrictions: newRestrictions }));
  };

  const addTimeRestriction = () => {
    setFormData(prev => ({
      ...prev,
      timeRestrictions: [
        ...prev.timeRestrictions,
        { startTime: '', endTime: '', days: [] },
      ],
    }));
  };

  const removeTimeRestriction = (index) => {
    if (formData.timeRestrictions.length > 1) {
      setFormData(prev => ({
        ...prev,
        timeRestrictions: prev.timeRestrictions.filter((_, i) => i !== index),
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.type) newErrors.type = 'Vui lòng chọn loại cấm';
    if (!formData.streetName.trim()) newErrors.streetName = 'Vui lòng nhập tên đường';
    if (!formData.side) newErrors.side = 'Vui lòng chọn bên cấm';
    if (!formData.startLat) newErrors.startLat = 'Vui lòng nhập vĩ độ điểm bắt đầu';
    if (!formData.startLng) newErrors.startLng = 'Vui lòng nhập kinh độ điểm bắt đầu';
    if (!formData.endLat) newErrors.endLat = 'Vui lòng nhập vĩ độ điểm kết thúc';
    if (!formData.endLng) newErrors.endLng = 'Vui lòng nhập kinh độ điểm kết thúc';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEdit) {
        await updateRestrictedZone(id, formData);
        toast.success('Cập nhật tuyến cấm thành công!');
      } else {
        await createRestrictedZone(formData);
        toast.success('Thêm tuyến cấm mới thành công!');
      }
      navigate(ROUTES.RESTRICTED_LIST);
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="restricted-form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {isEdit ? 'Chỉnh sửa tuyến cấm' : 'Thêm tuyến cấm mới'}
          </h1>
          <p className="page-subtitle">
            {isEdit ? 'Cập nhật thông tin tuyến cấm' : 'Nhập thông tin tuyến cấm mới'}
          </p>
        </div>
        <Button 
          variant="ghost" 
          icon={<FaArrowLeft />}
          onClick={() => navigate(ROUTES.RESTRICTED_LIST)}
        >
          Quay lại
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card title="Thông tin cơ bản">
          <div className="form-grid">
            <Input
              label="Tên đường cấm"
              placeholder="VD: Đường Lê Duẩn"
              value={formData.streetName}
              onChange={(e) => handleChange('streetName', e.target.value)}
              error={errors.streetName}
              required
            />

            <div className="input-group">
              <label className="input-label">
                Loại cấm <span className="input-required">*</span>
              </label>
              <select
                className={`input-field ${errors.type ? 'input-error' : ''}`}
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <option value="">Chọn loại cấm</option>
                {RESTRICTED_TYPES.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
              {errors.type && <span className="input-error-text">{errors.type}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">
                Bên cấm <span className="input-required">*</span>
              </label>
              <select
                className={`input-field ${errors.side ? 'input-error' : ''}`}
                value={formData.side}
                onChange={(e) => handleChange('side', e.target.value)}
              >
                <option value="">Chọn bên cấm</option>
                {RESTRICTED_SIDES.map((side, index) => (
                  <option key={index} value={side}>{side}</option>
                ))}
              </select>
              {errors.side && <span className="input-error-text">{errors.side}</span>}
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Mô tả</label>
            <textarea
              className="input-field"
              placeholder="Nhập mô tả về tuyến cấm"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>
        </Card>

        <Card title="Thời gian cấm">
          <div className="time-restrictions-container">
            {formData.timeRestrictions.map((restriction, index) => (
              <div key={index} className="time-restriction-item">
                <div className="time-restriction-header">
                  <h4>Mốc thời gian {index + 1}</h4>
                  {formData.timeRestrictions.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove-restriction"
                      onClick={() => removeTimeRestriction(index)}
                    >
                      <FaTrash /> Xóa
                    </button>
                  )}
                </div>

                <div className="form-grid">
                  <Input
                    label="Giờ bắt đầu"
                    type="time"
                    value={restriction.startTime}
                    onChange={(e) => handleTimeRestrictionChange(index, 'startTime', e.target.value)}
                  />

                  <Input
                    label="Giờ kết thúc"
                    type="time"
                    value={restriction.endTime}
                    onChange={(e) => handleTimeRestrictionChange(index, 'endTime', e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Ngày áp dụng</label>
                  <div className="days-selector">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        className={`day-btn ${restriction.days?.includes(day.value) ? 'active' : ''}`}
                        onClick={() => handleDayToggle(index, day.value)}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                  <p className="form-hint">💡 Click để chọn/bỏ chọn ngày. Không chọn = áp dụng tất cả các ngày</p>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              icon={<FaPlus />}
              onClick={addTimeRestriction}
            >
              Thêm mốc thời gian
            </Button>
          </div>
        </Card>

        <Card title="Vị trí địa lý">
          <h4 className="section-subtitle">📍 Điểm bắt đầu</h4>
          <div className="form-grid">
            <Input
              label="Vĩ độ (Latitude)"
              type="number"
              step="any"
              placeholder="VD: 16.0544"
              value={formData.startLat}
              onChange={(e) => handleChange('startLat', e.target.value)}
              error={errors.startLat}
              required
            />

            <Input
              label="Kinh độ (Longitude)"
              type="number"
              step="any"
              placeholder="VD: 108.2022"
              value={formData.startLng}
              onChange={(e) => handleChange('startLng', e.target.value)}
              error={errors.startLng}
              required
            />
          </div>

          <h4 className="section-subtitle">📍 Điểm kết thúc</h4>
          <div className="form-grid">
            <Input
              label="Vĩ độ (Latitude)"
              type="number"
              step="any"
              placeholder="VD: 16.0678"
              value={formData.endLat}
              onChange={(e) => handleChange('endLat', e.target.value)}
              error={errors.endLat}
              required
            />

            <Input
              label="Kinh độ (Longitude)"
              type="number"
              step="any"
              placeholder="VD: 108.2209"
              value={formData.endLng}
              onChange={(e) => handleChange('endLng', e.target.value)}
              error={errors.endLng}
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
            onClick={() => navigate(ROUTES.RESTRICTED_LIST)}
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

export default RestrictedForm;
