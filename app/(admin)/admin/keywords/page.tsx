"use client";

import { useState, useEffect } from "react";

export default function ManageKeywords() {
  const [keywords, setKeywords] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [editKeywordId, setEditKeywordId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchKeywords() {
      try {
        const res = await fetch("/api/keywords");
        const data = await res.json();
        if (Array.isArray(data)) {
          setKeywords(data);
        } else {
          console.error("Resposta inesperada da API:", data);
          setKeywords([]);
        }
      } catch (error) {
        console.error("Erro ao buscar palavras-chave:", error);
        setKeywords([]);
      }
    }
    fetchKeywords();
  }, []);

  const handleAddOrUpdateKeyword = async () => {
    const method = editKeywordId ? "PUT" : "POST";
    const endpoint = editKeywordId
      ? `/api/keywords/${editKeywordId}`
      : "/api/keywords";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setMessage(editKeywordId ? "Palavra-chave atualizada!" : "Palavra-chave adicionada!");
        setName("");
        setEditKeywordId(null);
        const updatedKeywords = await fetch("/api/keywords");
        setKeywords(await updatedKeywords.json());
      } else {
        const errorData = await res.json();
        setMessage(`Erro: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erro ao adicionar/atualizar palavra-chave:", error);
      setMessage("Erro ao adicionar/atualizar palavra-chave.");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Deseja excluir esta palavra-chave?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/keywords/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage("Palavra-chave excluída!");
        setKeywords((prev) => prev.filter((keyword) => keyword.id !== id));
      } else {
        const errorData = await res.json();
        setMessage(`Erro: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erro ao excluir palavra-chave:", error);
      setMessage("Erro ao excluir palavra-chave.");
    }
  };

  const handleEdit = (keyword: any) => {
    setEditKeywordId(keyword.id);
    setName(keyword.name);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Palavras-Chave</h1>

      {message && <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">{message}</div>}

      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editKeywordId ? "Editar Palavra-Chave" : "Adicionar Palavra-Chave"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddOrUpdateKeyword();
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome da Palavra-Chave
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded shadow-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              {editKeywordId ? "Atualizar" : "Adicionar"}
            </button>
          </div>
        </form>
      </div>

      <h2 className="text-xl font-semibold mb-4">Lista de Palavras-Chave</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Nome
              </th>
              <th className="px-4 py-2 text-right text-sm font-semibold text-gray-600">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((keyword) => (
              <tr key={keyword.id} className="border-t">
                <td className="px-4 py-2 text-sm">{keyword.name}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => handleEdit(keyword)}
                    className="text-blue-500 hover:underline mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(keyword.id)}
                    className="text-red-500 hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
