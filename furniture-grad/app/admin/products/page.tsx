import { getAllProductsForAdmin, createProduct } from '@/actions/products';
import { getCategories } from '@/actions/categories';
import { getColors } from '@/actions/colors';
import { ProductForm } from '@/components/admin/product-form';
import { ProductRow } from '@/components/admin/product-row';

export default async function AdminProductsPage() {
  const [products, categories, colors] = await Promise.all([
    getAllProductsForAdmin(),
    getCategories(),
    getColors(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#2c3e50] mb-8">Товары</h1>

      <ProductForm action={createProduct} categories={categories} colors={colors} />

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#f8f9fa]">
            <tr>
              <th className="text-left p-4">Название</th>
              <th className="text-left p-4">Цена</th>
              <th className="text-left p-4">Категория</th>
              <th className="p-4 w-64"></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <ProductRow key={p.id} product={p} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
