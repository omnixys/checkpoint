---
version: "alpha"
name: checkpoint
description: >
  Omnixys Checkpoint — productive event/ticket/scanner platform.
  Dense, information-rich Apple-inspired UI with multi-scheme theming
  (7 palettes × light/dark), custom surface/border extensions, and
  visual shader/orb tokens. MUI 9 with apple palette augmentation.
colors:
  # Scheme: Original (default)
  primary: "#6A4BBC"
  secondary: "#4E3792"
  error: "#F87171"
  success: "#A3E635"
  background-default: "#F8F8FC"
  background-paper: "#FFFFFF"
  background-default-dark: "#121212"
  background-paper-dark: "#1E1E1E"
  text-primary: "#312E81"
  text-secondary: "#6B7280"
  text-primary-dark: "#EDEDED"
  text-secondary-dark: "#BFBFC7"
  # Scheme: Red
  red-primary: "#DC2626"
  red-secondary: "#991B1B"
  # Scheme: Green
  green-primary: "#22C55E"
  green-secondary: "#16A34A"
  # Scheme: Yellow
  yellow-primary: "#F59E0B"
  yellow-secondary: "#B45309"
  # Scheme: Blue
  blue-primary: "#2563EB"
  blue-secondary: "#1E40AF"
  # Scheme: Brown
  brown-primary: "#8B5E3C"
  brown-secondary: "#6B3E1F"
  # Scheme: Wedding (checkpoint-integrated)
  wedding-primary: "#9B6B24"
  wedding-primary-dark: "#B68A45"
  # Extended surface tokens
  surface-level1: "{background-default}"
  surface-level2: "{background-paper}"
  surface-level3: "rgba(255,255,255,0.04)"
  surface-level3-light: "rgba(0,0,0,0.04)"
  border-subtle: "rgba(255,255,255,0.08)"
  border-subtle-light: "rgba(0,0,0,0.08)"
  border-strong: "rgba(255,255,255,0.16)"
  border-strong-light: "rgba(0,0,0,0.16)"
  # Visual tokens (shader/orb)
  orb-opacity: 0.65
  shader-brightness-dark: 0.3
  shader-brightness-light: 0.75
typography:
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, Roboto, sans-serif"
    fontSize: 16px
    lineHeight: 1.5
  h1:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif"
    fontWeight: 500
    fontSize: clamp(1.75rem, 3vw, 2.5rem)
    lineHeight: 1.15
  h2:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif"
    fontWeight: 500
    fontSize: clamp(1.5rem, 2.5vw, 2rem)
    lineHeight: 1.2
  h3:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif"
    fontWeight: 500
    fontSize: clamp(1.25rem, 2vw, 1.5rem)
    lineHeight: 1.25
  h4:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif"
    fontWeight: 500
    fontSize: 1.125rem
    lineHeight: 1.3
  button:
    fontWeight: 600
    textTransform: none
    letterSpacing: 0
rounded:
  base: 16px
  wedding-base: 20px
  pill: 999px
  dialog: 24px
  dialog-inner: 18px
  input: 16px
  section: 3px
  button: 3px
  border-radius2: 5px
spacing:
  unit: 8px
  section-gap: 24px
  card-padding: 20px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: 10px 18px
  button-outlined:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
  card:
    backgroundColor: "{colors.background-paper}"
    rounded: "{rounded.base}"
  card-wedding:
    backgroundColor: "{colors.background-paper}"
    rounded: "{rounded.wedding-base}"
  input:
    rounded: "{rounded.base}"
  dialog:
    rounded: "{rounded.dialog}"
    paper-rounded: "{rounded.dialog-inner}"
  surface-1:
    backgroundColor: "{colors.surface-level1}"
  surface-2:
    backgroundColor: "{colors.surface-level2}"
  surface-3:
    backgroundColor: "{colors.surface-level3}"
---

## Overview

Checkpoint is the Omnixys productive event/ticket/scanner management platform.
The design language is **information-dense, Apple-inspired, and operationally
focused** — a multi-screen tool for venue operators, security staff, and event
teams who need fast, clear information at a glance.

