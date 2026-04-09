export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  category: string;
  thumbnail: string;
  images: string[];
};

export type ProductListResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};
