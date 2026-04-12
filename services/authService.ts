import apiClient from '../api/apiClient';
import type { Cadastro } from '../types/Cadastro';
import type { Login } from '../types/Login';
import type { AuthResponse } from '../types/LoginResponse';

export async function criarConta(conta: Cadastro): Promise<Cadastro> {
  const response = await apiClient.post('/auth/criarConta', {
    nome: conta.nome,
    email: conta.email,
    senha: conta.senha,
  });
  return response.data;
}

export async function logarConta(conta: Login): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', conta);
  return response.data;
}
