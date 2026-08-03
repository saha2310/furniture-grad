import { notFound } from 'next/navigation';
import { getProductById, updateProduct } from '@/actions/products';
import { getCategories } from '@/actions/categories';
import { getColors } from '@/actions/colors';
import { ProductForm } from '@/components/admin/product-form';
import { ExistingGallery } from '@/components/admin/existing-gallery';
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

      <ExistingGallery productId={product.id} images={product.product_images || []} />
    </div>
  );
}
