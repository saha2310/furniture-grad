import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/actions/products';
import { Product } from '@/lib/types';
import { ContactSellerButton } from '@/components/contact-seller-button';
import { ProductGallery } from '@/components/product-gallery';
import { ProductDetailsSection } from '@/components/product-details-section';
import { RelatedProductsCarousel } from '@/components/related-products-carousel';
import { RegisterHeaderFavorite } from '@/components/register-header-favorite';
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
    <>
      <RegisterHeaderFavorite productId={product.id} />

      {/* pb-24: место под фиксированную кнопку "Связаться" внизу экрана,
          чтобы она не перекрывала последний блок страницы */}
      <div className="max-w-[1400px] mx-auto px-5 py-10 pb-24">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <ProductGallery
              mainImage={product.image}
              name={product.name}
              gallery={product.product_images || []}
            />

            <div className="p-10 flex flex-col justify-center max-md:p-6 min-w-0">
              <div className="order-1 text-xs text-[#e67e22] font-bold uppercase tracking-wider mb-3">
                {product.categories?.name || 'Мебель'}
              </div>
              <h1 className="order-2 text-4xl font-bold text-[#2c3e50] mb-4 max-md:text-2xl">{product.name}</h1>

              {/* На мобиле цена поднята сразу под название (order-3), на десктопе
                  остаётся после короткого описания, как и раньше (md:order-4) */}
              <div className="order-3 md:order-4 flex items-baseline gap-3 mb-6 flex-wrap">
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

              {product.description && (
                <p className="order-4 md:order-3 text-[#7f8c8d] mb-6 leading-relaxed break-words">
                  {firstSentence(product.description)}
                </p>
              )}

              {(product.colors || product.size || product.material) && (
                <div className="order-5 mb-8 text-sm">
                  {product.colors && (
                    <div className="grid grid-cols-[100px_1fr] gap-3 items-start py-3 border-t border-[#e5e7eb]">
                      <span className="text-[#64748b] font-medium">Цвет</span>
                      <span className="flex items-center gap-2 text-[#2c3e50] font-semibold justify-self-end text-right">
                        <span
                          className="w-4 h-4 rounded-full border border-[#999] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)] shrink-0"
                          style={{ backgroundColor: product.colors.hex }}
                        />
                        {product.colors.name}
                      </span>
                    </div>
                  )}
                  {product.size && (
                    <div className="grid grid-cols-[100px_1fr] gap-3 items-start py-3 border-t border-[#e5e7eb]">
                      <span className="text-[#64748b] font-medium">Размер</span>
                      <span className="text-[#2c3e50] font-semibold text-right break-words">{product.size}</span>
                    </div>
                  )}
                  {product.material && (
                    <div className="grid grid-cols-[100px_1fr] gap-3 items-start py-3 border-t border-b border-[#e5e7eb]">
                      <span className="text-[#64748b] font-medium">Материал</span>
                      <span className="text-[#2c3e50] font-semibold text-right break-words">{product.material}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-8">
          <ProductDetailsSection product={product} />

          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#2c3e50] mb-6">Похожие товары</h2>
              <RelatedProductsCarousel products={relatedProducts} />
            </div>
          )}
        </div>
      </div>

      {/* Кнопка "Связаться" зафиксирована внизу экрана (не внизу страницы) —
          и на мобиле, и на десктопе */}
      <div className="fixed bottom-0 left-0 right-0 z-[90] bg-white/95 backdrop-blur border-t border-[#eee] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-[1400px] mx-auto px-5 py-3">
          <ContactSellerButton className="w-full md:w-full" />
        </div>
      </div>
    </>
  );
}
