"use client";

import { useEffect, useState } from "react";

export default function KnowledgeReport() {
  const [knowledgeData, setKnowledgeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchKnowledgeReport() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/knowledge/report");
        if (!response.ok) {
          throw new Error("Erro ao carregar dados do relatório.");
        }

        const data = await response.json();
        setKnowledgeData(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Erro ao carregar o relatório.");
      } finally {
        setLoading(false);
      }
    }

    fetchKnowledgeReport();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Carregando...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Relatório de Conhecimentos</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200 shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                Nome do Conhecimento
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                Proporção de Alunos
              </th>
            </tr>
          </thead>
          <tbody>
            {knowledgeData.map((knowledge: any) => (
              <tr key={knowledge.id} className="odd:bg-white even:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700 border-b">
                  {knowledge.name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 border-b">
                  {knowledge.count} alunos
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
