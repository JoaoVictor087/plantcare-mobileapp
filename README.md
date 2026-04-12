# PlantCare 🌿

**Challenge Sprint - FIAP - 2TDSPA**

Aplicativo móvel para acompanhar o cuidado com plantas: cadastro de espécies, visão geral no painel, registro de cuidados integrado ao **Oracle APEX** via API REST e autenticação real contra o backend do grupo.

## Integrantes

| Nome | RM |
|------|-----|
| João Victor Alves da Silva | 559726 |
| Vinicius Kenzo Tocuyosi | 559982 |
| Juan Pablo Rebelo Coelho | 560445 |

## Problema

Muitas pessoas esquecem de regar, podar ou observar sinais de estresse nas plantas domésticas. Informações dispersas e falta de histórico dificultam manter um calendário de cuidados coerente com cada espécie.

## Solução proposta

O **PlantCare** centraliza o cadastro de plantas (API principal em HTTP), exibe um **dashboard** com dados vindos do servidor (sem mocks na interface) e oferece uma área de **cuidados** cujo **CRUD** é feito contra uma **API REST publicada pelo Oracle APEX**, onde ficam regras e persistência desse fluxo. O app usa **Expo Router** (rotas explícitas), **TanStack Query** para leitura/atualização de cache após mutações, **tema claro/escuro** persistido e **login** com tokens armazenados de forma segura (AsyncStorage).

## Tecnologias

- React Native / Expo (~54)
- TypeScript
- Expo Router (navegação por arquivos e rotas declaradas)
- TanStack Query (`useQuery`, `useMutation`)
- Axios (cliente HTTP da API principal e do endpoint APEX)
- AsyncStorage (sessão e preferência de tema)
- Oracle APEX (funcionalidade de cuidados exposta via REST — configurar URL no ambiente)

## Telas (rotas) principais

1. `app/index` — checagem de sessão e redirecionamento
2. `app/(auth)/login` — autenticação
3. `app/(auth)/cadastro` — criação de conta
4. `app/(tabs)/dashboard` — resumo com dados da API de plantas
5. `app/(tabs)/my_plants` — lista e criação de plantas
6. `app/plant/[id]` — leitura, atualização e exclusão de uma planta
7. `app/(tabs)/cuidados-apex` — CRUD de cuidados via API do APEX
8. `app/(tabs)/options` — tema e logout

## Como executar

### Pré-requisitos

- Node.js (LTS recomendado)
- Conta Expo / Expo Go no dispositivo (ou emulador)

### Passos

```bash
git clone <url-do-repositorio>
cd plantcare-mobileapp
npm install
```

Opcional: copie `.env.example` para `.env` e ajuste as URLs da API e do APEX.

```bash
npx expo start
```

Escaneie o QR code no Expo Go ou use `a` / `i` para Android / iOS no emulador.

### Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `EXPO_PUBLIC_API_BASE_URL` | Base da API principal (Spring), ex.: `http://host:8080/api` |
| `EXPO_PUBLIC_APEX_BASE_URL` | Base da coleção REST dos cuidados no APEX (ORDS ou proxy), sem barra final opcional |

O valor padrão no código aponta para o host de desenvolvimento do grupo; **o módulo APEX deve expor GET/POST/PUT/DELETE** compatíveis com o serviço em `services/apexCuidadosService.ts` (corpo JSON com `planta_id`, `tipo_cuidado`, `observacao` — ajustável conforme o contrato real do ORDS).

## Vídeo de apresentação (Sprint 3)

**Substitua o link abaixo pelo vídeo publicado no YouTube** (máx. 5 minutos, com narração e app em execução real):

- [Vídeo de apresentação — PlantCare Sprint 3](https://www.youtube.com/watch?v=SUBSTITUIR_PELO_ID_DO_VIDEO)

No vídeo deve aparecer: navegação entre telas, login, chamadas à API, uso da funcionalidade APEX e comportamento real do aplicativo.

## Organização do código

- `app/` — telas e layouts (Expo Router), sem chamadas HTTP diretas
- `components/` — UI reutilizável
- `hooks/` — hooks do TanStack Query e reutilização de lógica de dados
- `services/` — regras de chamada e mapeamento das APIs
- `api/` — instâncias Axios (cliente principal e cliente APEX)
- `context/` — tema claro/escuro
- `providers/` — `QueryClient` e composição de providers
- `types/` — tipos TypeScript compartilhados
