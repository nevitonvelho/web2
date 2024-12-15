"use client";


import { useSession } from "next-auth/react";
import Link from "next/link"


export default function NavBar(){
  const { data: session, status } = useSession();

    return(
        <>
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                <img src="logo.svg" className="h-8" alt="Logo" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">| WEB2</span>
            </Link>
            <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
               
            </button>
            <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {status === "authenticated" ? (
                <>
                  <Link
                    href="/projects"
                    className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                  >
                    Meus Projetos
                  </Link>
                  <Link
                    href="/projects/new"
                    className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                  >
                    Criar Projeto
                  </Link>
                  <Link
                    href="/user"
                    className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                  >
                    Sua Conta
                  </Link>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                >
                  Logar
                </Link>
              )}
            </ul>
            </div>
          </div>
        </nav>

          <header className="text-white">
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          
                <div className="w-[200px]">
                  <img src="https://coens.dv.utfpr.edu.br/site/wp-content/themes/flaton/images/sfwpreto.png" alt="" className="w-full h-full " />
                </div>
                <p className="mt-2.5 text-[22px] font-bold text-sm text-gray-500">
                  Projetos alunos de engenharia de software da UTFPR - Dois Viazinhos
                </p>
            </div>
          </div>

            
        </header>
        </>
    )
}