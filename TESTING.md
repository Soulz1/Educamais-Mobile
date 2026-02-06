# Testing and Validation Guide

This document provides instructions for testing the EducaMais Mobile application.

## Prerequisites

Before testing, ensure you have:

1. **Backend API Running**
   - The backend should be accessible from your development machine
   - Note your backend's IP address (e.g., `http://192.168.1.100:3333`)

2. **Mobile Development Environment**
   - Android Studio with Android SDK installed
   - Android emulator configured and running
   - OR physical Android device with USB debugging enabled

3. **Environment Variables**
   - Create `.env` file from `.env.example`
   - Set `EXPO_PUBLIC_API_URL` to your backend URL

## Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env and set EXPO_PUBLIC_API_URL
   ```

3. **Start the Application**
   ```bash
   npx expo start
   ```

4. **Launch on Android**
   - Press `a` to open in Android emulator
   - Or scan QR code with Expo Go app on physical device

## Test Cases

### 1. Authentication Flow

#### Test 1.1: Sign Up (New User)
1. Open the app
2. Click "Não tem conta? Cadastre-se"
3. Enter email: `teacher@test.com`
4. Enter password: `password123`
5. Click "Cadastre-se"
6. **Expected**: User is created and redirected to Feed screen
7. **Verify**: User name appears in header

#### Test 1.2: Sign In (Existing User)
1. If logged in, click "Sair" in header
2. Enter email and password
3. Click "Entrar"
4. **Expected**: User is logged in and redirected to Feed screen
5. **Verify**: 
   - User name appears in header
   - Role badge shows (👨‍🏫 Professor or 👨‍🎓 Aluno)

#### Test 1.3: Session Persistence
1. Log in as a user
2. Close the app completely
3. Reopen the app
4. **Expected**: User remains logged in (no need to re-enter credentials)
5. **Verify**: Feed screen is shown immediately

#### Test 1.4: Invalid Credentials
1. Enter invalid email or password
2. Click "Entrar"
3. **Expected**: Error alert is shown
4. **Verify**: User remains on login screen

### 2. Posts Feed

#### Test 2.1: View Posts List
1. Log in as any user
2. **Expected**: List of posts is displayed
3. **Verify**:
   - Each post shows: title, author, preview, date
   - Posts are ordered correctly
   - Smooth scrolling

#### Test 2.2: Infinite Scroll
1. Scroll down to the bottom of the feed
2. **Expected**: More posts are automatically loaded
3. **Verify**: Loading indicator appears briefly
4. Continue scrolling to load more pages

#### Test 2.3: Pull to Refresh
1. Pull down from the top of the feed
2. **Expected**: Refresh animation appears
3. **Verify**: Posts list is reloaded with latest data

#### Test 2.4: Search Posts
1. Type a search term in the search bar (e.g., "test")
2. Wait 500ms for debounce
3. **Expected**: Posts are filtered by search term
4. **Verify**: Only matching posts are shown
5. Clear search (tap X)
6. **Expected**: All posts are shown again

#### Test 2.5: Empty State
1. Search for a term with no results (e.g., "xyzabc123")
2. **Expected**: Empty state is shown with message "Nenhum post encontrado"

#### Test 2.6: Error State
1. Stop the backend API
2. Pull to refresh
3. **Expected**: Error state is shown
4. Click "Tentar Novamente"
5. Restart backend and verify retry works

### 3. Post Details

#### Test 3.1: View Post Details
1. From the feed, tap on any post
2. **Expected**: Post detail screen opens
3. **Verify**:
   - Full title is shown
   - Author name and email
   - Creation date with time
   - Full content
   - Post ID and update date (if different)

#### Test 3.2: Navigate Back
1. On post detail screen, tap "← Voltar"
2. **Expected**: Return to feed screen
3. **Verify**: Feed maintains scroll position

#### Test 3.3: Post Not Found
1. Manually navigate to a non-existent post ID (requires navigation from code)
2. **Expected**: Error state shown
3. **Verify**: Error message "Post não encontrado"

### 4. Admin Panel (Teacher Only)

#### Test 4.1: Admin Access - Teacher
1. Log in as a teacher
2. **Expected**: "⚙️ Administrar Posts" button is visible in feed
3. Tap the button
4. **Expected**: Admin posts list screen opens

#### Test 4.2: Admin Access - Student
1. Log in as a student
2. **Expected**: Admin button is NOT visible
3. **Verify**: Student cannot access admin features

#### Test 4.3: Create Post
1. As teacher, navigate to admin panel
2. Tap "➕ Novo Post"
3. Fill in form:
   - Título: "Test Post"
   - Descrição: "This is a test description"
   - Conteúdo: "This is the full content of the test post"
4. Tap "Criar Post"
5. **Expected**: Success alert shown
6. **Verify**: Redirected to admin list
7. **Verify**: New post appears in the list

#### Test 4.4: Form Validation - Create
1. Tap "➕ Novo Post"
2. Leave fields empty and tap "Criar Post"
3. **Expected**: Validation errors shown
4. Fill título with 2 characters
5. **Expected**: Error "Título deve ter pelo menos 3 caracteres"
6. Fill conteúdo with 5 characters
7. **Expected**: Error "Conteúdo deve ter pelo menos 10 caracteres"

#### Test 4.5: Edit Post
1. In admin list, tap "✏️ Editar" on a post
2. **Expected**: Edit screen opens with pre-filled data
3. Modify the título
4. Tap "Salvar Alterações"
5. **Expected**: Success alert shown
6. **Verify**: Changes are reflected in the list

#### Test 4.6: Delete Post
1. In admin list, tap "🗑️ Excluir"
2. **Expected**: Confirmation dialog appears
3. Tap "Cancelar"
4. **Expected**: Dialog closes, post remains
5. Tap "🗑️ Excluir" again
6. Tap "Excluir" in dialog
7. **Expected**: Post is deleted
8. **Verify**: Post is removed from list

#### Test 4.7: Cache Invalidation
1. Create or edit a post in admin
2. Navigate back to main feed
3. **Expected**: Changes are immediately visible
4. **Verify**: No need to manually refresh

### 5. Navigation and State Management

#### Test 5.1: Deep Navigation
1. Navigate: Feed → Post Detail → Back → Admin → Create → Cancel
2. **Expected**: Each navigation works correctly
3. **Verify**: No crashes or navigation errors

#### Test 5.2: Logout
1. While on any screen (except login), tap "Sair"
2. Tap "Sair" in confirmation dialog
3. **Expected**: User is logged out
4. **Verify**: Redirected to login screen
5. **Verify**: Session token is cleared

### 6. Role-Based Access Control

#### Test 6.1: Teacher Permissions
1. Log in as teacher
2. **Verify**:
   - Can view feed ✓
   - Can view post details ✓
   - Can access admin panel ✓
   - Can create posts ✓
   - Can edit posts ✓
   - Can delete posts ✓

#### Test 6.2: Student Permissions
1. Log in as student
2. **Verify**:
   - Can view feed ✓
   - Can view post details ✓
   - Cannot access admin panel ✗
   - Cannot create posts ✗
   - Cannot edit posts ✗
   - Cannot delete posts ✗

## Performance Testing

### Test 7.1: Large Dataset
1. Create 100+ posts in the backend
2. Load the feed
3. **Expected**: Feed loads smoothly
4. Scroll through the list
5. **Expected**: Infinite scroll works without lag

### Test 7.2: Network Conditions
1. Simulate slow network (via Android Studio)
2. Load feed
3. **Expected**: Loading states are shown appropriately
4. Restore network
5. **Expected**: Data loads successfully

### Test 7.3: Offline Handling
1. Turn off network completely
2. Try to load feed
3. **Expected**: Error state shown
4. Turn network back on
5. Tap retry
6. **Expected**: Data loads successfully

## Known Issues and Limitations

1. **Backend Dependency**: The app requires a running backend API. Ensure `EXPO_PUBLIC_API_URL` is correctly configured.

2. **Android Emulator Network**: On Android emulator, use your machine's local network IP (not `localhost`).

3. **Token Expiration**: If the backend implements token expiration, you may need to log in again after the token expires.

4. **Comments Feature**: Currently a placeholder - will be implemented in a future PR.

5. **Teachers/Students CRUD**: Scaffolded but not implemented - will be added in future PRs.

## Reporting Issues

When reporting issues, please include:
1. Steps to reproduce
2. Expected vs actual behavior
3. Screenshots if applicable
4. Console logs (from `npx expo start`)
5. Device/emulator information
6. Backend API version and status

## Success Criteria

All tests should pass with:
- ✅ No crashes or unhandled errors
- ✅ Smooth UI interactions
- ✅ Proper role-based access control
- ✅ Data persistence working correctly
- ✅ Network error handling working
- ✅ Form validations working
- ✅ Cache management working correctly
