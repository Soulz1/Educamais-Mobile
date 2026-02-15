# EducaMais Mobile

Mobile client for the EducaMais platform built with Expo / React Native.

## 📋 Features

- ✅ Authentication (Login/Sign Up with secure token storage)
- ✅ Posts Feed with search and infinite scroll
- ✅ Post Details
- ✅ Admin Panel for Teachers (Create/Edit/Delete Posts)
- ✅ Role-based access control (Teacher/Student)
- 🔄 Scaffolding for Teachers and Students CRUD (coming in future PRs)

## 🛠️ Tech Stack

- **React Native** with **Expo** (SDK 54)
- **TypeScript** (strict mode)
- **React Navigation** (Stack Navigator)
- **TanStack Query** (React Query) for data fetching and caching
- **React Hook Form** + **Zod** for form validation
- **Expo Secure Store** for secure token storage
- **Axios** for HTTP requests

## 📦 Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Android Studio (for Android emulator) or Xcode (for iOS simulator)
- Expo CLI (optional but recommended): `npm install -g expo-cli`

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Educamais-Mobile
   ```
Mobile client for the EducaMais platform built with Expo and React Native.

## 📋 Requisitos

- Node.js (v18+ recomendado)
- npm ou yarn
- Android Studio (para emulador Android) ou Xcode (para iOS)
- Expo CLI (opcional, mas útil): `npm install -g expo-cli`

## 🚀 Instalação

### 1. Instalar dependências

2. **Install dependencies**
   ```bash
   npm ci
   # or
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and configure your API URL:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your backend API URL:
   ```env
   EXPO_PUBLIC_API_URL=http://192.168.x.x:3333
   ```
   
   **Important**: For Android emulator, use your machine's local network IP address (not `localhost`).

## 🏃 Running the App

### Start the Metro bundler
```bash
npm start
# or
npx expo start
```

### Run on Android Emulator

1. **Start Android Studio and launch an Android emulator**

2. **Run the app**
   ```bash
   npm run android
   # or
   npx expo start --android
   ```

### Run on iOS Simulator (macOS only)

```bash
npm run ios
# or
npx expo start --ios
```

### Run on Physical Device

1. Install **Expo Go** app on your device
2. Scan the QR code shown in the terminal after running `npm start`

## 🔐 Authentication

The app uses secure token storage via **expo-secure-store**. Upon successful login, the session token is stored securely and automatically included in all API requests.

### Available Roles
- **teacher**: Can create, edit, and delete posts
- **student**: Can view posts (CRUD operations restricted)

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
│   └── common/         # Button, Input, Loader, EmptyState, ErrorState
├── contexts/           # React contexts (AuthContext)
├── features/           # Feature-specific code
│   ├── students/       # Student features (scaffold)
│   └── teachers/       # Teacher features (scaffold)
├── hooks/              # Custom React hooks (usePosts, useDebounce)
├── services/           # API services (api, auth, storage, posts)
└── types/              # TypeScript types and Zod schemas

app/
└── screens/            # Screen components
    ├── Home/          # Feed screen with search and infinite scroll
    ├── Login/         # Authentication screen
    ├── PostDetail/    # Post detail screen
    └── admin/         # Admin screens (teacher-only)
        ├── PostsList/
        ├── PostCreate/
        └── PostEdit/
```

## 🌐 API Integration

The app expects the following backend endpoints:

### Authentication
- `POST /api/auth/sign-in/email` - Sign in
- `POST /api/auth/sign-up/email` - Sign up
- `POST /api/auth/sign-out` - Sign out

### Posts
- `GET /api/posts?page=1&limit=10&q=search` - List posts (with pagination and search)
- `GET /api/posts/:id` - Get post details
- `POST /api/posts` - Create post (teacher only)
- `PUT /api/posts/:id` - Update post (teacher only)
- `DELETE /api/posts/:id` - Delete post (teacher only)

### Future Endpoints (scaffolded)
- Teachers: `GET/POST/PUT/DELETE /api/teachers`
- Students: `GET/POST/PUT/DELETE /api/students`
### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure a URL da API:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:3333
```

