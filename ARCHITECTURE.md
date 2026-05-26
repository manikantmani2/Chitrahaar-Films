# Directory Structure & Architecture Overview

## Complete Project File Tree

```
chitrahaar-website/
│
├── 📁 public/                              # Static assets (images, videos, etc.)
│   └── (Add your portfolio images here)
│
├── 📁 src/
│   │
│   ├── 📁 api/
│   │   └── client.ts                      # Axios API client with interceptors
│   │
│   ├── 📁 components/                      # Reusable React components
│   │   ├── About.tsx                      # About & team section
│   │   ├── Button.tsx                     # Reusable button component
│   │   ├── Card.tsx                       # Reusable card component
│   │   ├── Contact.tsx                    # Contact form & section
│   │   ├── Footer.tsx                     # Footer with links
│   │   ├── Header.tsx                     # Navigation header
│   │   ├── Hero.tsx                       # Hero section
│   │   ├── Loading.tsx                    # Loading animation
│   │   ├── Portfolio.tsx                  # Portfolio showcase
│   │   ├── Section.tsx                    # Section wrapper
│   │   ├── Services.tsx                   # Services section
│   │   ├── Stats.tsx                      # Statistics section
│   │   ├── Testimonials.tsx               # Testimonials section
│   │   └── index.ts                       # Component exports
│   │
│   ├── 📁 constants/
│   │   └── index.ts                       # All application data
│   │
│   ├── 📁 hooks/
│   │   └── index.ts                       # Custom React hooks
│   │
│   ├── 📁 pages/
│   │   ├── 📁 api/
│   │   │   ├── booking.ts                 # Booking API endpoint
│   │   │   ├── contact.ts                 # Contact form endpoint
│   │   │   └── newsletter.ts              # Newsletter endpoint
│   │   ├── _app.tsx                       # App wrapper
│   │   ├── _document.tsx                  # HTML structure
│   │   ├── 404.tsx                        # 404 error page
│   │   └── index.tsx                      # Homepage
│   │
│   ├── 📁 styles/
│   │   └── globals.css                    # Global styles
│   │
│   ├── 📁 types/
│   │   └── index.ts                       # TypeScript definitions
│   │
│   └── 📁 utils/
│       ├── animations.ts                  # Framer Motion variants
│       └── helpers.ts                     # Utility functions
│
├── 📄 .env.example                         # Environment variables template
├── 📄 .eslintrc.json                       # ESLint config
├── 📄 .gitignore                           # Git ignore rules
├── 📄 .prettierrc                          # Prettier config
├── 📄 next.config.js                       # Next.js config
├── 📄 package.json                         # Dependencies
├── 📄 postcss.config.js                    # PostCSS config
├── 📄 tailwind.config.js                   # Tailwind config
├── 📄 tsconfig.json                        # TypeScript config
│
├── 📚 ADVANCED_FEATURES.md                 # Advanced features guide
├── 📚 DEPLOYMENT_GUIDE.md                  # Deployment guide
├── 📚 QUICK_START.md                       # Quick start guide
├── 📚 README.md                            # Main documentation
├── 📚 PROJECT_SUMMARY.md                   # Project summary
├── 📄 PROJECT_STATUS.json                  # Project status
└── 📄 THIS_FILE.md                         # Architecture overview
```

---

## Architecture Overview

### Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser / User                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Pages (pages/)                                      │   │
│  │  • index.tsx (Homepage)                             │   │
│  │  • 404.tsx (Error Page)                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                     │                                       │
│  ┌──────────────────┴──────────────────────────────────┐   │
│  │ Components (components/)                           │   │
│  │  • Header, Hero, Services, Portfolio, etc.         │   │
│  │  • Reusable UI components (Button, Card, Section)  │   │
│  └────────────────────┬─────────────────────────────┬─┘   │
│                       │                             │       │
└───────────────────────┼─────────────────────────────┼──────┘
                        │                             │
        ┌───────────────┘                             └───────────────┐
        ▼                                                             ▼
┌──────────────────────┐                          ┌──────────────────────┐
│  Local State         │                          │  API Routes          │
│  (hooks/)            │                          │  (pages/api/)        │
│  • useScrollPosition │◄────────────────────────►│  • contact.ts        │
│  • useIsMobile       │                          │  • booking.ts        │
│  • useScrollAnimation│                          │  • newsletter.ts     │
│  • Custom hooks      │                          └──────────┬───────────┘
└──────────────────────┘                                     │
                                                             │
                                                             ▼
                                                  ┌──────────────────────┐
                                                  │  Backend Services    │
                                                  │  • Email Service     │
                                                  │    (Nodemailer)      │
                                                  │  • External APIs     │
                                                  │  • Database (ready)  │
                                                  └──────────────────────┘
