export interface Planta {
    id: number;
    nome: string;
    especie: string;
    dataCadastro: Date;
    dataAtualizacao?: Date;
    imgLink?: string;
    umidade: number;
    temperatura: number;
    luminosidade: number;
    status: string;
}