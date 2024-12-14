"use client";

import { useEffect, useState } from "react";
import KnowledgeProportionChart from "../components/KnowledgeReport";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar palavras-chave ao carregar a página
  useEffect(() => {
    async function fetchKeywords() {
      try {
        const response = await fetch("/api/keywords");
        const data = await response.json();
        setKeywords(data);
      } catch (err) {
        console.error("Erro ao buscar palavras-chave:", err);
      }
    }
    fetchKeywords();
  }, []);

  // Buscar projetos: todos ou filtrados
  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      setError(null);

      try {
        const endpoint = selectedKeyword
          ? `/api/projects?keywordId=${selectedKeyword}`
          : "/api/projects";
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Erro ao buscar projetos.");
        }
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (err: any) {
        console.error("Erro ao carregar projetos:", err);
        setError(err.message || "Erro ao carregar projetos.");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [selectedKeyword]);

  if (loading) {
    return <p className="text-center text-gray-500">Carregando...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Projetos</h1>
      <KnowledgeProportionChart/>

      {/* Filtro por palavra-chave */}
      <div className="mb-6">
        <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">
          Filtrar Projetos por Palavra-Chave
        </label>
        <select
          id="keyword"
          value={selectedKeyword || ""}
          onChange={(e) => setSelectedKeyword(e.target.value)}
          className="mt-1 block w-full p-2 border rounded-lg"
        >
          <option value="">Todos os Projetos</option>
          {keywords.map((keyword: any) => (
            <option key={keyword.id} value={keyword.id}>
              {keyword.name}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de projetos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {projects.map((project) => (
          <div key={project.id} className="border p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold">{project.name}</h2>
            <p className="text-sm text-gray-600">{project.summary}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.keywords.map((keyword: any) => (
                <span
                  key={keyword.id}
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded-lg text-xs"
                >
                  {keyword.name}
                </span>
              ))}
            </div>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-sm hover:underline mt-4"
            >
              Ver Projeto
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
