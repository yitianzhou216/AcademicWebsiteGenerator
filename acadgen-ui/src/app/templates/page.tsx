"use client";

import Image from "next/image";

const templates = [
  {
    id: 1,
    name: "MIT Academic Website",
    image: "/templates/template1.png",
  },
  {
    id: 2,
    name: "Minimal Academic CV",
    image: "/templates/template2.png",
  },
  {
    id: 3,
    name: "Latex CV Style",
    image: "/templates/template3.png",
  },
];

export default function TemplatesPage() {
  function handleSelectTemplate(templateId: number) {
    alert(`选择了模板 ID: ${templateId}`);
    // 后面这里可以跳转到模板预览/编辑页面
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">选择一个模板</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleSelectTemplate(template.id)}
          >
            <Image
              src={template.image}
              alt={template.name}
              width={400}
              height={250}
              className="object-cover w-full h-48"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{template.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
