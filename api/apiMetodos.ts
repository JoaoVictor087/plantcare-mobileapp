import {Cadastro} from "../types/Cadastro";
import {Login} from "../types/Login";
import {AuthResponse} from "../types/LoginResponse";
import apiClient from "./apiClient";

export async function criarConta(conta: Cadastro): Promise<Cadastro> {
    const response = await
        apiClient.post("/auth/criarConta",
            {
                nome: conta.nome,
                email: conta.email,
                senha: conta.senha,
            });
    return response.data;
}

export async function logarConta(conta: Login): Promise<AuthResponse> {
    try {
        const response = await
            apiClient.post<AuthResponse>("/auth/login", conta)
        return response.data;
    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
}
