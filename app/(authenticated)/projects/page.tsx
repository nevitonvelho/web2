"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      setError(null);

      try {
        const endpoint = showAll ? "/api/projects?all=true" : "/api/projects";
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Erro ao buscar projetos.");
        }

        const { projects, userId } = await response.json();
        setProjects(projects || []);
        setUserId(userId || null);
      } catch (error: any) {
        console.error(error);
        setError(error.message || "Erro ao carregar projetos.");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [showAll]);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Você tem certeza que deseja deletar este projeto?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na API:", errorText);
        throw new Error("Erro ao deletar projeto.");
      }

      setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Erro ao deletar o projeto:", error);
      alert("Erro ao deletar o projeto.");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Carregando projetos...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!projects || projects.length === 0) {
    return <p className="text-center text-gray-500">Nenhum projeto encontrado.</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl">Projetos</h1>
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          {showAll ? "Ver Meus Projetos" : "Ver Todos os Projetos"}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => {
          const canEditOrDelete =
            project.createdBy === userId || project.developers.some((dev: any) => dev.id === userId);

          return (
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
              <div className="mt-4 flex justify-between items-center">
                {canEditOrDelete && (
                  <>
                    <Link
                      href={`/projects/${project.id}/edit`}
                      className="text-blue-500 text-sm hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Deletar
                    </button>
                  </>
                )}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm hover:underline"
                >
                  Ver Projeto
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
