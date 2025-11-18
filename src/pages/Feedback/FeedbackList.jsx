import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSearch, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Table from '../../components/common/Table/Table';
import Input from '../../components/common/Input/Input';
import Modal from '../../components/common/Modal/Modal';
import { getAllFeedback, deleteFeedback } from '../../services/feedbackService';
import { checkInappropriateWords, formatDateTime } from '../../utils/helpers';
import './FeedbackList.css';

const FeedbackList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [feedbackList, setFeedbackList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const mockData = [
        {
          id: 1,
          userName: 'Nguyễn Văn A',
          parkingLotName: 'Bãi đỗ xe TTTM Indochina',
          rating: 5,
          comment: 'Bãi đỗ rộng rãi, giá cả hợp lý',
          createdAt: '2025-11-18T10:30:00',
          isInappropriate: false,
        },
        {
          id: 2,
          userName: 'Trần Thị B',
          parkingLotName: 'Bãi đỗ xe Lotte Mart',
          rating: 2,
          comment: 'Bãi đỗ này đồ chó quá, không bao giờ quay lại',
          createdAt: '2025-11-18T09:15:00',
          isInappropriate: true,
        },
      ];
      
      setFeedbackList(mockData);
      setLoading(false);
    } catch (error) {
      toast.error('Không thể tải danh sách feedback');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFeedback(deleteModal.id);
      toast.success('Đã xóa feedback thành công!');
      setDeleteModal({ isOpen: false, id: null });
      fetchFeedback();
    } catch (error) {
      toast.error('Không thể xóa feedback');
    }
  };

  const filteredData = feedbackList.filter(item =>
    item.parkingLotName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Người dùng',
      key: 'userName',
    },
    {
      header: 'Bãi đỗ xe',
      key: 'parkingLotName',
      render: (value) => <strong>{value}</strong>,
    },
    {
      header: 'Đánh giá',
      key: 'rating',
      align: 'center',
      render: (value) => (
        <div className="rating-stars">
          {'⭐'.repeat(value)}
        </div>
      ),
    },
    {
      header: 'Nội dung',
      key: 'comment',
      render: (value, row) => (
        <div className="feedback-content">
          {row.isInappropriate && (
            <FaExclamationTriangle className="warning-icon" title="Vi phạm từ ngữ" />
          )}
          <span className={row.isInappropriate ? 'inappropriate-text' : ''}>
            {value}
          </span>
        </div>
      ),
    },
    {
      header: 'Thời gian',
      key: 'createdAt',
      render: (value) => formatDateTime(value),
    },
    {
      header: 'Thao tác',
      key: 'id',
      align: 'center',
      width: '120px',
      render: (id, row) => (
        <div className="table-actions">
          <button 
            className="action-btn action-btn-danger"
            onClick={() => setDeleteModal({ isOpen: true, id })}
            title="Xóa"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="feedback-list">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý Feedback</h1>
          <p className="page-subtitle">Danh sách phản hồi từ người dùng</p>
        </div>
      </div>

      <Card>
        <div className="list-toolbar">
          <Input
            type="text"
            placeholder="Tìm kiếm theo bãi đỗ hoặc người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FaSearch />}
          />
          <div className="feedback-legend">
            <FaExclamationTriangle style={{ color: '#EF476F' }} />
            <span>Phản hồi có từ ngữ không phù hợp</span>
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredData}
          loading={loading}
          emptyMessage="Không tìm thấy feedback nào"
        />
      </Card>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        title="Xác nhận xóa feedback"
        size="small"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModal({ isOpen: false, id: null })}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Xóa
            </Button>
          </>
        }
      >
        <p>Bạn có chắc chắn muốn xóa feedback này?</p>
        <p style={{ color: '#EF476F', marginTop: '8px' }}>Hành động này không thể hoàn tác!</p>
      </Modal>
    </div>
  );
};

export default FeedbackList;
