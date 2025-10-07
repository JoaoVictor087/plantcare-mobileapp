export function validarEmail (email: string): boolean {
    if (!email){
        return false;
    }
    const emailTeste = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailTeste.test(email);
}

//validarSenha
export function validarTamanhoSenha (senha: string): boolean {
    if(!senha){
        return false;
    }
    return senha.length >= 8;
}

export function validarCaracterEspecialSenha(senha: string): boolean {
    if(!senha){
        return false;
    }
    const listaDeCaracteresEspeciais: string[] = ['#', '$', '%', '&', '*', '(', ')', '-', '+', '=',
        '{', '}', '[', ']', ':', ';', '"', '<', '>', ',', '.', '?', '/', '|', '@'];

    for (const caractere of listaDeCaracteresEspeciais) {
        if (senha.includes(caractere)) {
            return true;
        }
    }
    return false;
}

export function validarNumeroSenha(senha: string):boolean {
    if(!senha){
        return false;
    }
    const listaDeNumero:string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    for(const numero of listaDeNumero){
        if(senha.includes(numero)){
            return true
        }
    }
    return false;
}