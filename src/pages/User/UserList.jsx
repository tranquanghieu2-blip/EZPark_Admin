import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBan, FaCheck } from 'react-icons/fa';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Table from '../../components/common/Table/Table';
import Input from '../../components/common/Input/Input';
import Modal from '../../components/common/Modal/Modal';
import Pagination from '../../components/common/Pagination/Pagination';
import { getAllUsers, deleteUser} from '../../services/userService';
import { formatDateTime } from '../../utils/helpers';
import './UserList.css';

const UserList = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        query: searchTerm,
      });

      if (res.success) {
        setUsers(res.data || []);
        setTotalItems(res.pagination?.totalItems ?? 0);
        setTotalPages(res.pagination?.totalPages ?? 0);
        setCurrentPage(res.pagination?.currentPage ?? 1);
      }
      setLoading(false);
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng');
      setUsers([]);
      setLoading(false);
 
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(deleteModal.id);
      toast.success('Đã xóa người dùng thành công!');
      setDeleteModal({ isOpen: false, id: null, name: '' });
      fetchUsers();
    } catch (error) {
      toast.error('Không thể xóa người dùng');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
      await toggleUserStatus(id, newStatus);
      toast.success(`Đã ${newStatus === 'blocked' ? 'chặn' : 'mở chặn'} người dùng!`);
      fetchUsers();
    } catch (error) {
      toast.error('Không thể thay đổi trạng thái người dùng');
    }
  };

  const filteredData = users.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

    const handleSearchChange = (e) => {
    console.log("Search term changed:", e.target.value);
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const columns = [
    {
      header: 'Tên',
      key: 'name',
      render: (value) => <strong>{value}</strong>,
    },
    {
      header: 'Email',
      key: 'username',
    },
    // {
    //   header: 'Trạng thái',
    //   key: 'status',
    //   align: 'center',
    //   render: (value) => (
    //     <span className={`badge ${value === 'active' ? 'badge-success' : 'badge-danger'}`}>
    //       {value === 'active' ? 'Hoạt động' : 'Bị chặn'}
    //     </span>
    //   ),
    // },
    {
      header: 'Ngày tạo',
      key: 'created_at',
      render: (value) => formatDateTime(value),
    },
    {
      header: 'Thao tác',
      key: 'id',
      align: 'center',
      width: '200px',
      render: (id, row) => (
        <div className="table-actions">
          <button
            className={`action-btn ${row.status === 'active' ? 'action-btn-danger' : 'action-btn-primary'}`}
            onClick={() => handleToggleStatus(id, row.status)}
            title={row.status === 'active' ? 'Chặn' : 'Mở chặn'}
          >
            {row.status === 'active' ? <FaBan /> : <FaCheck />}
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
    <div className="user-list">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý người dùng</h1>
          <p className="page-subtitle">Danh sách tất cả người dùng trong hệ thống</p>
        </div>
      </div>

      <Card>
        <div className="list-toolbar">
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FaSearch />}
          />
        </div>

        <Table
          columns={columns}
          data={filteredData}
          loading={loading}
          emptyMessage="Không tìm thấy người dùng nào"
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
        <p>Bạn có chắc chắn muốn xóa người dùng <strong>{deleteModal.name}</strong>?</p>
      </Modal>
    </div>
  );
};

export default UserList;