**Importante para Android Emulator:**
- Não use `localhost` ou `127.0.0.1`
- Use o IP da sua máquina na rede local (ex: `192.168.1.100`)
- Para descobrir seu IP:
  - Windows: `ipconfig`
  - macOS/Linux: `ifconfig` ou `ip addr`

### 3. Iniciar o aplicativo

## 🧪 Development

### Linting
```bash
npm start
# ou
npx expo start
```

### Type Checking
TypeScript is configured with `strict: true` for maximum type safety.

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | Backend API base URL | `http://192.168.1.100:3333` |

### Finding Your Local IP Address

**Windows (PowerShell)**:
```powershell
ipconfig
# Look for "IPv4 Address" under your active network adapter
```

**macOS/Linux**:
```bash
ifconfig | grep "inet "
# Look for your local network IP (usually starts with 192.168.x.x)
```

Then use this IP in your `.env` file:
```env
EXPO_PUBLIC_API_URL=http://192.168.x.x:3333
```

## 📝 Usage

### Login Flow
1. Open the app
2. Enter email and password
3. Click "Entrar" to sign in or "Cadastre-se" to create an account
4. Upon successful authentication, you'll be redirected to the Feed

### Viewing Posts
- The Feed screen shows all posts with infinite scroll
- Use the search bar to filter posts by keyword (with debounce)
- Pull down to refresh the list
- Tap on any post to view full details

### Admin Panel (Teachers Only)
1. On the Feed screen, tap "⚙️ Administrar Posts"
2. View all posts with edit/delete options
3. Tap "➕ Novo Post" to create a new post
4. Tap "✏️ Editar" to edit an existing post
5. Tap "🗑️ Excluir" to delete a post (with confirmation)

## 🔍 Key Features Explained

### Search with Debounce
The search functionality includes a 500ms debounce to avoid excessive API calls while typing.

### Infinite Scroll
Posts are loaded in pages of 10. As you scroll down, more posts are automatically fetched.

### Pull to Refresh
Pull down on the Feed to refresh the post list.

### Form Validation
All forms use Zod schemas for validation:
- Post title: 3-200 characters
- Post content: minimum 10 characters
- Post description: optional, max 500 characters

### Role-Based Access
- Students can only view posts
- Teachers can create, edit, and delete posts
- Admin screens are accessible only to teachers

## 🐛 Troubleshooting

### Cannot connect to backend
- Ensure your backend is running
- Check that `EXPO_PUBLIC_API_URL` uses your local network IP (not localhost)
- Ensure both your development machine and test device/emulator are on the same network

### Session not persisting
- Clear app data and try logging in again
- Check console logs for SecureStore errors

### Build errors
- Clear cache: `npx expo start -c`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## 📄 License

[Add your license here]

## 👥 Contributors

[Add contributors here]
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
- ✅ Controle de acesso por papel (teacher/student)

### Posts (Feed)
- ✅ Listagem de posts com paginação infinita
- ✅ Busca com debounce (500ms)
- ✅ Pull-to-refresh
- ✅ Estados de loading/empty/error
- ✅ Skeleton loading
- ✅ Navegação para detalhes

### Posts (Administração - Teachers Only)
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
- `POST /api/posts` - Criar post (teacher only)
- `PUT /api/posts/:id` - Atualizar post (teacher only)
- `DELETE /api/posts/:id` - Deletar post (teacher only)

### Teachers/Students (Scaffolds - A implementar)
- `GET/POST/PUT/DELETE /api/teachers`
- `GET/POST/PUT/DELETE /api/students`

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

- [ ] Implementar CRUD completo de Teachers
- [ ] Implementar CRUD completo de Students
- [ ] Adicionar sistema de comentários nos posts
- [ ] Implementar notificações
- [ ] Adicionar testes unitários e de integração
- [ ] Configurar CI/CD

## 📄 Licença

Este projeto é parte do trabalho acadêmico da faculdade.

## 👥 Contribuidores

- Equipe EducaMais

---

Para mais informações sobre Expo, visite: [https://docs.expo.dev](https://docs.expo.dev)
