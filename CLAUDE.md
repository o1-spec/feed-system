# Architecture & Implementation Notes

## Production-Grade Frontend for News Feed System

### Core Design Philosophy
- **Scalable**: Modular, reusable components
- **Performant**: Optimized rendering, efficient caching
- **Maintainable**: Clean architecture, clear separation of concerns
- **Type-Safe**: Full TypeScript coverage
- **User-Centric**: Optimistic updates, loading states, error handling

## Complete Architecture

### 1. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERFACE                          │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │  Navbar    │  │  Sidebar   │  │   Main Content       │  │
│  └────────────┘  └────────────┘  └──────────────────────┘  │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│               COMPONENTS LAYER                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│  │PostCard  │  │FeedList  │  │CreateBox │  │LoginForm     │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘ │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                  HOOKS LAYER                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐ │
│  │useAuth     │  │useFeed     │  │usePost, useUser        │ │
│  │useLogin    │  │usePost     │  │(with optimistic        │ │
│  │useLogout   │  │useUserPosts│  │ updates built-in)      │ │
│  └────────────┘  └────────────┘  └────────────────────────┘ │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│             REACT QUERY LAYER                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ • useQuery (fetch data)                                 │ │
│  │ • useInfiniteQuery (pagination)                         │ │
│  │ • useMutation (create/update/delete)                   │ │
│  │ • Automatic caching, deduplication, refetching         │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│              SERVICES LAYER                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │auth.service  │  │feed.service  │  │posts.service     │   │
│  ├──────────────┤  ├──────────────┤  ├──────────────────┤   │
│  │register()    │  │getFeed()     │  │createPost()      │   │
│  │login()       │  │getPostById() │  │likePost()        │   │
│  │logout()      │  │getUserPosts()│  │deletePost()      │   │
│  │getCurrentUser│  │              │  │createComment()   │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│              AXIOS + INTERCEPTORS                            │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Request Interceptor:                                    │ │
│  │   • Attach Authorization header                         │ │
│  │                                                         │ │
│  │ Response Interceptor:                                   │ │
│  │   • Handle 401 → Refresh token                          │ │
│  │   • Retry request with new token                        │ │
│  │   • Redirect to login if refresh fails                  │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                  BACKEND API                                 │
│         http://localhost:3001/api/...                        │
└──────────────────────────────────────────────────────────────┘
```

### 2. Authentication Architecture

```
User Registration/Login
        ↓
    AuthService
        ↓
    Axios (apiClient)
        ↓
    Backend /auth/login or /auth/register
        ↓
    Returns: { accessToken, refreshToken, user }
        ↓
    AuthStore.setAuth(user, accessToken, refreshToken)
        ↓
    Tokens persisted to localStorage
        ↓
    Redirect to /feed
        ↓
    Axios interceptor attaches token to all requests
        ↓
    If 401: Automatically refresh token
        ↓
    If refresh succeeds: Retry original request
    If refresh fails: Logout + redirect to /login
```

### 3. State Management Strategy

```
GLOBAL STATE (Zustand - AuthStore)
├── user: User | null
├── accessToken: string | null
├── refreshToken: string | null
├── isAuthenticated: boolean
└── isLoading: boolean

SERVER STATE (React Query)
├── Queries (useQuery)
│   ├── ['currentUser']
│   ├── ['feed']
│   ├── ['post', postId]
│   ├── ['user', userId]
│   └── ['comments', postId]
│
└── Mutations (useMutation)
    ├── createPost
    ├── likePost / unlikePost
    ├── followUser / unfollowUser
    ├── createComment
    └── deletePost

COMPONENT STATE (useState)
├── Form inputs
├── UI toggles
└── Local filters
```

## Key Implementation Details

### Optimistic Updates Pattern

```typescript
export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postsService.likePost(postId),
    
    // 1. BEFORE request - update cache immediately
    onMutate: async (postId: string) => {
      // Cancel ongoing requests
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      
      // Save previous state
      const previousFeed = queryClient.getQueryData(['feed']);
      
      // Update cache optimistically
      queryClient.setQueryData(['feed'], (old) => {
        return updateFeedWithLike(old, postId);
      });
      
      return { previousFeed }; // Save for rollback
    },
    
    // 2. ON ERROR - rollback to previous state
    onError: (err, postId, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(['feed'], context.previousFeed);
      }
    },
    
    // 3. ON SUCCESS - ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};
