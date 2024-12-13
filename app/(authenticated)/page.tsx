"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) {
          throw new Error("Erro ao buscar projetos");
        }
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div>Carregando projetos...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  // Extrair tags únicas
  const uniqueTags = Array.from(
    new Set(projects.flatMap((project) => project.keywords.map((keyword) => keyword.name)))
  );

  return (
    <div>
      <div className="gap-2 grid grid-cols-4 py-5">
        {/* Tags */}
        <div className="border border-yellow-300 p-4 rounded col-span-1 overflow-hidden">
          <h3 className="mb-3">Tags</h3>
          <div className="flex flex-wrap gap-3">
            {uniqueTags.map((tag, index) => (
              <div
                key={index}
                className="border border-gray-300 text-black font-bold rounded-full py-1 px-2"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Projetos */}
        <div className="col-span-3">
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border h-auto border-yellow-300 rounded"
              >
                <div className="flex justify-between px-5 py-3">
                  <p>{project.name}</p>
                  <div className="border bg-yellow-400 text-black font-bold rounded-full py-1 px-4">
                    {project.keywords.map((keyword) => keyword.name).join(", ")}
                  </div>
                </div>
                <div className="flex bg-yellow-400 px-5 py-3 justify-between rounded-b-xl font-bold">
                  <p>Aluno Responsável: {project.createdBy}</p>
                  <p>{project.summary}</p>
                </div>
                <div className="px-5 py-3">
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    Visitar Projeto
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
