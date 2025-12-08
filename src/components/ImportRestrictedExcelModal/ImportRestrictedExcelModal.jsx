import React, { useState } from 'react';
import { FaFileExcel, FaUpload, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import Modal from '../common/Modal/Modal';
import Button from '../common/Button/Button';
import { DA_NANG_BOUNDS, RESTRICTED_TYPE_OPTIONS, RESTRICTED_SIDE_OPTIONS } from '../../constants';
import { createRestrictedZone } from '../../services/restrictedZoneService';
import { toast } from 'react-toastify';
import './ImportRestrictedExcelModal.css';
import { da } from 'date-fns/locale';

const ImportRestrictedExcelModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  // Required columns trong Excel
  const REQUIRED_COLUMNS = {
    street: 'Tên đường',
    type: 'Loại cấm', // "Cấm đỗ", "Cấm dừng", "Cấm đỗ chẵn lẻ"
    side: 'Bên cấm', // "Bên lẻ", "Bên chẵn", "Cả hai bên"
    startLat: 'Vĩ độ bắt đầu',
    startLng: 'Kinh độ bắt đầu',
    endLat: 'Vĩ độ kết thúc',
    endLng: 'Kinh độ kết thúc',
    timeStart: 'Giờ bắt đầu', // Format: HH:mm (VD: 07:00)
    timeEnd: 'Giờ kết thúc', // Format: HH:mm (VD: 18:00)
    days: 'Ngày áp dụng', // VD: "Monday,Tuesday,Friday" hoặc "T2,T3,T6"
    description: 'Mô tả' // Optional
  };

  const DAYS_MAPPING = {
    'T2': 'Monday',
    'T3': 'Tuesday',
    'T4': 'Wednesday',
    'T5': 'Thursday',
    'T6': 'Friday',
    'T7': 'Saturday',
    'CN': 'Sunday',
    'Monday': 'Monday',
    'Tuesday': 'Tuesday',
    'Wednesday': 'Wednesday',
    'Thursday': 'Thursday',
    'Friday': 'Friday',
    'Saturday': 'Saturday',
    'Sunday': 'Sunday'
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const fileExtension = uploadedFile.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls'].includes(fileExtension)) {
      toast.error('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
      return;
    }

    setFile(uploadedFile);
    setErrors([]);
    setData([]);

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

        const { validData, validationErrors } = validateExcelData(jsonData);
        setData(validData);
        setErrors(validationErrors);

        if (validationErrors.length === 0) {
          toast.success(`Đã đọc thành công ${validData.length} tuyến cấm`);
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

  const formatTimeToHHmm = (timeValue) => {
    if (!timeValue) return '';
    
    // Nếu đã đúng định dạng HH:mm thì trả về luôn
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (timeRegex.test(timeValue)) {
      return timeValue;
    }

    // Xử lý định dạng 12 giờ (5:00:00 CH, 5:00 CH, 5 CH, etc.)
    const time12hRegex = /^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*(CH|SA|PM|AM)$/i;
    const match = timeValue.toString().trim().match(time12hRegex);
    
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = match[2] || '00';
      const period = match[4].toUpperCase();
      
      // Chuyển đổi sang 24 giờ
      if ((period === 'CH' || period === 'PM') && hours !== 12) {
        hours += 12;
      } else if ((period === 'SA' || period === 'AM') && hours === 12) {
        hours = 0;
      }
      
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    }

    // Xử lý số Excel (serial number)
    if (typeof timeValue === 'number' && timeValue >= 0 && timeValue < 1) {
      const totalMinutes = Math.round(timeValue * 24 * 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    return timeValue.toString();
  };

  const validateTimeFormat = (time) => {
    if (!time) return false;
    const formatted = formatTimeToHHmm(time);
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(formatted);
  };

  const parseDays = (daysString) => {
    if (!daysString) return [];
    const daysList = daysString.split(',').map(d => d.trim());
    const validDays = [];
    
    daysList.forEach(day => {
      const mappedDay = DAYS_MAPPING[day];
      if (mappedDay && !validDays.includes(mappedDay)) {
        validDays.push(mappedDay);
      }
    });
    
    return validDays;
  };

  const validateExcelData = (jsonData) => {
    const validData = [];
    const validationErrors = [];

    jsonData.forEach((row, index) => {
      const rowNumber = index + 2;
      const rowErrors = [];

      // Check required columns
      Object.entries(REQUIRED_COLUMNS).forEach(([key, header]) => {
        if (key !== 'description' && !row[header]) {
          rowErrors.push(`Dòng ${rowNumber}: Thiếu trường "${header}"`);
        }
      });

      // Validate street
      if (row[REQUIRED_COLUMNS.street] && typeof row[REQUIRED_COLUMNS.street] !== 'string') {
        rowErrors.push(`Dòng ${rowNumber}: Tên đường phải là chuỗi ký tự`);
      }

      // Validate type
      if (row[REQUIRED_COLUMNS.type]) {
        const typeLabel = row[REQUIRED_COLUMNS.type].trim();
        const validType = RESTRICTED_TYPE_OPTIONS.find(opt => opt.label === typeLabel);
        if (!validType) {
          const validTypes = RESTRICTED_TYPE_OPTIONS.map(opt => `"${opt.label}"`).join(', ');
          rowErrors.push(`Dòng ${rowNumber}: Loại cấm không hợp lệ. Phải là một trong: ${validTypes}`);
        }
      }

      // Validate side
      if (row[REQUIRED_COLUMNS.side]) {
        const sideLabel = row[REQUIRED_COLUMNS.side].trim();
        const validSide = RESTRICTED_SIDE_OPTIONS.find(opt => opt.label === sideLabel);
        if (!validSide) {
          const validSides = RESTRICTED_SIDE_OPTIONS.map(opt => `"${opt.label}"`).join(', ');
          rowErrors.push(`Dòng ${rowNumber}: Bên cấm không hợp lệ. Phải là một trong: ${validSides}`);
        }
      }

      // Validate coordinates
      ['startLat', 'endLat'].forEach(key => {
        if (row[REQUIRED_COLUMNS[key]]) {
          const lat = Number(row[REQUIRED_COLUMNS[key]]);
          if (isNaN(lat)) {
            rowErrors.push(`Dòng ${rowNumber}: ${REQUIRED_COLUMNS[key]} phải là số hợp lệ`);
          } else if (lat < DA_NANG_BOUNDS.south || lat > DA_NANG_BOUNDS.north) {
            rowErrors.push(`Dòng ${rowNumber}: ${REQUIRED_COLUMNS[key]} phải nằm trong phạm vi Đà Nẵng (${DA_NANG_BOUNDS.south} - ${DA_NANG_BOUNDS.north})`);
          }
        }
      });

      ['startLng', 'endLng'].forEach(key => {
        if (row[REQUIRED_COLUMNS[key]]) {
          const lng = Number(row[REQUIRED_COLUMNS[key]]);
          if (isNaN(lng)) {
            rowErrors.push(`Dòng ${rowNumber}: ${REQUIRED_COLUMNS[key]} phải là số hợp lệ`);
          } else if (lng < DA_NANG_BOUNDS.west || lng > DA_NANG_BOUNDS.east) {
            rowErrors.push(`Dòng ${rowNumber}: ${REQUIRED_COLUMNS[key]} phải nằm trong phạm vi Đà Nẵng (${DA_NANG_BOUNDS.west} - ${DA_NANG_BOUNDS.east})`);
          }
        }
      });

      // Validate time format
      const formattedStartTime = formatTimeToHHmm(row[REQUIRED_COLUMNS.timeStart]);
      const formattedEndTime = formatTimeToHHmm(row[REQUIRED_COLUMNS.timeEnd]);
      
      if (row[REQUIRED_COLUMNS.timeStart] && !validateTimeFormat(row[REQUIRED_COLUMNS.timeStart])) {
        rowErrors.push(`Dòng ${rowNumber}: Giờ bắt đầu phải có định dạng HH:mm (VD: 07:00) hoặc 12 giờ (VD: 5:00 CH)`);
      }
      if (row[REQUIRED_COLUMNS.timeEnd] && !validateTimeFormat(row[REQUIRED_COLUMNS.timeEnd])) {
        rowErrors.push(`Dòng ${rowNumber}: Giờ kết thúc phải có định dạng HH:mm (VD: 18:00) hoặc 12 giờ (VD: 6:00 CH)`);
      }

      // Validate days
      if (row[REQUIRED_COLUMNS.days]) {
        const days = parseDays(row[REQUIRED_COLUMNS.days]);
        if (days.length === 0) {
          rowErrors.push(`Dòng ${rowNumber}: Ngày áp dụng không hợp lệ. Sử dụng T2,T3,T4,T5,T6,T7,CN hoặc Monday,Tuesday,...`);
        }
      }

      if (rowErrors.length > 0) {
        validationErrors.push(...rowErrors);
      } else {
        const typeLabel = row[REQUIRED_COLUMNS.type].trim();
        const typeValue = RESTRICTED_TYPE_OPTIONS.find(opt => opt.label === typeLabel)?.value;
        
        const sideLabel = row[REQUIRED_COLUMNS.side].trim();
        const sideValue = RESTRICTED_SIDE_OPTIONS.find(opt => opt.label === sideLabel)?.value;

        validData.push({
          street: row[REQUIRED_COLUMNS.street]?.toString().trim(),
          type: typeValue,
          side: sideValue,
          description: row[REQUIRED_COLUMNS.description]?.toString().trim() || '',
          location_begin: {
            type: 'Point',
            coordinates: [
              Number(row[REQUIRED_COLUMNS.startLng]),
              Number(row[REQUIRED_COLUMNS.startLat])
            ]
          },
          location_end: {
            type: 'Point',
            coordinates: [
              Number(row[REQUIRED_COLUMNS.endLng]),
              Number(row[REQUIRED_COLUMNS.endLat])
            ]
          },
          time_range: [{
            start: formatTimeToHHmm(row[REQUIRED_COLUMNS.timeStart]),
            end: formatTimeToHHmm(row[REQUIRED_COLUMNS.timeEnd])
          }],
          days_restricted: parseDays(row[REQUIRED_COLUMNS.days])
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
        await createRestrictedZone(item);
        successCount++;
      } catch (error) {
        failCount++;
        failedRows.push({
          row: i + 2,
          street: item.street,
          error: error.response?.data?.message || 'Lỗi không xác định'
        });
        console.error(`Failed to create restricted zone at row ${i + 2}:`, error);
      }
    }

    setIsProcessing(false);

    if (successCount === data.length) {
      toast.success(`Đã tạo thành công ${successCount} tuyến cấm!`);
      onSuccess();
      handleClose();
    } else if (successCount > 0) {
      toast.warning(`Tạo thành công ${successCount}/${data.length} tuyến cấm. ${failCount} tuyến bị lỗi.`);
      const errorMsg = failedRows.map(f => `Dòng ${f.row} (${f.street}): ${f.error}`).join('\n');
      console.error('Failed rows:', errorMsg);
    } else {
      toast.error(`Không thể tạo tuyến cấm nào. Vui lòng kiểm tra lại dữ liệu.`);
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
    const templateData = [
      {
        [REQUIRED_COLUMNS.street]: 'Đường Lê Duẩn',
        [REQUIRED_COLUMNS.type]: RESTRICTED_TYPE_OPTIONS[0].label,
        [REQUIRED_COLUMNS.side]: RESTRICTED_SIDE_OPTIONS[2].label,
        [REQUIRED_COLUMNS.startLat]: 16.0544,
        [REQUIRED_COLUMNS.startLng]: 108.2022,
        [REQUIRED_COLUMNS.endLat]: 16.0678,
        [REQUIRED_COLUMNS.endLng]: 108.2209,
        [REQUIRED_COLUMNS.timeStart]: '07:00',
        [REQUIRED_COLUMNS.timeEnd]: '18:00',
        [REQUIRED_COLUMNS.days]: 'T2,T3,T4,T5,T6',
        [REQUIRED_COLUMNS.description]: 'Mô tả tuyến cấm (tùy chọn)'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Restricted Zones');
    XLSX.writeFile(workbook, 'restricted_zones_template.xlsx');
    toast.success('Đã tải file mẫu thành công');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import tuyến cấm từ Excel"
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
            {isProcessing ? `Đang tạo ${uploadProgress.current}/${uploadProgress.total}...` : 'Tạo tuyến cấm'}
          </Button>
        </>
      }
    >
      <div className="import-excel-modal">
        <div className="template-section">
          <p className="template-hint">
            <FaFileExcel /> Chưa có file Excel? Tải file mẫu để bắt đầu
          </p>
          <Button variant="outline" size="small" onClick={downloadTemplate}>
            <FaFileExcel /> Tải file mẫu
          </Button>
        </div>

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

        <div className="columns-info">
          <h4>Các cột bắt buộc trong Excel:</h4>
          <ul>
            <li><strong>{REQUIRED_COLUMNS.street}</strong>: Tên đường cấm (chuỗi ký tự)</li>
            <li><strong>{REQUIRED_COLUMNS.type}</strong>: {RESTRICTED_TYPE_OPTIONS.map(opt => `"${opt.label}"`).join(', ')}</li>
            <li><strong>{REQUIRED_COLUMNS.side}</strong>: {RESTRICTED_SIDE_OPTIONS.map(opt => `"${opt.label}"`).join(', ')}</li>
            <li><strong>{REQUIRED_COLUMNS.startLat}</strong>: Vĩ độ điểm bắt đầu ({DA_NANG_BOUNDS.south} - {DA_NANG_BOUNDS.north})</li>
            <li><strong>{REQUIRED_COLUMNS.startLng}</strong>: Kinh độ điểm bắt đầu ({DA_NANG_BOUNDS.west} - {DA_NANG_BOUNDS.east})</li>
            <li><strong>{REQUIRED_COLUMNS.endLat}</strong>: Vĩ độ điểm kết thúc ({DA_NANG_BOUNDS.south} - {DA_NANG_BOUNDS.north})</li>
            <li><strong>{REQUIRED_COLUMNS.endLng}</strong>: Kinh độ điểm kết thúc ({DA_NANG_BOUNDS.west} - {DA_NANG_BOUNDS.east})</li>
            <li><strong>{REQUIRED_COLUMNS.timeStart}</strong>: Giờ bắt đầu (HH:mm, VD: 07:00)</li>
            <li><strong>{REQUIRED_COLUMNS.timeEnd}</strong>: Giờ kết thúc (HH:mm, VD: 18:00)</li>
            <li><strong>{REQUIRED_COLUMNS.days}</strong>: Ngày áp dụng (VD: T2,T3,T6 hoặc Monday,Friday)</li>
            <li><strong>{REQUIRED_COLUMNS.description}</strong>: Mô tả (tùy chọn)</li>
          </ul>
        </div>

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

        {data.length > 0 && errors.length === 0 && (
          <div className="success-preview">
            <h4>
              <FaCheckCircle /> Dữ liệu hợp lệ: {data.length} tuyến cấm
            </h4>
            <div className="preview-table">
              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên đường</th>
                    <th>Loại cấm</th>
                    <th>Bên cấm</th>
                    <th>Thời gian</th>
                    <th>Ngày áp dụng</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 5).map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{item.street}</td>
                      <td>{RESTRICTED_TYPE_OPTIONS.find(opt => opt.value === item.type)?.label}</td>
                      <td>{RESTRICTED_SIDE_OPTIONS.find(opt => opt.value === item.side)?.label}</td>
                      <td>{item.time_range[0].start} - {item.time_range[0].end}</td>
                      <td>{item.days_restricted.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length > 5 && (
                <p className="preview-more">... và {data.length - 5} tuyến cấm khác</p>
              )}
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="processing-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
              />
            </div>
            <p>Đang tạo {uploadProgress.current}/{uploadProgress.total} tuyến cấm...</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImportRestrictedExcelModal;
