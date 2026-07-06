export interface Product {
  id: string;
  _id?: string;
  name: string;
  code: string;
  price: number;
  comparePrice?: number;
  costPerItem?: number;
  barcode?: string;
  vendor?: string;
  productType?: string;
  trackQuantity?: boolean;
  continueSellingOutOfStock?: boolean;
  weight?: number;
  weightUnit?: string;
  chargeTax?: boolean;
  rating: number;
  image: string;
  tag?: string;
  category?: string;
  additionalImages?: string[];
  description?: string;
  stock?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
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