```

### Infinite Scroll Implementation

```typescript
// Hook
export const useFeed = (limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => feedService.getFeed(pageParam, limit),
    getNextPageParam: (lastPage) => 
      lastPage.hasMore ? lastPage.cursor : undefined,
    initialPageParam: undefined,
  });
};

// Component
export function FeedList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeed();
  const observerTarget = useRef(null);

  // Intersection Observer triggers fetchNextPage when element visible
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    
    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const posts = data?.pages.flatMap((page) => page.data) || [];
  
  return (
    <>
      {posts.map(post => <PostCard key={post.id} post={post} />)}
      <div ref={observerTarget} /> {/* Trigger point */}
    </>
  );
}
```

### Protected Routes

```typescript
export function ProtectedRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = AuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return null;
  
  return <>{children}</>;
}

// Usage
export default function FeedPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        {/* Content */}
      </MainLayout>
    </ProtectedRoute>
  );
}
```

## Performance Optimizations

1. **React Query Caching**
   - Stale time: 5 minutes
   - Cache time: 10 minutes
   - Prevents redundant requests

2. **Code Splitting**
   - Next.js automatically code-splits by route
   - Dynamic imports for heavy components

3. **Skeleton Loaders**
   - Shows loading state without white flash
   - Better perceived performance

4. **Memoization**
   - Components are only re-rendered when props change
   - Hooks don't re-run unless dependencies change

5. **Intersection Observer**
   - Efficient infinite scroll
   - No polling or manual scroll listeners

## File Organization Rationale

```
src/
├── app/                    # Pages follow Next.js convention
├── components/
│   ├── layout/            # Grouped by feature for easy discovery
│   ├── feed/
│   ├── post/
│   ├── auth/
│   └── common/
├── hooks/                  # All data-fetching logic centralized
├── services/              # Single source of truth for API
├── lib/                   # Pure utilities
├── store/                 # Global state separate and clear
├── types/                 # All types in one file for consistency
└── providers/             # Context providers
```

## Testing Strategy (Future)

```
1. Unit Tests
   - Utility functions (formatDate, formatNumber, etc)
   - Type definitions

2. Component Tests
   - Form components (LoginForm, RegisterForm)
   - UI components (PostCard, Skeleton)

3. Hook Tests
   - React Query hooks behavior
   - Store updates

4. Integration Tests
   - Auth flow (login → redirect → feed)
   - Feed infinite scroll
   - Post creation + like

5. E2E Tests
   - Full user journey
   - API integration
```

## Scalability Considerations

1. **Add new endpoints**
   - Create service method
   - Create React Query hook
   - Use in component

2. **Add new pages**
   - Create route in app/
   - Use MainLayout wrapper
   - Use existing hooks

3. **Cache strategies**
   - Stale time + cache time tunable per hook
   - Invalidation patterns well-defined

4. **Error handling**
   - Centralized in Axios interceptors
   - Component-level fallbacks

5. **Type safety**
   - All types in one file
   - Easy to update across app

## Next Steps to Production

1. **Error Tracking**: Integrate Sentry
2. **Analytics**: Add Mixpanel or GA
3. **Performance Monitoring**: Web Vitals tracking
4. **Image Optimization**: Add cloudinary/imgix
5. **Real-time Features**: Implement Socket.io for notifications
6. **PWA**: Add service workers for offline support
7. **Security**: CORS, CSP headers
8. **Testing**: Add Jest + React Testing Library
9. **CI/CD**: GitHub Actions or similar
10. **Monitoring**: Uptime monitoring, error alerts

---

This architecture supports rapid feature development while maintaining code quality and performance at scale.

