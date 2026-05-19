# Quick Start Guide - Feed System Frontend

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 What's Included

### Pages Ready to Use
- ✅ `/auth/login` - Login page
- ✅ `/auth/register` - Registration page
- ✅ `/feed` - Main infinite scroll feed
- ✅ `/profile/[userId]` - User profile page
- ✅ `/posts/[postId]` - Single post page with comments
- ✅ `/notifications` - Notifications page

### Components Ready to Use
- ✅ `Navbar` - Top navigation with user menu
- ✅ `Sidebar` - Left sidebar with navigation
- ✅ `MainLayout` - Page layout wrapper
- ✅ `PostCard` - Individual post display
- ✅ `CreatePostBox` - Post creation form
- ✅ `FeedList` - Infinite scrolling feed
- ✅ `Skeleton` - Loading placeholders
- ✅ `LoginForm` & `RegisterForm` - Auth forms

### Hooks Ready to Use
- ✅ `useAuth()` - Login, register, logout, get current user
- ✅ `useFeed()` - Infinite scrolling feed
- ✅ `usePost()` - Single post, create, like, delete
- ✅ `useUser()` - User profiles, follow/unfollow

## 🏗️ Architecture Overview

### Data Flow
```
Component
  ↓
Hook (usePost, useFeed, etc.)
  ↓
React Query (Caching, fetching)
  ↓
Service (posts.service.ts, etc.)
  ↓
Axios (HTTP + Auth interceptors)
  ↓
Backend API
```

### State Management
- **Auth**: Zustand store (persisted to localStorage)
- **Server state**: React Query (automatic caching)
- **Component state**: useState (local only)

## 🔐 Authentication Flow

1. User fills login/register form
2. Form submits to `useLogin()` or `useRegister()` hook
3. Hook calls API service
4. API service sends request via Axios
5. Response contains tokens and user data
6. AuthStore stores tokens in localStorage
7. Axios interceptor attaches token to future requests
8. User redirected to `/feed`

### Token Refresh
- If request returns 401: Automatically refresh token
- If refresh fails: Redirect to login

## ♾️ Infinite Scroll Feed

The feed uses cursor-based pagination:
```
First page: /feed (no cursor)
  ↓ (returns cursor for next page)
Second page: /feed?cursor=abc123
  ↓ (returns cursor for next page)
Third page: /feed?cursor=xyz789
```

Uses Intersection Observer API to auto-load next page when user scrolls to bottom.

## 🔄 Optimistic Updates

Actions like `like`, `follow`, and `comment` update the UI immediately:
1. Click like button
2. UI shows liked state + count increased
3. Request sent to server in background
4. If error: UI rolls back to previous state
5. If success: State confirmed from server

## 📝 Common Tasks

### Add a New Page
```bash
mkdir -p src/app/newpage
touch src/app/newpage/page.tsx
```

```tsx
'use client';
import { ProtectedRoute } from '@/providers/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';

export default function NewPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        {/* Your content */}
      </MainLayout>
    </ProtectedRoute>
  );
}
```

### Add a New Component
```bash
touch src/components/myfeature/MyComponent.tsx
```

```tsx
'use client';

export function MyComponent() {
  return <div>My Component</div>;
}
```

### Add a New API Endpoint
1. Create method in `src/services/myservice.service.ts`
2. Create hook in `src/hooks/useMyFeature.ts`
3. Use hook in component

## 🐛 Debugging

### View Network Requests
- Open DevTools → Network tab
- Check headers for Authorization token

### View React Query Cache
Install React Query DevTools (optional):
```bash
npm install @tanstack/react-query-devtools
```

### Common Issues

**Q: Tokens not attaching to requests?**
- A: Make sure requests go through `apiClient` (from `@/lib/axios`)

**Q: Feed not loading?**
- A: Check backend is running on `http://localhost:3001/api`
- A: Check NEXT_PUBLIC_API_URL is set correctly

**Q: Infinite redirects on protected routes?**
- A: ProtectedRoute component checks AuthStore.isAuthenticated
- A: Make sure tokens are being saved properly

## 📚 Project Structure

```
src/
├── app/                      # Pages (Next.js routing)
├── components/               # Reusable React components
├── hooks/                    # React Query hooks
├── services/                 # API communication layer
├── lib/                      # Utilities & config (axios, utils)
├── store/                    # Global state (Zustand)
├── types/                    # TypeScript interfaces
└── providers/                # React context providers
```

## ⚡ Performance Tips

1. **Don't re-fetch unnecessary data**: React Query caches automatically
2. **Use skeletons for loading**: Better UX than spinners
3. **Lazy load components**: For routes not immediately needed
4. **Memoize expensive calculations**: Use `useMemo`
5. **Monitor bundle size**: `npm run build` shows size

## 🎨 Styling

All styling uses **Tailwind CSS**. No custom CSS needed for most cases.

Dark mode is built-in via `dark:` classes:
```tsx
<div className="bg-white dark:bg-black text-black dark:text-white">
```

## 📦 Key Dependencies

- `next@16` - React framework
- `react@19` - React library
- `@tanstack/react-query@5` - Server state management
- `zustand@4` - Global state management
- `axios@1` - HTTP client
- `tailwindcss@4` - Styling
- `lucide-react@latest` - Icons

## 🔗 Useful Links

- [Frontend Guide](./FRONTEND_GUIDE.md) - Detailed architecture
- [Next.js Docs](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com)

## ✅ Checklist Before Deployment

- [ ] Backend API is deployed
- [ ] NEXT_PUBLIC_API_URL points to production API
- [ ] Error tracking is set up (Sentry)
- [ ] Analytics configured
- [ ] All environment variables set
- [ ] Build succeeds: `npm run build`
- [ ] Test all auth flows
- [ ] Test feed pagination
- [ ] Mobile responsive tested

---

**Ready to develop?** Run `npm run dev` and start building! 🎉
