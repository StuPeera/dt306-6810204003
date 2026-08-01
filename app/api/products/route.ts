import { NextResponse } from 'next/server';
import { productLists, Product } from '../../../data/products';
import { saveProducts } from '../../../lib/productStorage';

// ========================================
// GET - Get all products
// ========================================

export async function GET() {
  const products = productLists.flat();

  return NextResponse.json(
    {
      success: true,
      message: 'ดึงข้อมูลสินค้าสำเร็จ',
      total: products.length,
      data: products,
    },
    { status: 200 }
  );
}

// ========================================
// POST - Add new product
// ========================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      productCode,
      productName,
      category,
      price,
      stock,
    } = body;

    // Validate required fields
    if (
      !productCode ||
      !productName ||
      !category ||
      price === undefined ||
      stock === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'กรุณากรอกข้อมูลสินค้าให้ครบถ้วน',
          data: null,
        },
        { status: 400 }
      );
    }

    const products = productLists.flat();

    // Check duplicate product code
    const existingProduct = products.find(
      (product) =>
        product.productCode.toLowerCase() ===
        String(productCode).toLowerCase()
    );

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: 'รหัสสินค้านี้มีอยู่แล้ว',
          data: null,
        },
        { status: 409 }
      );
    }

    // Generate new ID
    const newId =
      products.length > 0
        ? Math.max(...products.map((product) => product.id)) + 1
        : 1;

    // Create new product
    const newProduct: Product = {
      id: newId,
      productCode: String(productCode),
      productName: String(productName),
      category: String(category),
      price: Number(price),
      stock: Number(stock),
    };

    // Add product to array
    productLists[0].push(newProduct);

    // Save permanently to products.ts
    saveProducts(productLists);

    return NextResponse.json(
      {
        success: true,
        message: 'เพิ่มสินค้าสำเร็จ',
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST Error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการเพิ่มสินค้า',
        data: null,
      },
      { status: 500 }
    );
  }
}

// ========================================
// PUT - Update product
// ========================================

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
      id,
      productCode,
      productName,
      category,
      price,
      stock,
    } = body;

    // Validate ID
    if (id === undefined || id === null) {
      return NextResponse.json(
        {
          success: false,
          message: 'ไม่พบ ID ของสินค้า',
          data: null,
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (
      !productCode ||
      !productName ||
      !category ||
      price === undefined ||
      stock === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'กรุณากรอกข้อมูลสินค้าให้ครบถ้วน',
          data: null,
        },
        { status: 400 }
      );
    }

    const products = productLists.flat();

    // Find product
    const product = products.find(
      (product) => product.id === Number(id)
    );

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: 'ไม่พบสินค้าที่ต้องการแก้ไข',
          data: null,
        },
        { status: 404 }
      );
    }

    // Check duplicate product code
    const duplicateCode = products.find(
      (item) =>
        item.id !== Number(id) &&
        item.productCode.toLowerCase() ===
          String(productCode).toLowerCase()
    );

    if (duplicateCode) {
      return NextResponse.json(
        {
          success: false,
          message: 'รหัสสินค้านี้ถูกใช้งานแล้ว',
          data: null,
        },
        { status: 409 }
      );
    }

    // Update product
    product.productCode = String(productCode);
    product.productName = String(productName);
    product.category = String(category);
    product.price = Number(price);
    product.stock = Number(stock);

    // Save changes permanently to products.ts
    saveProducts(productLists);

    return NextResponse.json(
      {
        success: true,
        message: 'แก้ไขข้อมูลสินค้าสำเร็จ',
        data: product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT Error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการแก้ไขสินค้า',
        data: null,
      },
      { status: 500 }
    );
  }
}

// ========================================
// DELETE - Delete product
// ========================================

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const { id } = body;

    // Validate ID
    if (id === undefined || id === null) {
      return NextResponse.json(
        {
          success: false,
          message: 'ไม่พบ ID ของสินค้า',
          data: null,
        },
        { status: 400 }
      );
    }

    // Find product index
    const productIndex = productLists[0].findIndex(
      (product) => product.id === Number(id)
    );

    if (productIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: 'ไม่พบสินค้าที่ต้องการลบ',
          data: null,
        },
        { status: 404 }
      );
    }

    // Get deleted product before removing it
    const deletedProduct = productLists[0][productIndex];

    // Remove product
    productLists[0].splice(productIndex, 1);

    // Save changes permanently to products.ts
    saveProducts(productLists);

    return NextResponse.json(
      {
        success: true,
        message: 'ลบสินค้าสำเร็จ',
        data: deletedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE Error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการลบสินค้า',
        data: null,
      },
      { status: 500 }
    );
  }
}