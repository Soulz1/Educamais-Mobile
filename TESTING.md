# Guia de Testes e Validação

Este documento fornece instruções para testar o aplicativo móvel EducaMais.

## Pré-requisitos

Antes de começar os testes, certifique-se de ter:

1. **API Backend Rodando**
   - O backend deve estar acessível a partir da sua máquina de desenvolvimento
   - Anote o endereço IP do backend (ex: `http://192.168.1.100:3333`)

2. **Ambiente de Desenvolvimento Mobile**
   - Android Studio com Android SDK instalado
   - Emulador Android configurado e rodando
   - OU dispositivo Android físico com depuração USB habilitada

3. **Variáveis de Ambiente**
   - Crie o arquivo `.env` a partir do `.env.example`
   - Configure `EXPO_PUBLIC_API_URL` com a URL do seu backend

## Passos de Configuração

1. **Instalar Dependências**
   ```bash
   npm install
   ```

2. **Configurar Ambiente**
   ```bash
   cp .env.example .env
   # Edit .env and set EXPO_PUBLIC_API_URL
   ```

3. **Iniciar o Aplicativo**
   ```bash
   npx expo start
   ```

4. **Abrir no Android**
   - Pressione `a` para abrir no emulador Android
   - Ou escaneie o QR code com o app Expo Go em um dispositivo físico

## Casos de Teste

### 1. Fluxo de Autenticação

#### Teste 1.1: Cadastro de Novo Usuário
1. Abra o aplicativo
2. Clique em "Não tem conta? Cadastre-se"
3. Digite um email válido e senha (mínimo 6 caracteres)
4. Clique em "Cadastre-se"
5. **Esperado**: Usuário é criado e redirecionado para a tela de Feed
6. **Verificar**: Nome do usuário aparece no cabeçalho

#### Teste 1.2: Login de Usuário Existente
1. Se estiver logado, clique em "Sair" no cabeçalho
2. Digite email e senha
3. Clique em "Entrar"
4. **Esperado**: Usuário é autenticado e redirecionado para o Feed
5. **Verificar**: 
   - Nome do usuário aparece no cabeçalho
   - Badge de função mostra (👨‍🏫 Professor ou 👨‍🎓 Aluno)

#### Teste 1.3: Persistência de Sessão
1. Faça login como um usuário
2. Feche o aplicativo completamente
3. Reabra o aplicativo
4. **Esperado**: Usuário continua logado (não precisa digitar credenciais novamente)
5. **Verificar**: Tela de Feed é mostrada imediatamente

**Resultado Esperado**: A sessão é mantida via expo-secure-store.

#### Teste 1.4: Logout
1. Na tela de Feed, clique em "Sair"
2. Confirme o logout
3. **Esperado**: Usuário é deslogado
4. **Verificar**: Redirecionado para tela de login
5. **Verificar**: Token de sessão é removido

#### Teste 1.5: Credenciais Inválidas
1. Digite email ou senha incorretos
2. Clique em "Entrar"
3. **Esperado**: Mensagem de erro é exibida
4. **Verificar**: Usuário permanece na tela de login

---

### 2. Feed de Posts

#### Teste 2.1: Visualizar Lista de Posts
1. Faça login como qualquer usuário
2. **Esperado**: Lista de posts é exibida
3. **Verificar**:
   - Cada post mostra: título, autor, prévia do conteúdo, data
   - Posts estão ordenados corretamente
   - Rolagem suave

#### Teste 2.2: Scroll Infinito
1. Role até o final do feed
2. **Esperado**: Mais posts são carregados automaticamente
3. **Verificar**: Indicador de carregamento aparece brevemente
4. Continue rolando para carregar mais páginas

#### Teste 2.3: Puxar para Atualizar
1. Puxe para baixo do topo do feed
2. **Esperado**: Animação de atualização aparece
3. **Verificar**: Lista de posts é recarregada com os dados mais recentes

