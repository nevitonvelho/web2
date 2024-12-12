import Image from "next/image";
import Link from "next/link";
import login from "./_actions/login";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-white to-yellow-200 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Bem-vindo ao Portfólio</h1>
          <p className="mt-2 text-sm text-gray-500">
            Acesse para ver e compartilhar projetos dos alunos de Engenharia de Software.
          </p>
        </div>
        {' '}
        <form action={login} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <input
                name="email"
                type="email"
                className="w-full rounded-lg border-gray-300 p-4 pr-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite seu email"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zM16 12v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <input
                name="password"
                type="password"
                className="w-full rounded-lg border-gray-300 p-4 pr-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite sua senha"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Não tem conta? <Link href={'/auth/sign_up'} className="text-yellow-500 hover:underline">Cadastre-se</Link>
            </p>
            <button
              type="submit"
              className="inline-block rounded-lg bg-yellow-500 px-5 py-3 text-sm font-medium text-white  transition"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
