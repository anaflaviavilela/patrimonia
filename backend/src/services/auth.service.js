// backend/src/services/auth.service.js

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { sendWelcomeEmail } from './email.services.js';

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_padrao_jwt';

export async function registerUser({ name, email, password }) {
  // Verifica se o e-mail já está cadastrado
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Este e-mail já está em uso.');
  }

  // Hash da palavra-passe (senha)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Cria o usuário no banco de dados usando password_hash conforme o schema
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password_hash: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      created_at: true,
    },
  });

  // Dispara o e-mail de boas-vindas (assíncrono, sem bloquear o fluxo principal)
  sendWelcomeEmail(user.email, user.name);

  return { user };
}

export async function loginUser({ email, password }) {
  // Busca o usuário pelo e-mail
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Credenciais inválidas.');
  }

  // Valida a palavra-passe usando password_hash
  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    throw new Error('Credenciais inválidas.');
  }

  // Gera o token JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}