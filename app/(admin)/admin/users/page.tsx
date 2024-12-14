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
      setUsers((prev) => prev.filter((user) => user.id !== id)); // Atualizar lista de usuários localmente
    } else {
      const errorData = await res.json();
      setMessage(`Erro ao excluir usuário: ${errorData.error}`);
    }
  };
  
  

  return (
    <div>
      <h1>Gerenciar Usuários</h1>
      {message && <p>{message}</p>}
      <div>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!editUserId && (
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="USER">Usuário</option>
          <option value="ADMIN">Administrador</option>
        </select>
        <button onClick={handleAddOrUpdateUser}>
          {editUserId ? "Atualizar Usuário" : "Adicionar Usuário"}
        </button>
      </div>

      <h2>Lista de Usuários</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="flex justify-between items-center">
            <div>
              {user.name} - {user.email} - {user.role}
            </div>
            <div>
              <button onClick={() => handleEdit(user)} className="text-blue-500 hover:underline">
                Editar
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="text-red-500 hover:underline ml-2"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
