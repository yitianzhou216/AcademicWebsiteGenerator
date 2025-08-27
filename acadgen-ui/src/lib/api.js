// src/lib/api.js
export async function uploadResume(templateId, file) {
    console.log(`📤 准备上传简历: template_id=${templateId}, file=${file?.name}`);
  
    const formData = new FormData();
    formData.append("template_id", templateId);
    formData.append("resume", file);
  
    try {
      // 1️⃣ 调用 start-task
      console.log("📡 正在调用 API: http://45.76.1.32:8000/start-task/");
      const startRes = await fetch("http://45.76.1.32:8000/start-task/", {
        method: "POST",
        body: formData,
      });
  
      if (!startRes.ok) {
        const errorText = await startRes.text();
        throw new Error(`启动任务失败: ${errorText}`);
      }
  
      const { task_id } = await startRes.json();
      console.log(`✅ 任务已启动，task_id=${task_id}`);
  
      // 2️⃣ 开始轮询任务状态
      const checkInterval = setInterval(async () => {
        const checkRes = await fetch(`http://45.76.1.32:8000/check-task/${task_id}`);
        const checkData = await checkRes.json();
  
        if (checkData.status === "done") {
          clearInterval(checkInterval);
          console.log(`📎 下载链接: ${checkData.download_url}`);
          window.location.href = checkData.download_url;
        } else if (checkData.status === "error") {
          clearInterval(checkInterval);
          console.error(`❌ 任务失败: ${checkData.message}`);
        } else {
          console.log(`⌛ 任务 ${task_id} 仍在进行中...`);
        }
      }, 5000);
  
    } catch (err) {
      console.error("🚨 上传或下载失败:", err);
    }
  }
  