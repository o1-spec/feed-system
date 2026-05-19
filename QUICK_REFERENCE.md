# 🎯 Quick Reference Card

## Command Cheat Sheet

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

# Install
npm install          # Install all dependencies
npm install <name>   # Install specific package
```

## File Locations

| Need | Location |
|------|----------|
| Add a page | `src/app/path/page.tsx` |
| Add a component | `src/components/folder/Name.tsx` |
| Add a hook | `src/hooks/useName.ts` |
| Add API service | `src/services/name.service.ts` |
| Add type | `src/types/index.ts` |
| Configure React Query | `src/providers/ReactQueryProvider.tsx` |
| Configure auth | `src/store/auth.store.ts` |
| Style component | Use Tailwind classes (no separate CSS) |

## Component Template

```tsx
'use client';

export function MyComponent() {
  return <div>Hello</div>;
}
```

## Hook Template

```tsx
import { useQuery } from '@tanstack/react-query';
import { myService } from '@/services/my.service';

export const useMyData = () => {
  return useQuery({
    queryKey: ['myKey'],
    queryFn: () => myService.getData(),
  });
};
```

## Service Template

```tsx
import apiClient from '@/lib/axios';

export const myService = {
  getData: async () => {
    const { data } = await apiClient.get('/endpoint');
    return data;
  },
};
```

## Using a Hook in Component

```tsx
import { useMyData } from '@/hooks/useMyData';

export function MyComponent() {
  const { data, isLoading, error } = useMyData();

  if (isLoading) return <Skeleton />;
  if (error) return <div>Error</div>;
  
  return <div>{/* render data */}</div>;
}
```

## Common Patterns

### Form Submission
```tsx
const mutation = useMutation({
  mutationFn: (data) => myService.create(data),
});

const handleSubmit = (e) => {
  e.preventDefault();
  mutation.mutate(formData);
};
```

### Optimistic Update
```tsx
onMutate: async (newData) => {
  await queryClient.cancelQueries({ queryKey: ['items'] });
  const old = queryClient.getQueryData(['items']);
  queryClient.setQueryData(['items'], (prev) => updateCache(prev));
  return { old };
},
onError: (err, data, context) => {
  queryClient.setQueryData(['items'], context.old);
},
```

### Infinite Scroll
```tsx
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['items'],
  queryFn: ({ pageParam }) => myService.getItems(pageParam),
  getNextPageParam: (last) => last.hasMore ? last.cursor : undefined,
});

const items = data?.pages.flatMap(p => p.data) || [];
```

### Protected Page
```tsx
export default function MyPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        {/* content */}
      </MainLayout>
    </ProtectedRoute>
  );
}
```

## Tailwind Tips

```tsx
// Responsive
<div className="w-full md:w-1/2 lg:w-1/3">

// Dark mode
<div className="bg-white dark:bg-black">

// Hover
<button className="bg-blue-500 hover:bg-blue-600">

// Disabled
<button disabled:opacity-50>

// Animations
<div className="animate-pulse">

// Spacing
<div className="p-4 m-2 gap-3">
```

## Debugging

```tsx
// Log data
console.log('data:', data);

// Check cache
// Install: npm install @tanstack/react-query-devtools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
<ReactQueryDevtools initialIsOpen={false} />

// Check store
console.log(AuthStore.getState());

// Check tokens
console.log(localStorage.getItem('auth-store'));
```

## TypeScript Tips

```tsx
// Typing props
interface MyProps {
  title: string;
  count: number;
  onClick?: () => void;
}

// Typing state
const [items, setItems] = useState<Post[]>([]);

// Typing function
const getName = (user: User): string => user.name;

// Generic types
const data: PaginatedResponse<Post> = ...
```

## Types Reference

```tsx
// User
{ id, username, email, bio, avatarUrl, 
  followersCount, followingCount, isFollowing }

// Post
{ id, content, author, likesCount, commentsCount, 
  isLiked, createdAt, updatedAt }

// Comment
{ id, content, author, postId, likesCount, 
  isLiked, createdAt }

// PaginatedResponse<T>
{ data: T[], cursor?, hasMore }
```

## API Endpoints

```
Auth:        /api/auth/...
Feed:        /api/feed
Posts:       /api/posts/...
Users:       /api/users/...
Comments:    /api/posts/:id/comments
Notifications: /api/notifications/...
```

## Hot Keys

```
Cmd+K / Ctrl+K    Search in VS Code
Cmd+/ / Ctrl+/    Comment code
Cmd+B / Ctrl+B    Toggle sidebar
F12                Open DevTools
Cmd+Shift+C        Inspect element
```

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| Module not found | Check import path (use @/) |
| Types missing | Check src/types/index.ts |
| Hook warnings | Move hook to top of component |
| Re-render loops | Check dependency arrays |
| 401 errors | Check NEXT_PUBLIC_API_URL |
| Cache not updating | Call queryClient.invalidateQueries() |

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Note**: Only variables prefixed with `NEXT_PUBLIC_` are exposed to browser.

## Useful VS Code Extensions

- ESLint
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin
- REST Client
- Prisma
- React-specific ones

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Component | PascalCase | `MyComponent.tsx` |
| Hook | camelCase, use* | `useMyData.ts` |
| Service | camelCase, .service.ts | `posts.service.ts` |
| Type | PascalCase | `Post`, `User` |
| Folder | kebab-case | `my-folder/` |
| CSS class | kebab-case | `my-class` |

## Git Workflow (Recommended)

```bash
# Create branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "feat: add my feature"

# Push
git push origin feature/my-feature

# Create pull request
# -> Review
# -> Merge
# -> Delete branch
```

## Production Checklist

- [ ] npm run build succeeds
- [ ] No console errors
- [ ] No console warnings
- [ ] All pages load
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] Auth flows work
- [ ] API connected
- [ ] Error handling working
- [ ] Loading states showing

## Performance Tips

1. **Use React Query** - Don't fetch manually
2. **Use Skeletons** - Not spinners
3. **Use Code Splitting** - Auto by Next.js
4. **Memoize Heavy Comps** - React.memo()
5. **Optimize Images** - Use next/image
6. **Monitor Bundle** - npm run build shows size

## Resources

- [React Docs](https://react.dev)
- [Next.js Docs](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org/docs)
- [MDN Web Docs](https://developer.mozilla.org)

---

**Print this and keep it handy!** 📌
