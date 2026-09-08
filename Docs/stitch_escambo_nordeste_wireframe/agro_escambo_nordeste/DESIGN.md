---
name: Agro-Escambo Nordeste
colors:
  surface: '#fcf9f2'
  surface-dim: '#dcdad3'
  surface-bright: '#fcf9f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ec'
  surface-container: '#f1eee7'
  surface-container-high: '#ebe8e1'
  surface-container-highest: '#e5e2db'
  on-surface: '#1c1c18'
  on-surface-variant: '#41493e'
  inverse-surface: '#31312c'
  inverse-on-surface: '#f3f0e9'
  outline: '#717a6d'
  outline-variant: '#c0c9bb'
  surface-tint: '#2a6b2c'
  primary: '#00450d'
  on-primary: '#ffffff'
  primary-container: '#1b5e20'
  on-primary-container: '#90d689'
  inverse-primary: '#91d78a'
  secondary: '#904d00'
  on-secondary: '#ffffff'
  secondary-container: '#fe932c'
  on-secondary-container: '#663500'
  tertiary: '#003e61'
  on-tertiary: '#ffffff'
  tertiary-container: '#005684'
  on-tertiary-container: '#8fcbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#acf4a4'
  primary-fixed-dim: '#91d78a'
  on-primary-fixed: '#002203'
  on-primary-fixed-variant: '#0c5216'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#fcf9f2'
  on-background: '#1c1c18'
  surface-variant: '#e5e2db'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '800'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  spacing-4xs: 0.125rem
  spacing-3xs: 0.25rem
  spacing-2xs: 0.5rem
  spacing-xs: 0.75rem
  spacing-sm: 1rem
  spacing-md: 1.25rem
  spacing-lg: 1.5rem
  spacing-xl: 2rem
  spacing-2xl: 2.5rem
  spacing-3xl: 3rem
  gutter-mobile: 1rem
  gutter-tablet: 1.5rem
  margin-mobile: 1rem
  margin-tablet: 2rem
  touch-target-min: 3rem
---

## Brand & Style

This design system powers a direct bartering and agricultural commerce mobile platform anchored in the Brazilian Northeast (Nordeste). The visual identity draws directly from the brand poster and logo mark: circular exchange loops, communal hands passing goods, vibrant harvest greens, sun-baked golden ochre, and clear water blue.

### Design Movement: Pragmatic Tactile & High-Contrast Field Usability
The design balances modern clarity with tactile, grounded elements designed specifically for field conditions:
- **High Outdoor Readability (IHC):** Built for intense sunlight in open fields, CEASA distribution centers, and rural homesteads. Heavy dependence on strong dark-to-light luminosity contrast (passing WCAG AAA for body text) rather than faint tinted grays.
- **Generous Physical Affordance:** Designed for outdoor manual workers, smallholder farmers, and rural co-ops. Touch targets are large (min 48px to 56px), input zones feel sturdy, and interactive surfaces provide immediate visual feedback.
- **Warmth and Dignity:** Replaces sterile, corporate fintech styling with sunlit earthy warmth—balancing deep agricultural green, rich trade gold, and clean river blue over warm clay/sand off-white backdrops.

## Colors

The color palette directly maps to the three-way exchange circular arrows in the brand mark: harvest/land (Deep Green), economic vitality and sunshine (Gold/Amber), and water resources/trust (River Blue), supported by high-contrast warm neutrals.

### Palette Architecture
- **Primary (`#1B5E20` - Terra Fértil Green):** Represents agricultural wealth, harvest, crops, and primary transactional actions (Confirm Exchange, Submit Proposal). Hover/Pressed states step into `#144818`. Soft tinted container fills use `#E8F5E9` to ensure crisp text separation.
- **Secondary (`#D97706` - Sol Dourado Amber):** Derived from the exchange hand and the trade loops. Highlights reciprocal offers ("Aceita Troca"), active negotiations, barter balances, and urgent alerts.
- **Tertiary (`#0284C7` - Rio & Chuva Blue):** The bottom loop arrow of the brand mark. Assigned to logistics, verified producer badges, chat messages, and transit tracking.
- **Neutral Core (`#1C1C18` on `#FBF9F5`):** Text contrast exceeds 12:1 against light surfaces to remain legible under 60,000+ lux equatorial sunlight. Light surfaces rely on `#FBF9F5` (base background), `#FFFFFF` (card surfaces), and `#EFE9DC` (subtle border delineation).

## Typography

The type system pairs **Plus Jakarta Sans** for structural display, headings, and exchange labels with **Inter** for descriptions, item inventories, and transaction summaries.

### Typography Hierarchy & Usage Rules
- **Plus Jakarta Sans (Headings & Labels):** Provides geometric openness and friendly, rounded terminals that echo the friendly community spirit and curved counterforms of the logo. Used in bold weights (700/800) for deal tags, commodity values, and card headlines.
- **Inter (Body & Data):** Neutral, maximum optical clarity with high x-height. Handles technical agricultural specifications (sack weights, moisture percentage, animal breeds, vehicle conditions) without visual fatigue.
- **Outdoor Accessibility Minimums:** No continuous text may run below `13px` (`body-sm`). Essential terms and labels default to `15px` (`label-lg`) to prevent misreading under glares or motion inside trucks and tractors.

