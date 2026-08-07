export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Color {
  id: string;
  name: string;
  hex: string;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image: string;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  old_price: number | null;
  category_id: string | null;
  color_id: string | null;
  size: string | null;
  material: string | null;
  sku: string | null;
  in_stock: boolean;
  image: string | null;
  is_new: boolean;
  is_active: boolean;
  created_at: string;
  categories?: Category | null;
  colors?: Color | null;
  product_images?: ProductImage[];
}

export interface Contact {
  id: string;
  label: string;
  value: string;
  href: string | null;
  sort_order: number;
  created_at: string;
}
