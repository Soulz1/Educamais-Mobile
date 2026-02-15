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
# Testing Guide - EducaMais Mobile

This guide provides step-by-step instructions for testing the mobile application.

## Prerequisites

1. Backend API running and accessible
2. Android Studio with emulator configured (or physical device)
3. Environment variables configured in `.env`

## Test Scenarios

### 1. Authentication Flow

#### Test 1.1: User Registration
1. Launch the app
2. On the login screen, click "Não tem conta? Cadastre-se"
3. Enter a valid email and password (min 6 characters)
4. Verify successful registration and automatic login
5. Verify you're redirected to the Feed screen

**Expected Result**: User is registered, token is stored securely, and Feed screen is displayed.

#### Test 1.2: User Login
1. If logged in, logout first
2. Enter valid credentials
3. Click "Entrar"
4. Verify redirect to Feed screen

**Expected Result**: User is authenticated and Feed is displayed.

#### Test 1.3: Session Persistence
1. Login with valid credentials
2. Close the app completely
3. Reopen the app
4. Verify you're still logged in (no login screen shown)

**Expected Result**: Session is persisted via expo-secure-store.

#### Test 1.4: Logout
1. On Feed screen, click "Sair"
2. Confirm logout
3. Verify redirect to login screen

**Expected Result**: User is logged out, session is cleared.

#### Test 1.5: Invalid Credentials
1. Try to login with invalid email/password
2. Verify error alert is shown

**Expected Result**: Error message displayed, user remains on login screen.

---

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
1. Login as any user
2. Verify posts are displayed in a list
3. Verify each post shows: title, author, brief content, date

**Expected Result**: Posts are listed with correct information.

#### Test 2.2: Search Posts
1. On Feed screen, tap the search bar
2. Type a search term (e.g., "test")
3. Wait 500ms (debounce)
4. Verify filtered results appear

**Expected Result**: Search works with debounce, results are filtered.

#### Test 2.3: Clear Search
1. After searching, clear the search field
2. Verify all posts are shown again

**Expected Result**: Full list is restored.

#### Test 2.4: Infinite Scroll
1. Scroll to the bottom of the posts list
2. Verify more posts are loaded automatically
3. Verify loading indicator appears at bottom

**Expected Result**: New posts load on scroll, infinite scroll works.

#### Test 2.5: Pull to Refresh
1. Pull down from top of list
2. Verify loading indicator appears
3. Verify posts are refreshed

**Expected Result**: List refreshes on pull-down gesture.

#### Test 2.6: Empty State
1. Search for a term that returns no results
2. Verify empty state is shown with message

**Expected Result**: Empty state displays "Nenhum post encontrado".

---

### 3. Post Detail

#### Test 3.1: Navigate to Detail
1. On Feed screen, tap any post
2. Verify navigation to detail screen
3. Verify full post content is displayed

**Expected Result**: Detail screen shows complete post.

#### Test 3.2: Post Information
1. On detail screen, verify:
   - Title
   - Author name and email
   - Full content
   - Creation date
   - Update date (if different)

**Expected Result**: All information is displayed correctly.

#### Test 3.3: Comments Placeholder
1. Scroll to bottom of post detail
2. Verify comments section placeholder is shown
3. Verify message: "Sistema de comentários em desenvolvimento"

**Expected Result**: Comments placeholder is visible.

#### Test 3.4: Back Navigation
1. Click "← Voltar" button
2. Verify return to Feed screen

**Expected Result**: Navigation back works correctly.

---

### 4. Admin Features (Teacher Only)

#### Test 4.1: Admin Button Visibility
1. Login as a **teacher** user
2. Verify "Admin" button is visible in header
3. Logout and login as a **student** user
4. Verify "Admin" button is NOT visible

**Expected Result**: Admin button only visible for teachers.

#### Test 4.2: Access Control - Student
1. Login as a **student**
2. Try to access admin screens (if possible)
3. Verify access is denied

**Expected Result**: Students cannot access admin features.

#### Test 4.3: Admin Posts List
1. Login as a **teacher**
2. Click "Admin" button
3. Verify list of posts with edit/delete buttons
4. Verify "+ Novo Post" button

