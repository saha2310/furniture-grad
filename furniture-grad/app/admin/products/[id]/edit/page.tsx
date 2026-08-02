import { notFound } from 'next/navigation';
import { getProductById, updateProduct, deleteProductImage } from '@/actions/products';
import { getCategories } from '@/actions/categories';
import { getColors } from '@/actions/colors';
import { ProductForm } from '@/components/admin/product-form';
import { Product } from '@/lib/types';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product: Product;

  try {
    product = await getProductById(id);
  } catch {
    notFound();
  }

  const [categories, colors] = await Promise.all([getCategories(), getColors()]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#2c3e50] mb-8">Редактировать товар</h1>

      <ProductForm action={updateProduct.bind(null, id)} categories={categories} colors={colors} product={product} />

      {product.product_images && product.product_images.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-bold text-[#2c3e50] mb-4">Дополнительные фото</h2>
          <div className="flex flex-wrap gap-3">
            {product.product_images.map(img => (
              <div key={img.id} className="relative">
                <img src={img.image} alt="" className="w-24 h-24 object-cover rounded-lg border border-[#ddd]" />
                <form action={deleteProductImage.bind(null, img.id)} className="absolute top-1 right-1">
                  <button
                    type="submit"
                    className="w-6 h-6 bg-white rounded-full shadow text-red-500 text-sm leading-none hover:bg-red-50"
                  >
                    ×
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
