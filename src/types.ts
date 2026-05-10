export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'men' | 'women' | 'unisex';
  type: 'hoodie' | 'tshirt' | 'pants' | 'accessories';
  images: string[];
  sizes: string[];
  stock: number;
  tags?: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
  discountPrice?: number;
}

export interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  wishlist?: string[];
  cart?: CartItem[];
  role?: 'customer' | 'admin';
}