**Expected Result**: Admin list shows all posts with actions.

#### Test 4.4: Create Post
1. On admin list, click "+ Novo Post"
2. Leave title empty and try to submit
3. Verify validation error appears
4. Fill valid data:
   - Title: "Test Post"
   - Description: "Test description"
   - Content: "Test content with more than 10 characters"
5. Click "Criar Post"
6. Verify success message
7. Verify new post appears in list

**Expected Result**: Validation works, post is created.

#### Test 4.5: Edit Post
1. On admin list, click "✏️ Editar" on any post
2. Verify form is pre-filled with current data
3. Modify the title
4. Click "Salvar Alterações"
5. Verify success message
6. Verify changes appear in list

**Expected Result**: Post is updated correctly.

#### Test 4.6: Delete Post
1. On admin list, click "🗑️ Excluir" on any post
2. Verify confirmation dialog appears
3. Click "Cancelar" - verify post remains
4. Click delete again, then "Excluir"
5. Verify success message
6. Verify post is removed from list

**Expected Result**: Delete confirmation works, post is removed.

#### Test 4.7: Form Validation
1. Try to create a post with:
   - Title < 3 characters
   - Content < 10 characters
   - Description > 500 characters
2. Verify appropriate error messages for each

**Expected Result**: All validations trigger correct error messages.

---

### 5. Role-Based Access

#### Test 5.1: Teacher Role
1. Login as teacher
2. Verify can access admin features
3. Verify can create/edit/delete posts

**Expected Result**: Teachers have full admin access.

#### Test 5.2: Student Role
1. Login as student
2. Verify can view feed
3. Verify can view post details
4. Verify CANNOT access admin features

**Expected Result**: Students have read-only access.

---

### 6. Error Handling

#### Test 6.1: Network Error
1. Disconnect from network
2. Try to load posts
3. Verify error state is shown
4. Reconnect and click "Tentar novamente"
5. Verify posts load

**Expected Result**: Error state with retry option works.

#### Test 6.2: 401 Unauthorized
1. Manually invalidate token (or wait for expiration)
2. Try to perform an action
3. Verify automatic logout occurs

**Expected Result**: Auto-logout on 401.

---

## Performance Tests

### Test P.1: Search Debounce
1. Type quickly in search field
2. Verify search only triggers after 500ms of no typing

**Expected Result**: Debounce prevents excessive API calls.

### Test P.2: Cache Behavior
1. View a post detail
2. Go back to list
3. View the same post again
4. Verify it loads from cache (instant)

**Expected Result**: React Query cache works correctly.

---

## Accessibility Tests

### Test A.1: Screen Reader
1. Enable TalkBack (Android) or VoiceOver (iOS)
2. Navigate through screens
3. Verify all elements are properly labeled

**Expected Result**: All interactive elements are accessible.

---

## Test Checklist

- [ ] Authentication: Registration, Login, Logout, Persistence
- [ ] Feed: List, Search, Infinite Scroll, Pull-to-Refresh
- [ ] Detail: Navigation, Full Content Display
- [ ] Admin (Teacher): List, Create, Edit, Delete
- [ ] Admin (Student): Access Denied
- [ ] Validation: All forms validate correctly
- [ ] Error Handling: Network errors, 401
- [ ] Performance: Debounce, Cache
- [ ] Security: Token storage, Role-based access

---

## Bug Report Template

If you find a bug during testing, please report it with:

```markdown
### Bug: [Short Description]

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Environment:**
- OS: [Android/iOS version]
- Device: [Emulator/Physical device model]
- App Version: 1.0.0

**Screenshots:**
[If applicable]

**Logs:**
[Console errors, if any]
```

---

## Notes for Testers

1. **Backend Connection**: Ensure `EXPO_PUBLIC_API_URL` points to a running backend
2. **Test Users**: You may need to create test users with different roles
3. **Data**: Some tests require existing posts in the database
4. **Reset**: To reset the app completely, clear app data or uninstall/reinstall

---

## Known Limitations (Current PR)

1. Comments feature is a placeholder (to be implemented)
2. Teachers/Students CRUD not implemented (scaffolds only)
3. No image upload for posts
4. No notifications

These will be addressed in future PRs.
