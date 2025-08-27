"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function UploadResumePage() {
  const { id } = useParams();
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    console.log("模板ID:", id);
    console.log("上传的文件:", file);
    // TODO: 后续调用 API 上传文件
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">选择模板 {id} 并上传你的简历</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          上传并继续
        </button>
      </form>
    </div>
  );
}
