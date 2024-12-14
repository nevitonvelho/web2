"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
        setError(err.message || "Erro ao carregar o gráfico.");
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
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={knowledgeData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
