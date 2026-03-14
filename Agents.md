# DevRoast - Code Roasting Platform

A web application that roasts your code — brutally honest or full roast mode.

## Tech Stack

- **Next.js 16** - React framework
- **Tailwind CSS v4** - Styling
- **Biome** - Linting & formatting
- **Radix UI** - Accessible components
- **Shiki** - Server-side syntax highlighting

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx     # Homepage
│   ├── layout.tsx   # Root layout with Navbar
│   └── components/  # Components showcase page
├── components/
│   ├── ui/          # Reusable UI components
│   │   ├── button.tsx
│   │   ├── toggle.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── code-block.tsx
│   │   ├── diff-line.tsx
│   │   ├── score-ring.tsx
│   │   └── table-row.tsx
│   ├── code-editor.tsx
│   ├── leaderboard-table.tsx
│   └── navbar.tsx
```

## Scripts

```bash
pnpm dev      # Start dev server
pnpm build    # Production build
pnpm lint     # Run Biome check
pnpm lint:fix # Auto-fix lint issues
pnpm format   # Format code
```

## UI Components

Located in `src/components/ui/`:
- Button - Multiple variants (primary, secondary, outline, ghost, destructive)
- Toggle - Radix-based switch with controlled/uncontrolled modes
- Badge - Status indicators (critical, warning, good)
- Card - Generic card component
- CodeBlock - Server-rendered syntax highlighting with Shiki
- DiffLine - Code diff visualization
- ScoreRing - Circular progress display
- TableRow - Leaderboard row component

## Design Tokens

Defined in `src/app/globals.css` using Tailwind @theme:
- `--color-button-primary`
- `--color-button-text`
- `--color-toggle-on`
