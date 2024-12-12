
import { auth } from "@/auth"


import Link from "next/link";
import SignOutPage from "./SignOutPage";

export default async  function Teste(){
    const session = await auth()

    if (!session?.user) {
        return(
            <>
                <div className="flex items-center gap-4">
    
                    <Link href={'/api/auth/signin'}>
                    <button
                        className="inline-flex items-center justify-center gap-1.5 rounded border border-gray-200 bg-black px-5 py-3 text-gray-900 transition hover:text-gray-700 focus:outline-none focus:ring"
                        type="button"
                    >
                        <span className="text-sm font-medium">Acessar conta</span>
                    </button>
                    </Link>
                </div>
            </>
        )
    }else{
        return(
            <>
                <SignOutPage/>
            </>
        )
    }

    
}