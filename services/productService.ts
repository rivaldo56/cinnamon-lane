import { supabase } from './supabase';
import { Product } from '../types';

export const productService = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    // Map snake_case from DB to camelCase for frontend
    return (data || []).map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      hoverImage: p.hover_image,
      stock: p.stock,
      isActive: p.is_active,
      category: p.category
    })) as Product[];
  },

  async updateProduct(product: Product): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        hover_image: product.hoverImage,
        stock: product.stock,
        is_active: product.isActive,
        category: product.category
      })
      .eq('id', product.id);

    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async addProduct(product: Product): Promise<void> {
    const { error } = await supabase
      .from('products')
      .insert({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        hover_image: product.hoverImage,
        stock: product.stock,
        is_active: product.isActive,
        category: product.category
      });

    if (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  async uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        console.error('Error converting file to Base64:', error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }
};
