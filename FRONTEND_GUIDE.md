# Frontend Development Guide - News Feed System

## Project Overview

This is a production-grade frontend for a scalable News Feed System built with **Next.js 15+**, **TypeScript**, **React Query**, and **Zustand**. The architecture prioritizes clean code, performance, and scalability.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: 
  - Zustand (Global auth state)
  - React Query (Server state & caching)
- **HTTP Client**: Axios (with interceptors)
- **Icons**: Lucide React
- **Type Safety**: Full TypeScript coverage

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── auth/
│   │   ├── login/           # Login page
│   │   └── register/        # Register page
│   ├── feed/                # Main feed page
│   ├── notifications/       # Notifications page
│   ├── profile/[userId]/    # User profile page
│   ├── posts/[postId]/      # Single post page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home redirect
│   └── globals.css          # Global styles
│
├── components/              # Reusable React components
│   ├── auth/               # Auth components
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── layout/             # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainLayout.tsx
│   ├── feed/              # Feed components
│   │   └── FeedList.tsx
│   ├── post/              # Post components
│   │   ├── PostCard.tsx
│   │   └── CreatePostBox.tsx
│   └── common/            # Shared components
│       └── Skeleton.tsx   # Loading skeletons
│
├── hooks/                  # React Query custom hooks
│   ├── useAuth.ts         # Auth operations
│   ├── useFeed.ts         # Feed queries
│   ├── usePost.ts         # Post mutations & queries
│   └── useUser.ts         # User queries & mutations
│
├── services/              # API service layer
│   ├── auth.service.ts    # Auth endpoints
│   ├── feed.service.ts    # Feed endpoints
│   ├── posts.service.ts   # Post endpoints
│   ├── users.service.ts   # User endpoints
│   └── notifications.service.ts
│
├── lib/                   # Utilities & configuration
│   ├── axios.ts          # Axios instance with interceptors
│   └── utils.ts          # Utility functions
│
├── store/                # Global state (Zustand)
│   └── auth.store.ts     # Auth state management
│
├── types/               # TypeScript types
│   └── index.ts        # All domain types
│
└── providers/          # React providers
    ├── ReactQueryProvider.tsx
    └── ProtectedRoute.tsx
```

## Architecture Decisions

### 1. **Separation of Concerns**
- **Services**: Handle all API communication
- **Hooks**: Manage data fetching with React Query
- **Components**: Pure presentation logic only
- **Store**: Global authentication state

### 2. **Authentication Flow**
```typescript
Login → AuthStore.setAuth() → Token stored in localStorage
→ Axios interceptor attaches token to requests
→ 401 response → Auto-refresh with refresh token
→ Failed refresh → Redirect to login
```

### 3. **Optimistic Updates**
All mutations (like, follow, create) use optimistic updates:
1. Update cache immediately
2. Send request to server
3. Rollback on error
4. Revalidate on success

### 4. **Infinite Scroll Implementation**
- Uses Intersection Observer API
- Cursor-based pagination (scalable)
- React Query `useInfiniteQuery` for data management
- Automatic cache management

### 5. **Performance Optimizations**
- Skeleton loaders for better perceived performance
- Query stale time: 5 minutes
- Cache time: 10 minutes
- Disabled refetch on window focus
- Memoization of expensive computations

## Key Features Implemented

### ✅ Authentication
- Register with email/username/password validation
- Login with email and password
- JWT token handling (access + refresh)
- Automatic token refresh on 401
- Secure token storage with Zustand persistence
- Protected routes with ProtectedRoute wrapper

### ✅ Feed
- Infinite scrolling with cursor pagination
- Skeleton loaders while loading
- Empty states
- Intersection Observer for auto-loading

### ✅ Posts
- Create posts with character count
- Like/unlike with optimistic updates
- Delete own posts
- View post details
- Comments on posts

### ✅ Social Features
- Follow/unfollow users with optimistic updates
- User profiles with follower/following counts
- User posts view
- User bio display

### ✅ UI/UX
- Modern Twitter/X-like interface
- Responsive design (mobile-first)
- Dark mode support (via Tailwind)
- Smooth transitions
- Loading states everywhere

## API Integration

### Example: Fetching Feed with Cache
```typescript
// In a component
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeed();

