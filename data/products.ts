export type Product = {
  id: number;
  productCode: string;
  productName: string;
  category: string;
  price: number;
  stock: number;
};

export const productLists = [
  [
    {
      "id": 1,
      "productCode": "EL-001",
      "productName": "Portable Bluetooth Speaker",
      "category": "Electronics",
      "price": 49.99,
      "stock": 120
    },
    {
      "id": 2,
      "productCode": "BK-002",
      "productName": "Modern JavaScript Guide",
      "category": "Books",
      "price": 24.99,
      "stock": 60
    },
    {
      "id": 3,
      "productCode": "CL-003",
      "productName": "Classic T-Shirt",
      "category": "Clothing",
      "price": 14.99,
      "stock": 220
    },
    {
      "id": 4,
      "productCode": "HM-004",
      "productName": "Ceramic Vase",
      "category": "Home",
      "price": 22,
      "stock": 45
    },
    {
      "id": 5,
      "productCode": "TY-005",
      "productName": "Building Blocks Set",
      "category": "Toys",
      "price": 34.99,
      "stock": 110
    },
    {
      "id": 6,
      "productCode": "SP-006",
      "productName": "Yoga Mat",
      "category": "Sports",
      "price": 25,
      "stock": 95
    },
    {
      "id": 7,
      "productCode": "BT-007",
      "productName": "Moisturizing Cream 50ml",
      "category": "Beauty",
      "price": 22.5,
      "stock": 120
    },
    {
      "id": 8,
      "productCode": "GD-008",
      "productName": "Garden Hose 10m",
      "category": "Garden",
      "price": 29.99,
      "stock": 80
    },
    {
      "id": 9,
      "productCode": "GR-009",
      "productName": "Organic Olive Oil 500ml",
      "category": "Grocery",
      "price": 12.99,
      "stock": 80
    },
    {
      "id": 10,
      "productCode": "BR-010",
      "productName": "Super Beer",
      "category": "Beverages",
      "price": 300.99,
      "stock": 80
    },
    {
      "id": 11,
      "productCode": "PC-001",
      "productName": "Average Personal Computer",
      "category": "Electronic",
      "price": 1200,
      "stock": 50
    }
  ]
] as const;