#### Teste 2.4: Buscar Posts
1. Digite um termo de busca na barra de pesquisa (ex: "test")
2. Aguarde 500ms pelo debounce
3. **Esperado**: Posts são filtrados pelo termo de busca
4. **Verificar**: Apenas posts correspondentes são mostrados
5. Limpe a busca (toque no X)
6. **Esperado**: Todos os posts são mostrados novamente

**Resultado Esperado**: Busca funciona com debounce, resultados são filtrados.

#### Teste 2.5: Estado Vazio
1. Busque por um termo sem resultados (ex: "xyzabc123")
2. **Esperado**: Estado vazio é mostrado com a mensagem "Nenhum post encontrado"

#### Teste 2.6: Estado de Erro
1. Pare a API do backend
2. Puxe para atualizar
3. **Esperado**: Estado de erro é mostrado
4. Clique em "Tentar Novamente"
5. Reinicie o backend e verifique se a tentativa funciona

**Resultado Esperado**: Estado de erro com opção de tentar novamente funciona.

---

### 3. Detalhes do Post

#### Teste 3.1: Visualizar Detalhes do Post
1. No feed, toque em qualquer post
2. **Esperado**: Tela de detalhes do post abre
3. **Verificar**:
   - Título completo é mostrado
   - Nome e email do autor
   - Data de criação com hora
   - Conteúdo completo
   - ID do post e data de atualização (se diferente)

**Resultado Esperado**: Todas as informações são exibidas corretamente.

#### Teste 3.2: Navegar de Volta
1. Na tela de detalhes, toque em "← Voltar"
2. **Esperado**: Retorna para a tela de feed
3. **Verificar**: Feed mantém a posição de rolagem

**Resultado Esperado**: Navegação de volta funciona corretamente.

#### Teste 3.3: Placeholder de Comentários
1. Role até o final dos detalhes do post
2. Verifique que o placeholder da seção de comentários é mostrado
3. Verifique a mensagem: "Sistema de comentários em desenvolvimento"

**Resultado Esperado**: Placeholder de comentários está visível.

#### Teste 3.4: Post Não Encontrado
1. Navegue manualmente para um ID de post inexistente (requer navegação via código)
2. **Esperado**: Estado de erro é mostrado
3. **Verificar**: Mensagem de erro "Post não encontrado"

---

### 4. Painel Admin (Apenas Professor)

#### Teste 4.1: Acesso Admin - Professor
1. Faça login como professor
2. **Esperado**: Botão "⚙️ Administrar Posts" está visível no feed
3. Toque no botão
4. **Esperado**: Tela de lista de posts admin abre

**Resultado Esperado**: Botão admin visível apenas para professores.

#### Teste 4.2: Acesso Admin - Aluno
1. Faça login como aluno
2. **Esperado**: Botão admin NÃO está visível
3. **Verificar**: Aluno não pode acessar funcionalidades admin

**Resultado Esperado**: Alunos não podem acessar funcionalidades admin.

#### Teste 4.3: Lista de Posts Admin
1. Faça login como professor
2. Clique no botão "Admin"
3. Verifique a lista de posts com botões de editar/excluir
4. Verifique o botão "+ Novo Post"

**Resultado Esperado**: Lista admin mostra todos os posts com ações.

#### Teste 4.4: Criar Post
1. No painel admin, toque em "➕ Novo Post"
2. Deixe o título vazio e tente enviar
3. Verifique que erro de validação aparece
4. Preencha com dados válidos:
   - Título: "Test Post"
   - Descrição: "Test description"
   - Conteúdo: "Test content with more than 10 characters"
5. Toque em "Criar Post"
6. **Esperado**: Mensagem de sucesso é exibida
7. **Verificar**: Redirecionado para lista admin
8. **Verificar**: Novo post aparece na lista

**Resultado Esperado**: Validação funciona, post é criado.