Unlike the more consumer-facing Nexys, Checkpoint prioritizes data density,
scanner-first workflows, and seven distinct color schemes (including a
"wedding" variant). The extended palette adds `surface.level1/2/3` and
`border.subtle/strong` tokens beyond MUI's standard palette. Visual tokens
(orb gradients, shader brightness, glow) power decorative background effects
that vary per scheme.

## Colors

### Scheme: Original (Default)

| Token | Light | Dark | Role |
|-------|-------|------|------|
| Primary | `#6A4BBC` | `#6A4BBC` | Primary actions, active states |
| Secondary | `#4E3792` | `#4E3792` | Supporting actions |
| Background Default | `#F8F8FC` | `#121212` | Page background |
| Background Paper | `#FFFFFF` | `#1E1E1E` | Card surface |
| Text Primary | `#312E81` | `#EDEDED` | Headings, body |
| Text Secondary | `#6B7280` | `#BFBFC7` | Captions, helpers |
| Error | `#F87171` | `#F87171` | Error states |
| Success | `#A3E635` | `#A3E635` | Positive feedback |

### Scheme: Red

| Token | Light | Dark |
|-------|-------|------|
| Primary | `#DC2626` | `#DC2626` |
| Secondary | `#991B1B` | `#991B1B` |

### Scheme: Green

| Token | Light | Dark |
|-------|-------|------|
| Primary | `#22C55E` | `#22C55E` |
| Secondary | `#16A34A` | `#16A34A` |

### Scheme: Yellow

| Token | Light | Dark |
|-------|-------|------|
| Primary | `#F59E0B` | `#F59E0B` |
| Secondary | `#B45309` | `#B45309` |

### Scheme: Blue

| Token | Light | Dark |
|-------|-------|------|
| Primary | `#2563EB` | `#2563EB` |
| Secondary | `#1E40AF` | `#1E40AF` |

### Scheme: Brown

| Token | Light | Dark |
|-------|-------|------|
| Primary | `#8B5E3C` | `#8B5E3C` |
| Secondary | `#6B3E1F` | `#6B3E1F` |

### Scheme: Wedding (Integrated)

| Token | Light | Dark |
|-------|-------|------|
| Primary | `#9B6B24` | `#B68A45` |

### Extended Palette Tokens

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| surface.level1 | `background-default` | `background-default` | Base page |
| surface.level2 | `background-paper` | `background-paper` | Elevated cards |
| surface.level3 | `rgba(0,0,0,0.04)` | `rgba(255,255,255,0.04)` | Subtle hover/active |
| border.subtle | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.08)` | Dividers, card edges |
| border.strong | `rgba(0,0,0,0.16)` | `rgba(255,255,255,0.16)` | Focused/active borders |

### Visual Tokens (per-scheme)

| Token | Light | Dark |
|-------|-------|------|
| background.base | `#FFFFFF` | `#000000` |
| shader.brightness | `0.75` | `0.3` |
| orb.opacity | `0.65` | `0.65` |

## Typography

- **Body**: SF Pro system stack
- **Headings**: Same stack, `fontWeight: 500` (editorial weight, not bold)
- **Buttons**: `textTransform: none`, `fontWeight: 600`

| Role | Weight | Size | Line Height |
|------|--------|------|-------------|
| h1 | 500 | clamp(1.75rem, 3vw, 2.5rem) | 1.15 |
| h2 | 500 | clamp(1.5rem, 2.5vw, 2rem) | 1.2 |
| h3 | 500 | clamp(1.25rem, 2vw, 1.5rem) | 1.25 |
| h4 | 500 | 1.125rem | 1.3 |
| body1 | 400 | 1rem | 1.5 |
| button | 600 | 0.875rem | 1.5 |

## Layout

- **Spacing unit**: 8px
- **Section gap**: 24px
- **Card padding**: 20px
- **Data density**: Higher than Nexys — multiple data points per card, compact tables
- **Scanner-first**: Primary workflow optimized for quick QR-code scan + ticket validation

