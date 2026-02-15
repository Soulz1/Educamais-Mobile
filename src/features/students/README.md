# Feature de Alunos

Este diretório conterá funcionalidades relacionadas a alunos em PRs futuros.

## Funcionalidades Planejadas
- Operações CRUD de alunos
- Listagem e detalhes de alunos
- Telas e componentes específicos para alunos

## Estrutura Planejada

```
src/features/students/
├── StudentsListScreen.tsx
├── StudentDetailScreen.tsx
├── StudentCreateScreen.tsx
├── StudentEditScreen.tsx
└── hooks/
    └── useStudents.ts
```

## Endpoints da API (a serem implementados)

- `GET /api/students` - Listar todos os alunos
- `GET /api/students/:id` - Obter detalhes do aluno
- `POST /api/students` - Criar novo aluno
- `PUT /api/students/:id` - Atualizar aluno
- `DELETE /api/students/:id` - Deletar aluno

## A FAZER

- [ ] Criar serviço de alunos
- [ ] Criar hooks React Query
- [ ] Implementar tela de listagem com busca e filtros
- [ ] Implementar tela de detalhes
- [ ] Implementar telas de criar/editar com validação
- [ ] Adicionar à navegação
