// src/data/data.js
export const products = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 199.99,
    stock: 45,
    category: 'Electronics',
    image: '/images/headphones.jpg',
    rating: 4.5,
    description: 'Noise-cancelling wireless headphones with 30-hour battery life'
  },
  {
    id: 2,
    name: 'Organic Cotton T-Shirt',
    price: 29.99,
    stock: 120,
    category: 'Clothing',
    image: '/images/tshirt.jpg',
    rating: 4.2,
    description: '100% organic cotton, available in multiple colors'
  },
  {
    id: 3,
    name: 'Smart Fitness Watch',
    price: 159.99,
    stock: 32,
    category: 'Electronics',
    image: '/images/watch.jpg',
    rating: 4.7,
    description: 'Track your heart rate, steps, and sleep patterns'
  },
  {
    id: 4,
    name: 'Stainless Steel Water Bottle',
    price: 24.95,
    stock: 89,
    category: 'Accessories',
    image: '/images/bottle.jpg',
    rating: 4.3,
    description: 'Keeps liquids hot/cold for 24 hours, 750ml capacity'
  },
  {
    id: 5,
    name: 'Wireless Phone Charger',
    price: 39.99,
    stock: 56,
    category: 'Electronics',
    image: '/images/charger.jpg',
    rating: 4.0,
    description: 'Fast-charging Qi-compatible wireless pad'
  }
];

export const Users = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    location: 'New York, USA',
    orders: 12,
    totalSpent: 845.50,
    joinDate: '2022-03-15'
  },
  {
    id: 2,
    name: 'Maria Garcia',
    email: 'maria.g@example.com',
    location: 'Madrid, Spain',
    orders: 8,
    totalSpent: 620.75,
    joinDate: '2022-07-22'
  },
  {
    id: 3,
    name: 'James Wilson',
    email: 'james.w@example.com',
    location: 'London, UK',
    orders: 5,
    totalSpent: 320.40,
    joinDate: '2023-01-10'
  },
  {
    id: 4,
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    location: 'Toronto, Canada',
    orders: 15,
    totalSpent: 1120.90,
    joinDate: '2021-11-05'
  },
  {
    id: 5,
    name: 'David Kim',
    email: 'david.kim@example.com',
    location: 'Seoul, South Korea',
    orders: 3,
    totalSpent: 195.25,
    joinDate: '2023-02-18'
  },
];

export const orders = [
  {
    id: '#ORD-1001',
    customer: 'Alex Johnson',
    date: '2023-04-15',
    status: 'Delivered',
    total: 199.99,
    items: [
      { product: 'Premium Wireless Headphones', quantity: 1, price: 199.99 }
    ]
  },
  {
    id: '#ORD-1002',
    customer: 'Maria Garcia',
    date: '2023-04-18',
    status: 'Shipped',
    total: 89.97,
    items: [
      { product: 'Organic Cotton T-Shirt', quantity: 3, price: 89.97 }
    ]
  },
  {
    id: '#ORD-1003',
    customer: 'Sarah Chen',
    date: '2023-04-20',
    status: 'Processing',
    total: 384.97,
    items: [
      { product: 'Smart Fitness Watch', quantity: 1, price: 159.99 },
      { product: 'Wireless Phone Charger', quantity: 1, price: 39.99 },
      { product: 'Stainless Steel Water Bottle', quantity: 2, price: 49.90 }
    ]
  },
  {
    id: '#ORD-1004',
    customer: 'James Wilson',
    date: '2023-04-22',
    status: 'Delivered',
    total: 159.99,
    items: [
      { product: 'Smart Fitness Watch', quantity: 1, price: 159.99 }
    ]
  }
];


export const Reviews = [
  {
    product: 'Premium Wireless Headphones',
    rating: 5,
    comment: 'Excellent sound quality and battery life!',
    author: 'Alex J.',
    date: '2023-04-10'
  },
  {
    product: 'Organic Cotton T-Shirt',
    rating: 4,
    comment: 'Very comfortable but color faded slightly after wash',
    author: 'Maria G.',
    date: '2023-04-05'
  },
  {
    product: 'Smart Fitness Watch',
    rating: 5,
    comment: 'Perfect for tracking my workouts and sleep',
    author: 'James W.',
    date: '2023-03-28'
  }
];

