"use client";

import ManageDevelopers from "@/app/components/ManageDevelopers";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

async function fetchProject(id: string) {
  const response = await fetch(`/api/projects?id=${id}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar o projeto.");
  }
  return response.json();
}

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [project, setProject] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    summary: "",
    link: "",
    keywords: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProject() {
      try {
        const data = await fetchProject(id);
        setProject(data);
        setForm({
          name: data.name,
          summary: data.summary,
          link: data.link,
          keywords: data.keywords.map((kw: any) => kw.name).join(", "),
        });
      } catch (error) {
        console.error(error);
      }
    }
    loadProject();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const keywords = form.keywords.split(",").map((kw) => kw.trim());
      const response = await fetch(`/api/projects`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: Number(id), ...form, keywords }),
      });

      if (response.ok) {
        setMessage("Projeto atualizado com sucesso!");
        setTimeout(() => router.push("/projects"), 2000);
      } else {
        setMessage("Erro ao atualizar o projeto.");
      }
    } catch (error) {
      setMessage("Erro ao enviar o formulário.");
      console.error("Erro ao enviar o formulário:", error);
    }
  };

  if (!project) {
    return <p className="text-center text-gray-500">Carregando...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <ManageDevelopers projectId={id} />

      <h1 className="text-2xl font-bold mb-6">Editar Projeto</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome do Projeto
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
            Resumo
          </label>
          <textarea
            id="summary"
            name="summary"
            value={form.summary}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700">
            Link
          </label>
          <input
            type="url"
            id="link"
            name="link"
            value={form.link}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
            Palavras-Chave (separadas por vírgulas)
          </label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            value={form.keywords}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Atualizar Projeto
        </button>
        {message && <p className="text-center text-sm text-green-500">{message}</p>}
      </form>

      
    </div>
  );
}
