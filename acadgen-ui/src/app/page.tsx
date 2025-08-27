"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const templates = [
  { id: 1, name: "Based upon HTML and Markdown", thumbnail: "/thumbnails/template1.png" },
  { id: 2, name: "AcadHomepage (Jekyll)", thumbnail: "/thumbnails/template2.png" },
  { id: 3, name: "Jekyll theme for academics", thumbnail: "/thumbnails/template3.png" },
];

export default function HomePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<null | number>(null);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }
    if (selectedTemplate === null) {
      alert("Please choose a template");
      return;
    }

    console.log("📤 按钮点击，准备调用 /start-task/ API...");

    try {
      const formData = new FormData();
      formData.append("template_id", String(selectedTemplate));
      formData.append("resume", file);

      // 调用后端启动任务
      const startRes = await fetch("http://45.76.1.32:8000/start-task/", {
        method: "POST",
        body: formData,
      });

      if (!startRes.ok) {
        const errorText = await startRes.text();
        console.error("❌ 启动任务失败:", errorText);
        alert("任务启动失败: " + errorText);
        return;
      }

      const { task_id } = await startRes.json();
      console.log(`✅ 任务已启动，task_id=${task_id}`);

      // 直接跳转到 /generating?task_id=xxx
      router.push(`/generating?task_id=${task_id}`);

    } catch (error) {
      console.error("🚨 上传或生成过程出错:", error);
      alert("上传或生成过程出错");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* 顶部导航栏 */}
      <nav className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="text-xl font-bold tracking-wide cursor-pointer"
            onClick={() => setSelectedTemplate(null)}
          >
            AcadGen
          </div>
          <button
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            onClick={() => alert("TODO: GitHub Login")}
          >
            Sign in with GitHub
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="py-20 text-center">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">
          AcadGen — Academic Website Generator
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your resume, choose a template, and instantly generate a professional academic website.
        </p>
      </header>

      {/* 模板展示 */}
      <main className="px-8 pb-16 flex-1">
        <h2 className="text-2xl font-semibold mb-8 text-center">Choose Your Template</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className={`bg-white border ${
                selectedTemplate === tpl.id ? "border-blue-500" : "border-gray-200"
              } rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition cursor-pointer`}
              onClick={() => setSelectedTemplate(tpl.id)}
            >
              <img src={tpl.thumbnail} alt={tpl.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{tpl.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 页脚 */}
      <footer className="py-8 text-center text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} AcadGen. All rights reserved.
      </footer>

      {/* 上传弹窗 */}
      {selectedTemplate !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="mb-4 block w-full border border-gray-300 p-2 rounded"
            />
            {file && (
              <p className="text-sm text-gray-600 mb-4">Selected: {file.name}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-black text-white hover:bg-gray-800 rounded"
              >
                Upload & Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