## Elevation & Depth

- **Surface hierarchy**: 3-tier system (`surface.level1` → `surface.level2` → `surface.level3`)
- **Border hierarchy**: 2-tier (`border.subtle` → `border.strong`)
- **Orb glow**: `radial-gradient(circle at 50% 55%, rgba(primary, 0.65), rgba(primary, 0.45), rgba(primary, 0.25))`
- **Shader**: Dark mode brightness `0.3`, light mode `0.75`
- **No backdrop-blur** (unlike Nexys) — surfaces are opaque for data legibility

## Shapes

| Element | Radius |
|---------|--------|
| Base (cards, inputs) | `16px` |
| Wedding variant cards | `20px` |
| Buttons | `999px` (pill) |
| Dialog | `24px` |
| Dialog inner | `18px` |
| sectionRadius | `3px` |
| buttonRadius (decorative) | `3px` |
| borderRadius2 | `5px` |

## Components

### Buttons

- **Shape**: Pill (`borderRadius: 999px`)
- **Active feedback**: `scale(0.96)` with `0.15s ease`
- **Contained shadow**: Diffused, mode-dependent

### Cards / Papers

- **Background**: `theme.palette.background.paper`
- **Border radius**: `theme.shape.borderRadius` (16px, or 20px in wedding scheme)
- **Extended surface tokens**: Use `theme.palette.extended.surface.*` for nested surfaces

### Dialogs

- **Outer radius**: 24px
- **Inner content radius**: 18px

### Text Fields

- **Border radius**: `theme.shape.borderRadius` (16px)
- **Extended border tokens**: `theme.palette.extended.border.*`

### Tabs / Navigation

- Active tab indicator: primary color
- Dense tab bar for scanner/ticket workflows

## Do's and Don'ts

### Do

- Use the extended `surface` and `border` tokens for nested content hierarchy
- Maintain data density — Checkpoint users need information at a glance
- Use scheme-specific colors when the context matches (wedding → wedding scheme)
- Keep the visual token (orb/shader) effects subtle — they're background decoration, not content
- Use `border.subtle` for dividers, `border.strong` for focused inputs

### Don't

- Reduce data density to make it "prettier" — density is a feature
- Mix scheme tokens across different color contexts
- Apply backdrop-blur (that's Nexys territory)
- Use `fontWeight: 700` on headings (h1-h4 use 500)
- Hardcode colors — always use theme tokens or extended palette

### Anti-AI-Slop

- Checkpoint is an operational tool, not a marketing site — no hero sections, no feature grids
- Never add ornamental gradients or decorative blobs over data views
- Scanner UI must remain minimal — a large QR viewfinder and status indicators, nothing else
- Don't reduce the seven color schemes to a single "default" — scheme diversity is intentional

## Responsive Behavior

- **Breakpoints**: Standard MUI (xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536)
- **Tablet/mobile**: Cards stack vertically, scanner view takes full viewport
- **Touch targets**: Minimum 48px on interactive elements (scanner workflow priority)
- **Data tables**: Horizontal scroll on small screens, no information removal

## Known Gaps

- The "wedding" scheme exists in the checkpoint theme but is a separate visual language — its tokens (`borderRadius: 20`, `letterSpacing: 0.08em`) differ from the operational schemes
- Visual tokens (orb, shader, glow) are computed at theme-creation time and baked into the theme object — not reactive to runtime scheme changes without full theme recreation
- `toolpad/core` integration adds its own theming layer that may conflict with custom extended palette

## Agent Prompt Guide

**Quick reference for coding agents:**
- Primary: `#6A4BBC` (original scheme)
- Card radius: `16px` (20px for wedding)
- Button: pill (`999px`), active `scale(0.96)`
- Use `theme.palette.extended.surface.level2` for elevated cards, never `#FFFFFF`
- Use `theme.palette.extended.border.subtle` for dividers, never `rgba(0,0,0,0.12)`
- Headings: `fontWeight: 500` (not 700)
- Seven schemes exist — always check `theme.omnixys.scheme` before hardcoding colors
