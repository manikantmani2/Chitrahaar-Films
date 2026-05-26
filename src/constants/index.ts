// Navigation Links
export const NAV_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

// Services Data
export const SERVICES = [
  {
    id: 1,
    icon: 'FaVideo',
    title: 'Corporate Videos',
    description: 'Professional corporate and promotional videos that showcase your brand story with cinematic quality.',
    features: ['4K Production', 'Professional Editing', 'Color Grading', 'Sound Design'],
  },
  {
    id: 2,
    icon: 'FaFilm',
    title: 'Documentary Films',
    description: 'Compelling documentary productions that capture authentic stories with artistic vision.',
    features: ['Research', 'Interview Production', 'Archival Integration', 'Distribution Support'],
  },
  {
    id: 3,
    icon: 'FaCamera',
    title: 'Photography',
    description: 'High-end photography for events, products, and editorial content with premium aesthetics.',
    features: ['Event Coverage', 'Product Shoots', 'Editorial', 'Retouching'],
  },
  {
    id: 5,
    icon: 'FaHeart',
    title: 'Wedding Coverage',
    description: 'Complete wedding photography and videography with cinematic storytelling and professional editing.',
    features: ['Photography Coverage', 'Videography', 'Drone Shots', 'Professional Editing'],
  },
  
];

// Portfolio Projects
export const PORTFOLIO_PROJECTS = [
  {
    id: 1,
    title: 'Corporate Brand Story',
    category: 'Corporate',
    image: '/portfolio/project-1.svg',
    description: 'A cinematic corporate video that elevated brand presence',
    client: 'Tech Startup',
    year: '2024',
    duration: '3:45',
  },
  {
    id: 2,
    title: 'Food & Weddings',
    category: 'Food & Weddings',
    image: '/portfolio/food-weddings.svg',
    description: 'Premium food and wedding photography with cinematic storytelling',
    client: 'Luxury Events',
    year: '2024',
  },
  {
    id: 3,
    title: 'Product Photography',
    category: 'Photography',
    image: '/portfolio/project-3.svg',
    description: 'High-end product photography for luxury brand',
    client: 'Premium Goods',
    year: '2023',
  },
  {
    id: 4,
    title: 'Event Coverage',
    category: 'Events',
    image: '/portfolio/project-4.svg',
    description: 'Complete coverage of international conference',
    client: 'Business Conference',
    year: '2023',
  },
  {
    id: 5,
    title: 'Wedding Coverage',
    category: 'Weddings',
    image: '/portfolio/wedding-coverage.svg',
    description: 'Complete wedding coverage with cinematic storytelling and editing',
    client: 'Premium Weddings',
    year: '2024',
  },
  {
    id: 6,
    title: 'Short Films',
    category: 'Short Films',
    image: '/portfolio/short-film.svg',
    description: 'Selected short films and festival entries',
    client: 'Various',
    year: '2022',
  },
];

// Team Members
export const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Arjun Sharma',
    role: 'Director & Founder',
    image: '/team/arjun.jpg',
    bio: 'Visionary filmmaker with 15+ years in cinema',
    social: { instagram: '#', linkedin: '#' },
  },
  {
    id: 2,
    name: 'Priya Desai',
    role: 'Cinematographer',
    image: '/team/priya.jpg',
    bio: 'Award-winning cinematographer known for visual storytelling',
    social: { instagram: '#', linkedin: '#' },
  },
  {
    id: 3,
    name: 'Rohan Gupta',
    role: 'Editor & Post-Producer',
    image: '/team/rohan.jpg',
    bio: 'Creative editor specializing in narrative and documentary',
    social: { instagram: '#', linkedin: '#' },
  },
  {
    id: 4,
    name: 'Neha Patel',
    role: 'Motion Graphics Artist',
    image: '/team/neha.jpg',
    bio: 'Creative animator bringing concepts to visual life',
    social: { instagram: '#', linkedin: '#' },
  },
];

// Testimonials
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Vikram Singh',
    company: 'TechCorp India',
    quote: 'Chitrahaar Films transformed our brand vision into a stunning reality. Their attention to detail is unmatched.',
    image: '/testimonials/testimonial-1.jpg',
  },
  {
    id: 2,
    name: 'Meera Kapoor',
    company: 'Creative Studios',
    quote: 'The production quality and creative approach exceeded our expectations. Highly recommended!',
    image: '/testimonials/testimonial-2.jpg',
  },
  {
    id: 3,
    name: 'Aditya Verma',
    company: 'Brand Marketing Plus',
    quote: 'Professional, creative, and results-driven. Chitrahaar Films is our go-to production house.',
    image: '/testimonials/testimonial-3.jpg',
  },
];

// Stats
export const STATS = [
  { label: 'Projects Completed', value: '150+' },
  { label: 'Years of Excellence', value: '15+' },
  { label: 'Happy Clients', value: '200+' },
  { label: 'Team Members', value: '25+' },
];

// Contact Info
export const CONTACT_INFO = {
  email: 'hello@chitrahaarfilms.com',
  phone: '+91 98765 43210',
  address: 'Mumbai, India',
  hours: 'Mon - Fri, 10 AM - 6 PM IST',
};

// Pricing - Hourly & Day Wise Charges (GST Excluded)
export const PRICING = {
  photography: {
    hourly: { amount: 5000, currency: 'INR', duration: 'per hour' },
    half_day: { amount: 15000, currency: 'INR', duration: '4 hours' },
    full_day: { amount: 25000, currency: 'INR', duration: '8 hours' },
    gst_note: 'GST Excluded - 18% GST will be added to final bill',
  },
  videography: {
    hourly: { amount: 8000, currency: 'INR', duration: 'per hour' },
    half_day: { amount: 24000, currency: 'INR', duration: '4 hours' },
    full_day: { amount: 40000, currency: 'INR', duration: '8 hours' },
    gst_note: 'GST Excluded - 18% GST will be added to final bill',
  },
  wedding_package: {
    pre_wedding: { amount: 50000, currency: 'INR', description: 'Pre-wedding shoot' },
    wedding_day: { amount: 75000, currency: 'INR', description: 'Full day coverage' },
    both: { amount: 120000, currency: 'INR', description: 'Pre-wedding + Wedding day' },
    gst_note: 'GST Excluded - 18% GST will be added to final bill',
  },
  food_photography: {
    hourly: { amount: 4000, currency: 'INR', duration: 'per hour' },
    full_day: { amount: 20000, currency: 'INR', duration: '8 hours' },
    gst_note: 'GST Excluded - 18% GST will be added to final bill',
  },
};

// Photo & Video Library
export const MEDIA_LIBRARY = [
  {
    id: 1,
    type: 'photo',
    title: 'Wedding Portraits',
    count: 500,
    description: 'Premium wedding portrait photography',
  },
  {
    id: 2,
    type: 'video',
    title: 'Wedding Reels',
    count: 150,
    description: 'Professional wedding video reels and clips',
  },
  {
    id: 3,
    type: 'photo',
    title: 'Food Photography',
    count: 800,
    description: 'High-quality food and culinary photography',
  },
  {
    id: 4,
    type: 'video',
    title: 'Event Videos',
    count: 200,
    description: 'Event coverage and highlight videos',
  },
  {
    id: 5,
    type: 'photo',
    title: 'Corporate Events',
    count: 400,
    description: 'Professional corporate event photography',
  },
  {
    id: 6,
    type: 'video',
    title: 'Cinematic Reels',
    count: 120,
    description: 'Cinematic videos and short films',
  },
];
