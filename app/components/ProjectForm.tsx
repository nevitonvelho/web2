"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ProjectForm() {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [link, setLink] = useState("");
  const [keywords, setKeywords] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === "loading") {
      setMessage("Carregando sessão, por favor, aguarde...");
      return;
    }

    if (!session?.user?.id) {
      setMessage("Erro: Usuário não autenticado.");
      return;
    }

    const keywordArray = keywords.split(",").map((kw) => kw.trim());
    const userId = parseInt(session.user.id, 10); // Converte o ID para número

    console.log("Dados enviados:", {
      name,
      summary,
      link,
      keywords: keywordArray,
      createdBy: userId,
    });

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          summary,
          link,
          keywords: keywordArray,
          createdBy: userId, // Envia como número
        }),
      });

      if (response.ok) {
        setMessage("Projeto criado com sucesso!");
        setName("");
        setSummary("");
        setLink("");
        setKeywords("");
      } else {
        const errorData = await response.json();
        setMessage(`Erro: ${errorData.error}`);
        console.error("Erro da API:", errorData);
      }
    } catch (error) {
      setMessage("Erro ao enviar a solicitação.");
      console.error("Erro detalhado ao enviar:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="text"
        placeholder="Nome do Projeto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <textarea
        placeholder="Resumo do Projeto"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="url"
        placeholder="Link do Projeto"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="Palavras-chave (separadas por vírgula)"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Cadastrar Projeto
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
