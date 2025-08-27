"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function GeneratingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskId = searchParams.get("task_id");

  const [elapsed, setElapsed] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);
  const [taskDone, setTaskDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const previewOpenedRef = useRef(false); // 防止多次打开预览

  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = () => {
    if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    // 每秒更新计时器
    timerRef.current = setInterval(() => setElapsed((prev) => prev + 1), 1000);

    // 轮询任务状态
    checkIntervalRef.current = setInterval(async () => {
      if (!taskId || isCancelled) return;

      try {
        console.log(`🔍 检查任务状态: ${taskId}`);
        const res = await fetch(`http://45.76.1.32:8000/check-task/${taskId}`);
        const data = await res.json();

        if (data.status === "done") {
          cleanup();

          if (data.preview_url) {
            setPreviewUrl(data.preview_url);

            // 只在第一次完成时打开预览
            if (!previewOpenedRef.current) {
              previewOpenedRef.current = true;
              window.open(data.preview_url, "_blank");
            }
          }

          setDownloadUrl(data.download_url || "");
          setTaskDone(true);
        } else if (data.status === "error") {
          cleanup();
          alert("生成失败: " + data.message);
          router.push("/");
        } else if (data.status === "cancelled") {
          cleanup();
          alert("任务已被取消");
          router.push("/");
        }
      } catch (err) {
        console.error("轮询任务失败", err);
      }
    }, 5000);

    return cleanup;
  }, [taskId, router, isCancelled]);

  const handleCancel = async () => {
    if (!taskId) return;
    try {
      setIsCancelled(true);
      cleanup();
      // 调用后端取消任务
      const res = await fetch(`http://45.76.1.32:8000/cancel-task/${taskId}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.status === "ok") {
        alert("任务已取消");
      } else {
        alert("取消失败：" + (data.message || "未知错误"));
      }
    } catch (err) {
      console.error("取消任务失败", err);
      alert("取消任务失败");
    } finally {
      router.push("/"); // 返回首页
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.location.href = downloadUrl;
      router.push("/");
    } else {
      alert("下载链接无效");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
      {!taskDone ? (
        <>
          <h1 className="text-3xl font-bold mb-4">⏳ 正在生成网站...</h1>
          <p className="text-gray-600">预计耗时 2~3 分钟，请耐心等待</p>
          <p className="mt-4 text-sm text-gray-500">已用时：{elapsed} 秒</p>
          <button
            onClick={handleCancel}
            className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            中断生成
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">✅ 网站生成完成</h1>
          {previewUrl && (
            <p className="text-gray-600 mb-4">
              预览已在新窗口打开（
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                点击再次预览
              </a>
              ），请确认内容无误。
            </p>
          )}
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            确认无误，下载 ZIP
          </button>
        </>
      )}
    </div>
  );
}
