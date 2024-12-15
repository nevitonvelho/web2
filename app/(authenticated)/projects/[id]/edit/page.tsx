"use client";

import ManageDevelopers from "@/app/components/ManageDevelopers";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Label, TextInput, Textarea, Button, Alert } from "flowbite-react";

async function fetchProject(id: string) {
  const response = await fetch(`/api/projects/${id}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar o projeto.");
  }
  return response.json();
}

export default function EditProjectPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const router = useRouter();

  const [params, setParams] = useState<{ id: string } | null>(null);
  const [project, setProject] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    summary: "",
    link: "",
    keywords: "",
  });
  const [message, setMessage] = useState("");

  // Descompactar `params`
  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await paramsPromise;
      setParams(resolvedParams);
    }
    loadParams();
  }, [paramsPromise]);

  // Carregar o projeto com base nos `params`
  useEffect(() => {
    async function loadProject() {
      if (!params?.id) return;

      try {
        const data = await fetchProject(params.id);
        setProject(data);
        setForm({
          name: data.name,
          summary: data.summary,
          link: data.link,
          keywords: data.keywords.map((kw: any) => kw.name).join(", "),
        });
      } catch (error) {
        console.error("Erro ao carregar o projeto:", error);
      }
    }
    loadProject();
  }, [params]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!params?.id) return;

    try {
      const keywords = form.keywords.split(",").map((kw) => kw.trim());
      const response = await fetch(`/api/projects`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: Number(params.id), ...form, keywords }),
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
      {/* Gerenciamento de Desenvolvedores */}
      <ManageDevelopers projectId={params?.id || ""} />

      <h1 className="text-2xl font-bold mb-6">Editar Projeto</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Nome do Projeto */}
        <div>
          <Label htmlFor="name" value="Nome do Projeto" />
          <TextInput
            id="name"
            name="name"
            type="text"
            placeholder="Digite o nome do projeto"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Resumo */}
        <div>
          <Label htmlFor="summary" value="Resumo do Projeto" />
          <Textarea
            id="summary"
            name="summary"
            placeholder="Descreva o resumo do projeto"
            value={form.summary}
            onChange={handleChange}
            required
          />
        </div>

        {/* Link */}
        <div>
          <Label htmlFor="link" value="Link do Projeto" />
          <TextInput
            id="link"
            name="link"
            type="url"
            placeholder="https://exemplo.com"
            value={form.link}
            onChange={handleChange}
            required
          />
        </div>

        {/* Palavras-Chave */}
        <div>
          <Label htmlFor="keywords" value="Palavras-Chave (separadas por vírgulas)" />
          <TextInput
            id="keywords"
            name="keywords"
            type="text"
            placeholder="Exemplo: inovação, tecnologia, IA"
            value={form.keywords}
            onChange={handleChange}
          />
        </div>

        {/* Botão de Submissão */}
        <Button type="submit" color="blue">
          Atualizar Projeto
        </Button>

        {/* Mensagem de Feedback */}
        {message && (
          <Alert color={message.includes("sucesso") ? "success" : "failure"} className="mt-4">
            {message}
          </Alert>
        )}
      </form>
    </div>
  );
}
