# Students Feature

This directory will contain all student-related CRUD operations and screens.

## Planned Structure

```
src/features/students/
├── StudentsListScreen.tsx
├── StudentDetailScreen.tsx
├── StudentCreateScreen.tsx
├── StudentEditScreen.tsx
└── hooks/
    └── useStudents.ts
```

## Endpoints (to be implemented)

- `GET /api/students` - List all students
- `GET /api/students/:id` - Get student details
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

## TODO

- [ ] Create student service
- [ ] Create React Query hooks
- [ ] Implement list screen with search and filters
- [ ] Implement detail screen
- [ ] Implement create/edit screens with validation
- [ ] Add to navigation
