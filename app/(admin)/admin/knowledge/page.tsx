"use client";

import { useState, useEffect } from "react";

// Definição de tipo para um conhecimento
interface Knowledge {
  id: number;
  name: string;
}

export default function ManageKnowledge() {
  const [knowledgeList, setKnowledgeList] = useState<Knowledge[]>([]);
  const [name, setName] = useState("");
  const [editKnowledgeId, setEditKnowledgeId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchKnowledge() {
      try {
        const res = await fetch("/api/knowledge");
        if (!res.ok) throw new Error("Erro ao buscar conhecimentos.");
        const data: Knowledge[] = await res.json();
        setKnowledgeList(data);
      } catch (error) {
        console.error(error);
        setMessage("Erro ao carregar conhecimentos.");
      }
    }
    fetchKnowledge();
  }, []);

  const handleAddOrUpdateKnowledge = async () => {
    if (!name.trim()) {
      setMessage("O nome do conhecimento não pode estar vazio.");
      return;
    }

    const method = editKnowledgeId ? "PUT" : "POST";
    const endpoint = editKnowledgeId
      ? `/api/knowledge/${editKnowledgeId}`
      : "/api/knowledge";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(`Erro: ${errorData.error}`);
        return;
      }

      setMessage(editKnowledgeId ? "Conhecimento atualizado!" : "Conhecimento adicionado!");
      setName("");
      setEditKnowledgeId(null);

      const updatedKnowledge: Knowledge = await res.json();
      if (editKnowledgeId) {
        setKnowledgeList((prev) =>
          prev.map((k) => (k.id === editKnowledgeId ? updatedKnowledge : k))
        );
      } else {
        setKnowledgeList((prev) => [...prev, updatedKnowledge]);
      }
    } catch (error) {
      console.error("Erro ao adicionar/atualizar conhecimento:", error);
      setMessage("Erro ao adicionar/atualizar conhecimento.");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Deseja excluir este conhecimento?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/knowledge/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(`Erro: ${errorData.error}`);
        return;
      }

      setMessage("Conhecimento excluído!");
      setKnowledgeList((prev) => prev.filter((knowledge) => knowledge.id !== id));
    } catch (error) {
      console.error("Erro ao excluir conhecimento:", error);
      setMessage("Erro ao excluir conhecimento.");
    }
  };

  const handleEdit = (knowledge: Knowledge) => {
    setEditKnowledgeId(knowledge.id);
    setName(knowledge.name);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Conhecimentos</h1>

      {message && <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">{message}</div>}

      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editKnowledgeId ? "Editar Conhecimento" : "Adicionar Conhecimento"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddOrUpdateKnowledge();
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome do Conhecimento
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
              {editKnowledgeId ? "Atualizar" : "Adicionar"}
            </button>
          </div>
        </form>
      </div>

      <h2 className="text-xl font-semibold mb-4">Lista de Conhecimentos</h2>
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
            {knowledgeList.map((knowledge) => (
              <tr key={knowledge.id} className="border-t">
                <td className="px-4 py-2 text-sm">{knowledge.name}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => handleEdit(knowledge)}
                    className="text-blue-500 hover:underline mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(knowledge.id)}
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
