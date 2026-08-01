import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/actions/products';
import { Product } from '@/lib/types';
import { ContactSellerButton } from '@/components/contact-seller-button';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product: Product;

  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-[1400px] mx-auto px-5 py-10">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="h-[500px] max-md:h-[300px]">
            <img 
              src={product.image || '/placeholder.jpg'} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-10 flex flex-col justify-center max-md:p-6">
            <div className="text-xs text-[#e67e22] font-bold uppercase tracking-wider mb-3">
              {product.categories?.name || 'Мебель'}
            </div>
            <h1 className="text-4xl font-bold text-[#2c3e50] mb-4 max-md:text-2xl">{product.name}</h1>
            <p className="text-[#7f8c8d] mb-8 leading-relaxed">{product.description}</p>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-extrabold text-[#2c3e50]">
                {product.price.toLocaleString()} ₽
              </span>
              {product.old_price && (
                <span className="text-xl text-[#95a5a6] line-through">
                  {product.old_price.toLocaleString()} ₽
                </span>
              )}
            </div>

            <ContactSellerButton />
          </div>
        </div>
      </div>
    </div>
  );
}
