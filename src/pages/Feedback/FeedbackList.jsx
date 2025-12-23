import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSearch, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Table from '../../components/common/Table/Table';
import Input from '../../components/common/Input/Input';
import Modal from '../../components/common/Modal/Modal';
import Pagination from '../../components/common/Pagination/Pagination';
import { getAllFeedback, deleteFeedback } from '../../services/feedbackService';
import { checkInappropriateWords, formatDateTime } from '../../utils/helpers';
import socket from '../../socket';
import './FeedbackList.css';

const FeedbackList = () => {
  const [loading, setLoading] = useState(true);
  const [feedbackList, setFeedbackList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchFeedback();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    const handleNewFeedback = (payload) => {
      console.log("📥 New feedback event:", payload);
      toast.info('Có feedback mới');
      fetchFeedback(); // Reload danh sách feedback
    };

    const handleFeedbackStatus = (payload) => {
      console.log("🔄 Feedback status changed:", payload);
      fetchFeedback(); // Reload khi feedback được cập nhật / xoá
    };

    socket.on('newFeedback', handleNewFeedback);
    socket.on('feedbackStatus', handleFeedbackStatus);

    return () => {
      socket.off('newFeedback', handleNewFeedback);
      socket.off('feedbackStatus', handleFeedbackStatus);
    };
  }, []);


  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await getAllFeedback({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        query: searchTerm,
      });

      if (res.success) {
        // Kiểm tra từ ngữ không phù hợp cho mỗi feedback
        const feedbackWithCheck = (res.data || []).map(feedback => ({
          ...feedback,
          isInappropriate: checkInappropriateWords(feedback.comment || '')
        }));

        setFeedbackList(feedbackWithCheck);
        setTotalItems(res.pagination?.totalItems ?? 0);
        setTotalPages(res.pagination?.totalPages ?? 0);
        setCurrentPage(res.pagination?.currentPage ?? 1);
      }
      setLoading(false);
    } catch (error) {
      toast.error('Không thể tải danh sách feedback');
      setFeedbackList([]);
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

  const handleSearchChange = (e) => {
    console.log("Search term changed:", e.target.value);
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };


  const columns = [
    {
      header: 'Người dùng',
      key: 'driverName',
    },
    {
      header: 'Bãi đỗ xe',
      key: 'parkingSpotName',
      render: (value) => <strong>{value}</strong>,
    },
    {
      header: 'Đánh giá',
      key: 'average_rating',
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
      key: 'updated_at',
      render: (value) => formatDateTime(value),
    },
    {
      header: 'Thao tác',
      key: 'feedback_id',
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
            onChange={handleSearchChange}
            icon={<FaSearch />}
          />
          <div className="feedback-legend">
            <FaExclamationTriangle style={{ color: '#EF476F' }} />
            <span>Phản hồi có từ ngữ không phù hợp</span>
          </div>
        </div>

        <Table
          columns={columns}
          data={feedbackList}
          loading={loading}
          emptyMessage="Không tìm thấy feedback nào"
        />

        {/* Pagination */}
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
