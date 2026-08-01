'use client';

import { useEffect, useState } from 'react';

type Product = {
  id: number;
  productCode: string;
  productName: string;
  category: string;
  price: number;
  stock: number;
};

type ApiResponse = {
  success: boolean;
  message: string;
  total?: number;
  data: Product[] | Product | null;
};

type ProductForm = {
  productCode: string;
  productName: string;
  category: string;
  price: string;
  stock: string;
};

const emptyForm: ProductForm = {
  productCode: '',
  productName: '',
  category: '',
  price: '',
  stock: '',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal
  const [showForm, setShowForm] = useState(false);

  // Edit mode
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  // Form
  const [form, setForm] = useState<ProductForm>(emptyForm);

  // ========================================
  // GET PRODUCTS
  // ========================================

  async function fetchProducts() {
    try {
      setLoading(true);

      const response = await fetch('/api/products');

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const result: ApiResponse = await response.json();

      if (Array.isArray(result.data)) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error(error);
      setError('ไม่สามารถโหลดข้อมูลสินค้าได้');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // ========================================
  // SEARCH
  // ========================================

  const filteredProducts = products.filter((product) => {
    const keyword = search.toLowerCase();

    return (
      product.productName.toLowerCase().includes(keyword) ||
      product.productCode.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword)
    );
  });

  // ========================================
  // INPUT CHANGE
  // ========================================

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ========================================
  // OPEN ADD FORM
  // ========================================

  function openAddForm() {
    setEditingProduct(null);
    setForm(emptyForm);
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  // ========================================
  // OPEN EDIT FORM
  // ========================================

  function openEditForm(product: Product) {
    setEditingProduct(product);

    setForm({
      productCode: product.productCode,
      productName: product.productName,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
    });

    setError('');
    setSuccess('');
    setShowForm(true);
  }

  // ========================================
  // CLOSE FORM
  // ========================================

  function closeForm() {
    setShowForm(false);
    setEditingProduct(null);
    setForm(emptyForm);
  }

  // ========================================
  // ADD / UPDATE PRODUCT
  // ========================================

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const isEditing = editingProduct !== null;

      const body = {
        ...(isEditing && {
          id: editingProduct.id,
        }),
        productCode: form.productCode,
        productName: form.productName,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      const response = await fetch('/api/products', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Something went wrong'
        );
      }

      setSuccess(result.message);

      closeForm();

      await fetchProducts();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('เกิดข้อผิดพลาด');
      }
    } finally {
      setSaving(false);
    }
  }

  // ========================================
  // DELETE PRODUCT
  // ========================================

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `ต้องการลบ "${product.productName}" ใช่หรือไม่?`
    );

    if (!confirmed) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: product.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'ไม่สามารถลบสินค้าได้'
        );
      }

      setSuccess(result.message);

      await fetchProducts();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('ไม่สามารถลบสินค้าได้');
      }
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Product List
            </h1>

            <p className="mt-1 text-gray-500">
              Search and manage your products
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="rounded-md bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            + Add New Product
          </button>
        </div>

        {/* ================================= */}
        {/* SUCCESS */}
        {/* ================================= */}

        {success && (
          <div className="mb-4 rounded-md bg-green-100 px-4 py-3 text-green-700">
            {success}
          </div>
        )}

        {/* ================================= */}
        {/* ERROR */}
        {/* ================================= */}

        {error && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* ================================= */}
        {/* SEARCH */}
        {/* ================================= */}

        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <input
            type="text"
            placeholder="Search by name, code, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
          />
        </div>

        {/* ================================= */}
        {/* TABLE */}
        {/* ================================= */}

        {loading ? (
          <div className="rounded-lg bg-white p-8 text-center">
            Loading products...
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-white shadow">

            <div className="border-b px-6 py-4">
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} of{' '}
                {products.length} products
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No products found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">

                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        ID
                      </th>

                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        Code
                      </th>

                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        Product
                      </th>

                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        Category
                      </th>

                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        Price
                      </th>

                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        Stock
                      </th>

                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.id}
                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {product.productCode}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">
                          {product.productName}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.category}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-900">
                          ${product.price.toFixed(2)}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.stock}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">

                            <button
                              onClick={() =>
                                openEditForm(product)
                              }
                              className="rounded-md bg-yellow-500 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-600"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(product)
                              }
                              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                              Delete
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================================= */}
      {/* ADD / EDIT MODAL */}
      {/* ================================= */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">

            {/* MODAL HEADER */}

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct
                    ? 'Edit Product'
                    : 'Add New Product'}
                </h2>

                <p className="text-sm text-gray-500">
                  {editingProduct
                    ? 'Update product information.'
                    : 'Enter the product information below.'}
                </p>
              </div>

              <button
                onClick={closeForm}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit}>

              {/* PRODUCT CODE */}

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Product Code
                </label>

                <input
                  type="text"
                  name="productCode"
                  value={form.productCode}
                  onChange={handleInputChange}
                  placeholder="e.g. EL-011"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
                />
              </div>

              {/* PRODUCT NAME */}

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Product Name
                </label>

                <input
                  type="text"
                  name="productName"
                  value={form.productName}
                  onChange={handleInputChange}
                  placeholder="e.g. Wireless Mouse"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
                />
              </div>

              {/* CATEGORY */}

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  placeholder="e.g. Electronics"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
                />
              </div>

              {/* PRICE + STOCK */}

              <div className="mb-6 grid grid-cols-2 gap-4">

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
                  />
                </div>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-md border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : editingProduct
                    ? 'Update Product'
                    : 'Add Product'}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </main>
  );
}