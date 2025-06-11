// file: app/admin/dictionary/vocabulary/page.tsx (hoặc Vocabulary.tsx tuỳ cấu trúc dự án)
"use client";

import { useState, useEffect, useCallback } from "react";
import DataTable from "../../../components/table-list/datatable";
import Breadcrumb from "../../../components/table-list/breadcrumb";
import VocabularyModal from "./modal";
import wordAPI from "../../../api/wordAPI";
import { toast } from "react-toastify";

interface Meaning {
  _id: string;
  type: string;
  content: string;
}

interface Example {
  _id: string;
  text: string;
  hiragana: string;
  meaning: string;
}

interface VocabularyItem {
  _id: string;
  text: string;
  hiragana: string[];
  meaning: Meaning[];
  examples: Example[];
  kanji: string[];
  romanji: string[];
  jlpt_level: number;
}

interface ModalVocabularyData {
  word: string;
  readings: string[];
  meanings: {
    type: string;
    content: string;
    examples: {
      sentence: string;
      hiragana: string;
      meaning: string;
    }[];
  }[];
}

const Vocabulary = () => {
  const [vocabulary, setVocabulary] = useState<any[]>([]);
  const [originalVocabulary, setOriginalVocabulary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ModalVocabularyData | null>(
    null
  );

  // Chỉ giữ một state cho từ khoá tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Chuyển API → modal format
  const transformApiDataToModal = (
    apiData: VocabularyItem
  ): ModalVocabularyData => {
    const meaningGroups: {
      [key: string]: {
        type: string;
        content: string;
        examples: { sentence: string; hiragana: string; meaning: string }[];
      };
    } = {};

    apiData.meaning.forEach((meaning) => {
      meaningGroups[meaning._id] = {
        type: meaning.type,
        content: meaning.content,
        examples: [],
      };
    });

    if (apiData.meaning.length === 0) {
      meaningGroups["default"] = {
        type: "Danh từ",
        content: "",
        examples: [],
      };
    }

    const firstKey = Object.keys(meaningGroups)[0];
    if (firstKey && apiData.examples) {
      meaningGroups[firstKey].examples = apiData.examples.map((example) => ({
        sentence: example.text,
        hiragana: example.hiragana,
        meaning: example.meaning,
      }));
    }

    if (firstKey && meaningGroups[firstKey].examples.length === 0) {
      meaningGroups[firstKey].examples = [
        { sentence: "", hiragana: "", meaning: "" },
      ];
    }

    return {
      word: apiData.text,
      readings:
        apiData.hiragana && apiData.hiragana.length > 0
          ? apiData.hiragana
          : [""],
      meanings: Object.values(meaningGroups),
    };
  };

  // 2. Chuyển modal → API khi lưu
  const transformModalDataToApi = (modalData: ModalVocabularyData) => {
    const allExamples: any[] = [];
    modalData.meanings.forEach((meaning) => {
      meaning.examples.forEach((example) => {
        if (example.sentence || example.hiragana || example.meaning) {
          allExamples.push({
            text: example.sentence,
            hiragana: example.hiragana,
            meaning: example.meaning,
          });
        }
      });
    });

    return {
      text: modalData.word,
      hiragana: modalData.readings.filter((r) => r.trim() !== ""),
      meaning: modalData.meanings
        .filter((m) => m.content.trim() !== "")
        .map((m) => ({
          type: m.type,
          content: m.content,
        })),
      examples: allExamples,
    };
  };

  // 3. Fetch dữ liệu (có pagination)
  const fetchVocabulary = async (
    page: number = 1,
    limit: number = itemsPerPage
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await wordAPI.getAll(page, limit);
      if (response.data.status === "success") {
        const transformedData = response.data.data.data.map(
          (item: VocabularyItem) => ({
            id: item._id,
            word: item.text,
            hiragana: item.hiragana.join(", "),
            meaning: item.meaning.map((m) => m.content).join("; "),
            romanji: item.romanji.join(", "),
            jlpt_level: item.jlpt_level,
            kanji: item.kanji.join(""),
            examples: item.examples,
            originalData: item,
          })
        );

        setVocabulary(transformedData);
        setOriginalVocabulary(transformedData);
        setCurrentPage(response.data.data.currentPage);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (err) {
      console.error("Error fetching vocabulary:", err);
      setError("Không thể tải dữ liệu từ vựng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocabulary(1, itemsPerPage);
  }, []);

  // 4. Handlers pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchVocabulary(page, itemsPerPage);
    }
  };

  const handleItemsPerPageChange = (newItems: number) => {
    setItemsPerPage(newItems);
    setCurrentPage(1);
    fetchVocabulary(1, newItems);
  };

  // 5. Xử lý action của DataTable
  const handleAction = (action: string, item: any) => {
    if (action === "Chỉnh sửa") {
      const modalData = transformApiDataToModal(item.originalData);
      setEditingItem(modalData);
      setIsModalOpen(true);
    } else if (action === "Xóa") {
      console.log("Delete vocabulary:", item);
      handleDeleteVocabulary(item.id);
    }
  };

  // 6. Thêm mới từ vựng
  const handleAddVocabulary = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  // 7. Search – luôn search trên tất cả các trường
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        // Nếu query rỗng, show lại toàn bộ
        setVocabulary(originalVocabulary);
        return;
      }

      const lower = query.toLowerCase().trim();
      const filtered = originalVocabulary.filter((item) => {
        return (
          item.word.toLowerCase().includes(lower) ||
          item.hiragana.toLowerCase().includes(lower) ||
          item.romanji.toLowerCase().includes(lower) ||
          item.meaning.toLowerCase().includes(lower)
        );
      });

      setVocabulary(filtered);
    },
    [originalVocabulary]
  );

  // 8. Lưu dữ liệu từ modal lên API
  const handleSaveVocabulary = async (data: ModalVocabularyData) => {
    try {
      setLoading(true);

      const apiData = transformModalDataToApi(data);

      if (!apiData.text || !apiData.meaning || apiData.meaning.length === 0) {
        throw new Error("Vui lòng điền đầy đủ thông tin từ vựng và ý nghĩa");
      }

      let response;
      if (editingItem) {
        const editingId = vocabulary.find(
          (item) => item.word === editingItem.word
        )?.id;
        if (editingId) {
          response = await wordAPI.update(editingId, apiData);
        } else {
          throw new Error("Không tìm thấy ID của từ vựng đang chỉnh sửa");
        }
      } else {
        response = await wordAPI.create(apiData);
      }

      if (response.data.status === "success") {
        await fetchVocabulary(currentPage, itemsPerPage);
        if (searchQuery) {
          setTimeout(() => {
            handleSearch(searchQuery);
          }, 100);
        }
        setIsModalOpen(false);
        setEditingItem(null);
        toast.success(
          editingItem ? "Cập nhật thành công!" : "Thêm mới từ vựng thành công!"
        );
      }
    } catch (error: any) {
      console.error("Error saving vocabulary:", error);
      let msg = "Lỗi không xác định";
      if (error.response?.data?.message) {
        msg = error.response.data.message;
      } else if (error.message) {
        msg = error.message;
      }
      toast.error(`Lỗi khi lưu từ vựng: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVocabulary = async (id: string) => {
    try {
      setLoading(true);
      // Gọi API xóa
      const response = await wordAPI.delete(id);

      if (response.data.status === "success") {
        // Nếu xóa thành công, reload lại trang hiện tại
        await fetchVocabulary(currentPage, itemsPerPage);

        // Nếu đang có filter/search, apply lại search để kết quả hiển thị đúng
        if (searchQuery) {
          setTimeout(() => {
            handleSearch(searchQuery);
          }, 100);
        }

        toast.success("Xóa từ vựng thành công!");
      } else {
        // Nếu backend trả về lỗi mặc dù status khác "success"
        toast.error("Không thể xóa từ vựng. Vui lòng thử lại.");
      }
    } catch (error: any) {
      console.error("Error deleting vocabulary:", error);
      let msg = "Lỗi không xác định";
      if (error.response?.data?.message) {
        msg = error.response.data.message;
      } else if (error.message) {
        msg = error.message;
      }
      toast.error(`Lỗi khi xóa từ vựng: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchVocabulary(currentPage, itemsPerPage);
    if (searchQuery) {
      setTimeout(() => {
        handleSearch(searchQuery);
      }, 100);
    }
  };

  // 9. Hiển thị loading / error
  if (loading && vocabulary.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // 10. JSX chính
  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Trang chủ", path: "/admin/dashboard" },
          { label: "Từ điển", path: "/admin/dictionary" },
          { label: "Từ vựng" },
        ]}
      />

      <DataTable
        title="Danh sách từ vựng"
        columns={[
          { key: "word", label: "Từ vựng", width: "20%" },
          { key: "hiragana", label: "Hiragana", width: "20%" },
          { key: "romanji", label: "Romanji", width: "20%" },
          { key: "meaning", label: "Ý nghĩa", width: "30%" },
        ]}
        data={vocabulary}
        onAdd={handleAddVocabulary}
        addButtonText="Thêm từ vựng"
        onAction={handleAction}
        loading={loading}
        useServerPagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalPages * itemsPerPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      <VocabularyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveVocabulary}
        initialData={editingItem || undefined}
        title={editingItem ? "Cập nhật từ vựng" : "Thêm từ vựng"}
      />
    </div>
  );
};

export default Vocabulary;
