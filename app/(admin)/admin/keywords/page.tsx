"use client";

import { useState, useEffect } from "react";

export default function ManageKeywords() {
  const [keywords, setKeywords] = useState<any[]>([]); // Inicializado como array
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
          setKeywords([]); // Se a resposta não for um array, define como vazio
        }
      } catch (error) {
        console.error("Erro ao buscar palavras-chave:", error);
        setKeywords([]); // Em caso de erro, define como vazio
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
        window.location.reload();
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
    <div>
      <h1>Gerenciar Palavras-Chave</h1>
      {message && <p>{message}</p>}

      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleAddOrUpdateKeyword}>
        {editKeywordId ? "Atualizar" : "Adicionar"}
      </button>

      <ul>
        {Array.isArray(keywords) && // Verifica se `keywords` é um array
          keywords.map((keyword: any) => (
            <li key={keyword.id}>
              {keyword.name}
              <button onClick={() => handleEdit(keyword)}>Editar</button>
              <button onClick={() => handleDelete(keyword.id)}>Excluir</button>
            </li>
          ))}
      </ul>
    </div>
  );
}