#### Teste 4.5: Validação de Formulário - Criar
1. Toque em "➕ Novo Post"
2. Deixe os campos vazios e toque em "Criar Post"
3. **Esperado**: Erros de validação são mostrados
4. Preencha título com 2 caracteres
5. **Esperado**: Erro "Título deve ter pelo menos 3 caracteres"
6. Preencha conteúdo com 5 caracteres
7. **Esperado**: Erro "Conteúdo deve ter pelo menos 10 caracteres"
8. Tente criar um post com descrição > 500 caracteres
9. **Esperado**: Mensagens de erro apropriadas para cada campo

**Resultado Esperado**: Todas as validações disparam mensagens de erro corretas.

#### Teste 4.6: Editar Post
1. Na lista admin, toque em "✏️ Editar" em um post
2. **Esperado**: Tela de edição abre com dados pré-preenchidos
3. Modifique o título
4. Toque em "Salvar Alterações"
5. **Esperado**: Alerta de sucesso é mostrado
6. **Verificar**: Mudanças são refletidas na lista

**Resultado Esperado**: Post é atualizado corretamente.

#### Teste 4.7: Excluir Post
1. Na lista admin, toque em "🗑️ Excluir"
2. **Esperado**: Diálogo de confirmação aparece
3. Toque em "Cancelar"
4. **Esperado**: Diálogo fecha, post permanece
5. Toque em "🗑️ Excluir" novamente
6. Toque em "Excluir" no diálogo
7. **Esperado**: Post é excluído
8. **Verificar**: Post é removido da lista

**Resultado Esperado**: Confirmação de exclusão funciona, post é removido.

#### Teste 4.8: Invalidação de Cache
1. Crie ou edite um post no admin
2. Navegue de volta para o feed principal
3. **Esperado**: Mudanças são imediatamente visíveis
4. **Verificar**: Não é necessário atualizar manualmente

---

### 5. Navegação e Gerenciamento de Estado

#### Teste 5.1: Navegação Profunda
1. Navegue: Feed → Detalhes do Post → Voltar → Admin → Criar → Cancelar
2. **Esperado**: Cada navegação funciona corretamente
3. **Verificar**: Sem crashes ou erros de navegação

#### Teste 5.2: Logout em Qualquer Tela
1. Em qualquer tela (exceto login), toque em "Sair"
2. Toque em "Sair" no diálogo de confirmação
3. **Esperado**: Usuário é deslogado
4. **Verificar**: Redirecionado para tela de login
5. **Verificar**: Token de sessão é removido

---

### 6. Controle de Acesso Baseado em Função

#### Teste 6.1: Permissões de Professor
1. Faça login como professor
2. **Verificar**:
   - Pode visualizar feed ✓
   - Pode visualizar detalhes de posts ✓
   - Pode acessar painel admin ✓
   - Pode criar posts ✓
   - Pode editar posts ✓
   - Pode excluir posts ✓

**Resultado Esperado**: Professores têm acesso admin completo.

#### Teste 6.2: Permissões de Aluno
1. Faça login como aluno
2. **Verificar**:
   - Pode visualizar feed ✓
   - Pode visualizar detalhes de posts ✓
   - NÃO pode acessar painel admin ✗
   - NÃO pode criar posts ✗
   - NÃO pode editar posts ✗
   - NÃO pode excluir posts ✗

**Resultado Esperado**: Alunos têm acesso somente leitura.

---

## Testes de Performance

### Teste 7.1: Dataset Grande
1. Crie 100+ posts no backend
2. Carregue o feed
3. **Esperado**: Feed carrega suavemente
4. Role pela lista
5. **Esperado**: Scroll infinito funciona sem travamentos

### Teste 7.2: Condições de Rede
1. Simule rede lenta (via Android Studio)
2. Carregue o feed
3. **Esperado**: Estados de carregamento são mostrados apropriadamente
4. Restaure a rede
5. **Esperado**: Dados carregam com sucesso

### Teste 7.3: Debounce da Busca
1. Digite rapidamente no campo de busca
2. Verifique que a busca só é acionada após 500ms sem digitação

