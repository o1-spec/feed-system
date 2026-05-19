# Architecture & Best Practices Guide

## 🏗️ Frontend Architecture Overview

### Layers

```
┌─────────────────────────────────────────┐
│         Pages (App Router)              │  ← User facing routes
├─────────────────────────────────────────┤
│      Components (React + UI)            │  ← Reusable UI elements
├─────────────────────────────────────────┤
│      Hooks (React Query + State)        │  ← Data fetching & state
├─────────────────────────────────────────┤
│      Services (API Layer)               │  ← Backend communication
├─────────────────────────────────────────┤
│      Axios (HTTP Client)                │  ← Network requests
├─────────────────────────────────────────┤
│      Store (Zustand)                    │  ← Global auth state
└─────────────────────────────────────────┘
```

---

## 📁 File Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home (redirects to /feed)
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── feed/page.tsx
│   ├── profile/
│   │   ├── edit/page.tsx        # ✨ NEW
│   │   └── [userId]/
│   │       ├── page.tsx
│   │       ├── followers/page.tsx # ✨ NEW
│   │       └── following/page.tsx # ✨ NEW
│   ├── posts/[postId]/page.tsx
│   ├── notifications/page.tsx
│   └── users/page.tsx           # ✨ NEW
│
├── components/
│   ├── common/
│   │   ├── EmptyState.tsx       # ✨ NEW
│   │   ├── ErrorState.tsx       # ✨ NEW
│   │   ├── RetryButton.tsx      # ✨ NEW
│   │   ├── SearchInput.tsx      # ✨ NEW
│   │   ├── Skeleton.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx          # Modified: Added /users link
│   │   └── MainLayout.tsx
│   ├── user/
│   │   ├── UserCard.tsx         # Enhanced styling
│   │   └── UserList.tsx         # ✨ NEW
│   ├── post/
│   │   ├── PostCard.tsx
│   │   └── CreatePostBox.tsx
│   ├── feed/
│   │   └── FeedList.tsx
│   └── auth/
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useFeed.ts
│   ├── usePost.ts
│   ├── useUser.ts               # ✨ Added: useUpdateUser
│   └── useUsers.ts              # ✨ NEW: useSuggestedUsers, useSearchUsers
│
├── services/
│   ├── auth.service.ts
│   ├── feed.service.ts
│   ├── posts.service.ts
│   ├── users.service.ts         # ✨ Added: getSuggestedUsers, updateUser
│   └── notifications.service.ts
│
├── store/
│   └── auth.store.ts            # Zustand auth store
│
├── lib/
│   ├── axios.ts                 # HTTP client with interceptors
│   ├── toast.ts                 # ✨ NEW: Toast utilities
│   └── utils.ts                 # Helpers (cn, formatDate, etc)
│
├── providers/
│   ├── ReactQueryProvider.tsx
│   ├── ProtectedRoute.tsx
│   └── ToastProvider.tsx         # ✨ NEW
│
└── types/
    └── index.ts                 # TypeScript interfaces
```

---

## 🔄 Data Flow Pattern

### Example: Follow User Flow

```
Component (UserCard)
    ↓
useFollowUser() hook
    ↓
mutation.mutateAsync(userId)
    ↓
usersService.followUser(userId)
    ↓
apiClient.post('/users/{userId}/follow')
    ↓
Axios interceptor (add token)
    ↓
Backend API
    ↓
Response received
    ↓
Query cache updated (optimistic)
    ↓
onSuccess callback
    ↓
Component re-renders with new state
    ↓
Toast notification shown
```

---

## 🎯 Key Design Decisions

### 1. React Query for Server State

**Why**: 
- Automatic caching and synchronization
- Built-in loading/error states
- Optimistic updates support
- Request deduplication

**Not for Auth**:
- Auth token stored in Zustand (sync state)
- Separate from server state

### 2. Zustand for Auth State Only

**Why**:
- Auth state needed synchronously (redirect checks)
- Small, simple state
- localStorage persistence for session

**Everything else** uses React Query

### 3. Centralized API Services

**Benefits**:
- Single source of truth for API endpoints
- Easy to mock in tests
- Type-safe request/response
- Consistent error handling

### 4. Custom Hooks for Complex Logic

**Pattern**:
```typescript
// ✅ Good: Hide complexity in hook
const { data, isLoading, mutate } = useFollowUser()

