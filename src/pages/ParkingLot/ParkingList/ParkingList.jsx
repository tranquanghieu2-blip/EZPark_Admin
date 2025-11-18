import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaEye, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import Table from '../../../components/common/Table/Table';
import Input from '../../../components/common/Input/Input';
import Modal from '../../../components/common/Modal/Modal';
import { getAllParkingLots, deleteParkingLot } from '../../../services/parkingService';
import { formatNumber } from '../../../utils/helpers';
import { ROUTES } from '../../../constants';
import './ParkingList.css';

const ParkingList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [parkingLots, setParkingLots] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });

  useEffect(() => {
    fetchParkingLots();
  }, []);

  const fetchParkingLots = async () => {
    try {
      // Dữ liệu mẫu - thay bằng API thực
      const mockData = [
        {
          id: 1,
          name: 'Bãi đỗ xe TTTM Indochina',
          type: 'Bãi đỗ công cộng',
          capacity: 200,
          address: '234 Trần Phú, Hải Châu, Đà Nẵng',
          lat: 16.0471,
          lng: 108.2068,
        },
        {
          id: 2,
          name: 'Bãi đỗ xe Lotte Mart',
          type: 'Bãi đỗ tư nhân',
          capacity: 150,
          address: '6 Nại Nam, Hòa Cường, Hải Châu, Đà Nẵng',
          lat: 16.0544,
          lng: 108.2022,
        },
        {
          id: 3,
          name: 'Bãi đỗ Công viên 29/3',
          type: 'Bãi đỗ công cộng',
          capacity: 100,
          address: 'Đường 2/9, Bình Hiên, Hải Châu, Đà Nẵng',
          lat: 16.0678,
          lng: 108.2209,
        },
      ];
      
      setParkingLots(mockData);
      setLoading(false);
    } catch (error) {
      toast.error('Không thể tải danh sách bãi đỗ xe');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteParkingLot(deleteModal.id);
      toast.success('Đã xóa bãi đỗ xe thành công!');
      setDeleteModal({ isOpen: false, id: null, name: '' });
      fetchParkingLots();
    } catch (error) {
      toast.error('Không thể xóa bãi đỗ xe');
    }
  };

  const filteredData = parkingLots.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Tên bãi đỗ',
      key: 'name',
      render: (value) => <strong>{value}</strong>,
    },
    {
      header: 'Loại',
      key: 'type',
    },
    {
      header: 'Sức chứa',
      key: 'capacity',
      align: 'center',
      render: (value) => <span className="badge badge-info">{formatNumber(value)} xe</span>,
    },
    {
      header: 'Địa chỉ',
      key: 'address',
    },
    {
      header: 'Thao tác',
      key: 'id',
      align: 'center',
      width: '200px',
      render: (id, row) => (
        <div className="table-actions">
          <button 
            className="action-btn action-btn-primary"
            onClick={() => navigate(`/parking-lots/${id}`)}
            title="Xem chi tiết"
          >
            <FaEye />
          </button>
          <button 
            className="action-btn action-btn-primary"
            onClick={() => navigate(`/parking-lots/${id}/edit`)}
            title="Chỉnh sửa"
          >
            <FaEdit />
          </button>
          <button 
            className="action-btn action-btn-danger"
            onClick={() => setDeleteModal({ isOpen: true, id, name: row.name })}
            title="Xóa"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="parking-list">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý bãi đỗ xe</h1>
          <p className="page-subtitle">Danh sách tất cả bãi đỗ xe tại Đà Nẵng</p>
        </div>
        <Button 
          variant="primary" 
          icon={<FaPlus />}
          onClick={() => navigate(ROUTES.PARKING_CREATE)}
        >
          Thêm bãi đỗ mới
        </Button>
      </div>

      <Card>
        <div className="list-toolbar">
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FaSearch />}
          />
        </div>

        <Table
          columns={columns}
          data={filteredData}
          loading={loading}
          emptyMessage="Không tìm thấy bãi đỗ xe nào"
        />
      </Card>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, name: '' })}
        title="Xác nhận xóa"
        size="small"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModal({ isOpen: false, id: null, name: '' })}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Xóa
            </Button>
          </>
        }
      >
        <p>Bạn có chắc chắn muốn xóa bãi đỗ xe <strong>{deleteModal.name}</strong>?</p>
        <p style={{ color: '#EF476F', marginTop: '8px' }}>Hành động này không thể hoàn tác!</p>
      </Modal>
    </div>
  );
};

export default ParkingList;
