# Teachers Feature

This directory will contain all teacher-related CRUD operations and screens.

## Planned Structure

```
src/features/teachers/
├── TeachersListScreen.tsx
├── TeacherDetailScreen.tsx
├── TeacherCreateScreen.tsx
├── TeacherEditScreen.tsx
└── hooks/
    └── useTeachers.ts
```

## Endpoints (to be implemented)

- `GET /api/teachers` - List all teachers
- `GET /api/teachers/:id` - Get teacher details
- `POST /api/teachers` - Create new teacher
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

## TODO

- [ ] Create teacher service
- [ ] Create React Query hooks
- [ ] Implement list screen with search and filters
- [ ] Implement detail screen
- [ ] Implement create/edit screens with validation
- [ ] Add to navigation