## Layout & Spacing

The system enforces a flexible 4-column mobile and 8-column tablet grid with a strict 4px base rhythm, prioritizing single-hand ergonomics and distinct visual chunking.

### Spacing Guidelines
- **Touch Targets:** The absolute minimum interactive touch target is `touch-target-min` (48px × 48px), expanded to 56px for primary floating action buttons and trade proposal confirmations.
- **Card Padding:** Content cards use generous internal padding (`spacing-sm` to `spacing-md`), preventing dense, cramped interfaces that overwhelm non-technical users.
- **Reflow & Responsiveness:** On mobile portrait (360px–428px), listing feeds use single-column full-width barter cards. On tablet landscape, screens split 40/60 into a categorized inventory pane and an active trade negotiation dock.

## Elevation & Depth

Visual hierarchy uses **warm tonal layers** supported by crisp 1px structural outlines and soft, diffused ground shadows. This avoids muddy contrast loss under daylight.

### Surface Tiers
- **Surface Level 0 (Canvas):** `#FBF9F5` — Soft warm bone/sand. Non-distracting, reduces screen eye glare outdoors.
- **Surface Level 1 (Default Card):** `#FFFFFF` with a crisp 1px solid border of `#EAE4D6` and a soft ambient ground drop shadow (`0 2px 8px -2px rgba(46, 60, 20, 0.08)`).
- **Surface Level 2 (Selected / Active Deal):** `#FFFFFF` with a 2px border in Primary Green (`#1B5E20`) or Trade Gold (`#D97706`) and elevated ambient drop (`0 8px 24px -4px rgba(27, 94, 32, 0.12)`).
- **Surface Level 3 (Sticky Bottom Trays & Modals):** Elevated sheets use pure `#FFFFFF` over an opaque `#121A0F` overlay at 60% opacity with a top rim shadow (`0 -4px 16px rgba(0, 0, 0, 0.08)`).

## Shapes

The shape system adopts a roundedness factor of `2` (medium-high curvature: 8px default, 16px for cards, 24px for containers), matching the friendly, looping aesthetic of the brand's curved arrows and rounded typography.

### Shape Distribution
- **Cards & Feed Containers:** `16px` (`rounded-lg`), providing distinct separation between disparate trade offerings.
- **Inputs & Large Buttons:** `12px` to `16px`, soft enough to be approachable while preserving structural rectangular stability.
- **Status Pills & Exchange Badges ("Troca por..."):** Fully pill-shaped (`9999px`), instantly identifying exchange criteria from standard descriptive text.

## Components

### 1. Buttons
- **Primary Action (Propor Troca / Confirmar):** Solid `#1B5E20` background with pure white text (`#FFFFFF`), `52px` height, `16px` border-radius, bold `label-lg` font. Active states shift to `#144818`.
- **Secondary Action (Contraproposta):** Solid `#D97706` background with white text (`#FFFFFF`), used when negotiating terms.
- **Tertiary / Ghost (Cancelar / Ver Detalhes):** Transparent surface with `#1B5E20` text and 1.5px `#EAE4D6` border.

### 2. Barter Status Chips & Badges
- **"Troca por..." (Barter Requirement):** High-visibility pill badge at the top-right of cards. `#FEF3C7` container with `#92400E` text and a subtle icon indicating wanted items (e.g., "Troca por: Milho / Ovinos").
- **"Disponível" (Available):** `#DCFCE7` background with `#166534` text.
- **"Em Negociação" (Under Trade):** `#E0F2FE` background with `#075985` text.

### 3. Barter Cards (Cartão de Escambo)
- Elevated `#FFFFFF` card featuring a side-by-side or stacked "Oferece" (Offers) vs "Deseja" (Wants) visual layout connected by the brand's dual-arrow loop motif.
- Minimum tap area for the entire card, with thumbnail images displayed with an 8px internal radius.

### 4. Inputs & Selection Controls
- **Text & Numeric Inputs:** `52px` height, `#FFFFFF` fill, 1.5px `#D6CFC1` border. When focused, transitions to 2px `#1B5E20` with a 3px soft green focus ring. Helper text uses `body-sm` in dark gray (`#4A4639`).
- **Checkboxes & Radios:** `24px × 24px` hit box inside a `48px` touch wrapper, with high-contrast `#1B5E20` fill and bold white checks.

### 5. Specialized Component: "Balança de Troca" (Barter Balance Bar)
- Visual component indicating whether an exchange proposal is equivalent, favorable, or requires cash complement ("Tornar volta"). Uses a segmented progress track transitioning from Blue (Equivalente) to Amber (Volta necessária).