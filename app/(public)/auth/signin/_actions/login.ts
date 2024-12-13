'use server'

import { signIn } from "@/auth"
import { redirect } from "next/navigation";


export default async function login (FormData: FormData){
    const {email, password} = Object.fromEntries(FormData.entries())

    console.log({email, password})

    await signIn('credentials', {email, password});

    redirect('/')
}