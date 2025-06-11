"use client";

import { useState, useEffect } from "react";
import DataTable from "../../../components/table-list/datatable";
import Breadcrumb from "../../../components/table-list/breadcrumb";
import HanziModal from "./modal";
import kanjiAPI from "../../../api/kanjiAPI";
import { toast } from "react-toastify";

interface KanjiData {
  _id: string;
  text: string;
  phonetic: string[];
  onyomi: string[];
  kunyomi: string[];
  strokes: number;
  jlpt_level: number;
  meaning: string;
  romanji: string[];
}

interface TableKanjiData {
  id: string;
  character: string;
  hanViet: string;
  meaning: string;
  jlpt: string;
}

const Hanzi = () => {
  const [hanzi, setHanzi] = useState<TableKanjiData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // Store original kanji data for editing
  const [originalKanjiData, setOriginalKanjiData] = useState<KanjiData[]>([]);

  const ITEMS_PER_PAGE = itemsPerPage;

  // Convert API data format to table format
  const convertApiDataToTableFormat = (
    apiData: KanjiData[]
  ): TableKanjiData[] => {
    return apiData.map((item) => ({
      id: item._id,
      character: item.text,
      hanViet: item.phonetic.join(", "),
      meaning: item.meaning,
      jlpt: `N${item.jlpt_level}`,
    }));
  };

  // Convert table format back to API format for modal
  const convertTableDataToModalFormat = (
    tableData: TableKanjiData,
    originalData?: KanjiData
  ) => {
    return {
      id: tableData.id,
      character: tableData.character,
      hanViet: tableData.hanViet.split(", "),
      strokeCount: originalData?.strokes || 1,
      jlpt: tableData.jlpt,
      meaning: tableData.meaning,
      radical: "", // You might need to add this field or get from original data
      onReadings: originalData?.onyomi || [""],
      kunReadings: originalData?.kunyomi || [""],
    };
  };

  // Fetch kanji data from API
  const fetchKanjiData = async (
    page: number = 1,
    limit: number = itemsPerPage
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await kanjiAPI.getAll(page, limit);

      if (response.data.status === "success") {
        const apiData = response.data.data.data;
        const convertedData = convertApiDataToTableFormat(apiData);

        // Store original data for editing
        setOriginalKanjiData(apiData);
        setHanzi(convertedData);
        setCurrentPage(response.data.data.currentPage);
        setTotalPages(response.data.data.totalPages);
      } else {
        throw new Error("Failed to fetch kanji data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching kanji data:", err);
      toast.error("Không thể tải dữ liệu kanji!");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchKanjiData(1, itemsPerPage);
  }, [itemsPerPage]);

  const columns = [
    { key: "character", label: "Hán tự", width: "20%" },
    { key: "hanViet", label: "Hán Việt", width: "25%" },
    { key: "meaning", label: "Ý nghĩa", width: "30%" },
  ];

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/admin/dashboard" },
    { label: "Từ điển", path: "/admin/dictionary" },
    { label: "Hán tự" },
  ];

  const handleAction = async (action: string, item: TableKanjiData) => {
    if (action === "Chỉnh sửa") {
      try {
        // Find original data for the item being edited
        const originalData = originalKanjiData.find(
          (data) => data._id === item.id
        );
        const modalData = convertTableDataToModalFormat(item, originalData);
        setEditingItem(modalData);
        setIsModalOpen(true);
      } catch (err) {
        console.error("Error preparing edit data:", err);
        toast.error("Không thể chuẩn bị dữ liệu chỉnh sửa!");
      }
    } else if (action === "Xóa") {
      try {
        setLoading(true);
        await kanjiAPI.delete(item.id);
        // Refresh current page after delete
        await fetchKanjiData(currentPage, itemsPerPage);
        toast.success("Xóa kanji thành công!");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete kanji");
        console.error("Error deleting kanji:", err);
        toast.error("Không thể xóa kanji!");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddHanzi = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleSaveHanzi = async (data: any) => {
    try {
      setLoading(true);

      // Convert modal data to API format
      const apiData = {
        text: data.character,
        phonetic: Array.isArray(data.hanViet)
          ? data.hanViet
          : data.hanViet.split(", "),
        onyomi: data.onReadings || [],
        kunyomi: data.kunReadings || [],
        strokes: data.strokeCount || 1,
        jlpt_level: parseInt(data.jlpt.replace("N", "")),
        meaning: data.meaning || "",
      };

      if (editingItem && editingItem.id) {
        // Update existing kanji
        console.log(
          "Updating kanji with ID:",
          editingItem.id,
          "Data:",
          apiData
        );
        await kanjiAPI.update(editingItem.id, apiData);
        toast.success("Cập nhật kanji thành công!");
      } else {
        // Create new kanji
        console.log("Creating new kanji:", apiData);
        await kanjiAPI.create(apiData);
        toast.success("Thêm mới kanji thành công!");
      }

      // Refresh data after save
      await fetchKanjiData(currentPage, itemsPerPage);
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save kanji";
      setError(errorMessage);
      console.error("Error saving kanji:", err);

      if (editingItem && editingItem.id) {
        toast.error("Không thể cập nhật kanji!");
      } else {
        toast.error("Không thể thêm kanji mới!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchKanjiData(page, itemsPerPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    // Reset to page 1 when changing items per page
    fetchKanjiData(1, newItemsPerPage);
  };

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Lỗi:</strong> {error}
          <button
            onClick={() => fetchKanjiData(currentPage)}
            className="ml-2 underline hover:no-underline"
          >
            Thử lại
          </button>
        </div>
      )}

      <DataTable
        title="Hán tự"
        columns={columns}
        data={hanzi}
        onAdd={handleAddHanzi}
        addButtonText="Thêm Hán tự"
        onAction={handleAction}
        actions={["Chỉnh sửa", "Xóa"]}
        loading={loading}
        useServerPagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalPages * ITEMS_PER_PAGE} // Approximate total, you might want to get this from API
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      <HanziModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveHanzi}
        initialData={editingItem || undefined}
        title={editingItem ? "Cập nhật Hán tự" : "Thêm Hán tự"}
      />
    </div>
  );
};

export default Hanzi;
