import type { Metadata } from "next";
import localFont from "next/font/local";
import '@/app/globals.css';
import Link from "next/link";
import SignOutPage from "../components/SignOutPage";
import NavBar from "../components/NavBar";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Portfólio de Engenharia de Software",
  description: "Sistema de portfólio dos alunos do Curso de Engenharia de Software",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const tecnologias = 'Angularjs'

  return (
    <html lang="pt">
      <body 
      >
        <div className="h-[700px] hero">

          <NavBar/>
        
        
        </div>
      
        <div className="max-w-[1200px] m-auto">
          <div className=" ">

            <div className="gap-2 grid grid-cols-4 py-5 ">
              <div className="border border-yellow-300  p-4 rounded  col-span-1 overflow-hidden">
                <h3 className="mb-3">Tags</h3>
                <div className="flex flex-wrap gap-3 ">
                      <div className=" border border-gray-300  text-black font-bold rounded-full py-1 px-2">
                        {tecnologias}
                      </div>
                      <div className=" border border-gray-300  text-black font-bold rounded-full py-1 px-2">
                        {tecnologias}
                      </div>
                      <div className=" border border-gray-300  text-black font-bold rounded-full py-1 px-2">
                        {tecnologias}
                      </div>
                      <div className=" border border-gray-300  text-black font-bold rounded-full py-1 px-2">
                        {tecnologias}
                      </div>
                </div>
              </div>
              <div className="col-span-3">
                <div className="grid grid-cols-1 gap-6">
                  <div className="border h-[100px] border-yellow-300  rounded">
                      <div className="flex justify-between  px-5 py-3">
                        <p>Projeto Babckend</p>
                        <div className=" border border- bg-yellow-400  text-black font-bold rounded-full py-1 px-4">
                          {tecnologias}
                        </div>
                      </div>
                      <div className="flex bg-yellow-400  px-5 py-3 justify-between rounded-b-xl font-bold">
                        <p>Aluno Responsavel: Neviton</p>
                        <p>10/12/24</p>
                      </div>
                  </div>
                  <div className="border h-[100px] border-yellow-300  rounded">
                      <div className="flex justify-between  px-5 py-3">
                        <p>Projeto Babckend</p>
                        <div className=" border border- bg-yellow-400  text-black font-bold rounded-full py-1 px-4">
                          {tecnologias}
                        </div>
                      </div>
                      <div className="flex bg-yellow-400  px-5 py-3 justify-between rounded-b-xl font-bold">
                        <p>Aluno Responsavel: Neviton</p>
                        <p>10/12/24</p>
                      </div>
                  </div>
                  <div className="border h-[100px] border-yellow-300  rounded">
                      <div className="flex justify-between  px-5 py-3">
                        <p>Projeto Babckend</p>
                        <div className=" border border- bg-yellow-400  text-black font-bold rounded-full py-1 px-4">
                          {tecnologias}
                        </div>
                      </div>
                      <div className="flex bg-yellow-400  px-5 py-3 justify-between rounded-b-xl font-bold">
                        <p>Aluno Responsavel: Neviton</p>
                        <p>10/12/24</p>
                      </div>
                  </div>
                  <div className="border h-[100px] border-yellow-300  rounded">
                      <div className="flex justify-between  px-5 py-3">
                        <p>Projeto Babckend</p>
                        <div className=" border border- bg-yellow-400  text-black font-bold rounded-full py-1 px-4">
                          {tecnologias}
                        </div>
                      </div>
                      <div className="flex bg-yellow-400  px-5 py-3 justify-between rounded-b-xl font-bold">
                        <p>Aluno Responsavel: Neviton</p>
                        <p>10/12/24</p>
                      </div>
                  </div>
                  <div className="border h-[100px] border-yellow-300  rounded">
                      <div className="flex justify-between  px-5 py-3">
                        <p>Projeto Babckend</p>
                        <div className=" border border- bg-yellow-400  text-black font-bold rounded-full py-1 px-4">
                          {tecnologias}
                        </div>
                      </div>
                      <div className="flex bg-yellow-400  px-5 py-3 justify-between rounded-b-xl font-bold">
                        <p>Aluno Responsavel: Neviton</p>
                        <p>10/12/24</p>
                      </div>
                  </div>
                  
                  
                </div>
              </div>
          
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
