import {Cadastro} from "../types/Cadastro";
import {Login} from "../types/Login";
import {AuthResponse} from "../types/LoginResponse";
import apiClient from "./apiClient";
import {Planta} from "../types/Planta";

interface PlantaDTO {
    id: number;
    nome: string;
    especie: string;
    dataCadastro: Date;
    dataAtualizacao?: Date;
    imgLink?: string;
    umidade?: number;
    temperatura?: number;
    status?: string;
}

interface HateoasResponse {
    _embedded: {
        plantaResponseDTOList: PlantaDTO[];
    };
    _links: any;
}

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

export const buscarPlantasPorUsuario = async (): Promise<PlantaDTO[]> => {
    try {
        const response = await apiClient.get<HateoasResponse>('/plantas');

        const listaDePlantasDTO = response.data?._embedded?.plantaResponseDTOList;

        if (!listaDePlantasDTO) {
            return [];
        }

        const plantasMapeadas: Planta[] = listaDePlantasDTO.map(dto => {
            return {
                id: dto.id,
                nome: dto.nome,
                especie: dto.especie,
                dataCadastro: dto.dataCadastro,
                dataAtualizacao: dto.dataAtualizacao,
                umidade: dto.umidade ?? 0,
                temperatura: dto.temperatura ?? 0,
                status: dto.status ?? 'N/A',
                imgLink: dto.imgLink
            };
        });

        return plantasMapeadas;

    } catch (error) {
        console.error('Erro ao buscar plantas:', error);
        throw error;
    }
}


