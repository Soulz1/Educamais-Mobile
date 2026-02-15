# Feature de Professores

Este diretório conterá funcionalidades relacionadas a professores em PRs futuros.

## Funcionalidades Planejadas
- Operações CRUD de professores
- Listagem e detalhes de professores
- Telas e componentes específicos para professores

## Estrutura Planejada

```
src/features/teachers/
├── TeachersListScreen.tsx
├── TeacherDetailScreen.tsx
├── TeacherCreateScreen.tsx
├── TeacherEditScreen.tsx
└── hooks/
    └── useTeachers.ts
```

## Endpoints da API (a serem implementados)

- `GET /api/teachers` - Listar todos os professores
- `GET /api/teachers/:id` - Obter detalhes do professor
- `POST /api/teachers` - Criar novo professor
- `PUT /api/teachers/:id` - Atualizar professor
- `DELETE /api/teachers/:id` - Deletar professor

## A FAZER

- [ ] Criar serviço de professores
- [ ] Criar hooks React Query
- [ ] Implementar tela de listagem com busca e filtros
- [ ] Implementar tela de detalhes
- [ ] Implementar telas de criar/editar com validação
- [ ] Adicionar à navegação