```

### Data Flow

```
src/constants/index.ts
    ├── SERVICES ──────────────┐
    ├── PORTFOLIO_PROJECTS ────┼──► Components ──► UI Rendering
    ├── TEAM_MEMBERS ──────────┼──► with         ──► Browser
    ├── TESTIMONIALS ──────────┤    animations
    └── CONTACT_INFO ──────────┘

User Input (Forms)
    ├── Contact Form ──► Validation ──► API ──► Backend ──► Database/Email
    ├── Booking Form ──► (helpers.ts)  (client.ts)
    └── Newsletter ────┘
```

---

## Component Hierarchy

```
pages/index.tsx (Homepage)
│
├── Header
│   ├── Logo
│   └── Navigation Links
│
├── Hero
│   ├── Title & Subtitle
│   ├── CTA Buttons
│   └── Video/Image
│
├── Services
│   └── ServiceCard (×6)
│       ├── Icon
│       ├── Title
│       └── Features List
│
├── Portfolio
│   ├── Filter Buttons
│   └── PortfolioCard (×6)
│       ├── Image
│       ├── Title
│       └── Project Info
│
├── Stats
│   └── StatItem (×4)
│       └── Animated Counter
│
├── Testimonials
│   └── TestimonialCard (×3)
│       ├── Quote
│       ├── Author Info
│       └── Rating
│
├── About
│   ├── Company Story
│   ├── TeamCard (×4)
│   └── Company Values
│
├── Contact
│   ├── Contact Info
│   └── Form
│       ├── Input Fields
│       ├── Validation Messages
│       └── Submit Button
│
└── Footer
    ├── Links
    ├── Contact Info
    └── Social Media
```

---

## Styling Architecture

```
Tailwind CSS (Configuration)
└── tailwind.config.js
    ├── Colors
    │   ├── primary: #1a1a1a
    │   ├── accent: #ff6b35
    │   └── gold: #d4af37
    ├── Typography
    │   ├── Display: Playfair Display
    │   ├── Body: Inter
    │   └── Mono: JetBrains Mono
    └── Custom Utilities
        ├── glass-effect
        ├── glow-effect
        └── btn-primary/secondary/ghost

Global Styles
└── src/styles/globals.css
    ├── Reset & Base Styles
    ├── Custom Utilities
    ├── Animation Keyframes
    └── Component Styles

Component Styles
└── Inline Tailwind Classes
    ├── Responsive Classes
    ├── State Classes (hover:, focus:)
    └── Custom CSS Classes
```

---

## Animation System

```
Framer Motion (Animation Library)
├── Animation Variants (utils/animations.ts)
│   ├── slideUpVariants
│   ├── slideDownVariants
│   ├── slideLeftVariants
│   ├── slideRightVariants
│   ├── fadeInVariants
│   ├── scaleVariants
│   ├── containerVariants (stagger)
│   └── itemVariants
│
├── Motion Components
│   ├── motion.div
│   ├── motion.button
│   ├── motion.a (links)
│   └── motion.section
│
└── Triggers
    ├── whileInView (scroll animations)
    ├── whileHover (hover animations)
    ├── whileTap (click animations)
    └── animate (continuous animations)
```

---

## API Integration

```
API Flow:
┌─────────────┐
│   Frontend  │ (src/api/client.ts)
│   Component │
└──────┬──────┘
       │ axios POST
       ▼
┌─────────────────────────────┐
│  API Route Handler          │
│  (pages/api/contact.ts)     │
│  (pages/api/booking.ts)     │
│  (pages/api/newsletter.ts)  │
└──────┬──────────────────────┘
       │ nodemailer / DB
       ▼
┌─────────────────┐
│  Email Service  │
│  or Database    │
└─────────────────┘

Interceptors:
├── Request Interceptor
│   └── Add Auth Token (if available)
│
└── Response Interceptor
    └── Handle Errors
        └── Redirect to Login if 401
```

---

## Responsive Design Breakpoints

```
Mobile First Approach:
├── 320px+ (Mobile)
│   └── Single column, full width
│
├── 768px+ (Tablet)
│   └── 2-3 columns, optimized spacing
│
├── 1024px+ (Desktop)
│   └── 4 columns, full layout
│
└── 1280px+ (Large)
    └── Max-width container, centered

Implementation:
├── Tailwind Classes: sm:, md:, lg:, xl:
├── CSS Media Queries in globals.css
└── useIsMobile() Hook for JS logic
```

---

## Type System

```
TypeScript Interfaces (src/types/index.ts)
│
├── Navigation Types
│   └── NavLink
│
├── Content Types
│   ├── Service
│   ├── PortfolioProject
│   ├── TeamMember
│   ├── Testimonial
│   └── Stat
│
├── Form Types
│   ├── ContactFormData
│   └── BookingRequest
│
├── API Types
│   └── ApiResponse<T>
│
└── Animation Types
    └── AnimationVariant

