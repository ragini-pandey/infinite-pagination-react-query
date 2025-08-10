# Infinite Pagination with React Query ♾️

A tiny demo of infinite scrolling built with React Query’s `useInfiniteQuery`, Vite, and TypeScript. The app mocks a paginated API (via a local items source) and loads additional pages as you scroll.

A live StackBlitz demo is linked in the repo header.

## ✨ Features
- Infinite scrolling with `useInfiniteQuery`
- Optimistic page appends and smooth UX
- Mocked paginated API (no backend required)
- Vite + React + TypeScript + Tailwind setup
- Clean, minimal component structure

## 🚀 Quick Start

```bash
# 1) Install
pnpm install
# or: npm install / yarn

# 2) Run dev
pnpm run dev
# or: npm run dev / yarn dev

# 3) Open the URL Vite prints (usually http://localhost:5173)
```

## 🧠 How It Works

### 1) Query setup with `useInfiniteQuery`
```ts
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  status,
} = useInfiniteQuery({
  queryKey: ['items'],
  queryFn: ({ pageParam = 1 }) => fetchPage(pageParam), // mocked fetch
  getNextPageParam: (lastPage) => lastPage.nextPage ?? false,
});
```

### 2) Mocked paginated fetch
```ts
async function fetchPage(page: number) {
  await new Promise(r => setTimeout(r, 300));

  const pageSize = 20;
  const start = (page - 1) * pageSize;
  const end   = start + pageSize;

  const slice = ALL_ITEMS.slice(start, end);
  const nextPage = end < ALL_ITEMS.length ? page + 1 : undefined;

  return { items: slice, nextPage };
}
```

### 3) Triggering next page on scroll (Intersection Observer)
```ts
const loadMoreRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  if (!loadMoreRef.current || !hasNextPage) return;

  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) fetchNextPage();
  });
  io.observe(loadMoreRef.current);
  return () => io.disconnect();
}, [hasNextPage, fetchNextPage]);
```

```tsx
{/* …list rendering… */}
<div ref={loadMoreRef} />
{isFetchingNextPage && <p>Loading more…</p>}
```

## 📂 Project Structure
```
.
├─ src/
│  ├─ components/        # UI components (list, item, loader)
│  ├─ data/              # mocked items source (e.g., items.ts)
│  ├─ hooks/             # query + intersection logic (optional)
│  ├─ App.tsx
│  └─ main.tsx
├─ index.html
├─ vite.config.ts
├─ tailwind.config.js
└─ tsconfig.json
```

## 🧩 Tech Stack
- **React + TypeScript** (Vite)
- **@tanstack/react-query** for server-state + infinite queries
- **Tailwind CSS** for styling

## 🧪 Tips & Notes
- Tune `pageSize` and the `IntersectionObserver` root margin for smoother prefetching.
- Handle empty states: show a friendly “No results” when `items.length === 0`.
- Cache keys (`['items']`) should include filters/search params if you add them later.

## ▶️ Live Demo
[View on StackBlitz](https://stackblitz.com/github/ragini-pandey-dev/infinite-pagination-react-query-poc?file=src%2FApp.tsx)
