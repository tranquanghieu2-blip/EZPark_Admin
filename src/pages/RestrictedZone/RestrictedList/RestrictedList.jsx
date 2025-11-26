import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaEye, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import Table from '../../../components/common/Table/Table';
import Input from '../../../components/common/Input/Input';
import Modal from '../../../components/common/Modal/Modal';
import Pagination from '../../../components/common/Pagination/Pagination';

import { getAllRestrictedZones, deleteRestrictedZone } from '../../../services/restrictedZoneService';
import { ROUTES } from '../../../constants';

import './RestrictedList.css';

const RestrictedList = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    name: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchZones();
  }, [currentPage, searchTerm]);

  const fetchZones = async () => {
    setLoading(true);
    try {
      const res = await getAllRestrictedZones({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        search: searchTerm,
      });

      if (res.success) {
        setZones(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalItems(res.pagination?.totalItems || 0);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách tuyến cấm");
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
      render: (value) => <span className="badge badge-danger">{value}</span>,
    },
    {
      header: "Bên cấm",
      key: "side",
    },
    {
      header: "Mô tả",
      key: "description",
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
            onClick={() => navigate(`/restricted-zones/${id}/edit`)}
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
        <Button
          variant="primary"
          icon={<FaPlus />}
          onClick={() => navigate(ROUTES.RESTRICTED_CREATE)}
        >
          Thêm tuyến cấm mới
        </Button>
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
          data={filteredData}
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
    </div>
  );
};

export default RestrictedList;
