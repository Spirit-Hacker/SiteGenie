export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface Category {
  id: number;
  name: string;
  image: string;
}

export const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 149.99,
    image: "/images/product1.jpg",
    category: "Electronics"
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 199.99,
    image: "/images/product2.jpg",
    category: "Electronics"
  },
  {
    id: 3,
    name: "Leather Backpack",
    price: 89.99,
    image: "/images/product3.jpg",
    category: "Accessories"
  },
  {
    id: 4,
    name: "Running Shoes",
    price: 129.99,
    image: "/images/product4.jpg",
    category: "Footwear"
  }
];

export const categories: Category[] = [
  {
    id: 1,
    name: "Electronics",
    image: "/images/category1.jpg"
  },
  {
    id: 2,
    name: "Clothing",
    image: "/images/category2.jpg"
  },
  {
    id: 3,
    name: "Home & Kitchen",
    image: "/images/category3.jpg"
  }
];
 