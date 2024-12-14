"use client";

import { useState } from "react";

export default function ManageDevelopers({ projectId }: { projectId: string }) {
  const [developerId, setDeveloperId] = useState("");
  const [message, setMessage] = useState("");

  const handleAddDeveloper = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/addDeveloper`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: parseInt(developerId, 10) }),
      });

      if (response.ok) {
        setMessage("Desenvolvedor adicionado com sucesso!");
      } else {
        const errorData = await response.json();
        setMessage(`Erro: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erro ao adicionar desenvolvedor:", error);
      setMessage("Erro ao adicionar desenvolvedor.");
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Gerenciar Desenvolvedores</h2>
      <input
        type="text"
        placeholder="ID do Desenvolvedor"
        value={developerId}
        onChange={(e) => setDeveloperId(e.target.value)}
        className="border p-2 rounded mb-4"
      />
      <button
        onClick={handleAddDeveloper}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
      >
        Adicionar Desenvolvedor
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  );
}
