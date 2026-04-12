/**
 * Credenciais fixas do perfil administrador (acesso local, sem API).
 * Usuário: admin · Senha: admin
 */
export function credenciaisAdminValidas(usuarioOuEmail: string, senha: string): boolean {
  const u = usuarioOuEmail.trim().toLowerCase();
  return u === 'admin' && senha === 'admin';
}
