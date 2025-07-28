export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface PricingPlan {
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  buttonVariant: 'primary' | 'secondary';
}

export interface VIPFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}