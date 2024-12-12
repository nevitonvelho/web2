'use client';
import Link from "next/link";
import register from "./_actions/register";
import { useEffect, useState } from "react";

export default function Cadastro() {

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Isso garante que o código seja executado apenas no cliente
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Retorna nada ou uma estrutura vazia enquanto aguarda a hidratação no cliente
  }


    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white to-yellow-200 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Crie sua Conta</h1>
            <p className="mt-2 text-sm text-gray-500">
              Preencha os campos abaixo para se cadastrar.
            </p>
          </div>
  
          <form action={register} className="space-y-4">
            <div>
              <label htmlFor="nome" className="sr-only">Nome</label>
              <input
                name="nome"
                type="text"
                id="nome"
                className="w-full rounded-lg border-gray-300 p-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite seu nome"
              />
            </div>
  
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full rounded-lg border-gray-300 p-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite seu email"
              />
            </div>
  
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                name="password"
                type="password"
                id="password"
                className="w-full rounded-lg border-gray-300 p-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite sua senha"
              />
            </div>
  
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Já possui uma conta? <Link href={'/auth/sign_in'} className="text-yellow-500 hover:underline">Entrar</Link> 
              </p>
         
              <button
                type="submit"
                className="inline-block rounded-lg bg-yellow-500 px-5 py-3 text-sm font-medium text-white"
              >
                Registrar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  