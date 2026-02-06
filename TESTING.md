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
