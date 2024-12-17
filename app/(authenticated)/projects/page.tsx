"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/projects?user=true"); // Busca apenas os projetos do usuário
        if (!response.ok) {
          throw new Error("Erro ao buscar projetos.");
        }

        const { projects } = await response.json();
        setProjects(projects || []);
      } catch (error: any) {
        console.error(error);
        setError("Erro ao carregar projetos.");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []); // Carrega os projetos ao montar o componente

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Você tem certeza que deseja excluir este projeto?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar projeto.");
      }

      setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar o projeto.");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Carregando projetos...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (projects.length === 0) {
    return <p className="text-center text-gray-500">Você ainda não possui projetos.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-6">Meus Projetos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="border p-4 rounded-lg shadow-sm relative">
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

            <div className="absolute top-2 right-3">
              <button data-modal-target="default-modal" data-modal-toggle="default-modal" className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                Adicionar Desenvolvedores
              </button>
            </div>

            <div id="default-modal"  aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                   dfff
                </div>
            </div>

            
            <div className="mt-4 flex justify-between items-center">
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
        ))}
      </div>
    </div>
  );
}
