export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  freeShipping?: boolean;
  minSpend?: number;
  description: string;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  deliveryNotes?: string;
}

export interface OrderDetails {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  customer: CustomerInfo;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  shipping: number;
  total: number;
  estimatedDelivery: string;
}

export type SortOption = 
  | 'default' 
  | 'price-asc' 
  | 'price-desc' 
  | 'rating-desc' 
  | 'reviews-desc' 
  | 'name-asc';

export interface FilterState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: SortOption;
}
