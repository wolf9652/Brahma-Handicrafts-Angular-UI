export interface AdminProduct {
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
  colors?: string[];
  sizes?: string[];
  stockQuantity: number;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentStatus: 'success' | 'pending' | 'failed' | 'refunded';
  shippingStatus: 'delivered' | 'shipped' | 'processing' | 'pending' | 'cancelled';
  paymentMethod: string;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  registeredAt: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  addresses: CustomerAddress[];
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  completedOrders: number;
  failedPayments: number;
  lowStockProducts: number;
}
