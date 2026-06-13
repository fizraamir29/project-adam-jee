export interface Product {
  id: string;
  _id?: string;
  name: string;
  code: string;
  price: number;
  rating: number;
  image: string;
  tag?: string;
  category?: string;
  additionalImages?: string[];
  description?: string;
}

export interface PCComponent {
  id: string;
  type: string;
  name: string;
  price: number;
  watts: number;
}

export interface GameMetrics {
  name: string;
  cpuScale: number;
  gpuScale: number;
  baseFps: number;
}

export interface Testimonial {
  name: string;
  text: string;
  verified: boolean;
  image?: string;
  videoUrl?: string;
  isCustomSubmit?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  image: string;
  tag: string;
  date: string;
  desc: string;
}
