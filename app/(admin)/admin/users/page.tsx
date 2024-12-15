"use client";

import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    }
    fetchUsers();
  }, []);

  const handleAddOrUpdateUser = async () => {
    if (!name || !email || (!editUserId && (!password || password.length < 6))) {
      setMessage("Preencha todos os campos obrigatórios. A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const method = editUserId ? "PUT" : "POST";
    const endpoint = editUserId ? `/api/users/${editUserId}` : "/api/users";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (res.ok) {
      setMessage(editUserId ? "Usuário atualizado com sucesso!" : "Usuário criado com sucesso!");
      setName("");
      setEmail("");
      setPassword("");
      setRole("USER");
      setEditUserId(null);
      const updatedUsers = await fetch("/api/users");
      setUsers(await updatedUsers.json());
    } else {
      const errorData = await res.json();
      setMessage(`Erro: ${errorData.error}`);
    }
  };

  const handleEdit = (user: User) => {
    setEditUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setPassword(""); // Por segurança, não exibe a senha existente
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Tem certeza de que deseja excluir este usuário?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setMessage("Usuário excluído com sucesso!");
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } else {
      const errorData = await res.json();
      setMessage(`Erro ao excluir usuário: ${errorData.error}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Usuários</h1>

      {message && <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">{message}</div>}

      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">{editUserId ? "Editar Usuário" : "Adicionar Usuário"}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddOrUpdateUser();
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded shadow-sm"
            />
          </div>
          {!editUserId && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded shadow-sm"
              />
            </div>
          )}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Papel
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded shadow-sm"
            >
              <option value="USER">Usuário</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              {editUserId ? "Atualizar" : "Adicionar"}
            </button>
          </div>
        </form>
      </div>

      <h2 className="text-xl font-semibold mb-4">Lista de Usuários</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Nome</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Papel</th>
              <th className="px-4 py-2 text-right text-sm font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2 text-sm">{user.name}</td>
                <td className="px-4 py-2 text-sm">{user.email}</td>
                <td className="px-4 py-2 text-sm">{user.role}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-500 hover:underline mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
