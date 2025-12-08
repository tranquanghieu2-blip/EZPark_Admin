import React, { useState } from 'react';
import { FaFileExcel, FaUpload, FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import Modal from '../common/Modal/Modal';
import Button from '../common/Button/Button';
import { DA_NANG_BOUNDS, TYPE_OPTIONS } from '../../constants';
import { createParkingSpot } from '../../services/parkingService';
import { toast } from 'react-toastify';
import './ImportExcelModal.css';

const ImportExcelModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  // Required columns trong Excel
  const REQUIRED_COLUMNS = {
    name: 'Tên bãi đỗ',
    type: 'Loại bãi đỗ', // "Bãi đỗ xe tập trung" hoặc "Bãi đỗ xe ven đường"
    capacity: 'Sức chứa',
    address: 'Địa chỉ',
    latitude: 'Vĩ độ',
    longitude: 'Kinh độ',
    description: 'Mô tả' // Optional
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    // Check file type
    const fileExtension = uploadedFile.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls'].includes(fileExtension)) {
      toast.error('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
      return;
    }

    setFile(uploadedFile);
    setErrors([]);
    setData([]);

    // Read Excel file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          toast.error('File Excel không có dữ liệu');
          return;
        }

        // Validate and parse data
        const { validData, validationErrors } = validateExcelData(jsonData);
        setData(validData);
        setErrors(validationErrors);

        if (validationErrors.length === 0) {
          toast.success(`Đã đọc thành công ${validData.length} bãi đỗ xe`);
        } else {
          toast.warning(`Phát hiện ${validationErrors.length} lỗi trong file Excel`);
        }
      } catch (error) {
        toast.error('Không thể đọc file Excel. Vui lòng kiểm tra định dạng file.');
        console.error('Excel read error:', error);
      }
    };
    reader.readAsBinaryString(uploadedFile);
  };

  const validateExcelData = (jsonData) => {
    const validData = [];
    const validationErrors = [];

    jsonData.forEach((row, index) => {
      const rowNumber = index + 2; // +2 vì Excel bắt đầu từ 1 và có header row
      const rowErrors = [];

      // Check required columns exist
      Object.entries(REQUIRED_COLUMNS).forEach(([key, header]) => {
        if (key !== 'description' && !row[header]) {
          rowErrors.push(`Dòng ${rowNumber}: Thiếu trường "${header}"`);
        }
      });

      // Validate name
      if (row[REQUIRED_COLUMNS.name] && typeof row[REQUIRED_COLUMNS.name] !== 'string') {
        rowErrors.push(`Dòng ${rowNumber}: Tên bãi đỗ phải là chuỗi ký tự`);
      }

      // Validate type
      if (row[REQUIRED_COLUMNS.type]) {
        const typeLabel = row[REQUIRED_COLUMNS.type].trim();
        const validType = TYPE_OPTIONS.find(opt => opt.label === typeLabel);
        if (!validType) {
          rowErrors.push(`Dòng ${rowNumber}: Loại bãi đỗ không hợp lệ. Phải là "${TYPE_OPTIONS[0].label}" hoặc "${TYPE_OPTIONS[1].label}"`);
        }
      }

      // Validate capacity
      if (row[REQUIRED_COLUMNS.capacity]) {
        const capacity = Number(row[REQUIRED_COLUMNS.capacity]);
        if (isNaN(capacity) || !Number.isInteger(capacity) || capacity <= 0) {
          rowErrors.push(`Dòng ${rowNumber}: Sức chứa phải là số nguyên dương`);
        }
      }

      // Validate address
      if (row[REQUIRED_COLUMNS.address] && typeof row[REQUIRED_COLUMNS.address] !== 'string') {
        rowErrors.push(`Dòng ${rowNumber}: Địa chỉ phải là chuỗi ký tự`);
      }

      // Validate latitude
      if (row[REQUIRED_COLUMNS.latitude]) {
        const lat = Number(row[REQUIRED_COLUMNS.latitude]);
        if (isNaN(lat)) {
          rowErrors.push(`Dòng ${rowNumber}: Vĩ độ phải là số hợp lệ`);
        } else if (lat < DA_NANG_BOUNDS.south || lat > DA_NANG_BOUNDS.north) {
          rowErrors.push(`Dòng ${rowNumber}: Vĩ độ phải nằm trong phạm vi Đà Nẵng (${DA_NANG_BOUNDS.south} - ${DA_NANG_BOUNDS.north})`);
        }
      }

      // Validate longitude
      if (row[REQUIRED_COLUMNS.longitude]) {
        const lng = Number(row[REQUIRED_COLUMNS.longitude]);
        if (isNaN(lng)) {
          rowErrors.push(`Dòng ${rowNumber}: Kinh độ phải là số hợp lệ`);
        } else if (lng < DA_NANG_BOUNDS.west || lng > DA_NANG_BOUNDS.east) {
          rowErrors.push(`Dòng ${rowNumber}: Kinh độ phải nằm trong phạm vi Đà Nẵng (${DA_NANG_BOUNDS.west} - ${DA_NANG_BOUNDS.east})`);
        }
      }

      if (rowErrors.length > 0) {
        validationErrors.push(...rowErrors);
      } else {
        // Map Excel data to API format
        const typeLabel = row[REQUIRED_COLUMNS.type].trim();
        const typeValue = TYPE_OPTIONS.find(opt => opt.label === typeLabel)?.value;

        validData.push({
          name: row[REQUIRED_COLUMNS.name]?.toString().trim(),
          type: typeValue,
          capacity: Number(row[REQUIRED_COLUMNS.capacity]),
          address: row[REQUIRED_COLUMNS.address]?.toString().trim(),
          latitude: Number(row[REQUIRED_COLUMNS.latitude]),
          longitude: Number(row[REQUIRED_COLUMNS.longitude]),
          description: row[REQUIRED_COLUMNS.description]?.toString().trim() || '',
        });
      }
    });

    return { validData, validationErrors };
  };

  const handleImport = async () => {
    if (errors.length > 0) {
      toast.error('Vui lòng sửa các lỗi trong file Excel trước khi import');
      return;
    }

    if (data.length === 0) {
      toast.error('Không có dữ liệu để import');
      return;
    }

    setIsProcessing(true);
    setUploadProgress({ current: 0, total: data.length });

    let successCount = 0;
    let failCount = 0;
    const failedRows = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      setUploadProgress({ current: i + 1, total: data.length });

      try {
        await createParkingSpot(item);
        successCount++;
      } catch (error) {
        failCount++;
        failedRows.push({
          row: i + 2,
          name: item.name,
          error: error.response?.data?.message || 'Lỗi không xác định'
        });
        console.error(`Failed to create parking spot at row ${i + 2}:`, error);
      }
    }

    setIsProcessing(false);

    // Show results
    if (successCount === data.length) {
      toast.success(`Đã tạo thành công ${successCount} bãi đỗ xe!`);
      onSuccess();
      handleClose();
    } else if (successCount > 0) {
      toast.warning(`Tạo thành công ${successCount}/${data.length} bãi đỗ xe. ${failCount} bãi bị lỗi.`);
      // Show failed rows
      const errorMsg = failedRows.map(f => `Dòng ${f.row} (${f.name}): ${f.error}`).join('\n');
      console.error('Failed rows:', errorMsg);
    } else {
      toast.error(`Không thể tạo bãi đỗ xe nào. Vui lòng kiểm tra lại dữ liệu.`);
    }
  };

  const handleClose = () => {
    setFile(null);
    setData([]);
    setErrors([]);
    setUploadProgress({ current: 0, total: 0 });
    onClose();
  };

  const downloadTemplate = () => {
    // Create template Excel file
    const templateData = [
      {
        [REQUIRED_COLUMNS.name]: 'Bãi đỗ xe số 1',
        [REQUIRED_COLUMNS.type]: TYPE_OPTIONS[0].label,
        [REQUIRED_COLUMNS.capacity]: 50,
        [REQUIRED_COLUMNS.address]: '123 Đường ABC, Quận XYZ, Đà Nẵng',
        [REQUIRED_COLUMNS.latitude]: 16.0471,
        [REQUIRED_COLUMNS.longitude]: 108.2068,
        [REQUIRED_COLUMNS.description]: 'Mô tả bãi đỗ xe (tùy chọn)'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Parking Spots');
    XLSX.writeFile(workbook, 'parking_spots_template.xlsx');
    toast.success('Đã tải file mẫu thành công');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import bãi đỗ xe từ Excel"
      size="large"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isProcessing}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleImport}
            disabled={!data.length || errors.length > 0 || isProcessing}
            loading={isProcessing}
          >
            {isProcessing ? `Đang tạo ${uploadProgress.current}/${uploadProgress.total}...` : 'Tạo bãi đỗ xe'}
          </Button>
        </>
      }
    >
      <div className="import-excel-modal">
        {/* Download Template Button */}
        <div className="template-section">
          <p className="template-hint">
            <FaFileExcel /> Chưa có file Excel? Tải file mẫu để bắt đầu
          </p>
          <Button variant="outline" size="small" onClick={downloadTemplate}>
            <FaFileExcel /> Tải file mẫu
          </Button>
        </div>

        {/* File Upload */}
        <div className="upload-section">
          <label className="upload-area">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={isProcessing}
              style={{ display: 'none' }}
            />
            <div className="upload-content">
              <FaUpload className="upload-icon" />
              <p className="upload-text">
                {file ? file.name : 'Chọn hoặc kéo thả file Excel vào đây'}
              </p>
              <p className="upload-hint">Hỗ trợ file .xlsx và .xls</p>
            </div>
          </label>
        </div>

        {/* Required Columns Info */}
        <div className="columns-info">
          <h4>Các cột bắt buộc trong Excel:</h4>
          <ul>
            <li><strong>{REQUIRED_COLUMNS.name}</strong>: Tên bãi đỗ xe (chuỗi ký tự)</li>
            <li><strong>{REQUIRED_COLUMNS.type}</strong>: {TYPE_OPTIONS.map(opt => `"${opt.label}"`).join(' hoặc ')}</li>
            <li><strong>{REQUIRED_COLUMNS.capacity}</strong>: Số nguyên dương</li>
            <li><strong>{REQUIRED_COLUMNS.address}</strong>: Địa chỉ đầy đủ</li>
            <li><strong>{REQUIRED_COLUMNS.latitude}</strong>: Vĩ độ ({DA_NANG_BOUNDS.south} - {DA_NANG_BOUNDS.north})</li>
            <li><strong>{REQUIRED_COLUMNS.longitude}</strong>: Kinh độ ({DA_NANG_BOUNDS.west} - {DA_NANG_BOUNDS.east})</li>
            <li><strong>{REQUIRED_COLUMNS.description}</strong>: Mô tả (tùy chọn)</li>
          </ul>
        </div>

        {/* Validation Errors */}
        {errors.length > 0 && (
          <div className="validation-errors">
            <h4>
              <FaExclamationTriangle /> Phát hiện {errors.length} lỗi:
            </h4>
            <ul>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Success Preview */}
        {data.length > 0 && errors.length === 0 && (
          <div className="success-preview">
            <h4>
              <FaCheckCircle /> Dữ liệu hợp lệ: {data.length} bãi đỗ xe
            </h4>
            <div className="preview-table">
              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên</th>
                    <th>Loại</th>
                    <th>Sức chứa</th>
                    <th>Địa chỉ</th>
                    <th>Tọa độ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 5).map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{item.name}</td>
                      <td>{TYPE_OPTIONS.find(opt => opt.value === item.type)?.label}</td>
                      <td>{item.capacity}</td>
                      <td>{item.address}</td>
                      <td>{item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length > 5 && (
                <p className="preview-more">... và {data.length - 5} bãi đỗ xe khác</p>
              )}
            </div>
          </div>
        )}

        {/* Processing Progress */}
        {isProcessing && (
          <div className="processing-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
              />
            </div>
            <p>Đang tạo {uploadProgress.current}/{uploadProgress.total} bãi đỗ xe...</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImportExcelModal;
