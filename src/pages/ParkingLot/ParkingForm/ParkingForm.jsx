import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import Card from "../../../components/common/Card/Card";
import Button from "../../../components/common/Button/Button";
import Input from "../../../components/common/Input/Input";
import {
  createParkingSpot,
  updateParkingSpot,
} from "../../../services/parkingService";
import {
  PARKING_TYPES,
  ROUTES,
  TYPE_OPTIONS,
  USER_ROLES,
} from "../../../constants";
import slugify from "slugify";
import "./ParkingForm.css";
import { de } from "date-fns/locale";
import { add } from "date-fns";

const ParkingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEdit = !!id;

  const parkingDataFromState = location.state?.parkingData;
  const returnToPage = location.state?.currentPage; // Trang để quay lại sau khi edit

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    latitude: "",
    longitude: "",
    description: "",
    name: "",
    address: "",
    type: "",
    capacity: "",
    role: USER_ROLES.ADMIN,
  });

  const [errors, setErrors] = useState({});
  const [showAddType, setShowAddType] = useState(false);
  const [newType, setNewType] = useState("");

  // --- Ref lưu input để scroll khi lỗi ---
  const errorRefs = {
    name: useRef(null),
    type: useRef(null),
    capacity: useRef(null),
    address: useRef(null),
    latitude: useRef(null),
    longitude: useRef(null),
  };

  useEffect(() => {
    if (isEdit && parkingDataFromState) {
      setFormData({
        name: parkingDataFromState.street || "",
        type: parkingDataFromState.type || "",
        capacity: parkingDataFromState.capacity || "",
        address: parkingDataFromState.address || "",
        description: parkingDataFromState.description || "",
        latitude: parkingDataFromState.location_begin?.latitude || "",
        longitude: parkingDataFromState.location_begin?.longitude || "",
        role: USER_ROLES.ADMIN,
        ...parkingDataFromState,
      });
    } else if (isEdit && !parkingDataFromState) {
      toast.warning("Vui lòng chọn bãi đỗ từ danh sách");
      navigate(ROUTES.PARKING_LIST);
    }
  }, [id, parkingDataFromState]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ------------------------------
  // VALIDATE + SCROLL TO FIRST ERROR
  // ------------------------------
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên bãi đỗ";
    if (!formData.type) newErrors.type = "Vui lòng chọn loại bãi đỗ";
    if (!formData.capacity) newErrors.capacity = "Vui lòng nhập sức chứa";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.latitude) newErrors.latitude = "Vui lòng nhập vĩ độ";
    if (!formData.longitude) newErrors.longitude = "Vui lòng nhập kinh độ";

    // Capacity integer > 0
    if (formData.capacity) {
      const c = Number(formData.capacity);
      if (isNaN(c)) newErrors.capacity = "Sức chứa phải là số";
      else if (!Number.isInteger(c))
        newErrors.capacity = "Sức chứa phải là số nguyên";
      else if (c <= 0) newErrors.capacity = "Sức chứa phải > 0";
    }

    // Latitude
    if (formData.latitude) {
      const latN = Number(formData.latitude);
      if (isNaN(latN)) newErrors.latitude = "Vĩ độ phải là số hợp lệ";
      else if (latN < -90 || latN > 90)
        newErrors.latitude = "Vĩ độ phải trong khoảng từ -90 đến 90";
    }

    // Longitude
    if (formData.longitude) {
      const lngN = Number(formData.longitude);
      if (isNaN(lngN)) newErrors.longitude = "Kinh độ phải là số hợp lệ";
      else if (lngN < -180 || lngN > 180)
        newErrors.longitude = "Kinh độ phải trong khoảng từ -180 đến 180";
    }

    setErrors(newErrors);

    // Scroll tới input lỗi đầu tiên
    const firstErrorField = Object.keys(newErrors)[0];
    if (firstErrorField && errorRefs[firstErrorField]?.current) {
      errorRefs[firstErrorField].current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  // ------------------------------
  // HANDLE SUBMIT
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        type:
          TYPE_OPTIONS.find((opt) => opt.label === formData.type)?.value ||
          formData.type,
      };

      if (isEdit) {
        await updateParkingSpot(id, payload);
        toast.success("Cập nhật bãi đỗ xe thành công!");
        // Quay về trang đã edit (nếu có)
        navigate(ROUTES.PARKING_LIST, { 
          state: { returnPage: returnToPage || 1 } 
        });
      } else {
        const response = await createParkingSpot(payload);
        toast.success("Thêm bãi đỗ xe mới thành công!");
        
        // Lấy tổng số items từ response hoặc tính toán trang cuối
        // Giả sử response trả về totalItems trong pagination
        const totalItems = response?.pagination?.totalItems || response?.data?.pagination?.totalItems;
        
        if (totalItems) {
          const lastPage = Math.ceil(totalItems / 10); // 10 items per page
          navigate(ROUTES.PARKING_LIST, { 
            state: { returnPage: lastPage } 
          });
        } else {
          // Nếu không có totalItems, fetch lại để lấy trang cuối
          navigate(ROUTES.PARKING_LIST, { 
            state: { returnPage: 'last' } 
          });
        }
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // ADD NEW TYPE
  // ------------------------------
  const handleAddType = () => {
    if (!newType.trim()) return toast.error("Vui lòng nhập tên loại mới");

    const englishValue = slugify(newType, { lower: true });

    // Không mutate TYPE_OPTIONS trực tiếp
    TYPE_OPTIONS.push({
      value: englishValue,
      label: newType,
    });

    setFormData((prev) => ({ ...prev, type: englishValue }));
    setNewType("");
    setShowAddType(false);
    toast.success("Đã thêm loại bãi đỗ!");
  };

  return (
    <div className="parking-form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {isEdit ? "Chỉnh sửa bãi đỗ xe" : "Thêm bãi đỗ xe mới"}
          </h1>
          <p className="page-subtitle">
            {isEdit ? "Cập nhật thông tin bãi đỗ xe" : "Nhập thông tin bãi đỗ xe"}
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
        {/* ----- CARD: Thông tin cơ bản ----- */}
        <Card title="Thông tin cơ bản">
          <div className="form-grid">
            <Input
              label="Tên bãi đỗ"
              placeholder="Nhập tên bãi đỗ"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={errors.name}
              required
              ref={errorRefs.name}
            />

            {/* Type */}
            <div className="input-group" ref={errorRefs.type}>
              <label className="input-label">
                Loại bãi đỗ <span className="input-required">*</span>
              </label>

              <select
                className={`input-field ${errors.type ? "input-error" : ""}`}
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
              >
                <option value="">Chọn loại bãi đỗ</option>
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {errors.type && (
                <span className="input-error-text">{errors.type}</span>
              )}

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
                <div className="add-type-actions">
                  <Button size="small" onClick={handleAddType}>
                    Thêm
                  </Button>
                  <Button
                    size="small"
                    variant="ghost"
                    onClick={() => {
                      setShowAddType(false);
                      setNewType("");
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            )}

            <Input
              label="Tổng sức chứa"
              type="number"
              placeholder="Nhập số lượng xe"
              value={formData.capacity}
              onChange={(e) => handleChange("capacity", e.target.value)}
              error={errors.capacity}
              required
              ref={errorRefs.capacity}
            />

            <Input
              label="Địa chỉ"
              placeholder="Nhập địa chỉ"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              error={errors.address}
              required
              ref={errorRefs.address}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Mô tả</label>
            <textarea
              className="input-field"
              placeholder="Nhập mô tả"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
            />
          </div>
        </Card>

        {/* ----- CARD: Vị trí ----- */}
        <Card title="Vị trí địa lý">
          <div className="form-grid">
            <Input
              label="Vĩ độ (Latitude)"
              type="number"
              step="any"
              placeholder="VD: 16.0471"
              value={formData.latitude}
              onChange={(e) => handleChange("latitude", e.target.value)}
              error={errors.latitude}
              required
              ref={errorRefs.latitude}
            />

            <Input
              label="Kinh độ (Longitude)"
              type="number"
              step="any"
              placeholder="VD: 108.2068"
              value={formData.longitude}
              onChange={(e) => handleChange("longitude", e.target.value)}
              error={errors.longitude}
              required
              ref={errorRefs.longitude}
            />
          </div>
          <p className="form-hint">
            💡 Bạn có thể lấy tọa độ từ Google Maps bằng cách nhấp chuột phải.
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
          <Button variant="primary" type="submit" icon={<FaSave />} loading={loading}>
            {isEdit ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ParkingForm;
