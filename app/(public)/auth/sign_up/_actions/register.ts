'use server';

import db from '@/lib/db';
import { hashSync } from 'bcrypt-ts';
import { redirect } from 'next/navigation'


export default async function register(formData: FormData) {
    // Extrair os valores do formulário
    const name = formData.get('nome') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Verificar se todos os campos estão preenchidos
    if (!name || !email || !password) {
        throw new Error('Todos os campos devem ser preenchidos!');
    }

    // Verificar se o usuário já existe no banco de dados
    const existingUser = await db.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new Error('Este usuário já está registrado.');
    }

    // Criar o novo usuário no banco de dados
    await db.user.create({
        data: {
            email,
            name,
            password: hashSync(password),
            role: 'USER',
        },
    });

    redirect('/');
}