// ❌ Avoid: Direct API calls in components
const response = await fetch('/api/users/follow')
```

### 5. Optimistic Updates Pattern

**Pattern**:
```typescript
return useMutation({
  mutationFn: async (data) => {
    // Make API call
  },
  onMutate: async (data) => {
    // Update cache BEFORE response
    // FAST feedback to user
  },
  onError: (err, data, context) => {
    // Rollback if request fails
  },
  onSettled: () => {
    // Revalidate after response
  }
})
```

---

## 💾 Caching Strategy

### Query Keys
```typescript
// Single query
queryKey: ['users', { userId }]

// List query
queryKey: ['followers', userId]

// Search query
queryKey: ['users', 'search', { query, limit }]
```

### Stale Time
```typescript
staleTime: 5 * 60 * 1000  // 5 minutes
// Data stays fresh for 5 min
// No new requests if data already fetched
```

### GC Time
```typescript
gcTime: 10 * 60 * 1000  // 10 minutes
// Keep unused queries in cache for 10 min
// Instant refetch if user navigates back
```

---

## 🚀 Performance Optimizations

### 1. Skeleton Loaders
```typescript
// Instead of spinner, show placeholder
{isLoading ? <Skeleton.PostCard /> : <PostCard />}
```

**Benefits**:
- Better perceived performance
- Looks like content will appear
- Keeps layout stable

### 2. Debounced Search
```typescript
const [timeoutId, setTimeoutId] = useState(null)

const handleChange = (value) => {
  if (timeoutId) clearTimeout(timeoutId)
  
  const id = setTimeout(() => {
    onSearch(value)  // Only call after 300ms pause
  }, 300)
  
  setTimeoutId(id)
}
```

**Benefits**:
- Fewer API calls while typing
- Better UX (no lag)
- Reduced server load

### 3. Infinite Queries (Ready for Use)
```typescript
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ['feed'],
  queryFn: ({ pageParam }) => getFeed(pageParam),
  getNextPageParam: (lastPage) => lastPage.cursor
})

// Use in IntersectionObserver
if (inView) fetchNextPage()
```

**Benefits**:
- Load data as user scrolls
- Memory efficient
- Smooth scrolling experience

### 4. Image Optimization
- ✅ Use Next.js Image component (already in app)
- ✅ Lazy load images
- ✅ Responsive images

### 5. Code Splitting
- ✅ Automatic with App Router
- ✅ Each route is a separate bundle
- ✅ Faster initial load

---

## 🔐 Type Safety

### Complete Type Coverage

```typescript
// ✅ All functions typed
export const followUser = async (userId: string): Promise<User> => {
  const { data } = await apiClient.post(`/users/${userId}/follow`)
  return data
}

// ✅ All hook returns typed
export const useFollowUser = (): UseMutationResult<User, Error, string> => {
  return useMutation({...})
}

// ✅ All components accept typed props
interface UserCardProps {
  user: User
  onFollowChange?: () => void
}

export const UserCard = ({ user, onFollowChange }: UserCardProps) => {
  // ...
}
```

### Benefits
- Auto-complete in IDE
- Catch errors at compile time
- Self-documenting code
- Easier refactoring

---

## 🧪 Testing Patterns

### Component Testing
```typescript
// ✅ Test behavior, not implementation
test('shows error on fetch failure', () => {
  // Render with error state
  // Verify error message
  // Verify retry button
})

// ❌ Avoid: Testing implementation details
test('calls fetch function', () => {
  expect(fetch).toHaveBeenCalled()
})
```

### Hook Testing
```typescript
const { result } = renderHook(() => useFollowUser())

act(() => {
  result.current.mutate(userId)
})

await waitFor(() => {
  expect(result.current.isSuccess).toBe(true)
})
```

### API Mocking
```typescript
// Mock API for tests
msw.use(
  http.post('/api/users/:id/follow', () => {
    return HttpResponse.json({ id, isFollowing: true })
  })
)
```

---

## 📋 Best Practices Checklist

### Code Quality
- [ ] No `any` types (strict TypeScript)
- [ ] No console.log in production code
- [ ] Meaningful variable names
- [ ] Functions < 50 lines
- [ ] Single responsibility principle
- [ ] DRY (Don't Repeat Yourself)

### Performance
- [ ] Optimize queries (staleTime, gcTime)
- [ ] Use React.memo for expensive components
- [ ] Debounce search/input
- [ ] Lazy load routes
- [ ] No unnecessary re-renders

### UX/Accessibility
- [ ] Keyboard navigation works
- [ ] Semantic HTML
- [ ] ARIA labels where needed
- [ ] Color contrast sufficient
- [ ] Touch targets >= 44px
- [ ] Error messages helpful

### Error Handling
- [ ] Try-catch in async functions
- [ ] User-friendly error messages
- [ ] Retry mechanisms
- [ ] Graceful degradation
- [ ] No silent failures

### Security
- [ ] Sanitize user input
- [ ] Never expose sensitive data
- [ ] Use HTTPS
- [ ] Validate on backend
- [ ] CORS configured
- [ ] No hardcoded secrets

---

## 🔗 API Integration Rules

### Request Headers
```typescript
// Automatically added by axios interceptor
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response Handling
```typescript
// Success (2xx)
{
  data: T,
  cursor?: string,
  hasMore?: boolean
}

// Error (4xx/5xx)
{
  message: string,
  code: string
}
```

