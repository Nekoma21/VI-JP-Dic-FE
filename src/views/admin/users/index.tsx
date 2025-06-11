"use client";

import { useState, useEffect } from "react";
import DataTable from "../../../components/table-list/datatable";
import Breadcrumb from "../../../components/table-list/breadcrumb";
import UserModal from "./modal";
import userAPI from "../../../api/userAPI";

interface User {
  id?: number;
  fullname: string;
  username: string;
  email: string;
  created_at: string;
  avatar?: string;
}

interface UserModalData {
  id?: number;
  name: string;
  email: string;
  joinDate: string;
  avatar?: string;
  status: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserModalData | null>(null);

  const columns = [
    { key: "username", label: "Tên đăng nhập", width: "30%" },
    { key: "email", label: "Email", width: "60%" },
  ];

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/admin/dashboard" },
    { label: "Người dùng" },
  ];

  // Function to fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // If your API supports pagination, you might need to modify this
      const response = await userAPI.getAllUsers();

      if (response.data.status === "success") {
        const apiData = response.data.data;
        setUsers(apiData.data);
        setCurrentPage(apiData.currentPage);
        setTotalPages(apiData.totalPages);
        setTotalItems(apiData.data.length); // You might want to get this from API if available
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      // You might want to show an error message to user
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleAction = (action: string, user: User) => {
    console.log(`${action} user:`, user);
    if (action === "Xem") {
      // Transform user data to match modal interface
      const modalData: UserModalData = {
        id: user.id,
        name: user.fullname, // Use fullname for modal display
        email: user.email,
        joinDate: new Date(user.created_at).toLocaleDateString("vi-VN"),
        avatar: user.avatar,
        status: "active", // You might want to get this from API if available
      };

      setSelectedUser(modalData);
      setIsUserModalOpen(true);
    }
  };

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <DataTable
        title="Danh sách người dùng"
        columns={columns}
        data={users}
        onAction={handleAction}
        actions={["Xem"]}
        // Server-side pagination props
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        loading={loading}
        useServerPagination={false} // Set to true if your API supports server-side pagination
      />

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        userData={selectedUser}
      />
    </div>
  );
};

export default Users;
