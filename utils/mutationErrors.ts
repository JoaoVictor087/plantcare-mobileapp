export function mensagemErroMutacao(error: unknown): string {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    (error as { code?: string }).code === 'OFFLINE'
  ) {
    return 'Sem conexão. Conecte-se à internet para enviar alterações ao servidor.';
  }
  return 'Não foi possível concluir a operação. Tente novamente.';
}