### Token Refresh
```typescript
// Automatic via interceptor:
// 1. Request sent with token
// 2. If 401 response → refresh token
// 3. Retry request with new token
// 4. If refresh fails → redirect to login
```

---

## 📚 Dependency Graph

```
Pages
  ↓
Components
  ├→ Common Components (ErrorState, EmptyState)
  ├→ Layout Components (Navbar, Sidebar)
  └→ Feature Components (UserCard, PostCard)
  
Hooks
  ├→ useAuth (auth queries/mutations)
  ├→ useFeed (feed queries/mutations)
  ├→ usePost (post queries/mutations)
  ├→ useUser (user queries/mutations)
  └→ useUsers (user discovery)
  
Services
  ├→ auth.service
  ├→ feed.service
  ├→ posts.service
  ├→ users.service
  └→ notifications.service
  
Axios
  ├→ Request interceptor (add token)
  └→ Response interceptor (handle 401)

Zustand
  └→ AuthStore (user, tokens, auth state)
```

---

## 🔄 Common Tasks

### Add a New Page

1. **Create file**: `src/app/feature/page.tsx`
2. **Wrap with ProtectedRoute** if private
3. **Use MainLayout** for consistent layout
4. **Add types** in `src/types/index.ts`
5. **Create hooks** in `src/hooks/useFeature.ts`
6. **Add services** in `src/services/feature.service.ts`

### Add a New Component

1. **Create file**: `src/components/feature/ComponentName.tsx`
2. **Define props interface**
3. **Use TypeScript strict mode**
4. **Export for reuse**
5. **Test responsiveness**

### Add a New API Method

1. **Add to service**: `src/services/feature.service.ts`
2. **Type request/response**
3. **Add to hook**: `src/hooks/useFeature.ts`
4. **Handle loading/error**
5. **Test with backend**

---

## 🎓 Learning Resources

### Recommended Patterns

**React Query**
- Query client configuration
- useQuery vs useInfiniteQuery
- Optimistic updates pattern
- Cache invalidation

**TypeScript**
- Interfaces vs Types
- Generics for reusability
- Union types for flexibility
- Exhaustive checks

**Next.js App Router**
- File-based routing
- Server vs Client components
- Data fetching patterns
- Error boundaries

**Tailwind CSS**
- Utility-first approach
- Responsive design
- Dark mode support
- Component composition

---

## ✅ Code Review Checklist

When reviewing new code:

- [ ] TypeScript types complete
- [ ] No `any` types
- [ ] Error handling present
- [ ] Loading states handled
- [ ] Responsive design works
- [ ] Dark mode tested
- [ ] No console warnings
- [ ] Tests passing
- [ ] Performance acceptable
- [ ] Accessibility OK

---

## 🚀 Deployment Considerations

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://api.example.com
NODE_ENV=production
```

### Build Optimization
```bash
npm run build  # Create optimized bundle
```

### Performance Monitoring
- Lighthouse scores
- Core Web Vitals
- Error tracking
- User analytics

### Scaling
- CDN for static assets
- Database indexing
- API rate limiting
- Caching strategy

---

## 📊 Metrics & Analytics

### Important Metrics
- Page load time (< 3s)
- Time to interactive (< 4s)
- Cumulative Layout Shift (< 0.1)
- First Input Delay (< 100ms)
- Error rate (< 0.1%)
- API response time (< 500ms)

---

This architecture is designed to be:
- ✅ **Scalable** - Can grow without major refactoring
- ✅ **Maintainable** - Clear patterns and structure
- ✅ **Type-safe** - Full TypeScript coverage
- ✅ **Performant** - Optimized for speed
- ✅ **User-friendly** - Good error handling and UX