Usage:
interface MyComponent extends React.FC<PropsType> {}
export const MyComponent: MyComponent = (props) => { ... }
```

---

## Performance Optimization Strategy

```
Optimization Layers:

1. Build Optimization
   ├── Next.js Code Splitting
   ├── Tailwind CSS Purging
   └── Tree Shaking

2. Runtime Optimization
   ├── Image Lazy Loading
   ├── Component Lazy Loading
   ├── Memoization (React.memo)
   └── useCallback for handlers

3. Animation Optimization
   ├── GPU Acceleration
   ├── Transform & Opacity only
   └── Minimal repaints

4. Network Optimization
   ├── API Client Caching
   ├── Request Debouncing
   └── CDN Ready
```

---

## Deployment Architecture

```
Development:
localhost:3000 ──► npm run dev ──► Next.js Dev Server

Production:
              ┌──────────────────────┐
              │    Git Repository    │
              │    (GitHub/GitLab)   │
              └──────────┬───────────┘
                         │
                    ┌────┴──────┐
                    ▼           ▼
           ┌──────────────┐ ┌──────────────┐
           │    Vercel    │ │    Netlify   │
           │ (Recommended)│ │ (Alternative)│
           └──────┬───────┘ └──────────────┘
                  │
                  ▼
          ┌──────────────────┐
          │  Production URL  │
          │ your-domain.com  │
          └──────────────────┘

Alternative: VPS
┌──────────────────┐
│  Your Server     │
│  (DigitalOcean,  │
│   AWS, etc.)     │
├──────────────────┤
│  Node.js + PM2   │
│  Nginx Reverse   │
│  Proxy           │
│  SSL Certificate │
└──────────────────┘
```

---

## Development Workflow

```
Development Cycle:
┌──────────────────┐
│  Edit Component  │
│  or Data         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Save File       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Next.js HMR     │
│  (Hot Reload)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  View in Browser │
│  (auto refresh)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Test & Repeat   │
└──────────────────┘

Commit Cycle:
git add .
git commit -m "message"
git push
    │
    ▼
Auto Deploy (Vercel/Netlify)
    │
    ▼
Production Updated
```

---

## Key File Relationships

```
homepage (pages/index.tsx)
    ├── imports Header, Hero, Services, etc.
    ├── uses constants for data
    ├── applies animations from utils/animations
    └── components use tailwind for styling

components/Button
    ├── uses TypeScript for props
    ├── applies Tailwind classes
    ├── imports framer-motion
    └── has variants defined inline

src/constants/index.ts
    ├── provides data for Services.tsx
    ├── provides data for Portfolio.tsx
    ├── provides data for About.tsx (Team)
    ├── provides data for Testimonials.tsx
    └── provides Contact.tsx info

tailwind.config.js
    ├── defines colors used globally
    ├── defines fonts for components
    ├── defines custom animations
    └── defines breakpoints
```

---

## Module Dependencies

```
pages/index.tsx
├── @/components/Header
├── @/components/Hero
├── @/components/Services
├── @/components/Portfolio
├── @/components/Stats
├── @/components/Testimonials
├── @/components/About
├── @/components/Contact
└── @/components/Footer

components/Contact.tsx
├── @/utils/helpers (validation)
├── @/api/client (API call)
├── @/utils/animations (Framer Motion variants)
├── @/constants (CONTACT_INFO)
└── @/components/Button
    ├── framer-motion
    └── tailwindcss

src/api/client.ts
├── axios
├── localStorage (for tokens)
└── error handling interceptors
```

---

## State Management Pattern

```
Local Component State:
├── Form Data
│   ├── formData: useState
│   └── errors: useState
│
├── UI State
│   ├── isOpen: useState
│   ├── selectedCategory: useState
│   └── loading: useState
│
└── Query State
    ├── response data
    └── error messages

Custom Hooks:
├── useScrollPosition() ──► Global scroll tracking
├── useScrollAnimation() ──► Scroll trigger detection
├── useIsMobile() ├──► Window size detection
├── useMousePosition() ──► Mouse tracking
└── useLocalStorage() ──► Persistent storage

No Redux/Context needed for this setup
```

---

## Summary

This is a **fully featured, production-ready** Next.js website with:

✅ Clear component architecture
✅ Modular styling system
✅ Reusable animation system
✅ Type-safe development
✅ Scalable file structure
✅ Easy customization
✅ Multiple deployment options

**Start here**: `QUICK_START.md`
**Deploy**: `DEPLOYMENT_GUIDE.md`
**Customize**: `ADVANCED_FEATURES.md`
