"use client";
import React, { useState } from "react";
import { uploadResume } from "@/lib/api"; // 引入我们写的 API 调用函数

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: number;       // 模板 ID（新增）
  templateName: string;
}

export default function UploadModal({ isOpen, onClose, templateId, templateName }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null; // 弹窗关闭状态

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("请先选择文件！");
      return;
    }
    setLoading(true);

    try {
      await uploadResume(templateId, file); // 调用后端接口
      alert("生成完成，已开始下载！");
      onClose();
    } catch (err) {
      console.error(err);
      alert("生成失败，请检查后端日志");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">上传简历到 {templateName}</h2>
        
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="mb-4 block w-full border p-2 rounded"
        />

        {file && <p className="text-sm text-gray-600 mb-4">已选择: {file.name}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            disabled={loading}
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "生成中..." : "上传并生成"}
          </button>
        </div>
      </div>
    </div>
  );
}
