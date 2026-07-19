import { Injectable, signal } from '@angular/core';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  description: string;
  features: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  sizes?: string[];
  colors?: string[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly products = signal<Product[]>([
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 299,
      originalPrice: 399,
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      category: 'Electronics',
      description: 'Experience premium sound quality with these wireless headphones featuring active noise cancellation and 30-hour battery life.',
      features: ['Active Noise Cancellation', '30-hour Battery', 'Wireless Charging', 'Premium Sound Quality'],
      inStock: true,
      rating: 4.8,
      reviews: 156,
      colors: ['Black', 'White', 'Blue'],
    },
    {
      id: '2',
      name: 'Minimalist Watch',
      price: 199,
      image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      category: 'Accessories',
      description: 'A sleek and minimalist watch that combines timeless design with modern functionality.',
      features: ['Swiss Movement', 'Water Resistant', 'Leather Strap', 'Minimalist Design'],
      inStock: true,
      rating: 4.6,
      reviews: 89,
      colors: ['Black', 'Brown', 'Silver'],
    },
    {
      id: '3',
      name: 'Designer Backpack',
      price: 149,
      originalPrice: 199,
      image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      category: 'Bags',
      description: 'A stylish and functional backpack perfect for work, travel, or everyday use.',
      features: ['Laptop Compartment', 'Water Resistant', 'Multiple Pockets', 'Ergonomic Design'],
      inStock: true,
      rating: 4.7,
      reviews: 203,
      colors: ['Black', 'Navy', 'Gray'],
    },
    {
      id: '4',
      name: 'Smartphone Stand',
      price: 29,
      image: 'https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      category: 'Accessories',
      description: 'Adjustable smartphone stand perfect for video calls, streaming, and hands-free use.',
      features: ['Adjustable Angle', 'Universal Compatibility', 'Non-slip Base', 'Portable Design'],
      inStock: true,
      rating: 4.4,
      reviews: 67,
      colors: ['Black', 'White'],
    },
    {
      id: '5',
      name: 'Wireless Charging Pad',
      price: 49,
      image: 'https://images.pexels.com/photos/4219656/pexels-photo-4219656.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/4219656/pexels-photo-4219656.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      category: 'Electronics',
      description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
      features: ['Fast Charging', 'LED Indicator', 'Non-slip Surface', 'Case Friendly'],
      inStock: true,
      rating: 4.5,
      reviews: 134,
    },
    {
      id: '6',
      name: 'Coffee Mug Set',
      price: 39,
      image: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [
        'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      category: 'Home',
      description: 'Beautiful ceramic coffee mug set perfect for your morning routine.',
      features: ['Ceramic Material', 'Dishwasher Safe', 'Set of 2', 'Heat Resistant'],
      inStock: true,
      rating: 4.3,
      reviews: 45,
      colors: ['White', 'Blue', 'Black'],
    },
  ]);

  getProducts() {
    return this.products();
  }

  getProduct(id: string) {
    return this.products().find((product) => product.id === id);
  }
}