// Automatic caching, refetching, pagination handled by React Query
```

### Example: Optimistic Like Update
```typescript
// The hook handles:
// 1. Cancel outgoing requests
// 2. Save previous state
// 3. Update UI immediately
// 4. Send request
// 5. Rollback on error or revalidate on success
const { mutate: likePost } = useLikePost();
```

## Setting Up Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Create .env.local file with:
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Running Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
npm start
```

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Note**: Prefix with `NEXT_PUBLIC_` to expose to browser.

## Common Patterns

### Adding a New Feature

1. **Create the API service**
```typescript
// services/myfeature.service.ts
export const myfeatureService = {
  getData: async () => {
    const { data } = await apiClient.get('/endpoint');
    return data;
  },
};
```

2. **Create a React Query hook**
```typescript
// hooks/useMyFeature.ts
export const useMyFeature = () => {
  return useQuery({
    queryKey: ['myfeature'],
    queryFn: () => myfeatureService.getData(),
  });
};
```

3. **Use in component**
```typescript
export function MyComponent() {
  const { data, isLoading } = useMyFeature();
  
  if (isLoading) return <Skeleton />;
  return <div>{/* render data */}</div>;
}
```

### Adding a New Page

1. Create folder in `src/app/` following Next.js conventions
2. Create `page.tsx`
3. Wrap with `<ProtectedRoute>` if authenticated access required
4. Use `<MainLayout>` for consistency

### Adding a Mutation

```typescript
const myMutation = useMutation({
  mutationFn: (data) => apiService.method(data),
  onMutate: (data) => {
    // Optimistic update
  },
  onError: (error, data, context) => {
    // Rollback
  },
  onSuccess: () => {
    // Invalidate cache
    queryClient.invalidateQueries({ queryKey: ['myKey'] });
  },
});
```

## Performance Tips

1. **Avoid fetching in components**: Use hooks
2. **Use React Query**: Don't manage fetching state manually
3. **Lazy load components**: Use dynamic imports
4. **Optimize images**: Use Next.js Image component
5. **Monitor bundle size**: `npm run build` shows it
6. **Use skeletons**: Never show nothing while loading

## Debugging

### React Query DevTools (Optional)
```bash
npm install @tanstack/react-query-devtools
```

Then use in layout:
```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} />
```

### Common Issues

**Issue**: "Cannot find module axios"
- **Solution**: `npm install axios`

**Issue**: "Token not attached to request"
- **Check**: AuthStore has token
- **Check**: Request goes through apiClient (not axios directly)

**Issue**: "Infinite loop on redirect"
- **Check**: ProtectedRoute is at route level, not root
- **Check**: useRouter push happens after state update

## Next Steps for Production

### Phase 2: Advanced Features
- [ ] Notifications real-time updates (Socket.io)
- [ ] Direct messaging
- [ ] Search functionality
- [ ] Hashtags and trending
- [ ] Retweets/reposts
- [ ] Image uploads
- [ ] Video support
- [ ] Analytics

### Phase 3: Optimization
- [ ] Image optimization and CDN
- [ ] Code splitting
- [ ] Service Workers
- [ ] Offline support
- [ ] Performance monitoring

### Phase 4: DevOps
- [ ] CI/CD pipeline
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics, Mixpanel)
- [ ] A/B testing
- [ ] Deployment automation

## Contributing Guidelines

1. Keep components small and focused
2. Always add proper TypeScript types
3. Use skeleton loaders for async operations
4. Implement optimistic updates for mutations
5. Add error boundaries for error handling
6. Write semantic HTML for accessibility

## Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## License

MIT
