# Quick Start Guide - Chitrahaar Films Website

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd chitrahaar-website
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env.local
```
Edit `.env.local` with your settings

### Step 3: Run Development Server
```bash
npm run dev
```

### Step 4: Open in Browser
Navigate to `http://localhost:3000`

## Key Customizations

### Update Company Info
**File**: `src/constants/index.ts`
```typescript
export const CONTACT_INFO = {
  email: 'your-email@example.com',
  phone: '+91 XXXXX XXXXX',
  address: 'Your Address',
  hours: 'Your Hours',
};
```

### Change Brand Colors
**File**: `tailwind.config.js`
```javascript
colors: {
  'accent': '#ff6b35',    // Change orange
  'gold': '#d4af37',      // Change gold
  // ... more colors
}
```

### Add Portfolio Project
**File**: `src/constants/index.ts`
```typescript
{
  id: 7,
  title: 'Your Project',
  category: 'Your Category',
  image: '/path/to/image.jpg',
  description: 'Project description',
  client: 'Client Name',
  year: '2024',
}
```

### Update Team Members
**File**: `src/constants/index.ts`
```typescript
{
  id: 1,
  name: 'Your Name',
  role: 'Your Role',
  image: '/path/to/image.jpg',
  bio: 'Your bio',
  social: {
    instagram: 'https://instagram.com/username',
    linkedin: 'https://linkedin.com/in/username',
  },
}
```

## Essential Files to Know

| File | Purpose |
|------|---------|
| `src/pages/index.tsx` | Homepage |
| `src/constants/index.ts` | All data (services, portfolio, team, etc.) |
| `tailwind.config.js` | Design system colors and typography |
| `src/styles/globals.css` | Global styles and custom utilities |
| `src/components/*` | React components |
| `src/pages/api/*` | Backend API routes |
| `.env.local` | Environment variables |

## Adding Pages

### Create New Page
```bash
# Create file: src/pages/blog.tsx
```

```typescript
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Blog() {
  return (
    <>
      <Head>
        <title>Blog - Chitrahaar Films</title>
      </Head>
      <Header />
      <main>{/* Your content */}</main>
      <Footer />
    </>
  );
}
```

## Updating Hero Section

**File**: `src/pages/index.tsx`
```typescript
<Hero
  title="Your Title"
  subtitle="Your Subtitle"
  description="Your description"
  cta1={{ text: 'Button 1' }}
  cta2={{ text: 'Button 2' }}
  hasVideo={true}  // Set to false for image
/>
```

## Form Configuration

The contact form sends to email. Set up:

1. **Gmail**
   - Enable 2FA
   - Generate app password
   - Add to `.env.local`

2. **Other Services**
   - SendGrid: Add API key
   - Mailgun: Add credentials
   - AWS SES: Configure IAM

## Testing

### Test Form
1. Fill out contact form
2. Check console for errors
3. Verify email received

### Test Responsiveness
1. Open DevTools (F12)
2. Test on mobile (375px), tablet (768px), desktop (1024px)

## Deployment Steps

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

2. **Connect to Vercel**
   - Visit vercel.com
   - Click "New Project"
   - Select your repository
   - Add environment variables
   - Click "Deploy"

### Deploy to Netlify

1. **Build project**
```bash
npm run build
```

2. **Push to GitHub**
3. **Connect in Netlify Dashboard**

### Self-Hosted Deployment

1. **Build production build**
```bash
npm run build
```

2. **Start server**
```bash
npm start
```

3. **Use PM2 (optional)**
```bash
npm install -g pm2
pm2 start "npm start" --name "chitrahaar"
```

## Common Issues & Solutions

### Issue: "Module not found"
**Solution**: 
```bash
npm install
# Clear cache
rm -rf .next
npm run dev
```

### Issue: Form not working
**Solution**:
- Check `.env.local` has correct credentials
- Verify email service is configured
- Check browser console for errors

### Issue: Animations not smooth
**Solution**:
- Check GPU acceleration in browser
- Reduce animation complexity
- Check for performance issues

### Issue: Styles not loading
**Solution**:
```bash
npm run build
# Or clear Tailwind cache
rm -rf .next
```

## Performance Tips

1. **Optimize Images**
   - Use WebP format
   - Compress before uploading
   - Use proper dimensions

2. **Lazy Load Components**
   - Use dynamic imports for heavy components
   - Load below-fold content on scroll

3. **Monitor Performance**
   - Use Lighthouse (DevTools)
   - Check Core Web Vitals
   - Aim for 90+ score

## Next Steps

1. ✅ Customize colors and content
2. ✅ Add your images and portfolio
3. ✅ Set up email service
4. ✅ Test all forms
5. ✅ Deploy to production
6. ✅ Set up analytics
7. ✅ Monitor performance

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com
- **Framer Motion**: https://www.framer.com/motion
- **React Icons**: https://react-icons.github.io/react-icons

## Need Help?

- Check README.md for detailed documentation
- See ADVANCED_FEATURES.md for custom implementations
- Review component files for examples
- Check Next.js documentation

---

**Happy coding! 🎬**
