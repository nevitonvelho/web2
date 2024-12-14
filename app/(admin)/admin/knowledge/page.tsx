"use client";

import { useState, useEffect } from "react";

// Definição de tipo para um conhecimento
interface Knowledge {
  id: number;
  name: string;
}

export default function ManageKnowledge() {
  const [knowledgeList, setKnowledgeList] = useState<Knowledge[]>([]); // Define o tipo do estado
  const [name, setName] = useState("");
  const [editKnowledgeId, setEditKnowledgeId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  // Buscar conhecimentos ao carregar o componente
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

  // Adicionar ou atualizar um conhecimento
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

      // Atualiza a lista local sem recarregar a página
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

  // Excluir um conhecimento
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
      setKnowledgeList((prev) => prev.filter((knowledge) => knowledge.id !== id)); // Atualiza a lista local
    } catch (error) {
      console.error("Erro ao excluir conhecimento:", error);
      setMessage("Erro ao excluir conhecimento.");
    }
  };

  // Preencher campos para edição
  const handleEdit = (knowledge: Knowledge) => {
    setEditKnowledgeId(knowledge.id);
    setName(knowledge.name);
  };

  return (
    <div>
      <h1>Gerenciar Conhecimentos</h1>
      {message && <p>{message}</p>}

      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleAddOrUpdateKnowledge}>
        {editKnowledgeId ? "Atualizar" : "Adicionar"}
      </button>

      <ul>
        {knowledgeList.map((knowledge) => (
          <li key={knowledge.id}>
            {knowledge.name}
            <button onClick={() => handleEdit(knowledge)}>Editar</button>
            <button onClick={() => handleDelete(knowledge.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
