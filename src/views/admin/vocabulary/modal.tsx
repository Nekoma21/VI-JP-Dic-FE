"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";

interface VocabularyData {
  word: string;
  readings: string[]; // Thay đổi từ reading thành readings array
  meanings: {
    type: string;
    content: string; // Thêm trường content cho ý nghĩa
    examples: {
      sentence: string;
      hiragana: string;
      meaning: string;
    }[];
  }[];
}

interface VocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VocabularyData) => void;
  initialData?: VocabularyData;
  title?: string;
}

const VocabularyModal: React.FC<VocabularyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  title = "Cập nhật từ vựng",
}) => {
  const [formData, setFormData] = useState<VocabularyData>(
    initialData || {
      word: "",
      readings: [""], // Khởi tạo với một cách đọc trống
      meanings: [
        {
          type: "Danh từ",
          content: "", // Khởi tạo content rỗng
          examples: [
            {
              sentence: "",
              hiragana: "",
              meaning: "",
            },
          ],
        },
      ],
    }
  );

  // Cập nhật formData khi initialData thay đổi
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        word: "",
        readings: [""],
        meanings: [
          {
            type: "Danh từ",
            content: "",
            examples: [
              {
                sentence: "",
                hiragana: "",
                meaning: "",
              },
            ],
          },
        ],
      });
    }
  }, [initialData]);

  const meaningTypes = ["Danh từ", "Động từ", "Tính từ", "Trạng từ", "Khác"];

  // Hàm xử lý cách đọc
  const addReading = () => {
    setFormData({
      ...formData,
      readings: [...formData.readings, ""],
    });
  };

  const removeReading = (readingIndex: number) => {
    if (formData.readings.length > 1) {
      setFormData({
        ...formData,
        readings: formData.readings.filter(
          (_, index) => index !== readingIndex
        ),
      });
    }
  };

  const updateReading = (readingIndex: number, value: string) => {
    const newReadings = [...formData.readings];
    newReadings[readingIndex] = value;
    setFormData({ ...formData, readings: newReadings });
  };

  const addMeaning = () => {
    setFormData({
      ...formData,
      meanings: [
        ...formData.meanings,
        {
          type: "Danh từ",
          content: "", // Thêm content rỗng cho meaning mới
          examples: [
            {
              sentence: "",
              hiragana: "",
              meaning: "",
            },
          ],
        },
      ],
    });
  };

  const removeMeaning = (meaningIndex: number) => {
    if (formData.meanings.length > 1) {
      setFormData({
        ...formData,
        meanings: formData.meanings.filter(
          (_, index) => index !== meaningIndex
        ),
      });
    }
  };

  const addExample = (meaningIndex: number) => {
    const newMeanings = [...formData.meanings];
    newMeanings[meaningIndex].examples.push({
      sentence: "",
      hiragana: "",
      meaning: "",
    });
    setFormData({ ...formData, meanings: newMeanings });
  };

  const removeExample = (meaningIndex: number, exampleIndex: number) => {
    const newMeanings = [...formData.meanings];
    if (newMeanings[meaningIndex].examples.length > 1) {
      newMeanings[meaningIndex].examples = newMeanings[
        meaningIndex
      ].examples.filter((_, index) => index !== exampleIndex);
      setFormData({ ...formData, meanings: newMeanings });
    }
  };

  const updateMeaningType = (meaningIndex: number, type: string) => {
    const newMeanings = [...formData.meanings];
    newMeanings[meaningIndex].type = type;
    setFormData({ ...formData, meanings: newMeanings });
  };

  // Thêm hàm cập nhật content của meaning
  const updateMeaningContent = (meaningIndex: number, content: string) => {
    const newMeanings = [...formData.meanings];
    newMeanings[meaningIndex].content = content;
    setFormData({ ...formData, meanings: newMeanings });
  };

  const updateExample = (
    meaningIndex: number,
    exampleIndex: number,
    field: string,
    value: string
  ) => {
    const newMeanings = [...formData.meanings];
    newMeanings[meaningIndex].examples[exampleIndex] = {
      ...newMeanings[meaningIndex].examples[exampleIndex],
      [field]: value,
    };
    setFormData({ ...formData, meanings: newMeanings });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Điền thông tin từ vựng. Vui lòng bấm lưu xong khi điền xong.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Từ vựng
              </label>
              <input
                type="text"
                value={formData.word}
                onChange={(e) =>
                  setFormData({ ...formData, word: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="朝"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cách đọc
              </label>
              <div className="space-y-2">
                {formData.readings.map((reading, readingIndex) => (
                  <div
                    key={readingIndex}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="text"
                      value={reading}
                      onChange={(e) =>
                        updateReading(readingIndex, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={
                        readingIndex === 0 ? "あさ" : "Cách đọc khác..."
                      }
                    />
                    {formData.readings.length > 1 && (
                      <button
                        onClick={() => removeReading(readingIndex)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addReading}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Thêm cách đọc</span>
                </button>
              </div>
            </div>
          </div>

          {/* Meanings */}
          <div className="space-y-4">
            {formData.meanings.map((meaning, meaningIndex) => (
              <div
                key={meaningIndex}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">
                      Ý nghĩa
                    </span>
                    <select
                      value={meaning.type}
                      onChange={(e) =>
                        updateMeaningType(meaningIndex, e.target.value)
                      }
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {meaningTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formData.meanings.length > 1 && (
                    <button
                      onClick={() => removeMeaning(meaningIndex)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                </div>

                {/* Tạo ô input nhập ở đây */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung ý nghĩa
                  </label>
                  <input
                    type="text"
                    value={meaning.content}
                    onChange={(e) =>
                      updateMeaningContent(meaningIndex, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="buổi sáng"
                  />
                </div>

                {/* Examples */}
                <div className="space-y-3">
                  {meaning.examples.map((example, exampleIndex) => (
                    <div
                      key={exampleIndex}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Ví dụ
                        </span>
                        {meaning.examples.length > 1 && (
                          <button
                            onClick={() =>
                              removeExample(meaningIndex, exampleIndex)
                            }
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Câu
                          </label>
                          <input
                            type="text"
                            value={example.sentence}
                            onChange={(e) =>
                              updateExample(
                                meaningIndex,
                                exampleIndex,
                                "sentence",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="朝、散歩するのが好きです。"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Hiragana
                          </label>
                          <input
                            type="text"
                            value={example.hiragana}
                            onChange={(e) =>
                              updateExample(
                                meaningIndex,
                                exampleIndex,
                                "hiragana",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="あさ、さんぽするのがすきです。"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Ý nghĩa
                          </label>
                          <input
                            type="text"
                            value={example.meaning}
                            onChange={(e) =>
                              updateExample(
                                meaningIndex,
                                exampleIndex,
                                "meaning",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Tôi thích đi dạo vào buổi sáng."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => addExample(meaningIndex)}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={addMeaning}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-gray-600">Thêm ý nghĩa</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default VocabularyModal;
