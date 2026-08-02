import Link from 'next/link';
import { getProducts, createProduct, deleteProduct } from '@/actions/products';
import { getCategories } from '@/actions/categories';
import { getColors } from '@/actions/colors';
import { Button } from '@/components/ui/button';
import { ProductForm } from '@/components/admin/product-form';

export default async function AdminProductsPage() {
  const [products, categories, colors] = await Promise.all([
    getProducts(),
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
              <th className="p-4 w-44"></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t border-[#eee]">
                <td className="p-4">{p.name}</td>
                <td className="p-4">{p.price.toLocaleString()} ₽</td>
                <td className="p-4">{p.categories?.name || '—'}</td>
                <td className="p-4 flex gap-2 justify-end">
                  <Link href={`/admin/products/${p.id}/edit`}>
                    <Button variant="outline">Редактировать</Button>
                  </Link>
                  <form action={deleteProduct.bind(null, p.id)}>
                    <Button variant="outline" className="text-red-500 hover:border-red-500">Удалить</Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
