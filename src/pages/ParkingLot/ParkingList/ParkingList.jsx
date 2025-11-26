import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus, FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

import Card from "../../../components/common/Card/Card";
import Button from "../../../components/common/Button/Button";
import Table from "../../../components/common/Table/Table";
import Input from "../../../components/common/Input/Input";
import Modal from "../../../components/common/Modal/Modal";
import Pagination from "../../../components/common/Pagination/Pagination";

import {
  getAllParkingSpots,
  deleteParkingSpot,
} from "../../../services/parkingService";

import { formatNumber } from "../../../utils/helpers";
import { ROUTES } from "../../../constants";

import "./ParkingList.css";

const ParkingList = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    name: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchParkingSpots();
  }, [currentPage, searchTerm]);

  const fetchParkingSpots = async () => {
    setLoading(true);

    try {
      const res = await getAllParkingSpots({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        search: searchTerm,
      });

      if (res.success) {
        setParkingSpots(res.data || []);

        setTotalPages(res.pagination?.totalPages || 1);
        setTotalItems(res.pagination?.totalItems || 0);
      }

      setLoading(false);
    } catch (error) {
      toast.error("Không thể tải danh sách bãi đỗ xe");
      setParkingSpots([]);
      setLoading(false);
      console.error("Error fetching parking spots:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteParkingSpot(deleteModal.id);
      toast.success("Đã xóa bãi đỗ xe!");

      setDeleteModal({ isOpen: false, id: null, name: "" });

      // If this is the last item on the page → go back 1 page
      if (parkingSpots.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchParkingSpots();
      }
    } catch (err) {
      toast.error("Không thể xóa bãi đỗ xe");
    }
  };

  const filteredData = parkingSpots.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const columns = [
    {
      header: "Tên bãi đỗ",
      key: "name",
      render: (val) => <strong>{val}</strong>,
    },
    {
      header: "Loại",
      key: "type",
    },
    {
      header: "Sức chứa",
      key: "capacity",
      align: "center",
      render: (val) => (
        <span className="badge badge-info">{formatNumber(val)} xe</span>
      ),
    },
    {
      header: "Địa chỉ",
      key: "address",
    },
    {
      header: "Thao tác",
      key: "parking_spot_id",
      align: "center",
      width: "200px",
      render: (id, row) => (
        <div className="table-actions">
          <button
            className="action-btn action-btn-primary"
            onClick={() => navigate(`/parking-spots/${id}`)}
            title="Xem chi tiết"
          >
            <FaEye />
          </button>

          <button
            className="action-btn action-btn-primary"
            onClick={() => navigate(`/parking-spots/${id}/edit`, { state: { parkingData: row } })}
            title="Chỉnh sửa"
          >
            <FaEdit />
          </button>

          <button
            className="action-btn action-btn-danger"
            onClick={() =>
              setDeleteModal({ isOpen: true, id, name: row.name })
            }
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
          <p className="page-subtitle">
            Danh sách tất cả bãi đỗ xe tại thành phố Đà Nẵng
          </p>
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
        {/* Search Bar */}
        <div className="list-toolbar">
          <Input
            type="text"
            placeholder="Tìm theo tên hoặc địa chỉ..."
            value={searchTerm}
            onChange={handleSearchChange}
            icon={<FaSearch />}
          />
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={parkingSpots}
          loading={loading}
          emptyMessage="Không tìm thấy bãi đỗ nào"
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

      {/* Delete modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, name: "" })}
        title="Xác nhận xóa"
        size="small"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() =>
                setDeleteModal({ isOpen: false, id: null, name: "" })
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
          Bạn chắc chắn muốn xóa <strong>{deleteModal.name}</strong>?
        </p>
        <p style={{ marginTop: 8, color: "#EF476F" }}>
          Hành động này không thể hoàn tác!
        </p>
      </Modal>
    </div>
  );
};

export default ParkingList;
