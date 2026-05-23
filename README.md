# 📰 News Feed System - Frontend

A **production-grade frontend** for a scalable News Feed System similar to Twitter/X or Instagram.

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```


## ✨ Features Implemented

✅ **Authentication**
- Register & login with JWT
- Auto token refresh on 401
- Secure token persistence
- Protected routes

✅ **Feed**
- Infinite scroll with cursor pagination
- Skeleton loaders
- Empty states
- Responsive design

✅ **Posts**
- Create posts with character count
- Like/unlike (optimistic updates)
- Delete own posts
- Comments system

✅ **Social**
- Follow/unfollow users
- User profiles
- Follower/following counts
- User posts view

✅ **UI/UX**
- Modern Twitter-like interface
- Dark mode support
- Mobile-friendly
- Loading states everywhere

## 🏗️ Architecture

```
Components → Hooks → React Query → Services → Axios → Backend
```

Built with:
- **Next.js 15+** - React framework
- **TypeScript** - Type safety (100%)
- **React Query** - Server state management
- **Zustand** - Global auth state
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

## 📂 Project Structure

```
src/
├── app/              # Pages (Next.js App Router)
├── components/       # React components
├── hooks/           # React Query hooks
├── services/        # API services
├── lib/             # Utilities & Axios
├── store/           # Zustand auth store
├── types/           # TypeScript types
└── providers/       # React providers
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test the App
- Go to http://localhost:3000/auth/register
- Create an account
- Explore the feed

## 📖 Documentation Files

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Project structure & features
- **[FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md)** - Detailed architecture guide
- **[CLAUDE.md](./CLAUDE.md)** - Advanced architecture diagrams
- **[NEXT_STEPS.md](./NEXT_STEPS.md)** - Next steps & checklist
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Cheat sheet & code templates
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What was built
- **[IMPLEMENTATION_REPORT.md](./IMPLEMENTATION_REPORT.md)** - Complete build report

## 🧪 Build Status

- ✅ TypeScript compilation: Success
- ✅ ESLint: Passing
- ✅ Next.js build: Success
- ✅ Dev server: Running

## 🔐 Security Features

- JWT authentication with refresh tokens
- Automatic token refresh on 401
- Protected routes
- Secure token storage
- XSS protection (React default)

## ⚡ Performance Optimizations

- React Query caching (5 min stale, 10 min cache)
- Optimistic updates for instant UI feedback
- Skeleton loaders for perceived performance
- Intersection Observer for infinite scroll
- Code splitting by Next.js automatically

## 🛠️ Building for Production

```bash
npm run build
npm start
```

Output will be in `.next` folder.

## 📊 Project Stats

| Metric | Count |
|--------|-------|
| TypeScript Files | 27 |
| Components | 10+ |
| Hooks | 14+ |
| Services | 5 |
| Pages | 6 |
| Type Definitions | 6 |
| Total Lines of Code | 2,500+ |

## 🚀 Ready to Deploy

This frontend is **production-ready** and can be deployed to:
- Vercel (recommended)
- Netlify
- AWS
- Any Node.js hosting

## 💡 Key Concepts

### Optimistic Updates
Actions like like, follow, create are optimistic - UI updates immediately, request sent in background, rollback on error.

### Infinite Scroll
Uses Intersection Observer API with cursor-based pagination for scalability.

### Protected Routes
Simple wrapper component that redirects unauthenticated users to login.

### Auto Token Refresh
Axios interceptor automatically refreshes tokens on 401 responses.

## 📞 Need Help?

1. Check [QUICKSTART.md](./QUICKSTART.md) for common issues
2. Check [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md) for architecture questions
3. Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for code examples

## 📝 Technology Stack

**Frontend:**
- Next.js 15+
- React 19
- TypeScript 5
- Tailwind CSS 4

**State & Data:**
- React Query (TanStack Query)
- Zustand
- Axios

**Styling & Icons:**
- Tailwind CSS
- Lucide React

## 🤝 Contributing

1. Follow the patterns in existing code
2. Use TypeScript for type safety
3. Add skeleton loaders for async operations
4. Implement optimistic updates for mutations
5. Keep components small and focused

## 📄 License

MIT

---

**Built with ❤️ for scalability and performance**

Start with [QUICKSTART.md](./QUICKSTART.md) now! 🚀
