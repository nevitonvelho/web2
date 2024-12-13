import Teste from "./Teste"
import AuthCheck from "./AuthCheck"


export default function NavBar(){
    return(
        <>
          <header className="text-white">
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="w-[200px]">
                  <img src="UTFPR_logo.svg" alt="" className="w-full h-full " />
                </div>
                <p className="mt-1.5 text-sm text-gray-500">
                  Projeots alunos de engenharia de software da UTFPR - Dois Viazinhos
                </p>
              </div>

            

              <Teste/>
            </div>
          </div>

            
        </header>
        </>
    )
}