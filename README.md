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

## 🧪 Development

### Linting
```bash
npm run lint
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
