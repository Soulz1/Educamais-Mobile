# EducaMais Mobile

Cliente mobile para a plataforma EducaMais construído com Expo / React Native.

## 📋 Funcionalidades

- ✅ Autenticação (Login/Cadastro com armazenamento seguro de token)
- ✅ Feed de Posts com busca e rolagem infinita
- ✅ Detalhes de Posts
- ✅ Painel Admin para Professores (Criar/Editar/Excluir Posts)

## 🛠️ Stack

- **React Native** com **Expo** (SDK 54)
- **TypeScript** (modo estrito)
- **React Navigation** (Stack Navigator)
- **TanStack Query** (React Query) para busca e cache de dados
- **React Hook Form** + **Zod** para validação de formulários
- **Expo Secure Store** para armazenamento seguro de tokens
- **Axios** para requisições HTTP

## 📋 Requisitos

- Node.js (v18+ recomendado)
- npm ou yarn
- Android Studio (para emulador Android) ou Xcode (para iOS)
- Expo CLI (opcional, mas útil): `npm install -g expo-cli`

## 🚀 Instalação

### 1. Clonar o repositório
   ```bash
   git clone <repository-url>
   cd Educamais-Mobile
   ```

### 2. Instalar dependências
   ```bash
   npm ci
   # ou
   npm install
   ```

### 3. Configurar variáveis de ambiente
   
   Copie `.env.example` para `.env` e configure a URL da API:
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` e defina a URL da sua API backend:
   ```env
   EXPO_PUBLIC_API_URL=http://192.168.x.x:3333
   ```
   
   **Importante**: Para emulador Android, use o endereço IP da sua máquina na rede local (não use `localhost`).

## 🏃 Executando o App

### Iniciar o Metro bundler
```bash
npm start
# ou
npx expo start
```

### Executar no Emulador Android

1. **Inicie o Android Studio e abra um emulador Android**

2. **Execute o app**
   ```bash
   npm run android
   # ou
   npx expo start --android
   ```

### Executar no Simulador iOS (somente macOS)

```bash
npm run ios
# ou
npx expo start --ios
```

### Executar em Dispositivo Físico

1. Instale o app **Expo Go** no seu dispositivo
2. Escaneie o código QR mostrado no terminal após executar `npm start`

## 🔐 Autenticação

O app usa armazenamento seguro de tokens via **expo-secure-store**. Após login bem-sucedido, o token da sessão é armazenado de forma segura e automaticamente incluído em todas as requisições à API.

### Papéis Disponíveis
- **teacher**: Pode criar, editar e excluir posts
- **student**: Pode visualizar posts (operações CRUD restritas)

## 📱 Estrutura do App

```
src/
├── components/          # Componentes UI reutilizáveis
│   └── common/         # Button, Input, Loader, EmptyState, ErrorState
├── contexts/           # Contextos React (AuthContext)
├── features/           # Código específico de funcionalidades
│   ├── students/       # Funcionalidades de alunos (scaffold)
│   └── teachers/       # Funcionalidades de professores (scaffold)
├── hooks/              # Hooks React customizados (usePosts, useDebounce)
├── services/           # Serviços de API (api, auth, storage, posts)
└── types/              # Tipos TypeScript e schemas Zod

app/
└── screens/            # Componentes de tela
    ├── Home/          # Tela de feed com busca e rolagem infinita
    ├── Login/         # Tela de autenticação
    ├── PostDetail/    # Tela de detalhes do post
    └── admin/         # Telas de admin (somente professores)
        ├── PostsList/
        ├── PostCreate/
        └── PostEdit/
```

## 🌐 Integração com API

O app espera os seguintes endpoints no backend:

### Autenticação
- `POST /api/auth/sign-in/email` - Fazer login
- `POST /api/auth/sign-up/email` - Fazer cadastro
- `POST /api/auth/sign-out` - Fazer logout

### Posts
- `GET /api/posts?page=1&limit=10&q=search` - Listar posts (com paginação e busca)
- `GET /api/posts/:id` - Obter detalhes do post
- `POST /api/posts` - Criar post (somente professores)
- `PUT /api/posts/:id` - Atualizar post (somente professores)
- `DELETE /api/posts/:id` - Deletar post (somente professores)

## 🧪 Desenvolvimento

### Linting
```bash
npm run lint
```

### Verificação de Tipos
TypeScript está configurado com `strict: true` para máxima segurança de tipos.

## 🔧 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `EXPO_PUBLIC_API_URL` | URL base da API backend | `http://192.168.1.100:3333` |

