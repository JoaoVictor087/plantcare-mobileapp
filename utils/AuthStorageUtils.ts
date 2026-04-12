import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ID_KEY = 'userId';
const SESSAO_ADMIN_KEY = 'sessaoAdmin';

interface AuthData {
    accessToken: string;
    refreshToken: string;
    userId: number;
}

export const salvarAuthData = async (data: AuthData) => {
    try {
        await AsyncStorage.removeItem(SESSAO_ADMIN_KEY);
        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        await AsyncStorage.setItem(USER_ID_KEY, data.userId.toString());
    } catch (e) {
        console.error('Falha ao salvar dados de auth', e);
    }
};

export const salvarSessaoAdmin = async () => {
    try {
        await AsyncStorage.setItem(SESSAO_ADMIN_KEY, '1');
    } catch (e) {
        console.error('Falha ao salvar sessão admin', e);
    }
};

export const isSessaoAdmin = async (): Promise<boolean> => {
    try {
        const v = await AsyncStorage.getItem(SESSAO_ADMIN_KEY);
        return v === '1';
    } catch {
        return false;
    }
};

/** Há JWT de usuário comum ou sessão administrador ativa. */
export const temSessaoAtiva = async (): Promise<boolean> => {
    const token = await getAccessToken();
    if (token) return true;
    return isSessaoAdmin();
};

export const limparAuthData = async () => {
    try {
        await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
        await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
        await AsyncStorage.removeItem(USER_ID_KEY);
        await AsyncStorage.removeItem(SESSAO_ADMIN_KEY);
    } catch (e) {
        console.error('Falha ao limpar dados de auth', e);
    }
};

export const getAccessToken = () => AsyncStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => AsyncStorage.getItem(REFRESH_TOKEN_KEY);
export const getUsuarioId = async (): Promise<number | null> => {
    try {
        const id = await AsyncStorage.getItem(USER_ID_KEY);
        return id ? parseInt(id, 10) : null;
    } catch (e) {
        return null;
    }
};