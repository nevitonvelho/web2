"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Label, TextInput, Textarea, Button, Alert } from "flowbite-react";

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
    const userId = parseInt(session.user.id, 10);

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
          createdBy: userId,
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Cadastrar Projeto</h1>
      
      {/* Nome do Projeto */}
      <div>
        <Label htmlFor="name" value="Nome do Projeto" />
        <TextInput
          id="name"
          type="text"
          placeholder="Digite o nome do projeto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Resumo */}
      <div>
        <Label htmlFor="summary" value="Resumo do Projeto" />
        <Textarea
          id="summary"
          placeholder="Descreva o resumo do projeto"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        />
      </div>

      {/* Link */}
      <div>
        <Label htmlFor="link" value="Link do Projeto" />
        <TextInput
          id="link"
          type="url"
          placeholder="https://exemplo.com"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
      </div>

      {/* Palavras-chave */}
      <div>
        <Label htmlFor="keywords" value="Palavras-chave (separadas por vírgula)" />
        <TextInput
          id="keywords"
          type="text"
          placeholder="Exemplo: tecnologia, inovação, IA"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          required
        />
      </div>

      {/* Botão de Submissão */}
      <Button type="submit" color="blue">
        Cadastrar Projeto
      </Button>

      {/* Mensagem de feedback */}
      {message && (
        <Alert color={message.includes("Erro") ? "failure" : "success"}>
          {message}
        </Alert>
      )}
    </form>
  );
}
