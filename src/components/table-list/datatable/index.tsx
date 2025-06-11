"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Loader2,
} from "lucide-react";

interface Column {
  key: string;
  label: string;
  width?: string;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: any[];
  onAdd?: () => void;
  addButtonText?: string;
  onAction?: (action: string, item: any) => void;
  actions?: string[];
  // Server-side pagination props
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  loading?: boolean;
  useServerPagination?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  data,
  onAdd,
  addButtonText = "",
  onAction,
  actions = ["Chỉnh sửa", "Xóa"],
  // Server-side pagination props
  currentPage: externalCurrentPage,
  totalPages: externalTotalPages,
  totalItems,
  itemsPerPage: externalItemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  loading = false,
  useServerPagination = false,
}) => {
  // Local state for client-side pagination
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [localItemsPerPage, setLocalItemsPerPage] =
    useState(externalItemsPerPage);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Choose between server-side or client-side pagination
  const currentPage = useServerPagination
    ? externalCurrentPage || 1
    : localCurrentPage;
  const itemsPerPage = useServerPagination
    ? externalItemsPerPage
    : localItemsPerPage;

  // Client-side pagination calculations
  const clientTotalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = useServerPagination
    ? data
    : data.slice(startIndex, endIndex);

  // Final values to display
  const totalPages = useServerPagination
    ? externalTotalPages || 1
    : clientTotalPages;
  const displayTotalItems = useServerPagination
    ? totalItems || data.length
    : data.length;

  useEffect(() => {
    const handleClickOutside = () => {
      if (openDropdown !== null) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdown]);

  const handlePageChange = (page: number) => {
    if (useServerPagination && onPageChange) {
      onPageChange(page);
    } else {
      setLocalCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value: number) => {
    if (useServerPagination && onItemsPerPageChange) {
      onItemsPerPageChange(value);
    } else {
      setLocalItemsPerPage(value);
      setLocalCurrentPage(1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {onAdd && (
          <button
            onClick={onAdd}
            disabled={loading}
            className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>{addButtonText}</span>
          </button>
        )}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="relative">
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="flex items-center space-x-2 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Đang tải...</span>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  Hành động
                </th>
              )}
            </tr>
          </thead>
          <tbody
            className={`bg-white divide-y divide-gray-200 ${
              loading ? "opacity-50" : ""
            }`}
          >
            {currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  {loading ? "Đang tải dữ liệu..." : "Không có dữ liệu"}
                </td>
              </tr>
            ) : (
              currentData.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.key === "status" ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item[column.key] === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item[column.key] === "active"
                            ? "Hoạt động"
                            : "Bị cấm"}
                        </span>
                      ) : column.key === "jlpt_level" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          N{item[column.key]}
                        </span>
                      ) : (
                        <span className="break-words">{item[column.key]}</span>
                      )}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(
                              openDropdown === index ? null : index
                            );
                          }}
                          disabled={loading}
                          className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openDropdown === index && (
                          <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col">
                            {actions.map((action) => (
                              <button
                                key={action}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAction?.(action, item);
                                  setOpenDropdown(null);
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">
            Tổng {displayTotalItems.toLocaleString()} bản ghi
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Số bản ghi 1 trang</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              disabled={loading}
              className="border border-gray-300 rounded px-2 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Trang {currentPage} / {totalPages}
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Trang sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
