import { AdminProduct, AdminStats, Customer, Order } from '../models/admin.model';

export const adminProducts: AdminProduct[] = [
  {
    id: '1',
    name: 'Premium Brass Vase',
    price: 129,
    originalPrice: 159,
    image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=800&q=80'],
    category: 'Decor',
    description: 'Elegant handcrafted brass vase for modern interiors.',
    features: ['Handmade', 'Premium finish', 'Home decor'],
    inStock: true,
    rating: 4.8,
    reviews: 120,
    colors: ['Gold', 'Antique'],
    stockQuantity: 16,
    sku: 'BH-001',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    name: 'Wooden Story Box',
    price: 89,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80'],
    category: 'Gifts',
    description: 'A beautifully carved wooden box made for keepsakes.',
    features: ['Hand carved', 'Eco-friendly wood', 'Gift-ready'],
    inStock: true,
    rating: 4.6,
    reviews: 84,
    colors: ['Walnut', 'Oak'],
    stockQuantity: 5,
    sku: 'BH-002',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  }
];

export const orders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerId: '1',
    customerInfo: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      }
    },
    items: [
      {
        productId: '1',
        productName: 'Premium Brass Vase',
        productImage: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=800&q=80',
        quantity: 1,
        price: 129,
        color: 'Gold'
      }
    ],
    subtotal: 129,
    shipping: 0,
    tax: 10.32,
    total: 139.32,
    paymentStatus: 'success',
    shippingStatus: 'delivered',
    paymentMethod: 'Credit Card',
    paymentId: 'pi_1234567890',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-25T14:20:00Z'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerId: '2',
    customerInfo: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543',
      address: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      }
    },
    items: [
      {
        productId: '2',
        productName: 'Wooden Story Box',
        productImage: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
        quantity: 2,
        price: 89,
        color: 'Walnut'
      }
    ],
    subtotal: 178,
    shipping: 5.99,
    tax: 14.24,
    total: 198.23,
    paymentStatus: 'pending',
    shippingStatus: 'processing',
    paymentMethod: 'PayPal',
    paymentId: 'pp_9876543210',
    createdAt: '2024-01-22T15:45:00Z',
    updatedAt: '2024-01-22T15:45:00Z'
  }
];

export const customers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    registeredAt: '2024-01-15T08:00:00Z',
    totalOrders: 3,
    totalSpent: 897.45,
    lastOrderDate: '2024-01-20T10:30:00Z',
    addresses: [
      {
        id: '1',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        isDefault: true
      }
    ]
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    registeredAt: '2024-01-18T12:30:00Z',
    totalOrders: 1,
    totalSpent: 435.83,
    lastOrderDate: '2024-01-22T15:45:00Z',
    addresses: [
      {
        id: '2',
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
        isDefault: true
      }
    ]
  }
];

export const adminStats: AdminStats = {
  totalOrders: 2,
  totalRevenue: 337.55,
  totalCustomers: 2,
  totalProducts: 6,
  pendingOrders: 1,
  completedOrders: 1,
  failedPayments: 0,
  lowStockProducts: 1
};