**Resultado Esperado**: Debounce previne chamadas excessivas à API.

### Teste 7.4: Comportamento do Cache
1. Visualize um post em detalhes
2. Volte para a lista
3. Visualize o mesmo post novamente
4. Verifique que carrega do cache (instantâneo)

**Resultado Esperado**: Cache do React Query funciona corretamente.

### Teste 7.5: Tratamento de Offline
1. Desligue a rede completamente
2. Tente carregar o feed
3. **Esperado**: Estado de erro é mostrado
4. Ligue a rede novamente
5. Toque em tentar novamente
6. **Esperado**: Dados carregam com sucesso

---

## Testes de Acessibilidade

### Teste A.1: Leitor de Tela
1. Habilite TalkBack (Android) ou VoiceOver (iOS)
2. Navegue pelas telas
3. Verifique que todos os elementos têm labels apropriadas

**Resultado Esperado**: Todos os elementos interativos são acessíveis.

---

## Checklist de Testes

- [ ] Autenticação: Cadastro, Login, Logout, Persistência
- [ ] Feed: Lista, Busca, Scroll Infinito, Puxar para Atualizar
- [ ] Detalhes: Navegação, Exibição de Conteúdo Completo
- [ ] Admin (Professor): Lista, Criar, Editar, Excluir
- [ ] Admin (Aluno): Acesso Negado
- [ ] Validação: Todos os formulários validam corretamente
- [ ] Tratamento de Erros: Erros de rede, 401
- [ ] Performance: Debounce, Cache
- [ ] Segurança: Armazenamento de token, Acesso baseado em função

---

## Template de Relatório de Bug

Se você encontrar um bug durante os testes, por favor reporte com:

```markdown
### Bug: [Descrição Curta]

**Passos para Reproduzir:**
1. Passo 1
2. Passo 2
3. Passo 3

**Comportamento Esperado:**
[O que deveria acontecer]

**Comportamento Real:**
[O que realmente aconteceu]

**Ambiente:**
- SO: [Versão Android/iOS]
- Dispositivo: [Modelo do emulador/dispositivo físico]
- Versão do App: 1.0.0

**Screenshots:**
[Se aplicável]

**Logs:**
[Erros do console, se houver]
```

---

## Notas para Testadores

1. **Conexão com Backend**: Certifique-se de que `EXPO_PUBLIC_API_URL` aponta para um backend rodando
2. **Usuários de Teste**: Você pode precisar criar usuários de teste com diferentes funções
3. **Dados**: Alguns testes requerem posts existentes no banco de dados
4. **Resetar**: Para resetar o app completamente, limpe os dados do app ou desinstale/reinstale

---

## Limitações Conhecidas

1. **Dependência do Backend**: O app requer uma API backend rodando. Certifique-se de que `EXPO_PUBLIC_API_URL` está configurado corretamente.

2. **Rede do Emulador Android**: No emulador Android, use o IP da rede local da sua máquina (não `localhost`).

3. **Expiração de Token**: Se o backend implementar expiração de token, você pode precisar fazer login novamente após o token expirar.

4. **Funcionalidade de Comentários**: Atualmente é um placeholder - será implementado em um PR futuro.

5. **CRUD de Professores/Alunos**: Estrutura criada mas não implementada - será adicionado em PRs futuros.

6. **Upload de Imagens**: Não implementado para posts.

7. **Notificações**: Não implementadas.

Estas funcionalidades serão abordadas em PRs futuros.

---

## Critérios de Sucesso

Todos os testes devem passar com:
- ✅ Sem crashes ou erros não tratados
- ✅ Interações de UI suaves
- ✅ Controle de acesso baseado em função funcionando
- ✅ Persistência de dados funcionando corretamente
- ✅ Tratamento de erros de rede funcionando
- ✅ Validações de formulário funcionando
- ✅ Gerenciamento de cache funcionando corretamente
