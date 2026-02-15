# EducaMais Mobile

Mobile client for the EducaMais platform built with Expo and React Native.

## 📋 Requisitos

- Node.js (v18+ recomendado)
- npm ou yarn
- Android Studio (para emulador Android) ou Xcode (para iOS)
- Expo CLI (opcional, mas útil): `npm install -g expo-cli`

## 🚀 Instalação

### 1. Instalar dependências

```bash
npm ci
# ou
npm install
```

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

```bash
npm start
# ou
npx expo start
```

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
