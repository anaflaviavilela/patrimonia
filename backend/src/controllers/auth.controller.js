import * as authService from '../services/auth.service.js';

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }

    const user = await authService.registerUser({ name, email, password });
    return res.status(201).json({ message: 'Usuário registado com sucesso!', user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Informe o e-mail e a palavra-passe.' });
    }

    const result = await authService.loginUser({ email, password });
    return res.status(200).json({ message: 'Login efetuado com sucesso!', ...result });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}