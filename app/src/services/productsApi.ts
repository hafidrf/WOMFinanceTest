import { apiClient } from "./apiClient";
import { Product, ProductListResponse } from "../types/api";

export async function fetchProducts(): Promise<Product[]> {
  const response = await apiClient.get<ProductListResponse>("/products", {
    params: {
      limit: 20,
    },
  });
  return response.data.products;
}

export async function fetchProductById(id: number): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
}
