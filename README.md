# PlantCare 🌿

**Challenge Sprint · FIAP · 2TDSPA**

## Integrantes

| Nome | RM |
|---|---|
| João Victor Alves da Silva | 559726 |
| Vinicius Kenzo Tocuyosi | 559982 |
| Juan Pablo Rebelo Coelho | 560445 |

## Problema

Muitas pessoas perdem plantas por não saber a hora certa de regar, a quantidade de luz ideal ou por não perceberem sinais de doenças a tempo.

## Solução

O **PlantCare** é um app mobile que monitora plantas domésticas via sensores de umidade, temperatura e luminosidade. O app exibe dados em tempo real, gera diagnósticos com IA e calcula um saudômetro com base no histórico de saúde da planta.

## Tecnologias

- React Native + Expo
- TypeScript
- Expo Router
- TanStack Query
- Axios
- Oracle APEX (saudômetro via REST)
- Spring Boot (API backend)
- expo-notifications

## Como executar

```bash
git clone <url-do-repositorio>
cd plantcare-mobileapp
npm install
npx expo start
```

Crie um `.env` baseado no `.env.example` com as URLs da API.

## Variáveis de ambiente

```env
EXPO_PUBLIC_API_BASE_URL=https://plantcare-api.azurewebsites.net/api
EXPO_PUBLIC_APEX_BASE_URL=https://g8e46678d441c4b-plantcare.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/plantcare
EXPO_PUBLIC_COMMIT_HASH=<hash_do_commit>
```

## Download do Aplicativo

📱 [Baixar APK via Firebase App Distribution](<https://appdistribution.firebase.google.com/testerapps/1:1069984391798:android:e1b990e7553f8eef97f557/releases/40jmk6o44b32o?utm_source=firebase-console>)

## Vídeo de Apresentação

🎬 [Assistir no YouTube](<https://youtu.be/CL6F1k3NWEc>)
