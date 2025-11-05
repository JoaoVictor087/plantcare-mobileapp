import {Cadastro} from "../types/Cadastro";
import {apiClient} from "./apiClient";
import {Login} from "../types/Login";
import {LoginResponse} from "../types/LoginResponse";

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

export async function logarConta(conta: Login): Promise<LoginResponse>  {
    const response = await
        apiClient.post("/auth/login", {
            email: conta.email,
            senha: conta.senha
        });
    return response.data;
}
