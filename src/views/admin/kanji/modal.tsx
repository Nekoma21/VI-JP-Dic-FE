"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";

interface HanziData {
  character: string;
  hanViet: string[];
  strokeCount: number;
  jlpt: string;
  radical: string;
  onReadings: string[];
  kunReadings: string[];
  meaning?: string; // Add meaning field
}

interface HanziModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: HanziData) => void;
  initialData?: HanziData;
  title?: string;
}

const HanziModal: React.FC<HanziModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  title = "Cập nhật Hán tự",
}) => {
  const getDefaultFormData = (): HanziData => ({
    character: "",
    hanViet: [""],
    strokeCount: 1,
    jlpt: "N5",
    radical: "",
    onReadings: [""],
    kunReadings: [""],
    meaning: "",
  });

  const [formData, setFormData] = useState<HanziData>(getDefaultFormData());

  // Update form data when initialData changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Fill form with initial data for editing
        setFormData({
          character: initialData.character || "",
          hanViet:
            Array.isArray(initialData.hanViet) && initialData.hanViet.length > 0
              ? initialData.hanViet.filter((item) => item.trim() !== "")
              : [""],
          strokeCount: initialData.strokeCount || 1,
          jlpt: initialData.jlpt || "N5",
          radical: initialData.radical || "",
          onReadings:
            Array.isArray(initialData.onReadings) &&
            initialData.onReadings.length > 0
              ? initialData.onReadings.filter((item) => item.trim() !== "")
              : [""],
          kunReadings:
            Array.isArray(initialData.kunReadings) &&
            initialData.kunReadings.length > 0
              ? initialData.kunReadings.filter((item) => item.trim() !== "")
              : [""],
          meaning: initialData.meaning || "",
        });
      } else {
        // Reset form for adding new item
        setFormData(getDefaultFormData());
      }
    }
  }, [isOpen, initialData]);

  const jlptLevels = ["N5", "N4", "N3", "N2", "N1"];

  const addOnReading = () => {
    setFormData({
      ...formData,
      onReadings: [...formData.onReadings, ""],
    });
  };

  const removeOnReading = (index: number) => {
    if (formData.onReadings.length > 1) {
      setFormData({
        ...formData,
        onReadings: formData.onReadings.filter((_, i) => i !== index),
      });
    }
  };

  const updateOnReading = (index: number, value: string) => {
    const newReadings = [...formData.onReadings];
    newReadings[index] = value;
    setFormData({ ...formData, onReadings: newReadings });
  };

  const addKunReading = () => {
    setFormData({
      ...formData,
      kunReadings: [...formData.kunReadings, ""],
    });
  };

  const removeKunReading = (index: number) => {
    if (formData.kunReadings.length > 1) {
      setFormData({
        ...formData,
        kunReadings: formData.kunReadings.filter((_, i) => i !== index),
      });
    }
  };

  const updateKunReading = (index: number, value: string) => {
    const newReadings = [...formData.kunReadings];
    newReadings[index] = value;
    setFormData({ ...formData, kunReadings: newReadings });
  };

  const addHanViet = () => {
    setFormData({
      ...formData,
      hanViet: [...formData.hanViet, ""],
    });
  };

  const removeHanViet = (index: number) => {
    if (formData.hanViet.length > 1) {
      setFormData({
        ...formData,
        hanViet: formData.hanViet.filter((_, i) => i !== index),
      });
    }
  };

  const updateHanViet = (index: number, value: string) => {
    const newHanViet = [...formData.hanViet];
    newHanViet[index] = value;
    setFormData({ ...formData, hanViet: newHanViet });
  };

  const handleSave = () => {
    // Clean up empty values before saving
    const cleanedData = {
      ...formData,
      hanViet: formData.hanViet.filter((item) => item.trim() !== ""),
      onReadings: formData.onReadings.filter((item) => item.trim() !== ""),
      kunReadings: formData.kunReadings.filter((item) => item.trim() !== ""),
    };

    // Ensure at least one empty string if all are removed
    if (cleanedData.hanViet.length === 0) cleanedData.hanViet = [""];
    if (cleanedData.onReadings.length === 0) cleanedData.onReadings = [""];
    if (cleanedData.kunReadings.length === 0) cleanedData.kunReadings = [""];

    onSave(cleanedData);
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Điền thông tin Hán tự. Vui lòng bấm lưu xong khi điền xong.
            </p>
          </div>
          <button
            onClick={handleClose}
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
                value={formData.character}
                onChange={(e) =>
                  setFormData({ ...formData, character: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="私"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                JLPT
              </label>
              <select
                value={formData.jlpt}
                onChange={(e) =>
                  setFormData({ ...formData, jlpt: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {jlptLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stroke Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số nét
            </label>
            <input
              type="number"
              min="1"
              value={formData.strokeCount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  strokeCount: parseInt(e.target.value) || 1,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="1"
            />
          </div>

          {/* Radical */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bộ thủ
            </label>
            <input
              type="text"
              value={formData.radical}
              onChange={(e) =>
                setFormData({ ...formData, radical: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="禾"
            />
          </div>

          {/* Meaning */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ý nghĩa
            </label>
            <input
              type="text"
              value={formData.meaning || ""}
              onChange={(e) =>
                setFormData({ ...formData, meaning: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tôi, ta"
            />
          </div>

          {/* Han Viet Meanings */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Hán Việt
            </label>
            {formData.hanViet.map((meaning, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={meaning}
                  onChange={(e) => updateHanViet(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tư"
                />
                {formData.hanViet.length > 1 && (
                  <button
                    onClick={() => removeHanViet(index)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addHanViet}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center"
            >
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* On Readings */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Âm on
            </label>
            {formData.onReadings.map((reading, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={reading}
                  onChange={(e) => updateOnReading(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="シ"
                />
                {formData.onReadings.length > 1 && (
                  <button
                    onClick={() => removeOnReading(index)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addOnReading}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center"
            >
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Kun Readings */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Âm kun
            </label>
            {formData.kunReadings.map((reading, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={reading}
                  onChange={(e) => updateKunReading(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="わたし"
                />
                {formData.kunReadings.length > 1 && (
                  <button
                    onClick={() => removeKunReading(index)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addKunReading}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center"
            >
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
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

export default HanziModal;
