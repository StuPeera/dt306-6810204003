import fs from 'fs';
import path from 'path';

const filePath = path.join(
  process.cwd(),
  'data',
  'products.ts'
);

export function saveProducts(products: any[][]) {
  const fileContent = `export type Product = {
  id: number;
  productCode: string;
  productName: string;
  category: string;
  price: number;
  stock: number;
};

export const productLists = ${JSON.stringify(
    products,
    null,
    2
)} as const;
`;

  fs.writeFileSync(filePath, fileContent, 'utf8');
}