### Encontrando seu Endereço IP Local

**Windows (PowerShell)**:
```powershell
ipconfig
# Procure por "Endereço IPv4" no adaptador de rede ativo
```

**macOS/Linux**:
```bash
ifconfig | grep "inet "
# Procure pelo IP da sua rede local (geralmente começa com 192.168.x.x)
```

Então use este IP no seu arquivo `.env`:
```env
EXPO_PUBLIC_API_URL=http://192.168.x.x:3333
```

## 📝 Como Usar

### Fluxo de Login
1. Abra o app
2. Digite email e senha
3. Clique em "Entrar" para fazer login ou "Cadastre-se" para criar uma conta
4. Após autenticação bem-sucedida, você será redirecionado para o Feed

### Visualizando Posts
- A tela de Feed mostra todos os posts com rolagem infinita
- Use a barra de busca para filtrar posts por palavra-chave (com debounce)
- Puxe para baixo para atualizar a lista
- Toque em qualquer post para ver os detalhes completos

### Painel Admin (Somente Professores)
1. Na tela de Feed, toque em "⚙️ Administrar Posts"
2. Visualize todos os posts com opções de editar/excluir
3. Toque em "➕ Novo Post" para criar um novo post
4. Toque em "✏️ Editar" para editar um post existente
5. Toque em "🗑️ Excluir" para deletar um post (com confirmação)

## 🔍 Principais Funcionalidades Explicadas

### Busca com Debounce
A funcionalidade de busca inclui um debounce de 500ms para evitar chamadas excessivas à API enquanto digita.

### Rolagem Infinita
Posts são carregados em páginas de 10. Conforme você rola para baixo, mais posts são automaticamente buscados.

### Puxar para Atualizar
Puxe para baixo no Feed para atualizar a lista de posts.

### Validação de Formulários
Todos os formulários usam schemas Zod para validação:
- Título do post: 3-200 caracteres
- Conteúdo do post: mínimo 10 caracteres
- Descrição do post: opcional, máximo 500 caracteres

### Acesso Baseado em Papel
- Alunos podem apenas visualizar posts
- Professores podem criar, editar e deletar posts
- Telas de admin são acessíveis apenas para professores

## 🐛 Solução de Problemas

### Não consegue conectar ao backend
- Certifique-se de que seu backend está rodando
- Verifique se `EXPO_PUBLIC_API_URL` usa o IP da sua rede local (não localhost)
- Garanta que sua máquina de desenvolvimento e dispositivo/emulador de teste estão na mesma rede

### Sessão não persiste
- Limpe os dados do app e tente fazer login novamente
- Verifique os logs do console para erros do SecureStore

### Erros de build
- Limpe o cache: `npx expo start -c`
- Delete node_modules e reinstale: `rm -rf node_modules && npm install`

## 📱 Executando no Android Studio

### Setup do Emulador Android

1. **Instalar Android Studio**
   - Download: https://developer.android.com/studio
   - Siga o instalador padrão

2. **Configurar Android Virtual Device (AVD)**
   - Abra Android Studio
   - Vá em `Tools > Device Manager`
   - Clique em `Create Device`
   - Selecione um dispositivo (recomendado: Pixel 6)
   - Selecione uma imagem do sistema (recomendado: Android 13/API 33)
   - Finalize a criação

3. **Iniciar o emulador**
   - No Device Manager, clique no ícone de Play do dispositivo criado
   - Aguarde o emulador iniciar completamente

4. **Executar o app no emulador**
   
   Com o emulador rodando, execute:
   ```bash
   npm run android
   # ou
   npx expo start --android
   # ou pressione 'a' no terminal do Expo
   ```

### Atalhos úteis no Expo

Após executar `npx expo start`:
- `a` - Abrir no Android
- `i` - Abrir no iOS
- `w` - Abrir no navegador
- `r` - Recarregar app
- `m` - Alternar menu
- `c` - Limpar cache do bundler

## 🏗️ Estrutura do Projeto

