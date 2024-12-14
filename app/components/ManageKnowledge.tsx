"use client";

import { useEffect, useState } from "react";

// Definição dos tipos para os dados
interface Knowledge {
  id: number;
  name: string;
}

interface UserKnowledge {
  id: number;
  knowledgeId: number;
  level: number;
  knowledge: Knowledge;
}

export default function ManageKnowledge() {
  const [knowledgeList, setKnowledgeList] = useState<UserKnowledge[]>([]);
  const [availableKnowledge, setAvailableKnowledge] = useState<Knowledge[]>([]);
  const [knowledgeId, setKnowledgeId] = useState<string>("");
  const [level, setLevel] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  // Buscar conhecimentos do usuário e conhecimentos disponíveis
  useEffect(() => {
    async function fetchKnowledge() {
      try {
        const response = await fetch("/api/auth/knowledge");
        if (!response.ok) throw new Error("Erro ao buscar conhecimentos do usuário.");
        const data = await response.json();
        setKnowledgeList(data);
      } catch (error) {
        console.error("Erro ao buscar conhecimentos do usuário:", error);
      }
    }
    fetchKnowledge();

    async function fetchAvailableKnowledge() {
      try {
        const response = await fetch("/api/knowledge");
        if (!response.ok) throw new Error("Erro ao buscar conhecimentos disponíveis.");
        const data = await response.json();
        setAvailableKnowledge(data);
      } catch (error) {
        console.error("Erro ao buscar conhecimentos disponíveis:", error);
      }
    }
    fetchAvailableKnowledge();
  }, []);

  const handleAddOrUpdate = async () => {
    try {
      const response = await fetch("/api/auth/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ knowledgeId: Number(knowledgeId), level }),
      });

      if (response.ok) {
        const updatedKnowledge = await response.json();
        // Atualiza a lista localmente sem recarregar a página
        setKnowledgeList((prev) => {
          const existingIndex = prev.findIndex((k) => k.knowledgeId === updatedKnowledge.knowledgeId);
          if (existingIndex !== -1) {
            prev[existingIndex] = updatedKnowledge;
            return [...prev];
          }
          return [...prev, updatedKnowledge];
        });
        setMessage("Conhecimento atualizado com sucesso!");
      } else {
        const errorData = await response.json();
        setMessage(`Erro: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erro ao adicionar/atualizar conhecimento:", error);
      setMessage("Erro ao adicionar/atualizar conhecimento.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch("/api/auth/knowledge", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ knowledgeId: id }),
      });

      if (response.ok) {
        // Remove o item localmente sem recarregar a página
        setKnowledgeList((prev) => prev.filter((k) => k.knowledgeId !== id));
        setMessage("Conhecimento excluído com sucesso!");
      } else {
        const errorData = await response.json();
        setMessage(`Erro: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erro ao excluir conhecimento:", error);
      setMessage("Erro ao excluir conhecimento.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Gerenciar Conhecimentos</h1>
      {message && <p className="text-green-500">{message}</p>}
      <div className="mb-4">
        <select
          value={knowledgeId}
          onChange={(e) => setKnowledgeId(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Selecione um conhecimento</option>
          {availableKnowledge.map((knowledge) => (
            <option key={knowledge.id} value={knowledge.id}>
              {knowledge.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Nível (0-10)"
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          className="border p-2 rounded w-full mt-2"
          min={0}
          max={10}
        />
        <button
          onClick={handleAddOrUpdate}
          className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
        >
          Adicionar/Atualizar
        </button>
      </div>

      <h2 className="text-xl mb-2">Seus Conhecimentos</h2>
      <ul>
        {knowledgeList.map((k) => (
          <li key={k.id} className="flex justify-between items-center mb-2">
            <div>
              {k?.knowledge?.name || "Desconhecido"} - Nível: {k.level}
            </div>
            <button
              onClick={() => handleDelete(k.knowledgeId)}
              className="text-red-500 hover:underline"
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
