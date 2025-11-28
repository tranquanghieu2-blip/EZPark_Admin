import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { createRestrictedZone, updateRestrictedZone } from '../../../services/restrictedZoneService';
import { RESTRICTED_TYPES, RESTRICTED_SIDES, ROUTES, RESTRICTED_TYPE_OPTIONS, RESTRICTED_SIDE_OPTIONS, USER_ROLES } from '../../../constants';
import './RestrictedForm.css';

const RestrictedForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEdit = !!id;

  const restrictedDataFromState = location.state?.restrictedData || null;
  const returnToPage = location.state?.currentPage;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    street: '',
    side: '',
    description: '',
    startLat: '',
    startLng: '',
    endLat: '',
    endLng: '',
    time_range: [
      {
        start: '',
        end: '',
      },
    ],
    days_restricted: [

    ],
  });
  const [errors, setErrors] = useState({});

  // --- Ref lưu input để scroll khi lỗi ---
  const errorRefs = {
    street: useRef(null),
    type: useRef(null),
    side: useRef(null),
    description: useRef(null),
    startLat: useRef(null),
    startLng: useRef(null),
    endLat: useRef(null),
    endLng: useRef(null),
    time_range: useRef(null),
    days_restricted: useRef(null),
  };

  const daysOfWeek = [
    { value: 'Monday', label: 'T2' },
    { value: 'Tuesday', label: 'T3' },
    { value: 'Wednesday', label: 'T4' },
    { value: 'Thursday', label: 'T5' },
    { value: 'Friday', label: 'T6' },
    { value: 'Saturday', label: 'T7' },
    { value: 'Sunday', label: 'CN' },
  ];


  useEffect(() => {
    if (isEdit && restrictedDataFromState) {
      setFormData({
        street: restrictedDataFromState.street || "",
        type: restrictedDataFromState.type || "",
        side: restrictedDataFromState.side || "",
        description: restrictedDataFromState.description || "",
        startLat: restrictedDataFromState.location_begin?.latitude || "",
        startLng: restrictedDataFromState.location_begin?.longitude || "",
        endLat: restrictedDataFromState.location_end?.latitude || "",
        endLng: restrictedDataFromState.location_end?.longitude || "",
        time_range: restrictedDataFromState.time_range || [
          { start: "", end: "" }
        ],
        days_restricted: restrictedDataFromState.days_restricted || [],
        role: USER_ROLES.ADMIN,
        ...restrictedDataFromState,
      });
    } else if (isEdit && !restrictedDataFromState) {
      toast.warning("Vui lòng chọn tuyến cấm từ danh sách");
      navigate(ROUTES.RESTRICTED_LIST);
    }
  }, [id, restrictedDataFromState]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleTimeRangeChange = (index, field, value) => {
    const newTimeRange = [...formData.time_range];
    newTimeRange[index][field] = value;
    setFormData(prev => ({ ...prev, time_range: newTimeRange }));
  };

  const handleDayToggle = (day) => {
    const currentDays = formData.days_restricted || [];

    if (currentDays.includes(day)) {
      setFormData(prev => ({
        ...prev,
        days_restricted: currentDays.filter(d => d !== day)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        days_restricted: [...currentDays, day]
      }));
    }
  };

  const addTimeRange = () => {
    setFormData(prev => ({
      ...prev,
      time_range: [
        ...prev.time_range,
        { start: '', end: '' },
      ],
    }));
  };

  const removeTimeRange = (index) => {
    if (formData.time_range.length > 1) {
      setFormData(prev => ({
        ...prev,
        time_range: prev.time_range.filter((_, i) => i !== index),
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.type) newErrors.type = 'Vui lòng chọn loại cấm';
    if (!formData.street.trim()) newErrors.street = 'Vui lòng nhập tên đường';
    if (!formData.side) newErrors.side = 'Vui lòng chọn bên cấm';
    if (!formData.startLat) newErrors.startLat = 'Vui lòng nhập vĩ độ điểm bắt đầu';
    if (!formData.startLng) newErrors.startLng = 'Vui lòng nhập kinh độ điểm bắt đầu';
    if (!formData.endLat) newErrors.endLat = 'Vui lòng nhập vĩ độ điểm kết thúc';
    if (!formData.endLng) newErrors.endLng = 'Vui lòng nhập kinh độ điểm kết thúc';
    
    if (!formData.time_range || formData.time_range.length === 0) {
      newErrors.time_range = 'Vui lòng thêm ít nhất một mốc thời gian';
    } else {
      // Kiểm tra xem có time range nào chưa điền đủ không
      const hasInvalidTimeRange = formData.time_range.some(tr => !tr.start || !tr.end);
      if (hasInvalidTimeRange) {
        newErrors.time_range = 'Vui lòng điền đầy đủ giờ bắt đầu và kết thúc';
      }
    }
    
    if (!formData.days_restricted || formData.days_restricted.length === 0) {
      newErrors.days_restricted = 'Vui lòng chọn ít nhất một ngày cấm';
    }

    setErrors(newErrors);
    const firstErrorField = Object.keys(newErrors)[0];
    if (firstErrorField && errorRefs[firstErrorField]?.current) {
      errorRefs[firstErrorField].current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        street: formData.street,
        type: formData.type,
        side: formData.side,
        description: formData.description,
        location_begin: {
          type: 'Point',
          coordinates: [parseFloat(formData.startLng), parseFloat(formData.startLat)]
        },
        location_end: {
          type: 'Point',
          coordinates: [parseFloat(formData.endLng), parseFloat(formData.endLat)]
        },
        time_range: formData.time_range.map(tr => ({
          start: tr.start,
          end: tr.end,
        })),
        days_restricted: formData.days_restricted,
      };
      
      if (isEdit) {
        await updateRestrictedZone(id, payload);
        toast.success('Cập nhật tuyến cấm thành công!');
        // Quay về trang đã edit (nếu có)
        navigate(ROUTES.RESTRICTED_LIST, {
          state: { returnPage: returnToPage || 1 }
        });
      } else {
        const response = await createRestrictedZone(payload);
        toast.success('Thêm tuyến cấm mới thành công!');
        
        // Lấy tổng số items từ response
        const totalItems = response?.pagination?.totalItems || response?.data?.pagination?.totalItems;

        if (totalItems) {
          const lastPage = Math.ceil(totalItems / 10); // 10 items per page
          navigate(ROUTES.RESTRICTED_LIST, {
            state: { returnPage: lastPage }
          });
        } else {
          // Nếu không có totalItems, fetch lại để lấy trang cuối
          navigate(ROUTES.RESTRICTED_LIST, {
            state: { returnPage: 'last' }
          });
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
      toast.error(msg);
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
              value={formData.street}
              onChange={(e) => handleChange('street', e.target.value)}
              error={errors.street}
              required
              ref={errorRefs.street}
            />

            <div className="input-group" ref={errorRefs.type}>
              <label className="input-label">
                Loại cấm <span className="input-required">*</span>
              </label>
              <select
                className={`input-field ${errors.type ? 'input-error' : ''}`}
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <option value="">Chọn loại cấm</option>
                {RESTRICTED_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.type && <span className="input-error-text">{errors.type}</span>}
            </div>

            <div className="input-group" ref={errorRefs.side}>
              <label className="input-label">
                Bên cấm <span className="input-required">*</span>
              </label>
              <select
                className={`input-field ${errors.side ? 'input-error' : ''}`}
                value={formData.side}
                onChange={(e) => handleChange('side', e.target.value)}
              >
                <option value="">Chọn bên cấm</option>
                {RESTRICTED_SIDE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
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

        <Card title="Thời gian cấm" ref={errorRefs.time_range}>
          {errors.time_range && (
            <div className="error-message" style={{ color: '#EF476F', marginBottom: '16px' }}>
              {errors.time_range}
            </div>
          )}
          <div className="time-restrictions-container">
            {formData.time_range.map((timeRange, index) => (
              <div key={index} className="time-restriction-item">
                <div className="time-restriction-header">
                  <h4>Mốc thời gian {index + 1}</h4>
                  {formData.time_range.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove-restriction"
                      onClick={() => removeTimeRange(index)}
                    >
                      <FaTrash /> Xóa
                    </button>
                  )}
                </div>

                <div className="form-grid">
                  <Input
                    label="Giờ bắt đầu"
                    type="time"
                    value={timeRange.start}
                    onChange={(e) => handleTimeRangeChange(index, 'start', e.target.value)}
                    required
                  />

                  <Input
                    label="Giờ kết thúc"
                    type="time"
                    value={timeRange.end}
                    onChange={(e) => handleTimeRangeChange(index, 'end', e.target.value)}
                    required
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              icon={<FaPlus />}
              onClick={addTimeRange}
            >
              Thêm mốc thời gian
            </Button>
          </div>

          <div className="input-group" ref={errorRefs.days_restricted} style={{ marginTop: '24px' }}>
            <label className="input-label">
              Ngày áp dụng <span className="input-required">*</span>
            </label>
            <div className="days-selector">
              {daysOfWeek.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  className={`day-btn ${formData.days_restricted?.includes(day.value) ? 'active' : ''}`}
                  onClick={() => handleDayToggle(day.value)}
                >
                  {day.label}
                </button>
              ))}
            </div>
            {errors.days_restricted && (
              <span className="input-error-text">{errors.days_restricted}</span>
            )}
            <p className="form-hint">💡 Click để chọn/bỏ chọn ngày áp dụng cấm</p>
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
              ref={errorRefs.startLat}
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
              ref={errorRefs.startLng}
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
              ref={errorRefs.endLat}
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
              ref={errorRefs.endLng}
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
