import { useMutation } from '@tanstack/react-query';
import * as authService from '../services/authService';
import { salvarAuthData } from '../utils/AuthStorageUtils';
import type { Cadastro } from '../types/Cadastro';
import type { Login } from '../types/Login';

export function useLoginMutation() {
  return useMutation({
    mutationFn: (credenciais: Login) => authService.logarConta(credenciais),
    onSuccess: async (data) => {
      await salvarAuthData(data);
    },
  });
}

export function useCadastroMutation() {
  return useMutation({
    mutationFn: (dados: Cadastro) => authService.criarConta(dados),
  });
}
