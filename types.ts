
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  hoverImage: string; // The "Peek Inside" or texture view
  stock: number;
  isActive: boolean;
  category: 'pastry' | 'bread' | 'cake';
}

export interface CartItem extends Product {
  quantity: number;
  variant?: string; // e.g., "Part of Box"
}

export enum OrderStatus {
  PENDING = 'PENDING',
  BAKING = 'BAKING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
}

export interface Order {
  id: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  timestamp: Date;
}

export type ViewMode = 'CUSTOMER' | 'ADMIN';
export type Page = 'HOME' | 'MENU';

export type BoxSize = 4 | 6 | 12;

export interface BoxState {
  isOpen: boolean;
  size: BoxSize;
  items: Product[];
}
