import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/actions/products';
import { Product } from '@/lib/types';
import { ContactSellerButton } from '@/components/contact-seller-button';
import { ProductGallery } from '@/components/product-gallery';
import { ProductDetailsSection } from '@/components/product-details-section';
import { RelatedProductsCarousel } from '@/components/related-products-carousel';
import { getDiscountPercent, firstSentence } from '@/lib/utils';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product: Product;

  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product);
  const discountPercent = getDiscountPercent(product.price, product.old_price);

  return (
    <div className="max-w-[1400px] mx-auto px-5 py-10">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <ProductGallery
            mainImage={product.image}
            name={product.name}
            gallery={product.product_images || []}
          />

          <div className="p-10 flex flex-col justify-center max-md:p-6 min-w-0">
            <div className="text-xs text-[#e67e22] font-bold uppercase tracking-wider mb-3">
              {product.categories?.name || 'Мебель'}
            </div>
            <h1 className="text-4xl font-bold text-[#2c3e50] mb-4 max-md:text-2xl">{product.name}</h1>
            {product.description && (
              <p className="text-[#7f8c8d] mb-6 leading-relaxed break-words">
                {firstSentence(product.description)}
              </p>
            )}

            <div className="flex items-baseline gap-3 mb-6 flex-wrap">
              <span className="text-4xl font-extrabold text-[#2c3e50]">
                {product.price.toLocaleString('ru-RU')} ₽
              </span>
              {product.old_price && (
                <span className="text-xl text-[#95a5a6] line-through">
                  {product.old_price.toLocaleString('ru-RU')} ₽
                </span>
              )}
              {discountPercent !== null && (
                <span className="text-xs font-bold text-white bg-[#e74c3c] rounded-full px-2.5 py-1">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {(product.colors || product.size || product.material) && (
              <div className="mb-8 text-sm">
                {product.colors && (
                  <div className="flex items-center justify-between gap-3 py-2.5 border-t border-[#f0f0f0]">
                    <span className="text-[#95a5a6]">Цвет</span>
                    <span className="flex items-center gap-2 text-[#2c3e50] font-medium">
                      <span
                        className="w-4 h-4 rounded-full border border-[#999] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]"
                        style={{ backgroundColor: product.colors.hex }}
                      />
                      {product.colors.name}
                    </span>
                  </div>
                )}
                {product.size && (
                  <div className="flex items-center justify-between gap-3 py-2.5 border-t border-[#f0f0f0]">
                    <span className="text-[#95a5a6]">Размер</span>
                    <span className="text-[#2c3e50] font-medium text-right">{product.size}</span>
                  </div>
                )}
                {product.material && (
                  <div className="flex items-center justify-between gap-3 py-2.5 border-t border-b border-[#f0f0f0]">
                    <span className="text-[#95a5a6]">Материал</span>
                    <span className="text-[#2c3e50] font-medium text-right">{product.material}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-8 items-start">
        <ProductDetailsSection product={product} />

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#2c3e50] mb-6">Похожие товары</h2>
            <RelatedProductsCarousel products={relatedProducts} />
          </div>
        )}
      </div>

      <div className="mt-8">
        <ContactSellerButton className="w-full md:w-full" />
      </div>
    </div>
  );
}
