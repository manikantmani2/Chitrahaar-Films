// Type definitions for the application

export interface NavLink {
  name: string;
  href: string;
}

export interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export interface PortfolioProject {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  client: string;
  year: string;
  duration?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  social: {
    instagram: string;
    linkedin: string;
  };
}

export interface Testimonial {
  id: number;
  name: string;
  company: string;
  quote: string;
  image: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export interface BookingRequest {
  clientName: string;
  email: string;
  phone: string;
  serviceType: string;
  projectDetails: string;
  budget: string;
  timeline: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AnimationVariant {
  hidden: Record<string, any>;
  visible: Record<string, any>;
}
