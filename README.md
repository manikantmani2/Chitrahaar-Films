# Chitrahaar Films - Premium Production Website

## Project Overview
Premium, interactive portfolio website for Chitrahaar Films with cinematic design, smooth animations, and professional UI/UX.

## Features Implemented

### 🎨 Design & UI
- Dark, cinematic theme with gold and orange accents
- Premium glass-morphism effects
- Responsive mobile-first design
- Smooth scroll animations
- Interactive hover effects

### 📱 Components
- **Header** - Sticky navigation with mobile menu
- **Hero** - Cinematic hero section with video background
- **Services** - 6 service cards with hover animations
- **Portfolio** - Filterable project showcase
- **Testimonials** - Client testimonials with ratings
- **Stats** - Animated counters
- **About** - Team profiles and company story
- **Contact** - Form with validation
- **Footer** - Complete footer with links and social media

### ⚡ Performance & UX
- Framer Motion animations
- Lazy loading
- SEO optimization
- Form validation
- API integration ready
- Accessibility features

### 🛠 Tech Stack
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Icons
- Axios for API calls

## Installation & Setup

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Steps

1. **Navigate to project directory**
   ```bash
   cd chitrahaar-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   Create a `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   BUSINESS_EMAIL=contact@chitrahaarfilms.com
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
chitrahaar-website/
├── public/              # Static assets
├── src/
│   ├── api/            # API routes & client
│   ├── components/     # Reusable components
│   ├── constants/      # Constants and data
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Next.js pages
│   ├── styles/         # Global CSS
│   └── utils/          # Utility functions
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Key Features Explained

### 1. **Animations**
- Fade-in and slide animations on scroll
- Smooth hover transitions
- Loading states
- Interactive button states

### 2. **Responsive Design**
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly interface
- Optimized images

### 3. **Form Validation**
- Email validation
- Phone number validation
- Required field checks
- Error messages

### 4. **Performance**
- Code splitting
- Image optimization
- CSS optimization
- Lazy component loading

## Customization

### Change Colors
Edit `tailwind.config.js` color variables:
```javascript
colors: {
  'primary': '#1a1a1a',
  'accent': '#ff6b35',
  // ... more colors
}
```

### Add Portfolio Items
Update `src/constants/index.ts` `PORTFOLIO_PROJECTS` array

### Modify Services
Edit `src/constants/index.ts` `SERVICES` array

### Update Team
Edit `src/constants/index.ts` `TEAM_MEMBERS` array

## Email Setup

To enable contact form emails:

1. **Gmail Setup**
   - Enable 2-factor authentication
   - Generate app password
   - Add credentials to `.env.local`

2. **Alternative Providers**
   - SendGrid
   - Mailgun
   - AWS SES

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Other Platforms
```bash
npm run build
npm start
```

## SEO Optimization

- Meta tags in place
- Sitemap ready
- Open Graph tags
- Mobile-friendly
- Fast loading

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

All rights reserved © 2024 Chitrahaar Films

## Support

For questions or issues, contact: hello@chitrahaarfilms.com
