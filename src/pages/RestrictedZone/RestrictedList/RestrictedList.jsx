import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaEye, FaEdit, FaTrash, FaSearch, FaFileExcel } from 'react-icons/fa';

import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import Table from '../../../components/common/Table/Table';
import Input from '../../../components/common/Input/Input';
import Modal from '../../../components/common/Modal/Modal';
import Pagination from '../../../components/common/Pagination/Pagination';
import ImportRestrictedExcelModal from '../../../components/ImportRestrictedExcelModal/ImportRestrictedExcelModal';

import { getAllRestrictedZones, deleteRestrictedZone } from '../../../services/restrictedZoneService';
import { ROUTES, RESTRICTED_TYPE_OPTIONS, RESTRICTED_SIDE_OPTIONS } from '../../../constants';

import './RestrictedList.css';
import { set } from 'date-fns';

const RestrictedList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    name: '',
  });

  const [importModalOpen, setImportModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Kiểm tra nếu có returnPage từ navigate state (sau khi edit hoặc create)
  useEffect(() => {
    if (location.state?.returnPage) {
      const returnPage = location.state.returnPage;

      if (returnPage === 'last') {
        // Fetch để lấy totalPages, sau đó set về trang cuối
        fetchRestrictedZonesForLastPage();
      } else {
        setCurrentPage(returnPage);
      }

      // Clear state sau khi đã sử dụng
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchRestrictedZonesForLastPage = async () => {
    setLoading(true);
    try {
      const res = await getAllRestrictedZones({
        pageNumber: 1,
        pageSize: itemsPerPage,
        query: searchTerm,
      });

      if (res.success) {
        const lastPage = res.pagination?.totalPages || 1;
        setCurrentPage(lastPage);
      }
    } catch (error) {
      console.error("Error fetching last page:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchZones();
  }, [currentPage, searchTerm]);

  const fetchZones = async () => {
    setLoading(true);
    try {
      const res = await getAllRestrictedZones({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        query: searchTerm,
      });

      if (res.success) {
        setZones(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalItems(res.pagination?.totalItems || 0);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách tuyến cấm");
      setZones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRestrictedZone(deleteModal.id);
      toast.success("Đã xóa tuyến cấm thành công!");

      setDeleteModal({ isOpen: false, id: null, name: '' });

      if (zones.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchZones();
      }

    } catch (error) {
      toast.error("Không thể xóa tuyến cấm");
    }
  };

  const filteredData = zones.filter(item =>
    item.street.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const columns = [
    {
      header: "Tên đường",
      key: "street",
      render: (value) => <strong>{value}</strong>,
    },
    {
      header: "Loại cấm",
      key: "type",
      render: (value) => {
        const typeOption = RESTRICTED_TYPE_OPTIONS.find(opt => opt.value === value);
        return typeOption ? <span className="badge badge-danger">{typeOption.label}</span> : value;
      }
    },
    {
      header: "Bên cấm",
      key: "side",
      render: (value) => {
        const sideOption = RESTRICTED_SIDE_OPTIONS.find(opt => opt.value === value);
        return sideOption ? <span className="badge badge-primary">{sideOption.label}</span> : value;
      }
    },
    {
      header: "Mô tả",
      key: "description",
      render: (value) => value || <em>Không có</em>,
    },
    {
      header: "Thao tác",
      key: "no_parking_route_id",
      align: "center",
      width: "200px",
      render: (id, row) => (
        <div className="table-actions">
          <button
            className="action-btn action-btn-primary"
            onClick={() => navigate(`/restricted-zones/${id}`)}
          >
            <FaEye />
          </button>

          <button
            className="action-btn action-btn-primary"
            onClick={() => navigate(`/restricted-zones/${id}/edit`, { 
              state: { 
                restrictedData: row,
                currentPage: currentPage // Truyền trang hiện tại để quay lại
              } 
            })}
            title="Chỉnh sửa"
          >
            <FaEdit />
          </button>

          <button
            className="action-btn action-btn-danger"
            onClick={() =>
              setDeleteModal({ isOpen: true, id, name: row.street })
            }
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="restricted-list">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý tuyến cấm</h1>
          <p className="page-subtitle">Danh sách các tuyến đường cấm dừng/đỗ</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="outline"
            icon={<FaFileExcel />}
            onClick={() => setImportModalOpen(true)}
          >
            Import Excel
          </Button>
          <Button
            variant="primary"
            icon={<FaPlus />}
            onClick={() => navigate(ROUTES.RESTRICTED_CREATE)}
          >
            Thêm tuyến cấm mới
          </Button>
        </div>
      </div>

      <Card>
        <div className="list-toolbar">
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên đường..."
            value={searchTerm}
            onChange={handleSearchChange}
            icon={<FaSearch />}
          />
        </div>

        <Table
          columns={columns}
          data={zones}
          loading={loading}
          emptyMessage="Không tìm thấy tuyến cấm nào"
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </Card>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, id: null, name: '' })
        }
        title="Xác nhận xóa"
        size="small"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() =>
                setDeleteModal({ isOpen: false, id: null, name: '' })
              }
            >
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Xóa
            </Button>
          </>
        }
      >
        <p>
          Bạn có chắc chắn muốn xóa tuyến cấm{" "}
          <strong>{deleteModal.name}</strong>?
        </p>
        <p style={{ marginTop: 8, color: "#EF476F" }}>
          Hành động này không thể hoàn tác!
        </p>
      </Modal>

      {/* Import Excel Modal */}
      <ImportRestrictedExcelModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onSuccess={() => {
          setImportModalOpen(false);
          fetchZones(); // Refresh list after import
        }}
      />
    </div>
  );
};

export default RestrictedList;