```
├── app/                      # Expo Router (screens antigas)
│   ├── screens/
│   │   ├── Login/           # Tela de login
│   │   ├── Home/            # Re-export do Feed
│   │   └── PostDetail/      # Detalhe do post
│   └── _layout.tsx          # Layout raiz
├── src/
│   ├── components/
│   │   └── common/          # Componentes reutilizáveis
│   │       ├── Loader.tsx
│   │       ├── ErrorState.tsx
│   │       ├── EmptyState.tsx
│   │       └── PostSkeleton.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx  # Contexto de autenticação
│   ├── features/
│   │   ├── auth/            # Feature de autenticação
│   │   ├── posts/
│   │   │   ├── FeedScreen.tsx
│   │   │   └── admin/       # CRUD de posts (teachers only)
│   │   │       ├── AdminPostsListScreen.tsx
│   │   │       ├── AdminPostCreateScreen.tsx
│   │   │       └── AdminPostEditScreen.tsx
│   │   ├── teachers/        # Scaffold para CRUD de professores
│   │   └── students/        # Scaffold para CRUD de alunos
│   ├── hooks/
│   │   ├── usePosts.ts      # React Query hooks para posts
│   │   └── useDebounce.ts   # Hook de debounce
│   ├── services/
│   │   ├── api.ts           # Cliente axios com interceptors
│   │   ├── authService.ts   # Serviço de autenticação
│   │   └── postService.ts   # Serviço de posts
│   └── types/
│       └── models.ts        # Tipos TypeScript e schemas Zod
├── routes/
│   ├── app.routes.tsx       # Rotas da aplicação
│   └── index.tsx            # Entry point de navegação
└── app.config.ts            # Configuração do Expo
```

## 🔐 Funcionalidades Implementadas

### Autenticação
- ✅ Login com email e senha
- ✅ Cadastro de novos usuários
- ✅ Armazenamento seguro de token (expo-secure-store)
- ✅ Interceptors para adicionar token nas requisições
- ✅ Logout automático em caso de 401
- ✅ Persistência de sessão

### Posts (Feed)
- ✅ Listagem de posts com paginação infinita
- ✅ Busca com debounce (500ms)
- ✅ Pull-to-refresh
- ✅ Estados de loading/empty/error
- ✅ Skeleton loading
- ✅ Navegação para detalhes

### Posts (Administração - Professores)
- ✅ Listagem administrativa de posts
- ✅ Criação de posts com validação (react-hook-form + zod)
- ✅ Edição de posts com pré-carregamento de dados
- ✅ Exclusão de posts com confirmação
- ✅ Invalidação automática de cache
- ✅ Guards de rota por papel

### Infraestrutura
- ✅ React Query para gerenciamento de estado
- ✅ Validação com Zod
- ✅ Tipos TypeScript com strict mode
- ✅ Configuração de ambiente via .env
- ✅ ESLint configurado
- ✅ Estrutura modular por features

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/sign-in/email` - Login
- `POST /api/auth/sign-up/email` - Cadastro
- `POST /api/auth/sign-out` - Logout

### Posts
- `GET /api/posts?page=&limit=&q=` - Listar posts (com busca opcional)
- `GET /api/posts/:id` - Detalhe do post
- `POST /api/posts` - Criar post 
- `PUT /api/posts/:id` - Atualizar post
- `DELETE /api/posts/:id` - Deletar post 

## 🎨 Temas e Customização

O app suporta tema claro/escuro automaticamente baseado nas configurações do sistema.

## 🧪 Lint

```bash
npm run lint
```

## 🐛 Troubleshooting

### Erro de conexão com a API

1. Verifique se o backend está rodando
2. Confirme que `EXPO_PUBLIC_API_URL` está correto no `.env`
3. Para Android emulator, use o IP da sua máquina, não `localhost`
4. Teste a URL no navegador: `http://SEU_IP:3333/api/posts`

### App não conecta no emulador

1. Certifique-se de que o emulador está na mesma rede
2. Verifique se não há firewall bloqueando a conexão
3. Reinicie o Metro bundler: `npm start` e pressione `r`

### Erro "Unable to resolve module"

```bash
# Limpar cache
npx expo start -c
# ou
rm -rf node_modules package-lock.json
npm install
```

## 📝 Próximos Passos

- [ ] Implementar CRUD completo de Professores
- [ ] Implementar CRUD completo de Alunos
- [ ] Adicionar sistema de comentários nos posts
- [ ] Implementar notificações
- [ ] Adicionar testes unitários e de integração
- [ ] Configurar CI/CD

## 📄 Licença

Este projeto é parte do trabalho acadêmico da FIAP.

## 👥 Contribuidores

- Equipe EducaMais

---

Para mais informações sobre Expo, visite: [https://docs.expo.dev](https://docs.expo.dev)
