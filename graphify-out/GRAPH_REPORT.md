# Graph Report - frontend  (2026-11-18)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 92 nodes · 171 edges · 12 communities (7 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- package.json
- next
- layout.js
- AuthProvider.js
- products/[id]/page.js
- competitions/page.js
- react
- compilerOptions
- next.config.mjs
- competitions.js
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `next` - 13 edges
2. `apiFetch()` - 11 edges
3. `react` - 11 edges
4. `useAuth()` - 8 edges
5. `AddCompetitionModal()` - 7 edges
6. `Home()` - 5 edges
7. `ProductCard()` - 5 edges
8. `Navbar()` - 5 edges
9. `Providers()` - 5 edges
10. `VideoPlaceholder()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `ProductsPage()` --calls--> `ProductCard()`  [EXTRACTED]
  app/products/page.js → components/ProductCard.js
- `CompetitionPreview()` --calls--> `apiFetch()`  [EXTRACTED]
  components/CompetitionPreview.js → lib/api.js
- `AuthProvider()` --calls--> `apiFetch()`  [EXTRACTED]
  components/AuthProvider.js → lib/api.js
- `CompetitionDetailPage()` --calls--> `apiFetch()`  [EXTRACTED]
  app/competitions/[id]/page.js → lib/api.js
- `CompetitionsPage()` --calls--> `apiFetch()`  [EXTRACTED]
  app/competitions/page.js → lib/api.js

## Import Cycles
- None detected.

## Communities (12 total, 5 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.12
Nodes (19): dependencies, next@16.3.4, next-themes@^0.4.6, react@19.2.8, react-dom@19.2.8, devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4 (+11 more)

### Community 1 - "next"
Cohesion: 0.24
Nodes (8): Home(), ProductsPage(), AboutSection(), CompetitionPreview(), Hero(), ProductCard(), dummyProducts, next

### Community 2 - "layout.js"
Cohesion: 0.31
Nodes (7): metadata, RootLayout(), AuthGate(), AuthProvider(), Footer(), Navbar(), Providers()

### Community 3 - "AuthProvider.js"
Cohesion: 0.33
Nodes (6): AuthContext, API_URL, ApiError, apiFetch(), getToken(), TOKEN_KEY

### Community 4 - "products/[id]/page.js"
Cohesion: 0.39
Nodes (3): CompetitionDetailPage(), ProductDetailPage(), VideoPlaceholder()

### Community 5 - "competitions/page.js"
Cohesion: 0.54
Nodes (6): CompetitionsPage(), AddCompetitionModal(), deriveParticipants(), deriveVideos(), emptyFormState(), emptyParticipant()

### Community 6 - "react"
Cohesion: 0.48
Nodes (4): LoginPage(), useAuth(), ThemeToggle(), react

## Knowledge Gaps
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `package.json`, `AuthProvider.js`, `products/[id]/page.js`, `competitions/page.js`, `react`?**
  _High betweenness centrality (0.274) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.12105263157894737 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `package.json`, `next`, `AuthProvider.js`, `products/[id]/page.js`, `competitions/page.js`?**
  _High betweenness centrality (0.176) - this node is a cross-community bridge._
- **Why does `apiFetch()` connect `AuthProvider.js` to `next`, `layout.js`, `products/[id]/page.js`, `competitions/page.js`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._