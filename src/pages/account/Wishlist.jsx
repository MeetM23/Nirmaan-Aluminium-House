// src/pages/account/Wishlist.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { products } from '../../data/products';
import { formatINR } from '../../utils/pricing';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  // Find saved products from data
  const favoritedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAddToCart = (product) => {
    const defaultFinish = product.variants?.finish?.[0]?.name || 'Standard';
    const defaultMaterial = product.variants?.material?.[0]?.name || 'Standard';

    addToCart({
      id: product.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variant: `${defaultFinish} • ${defaultMaterial}`,
      finish: defaultFinish,
      material: defaultMaterial,
      unit: product.unit || 'per sq ft',
      unitPrice: product.price || 1000,
      quantity: product.minQty || 1,
      image: product.image,
    });
  };

  return (
    <>
      <Helmet>
        <title>Saved Wishlist – Nirmaan Aluminium House</title>
      </Helmet>

      <div className="space-y-6">
        <div className="bg-[#0A1F1A] border border-[#C9A15A]/25 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div>
              <h2 className="font-serif text-xl font-semibold text-white">Saved Wishlist</h2>
              <p className="text-xs text-white/50">Designs and architectural fabrications saved for your spaces</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#C9A15A]/15 text-[#E2C285]">
              {favoritedProducts.length} Saved
            </span>
          </div>

          {favoritedProducts.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/30 mx-auto mb-4">
                <Heart size={30} />
              </div>
              <h3 className="font-serif text-lg font-medium text-white mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-xs text-white/50 max-w-xs mx-auto mb-6">
                Tap the heart icon on any architectural product card to save it for future project planning.
              </p>
              <Link to="/products" className="btn-gold text-xs uppercase tracking-wider font-semibold">
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              {favoritedProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-black/35 border border-white/10 hover:border-[#C9A15A]/30 transition flex flex-col justify-between"
                >
                  <div className="flex gap-4">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-20 h-20 object-cover rounded-lg border border-white/10 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/products/${p.slug}`}
                        className="font-serif font-semibold text-sm text-white hover:text-[#C9A15A] transition block truncate"
                      >
                        {p.name}
                      </Link>
                      <p className="text-xs text-[#C9A15A] mt-0.5 font-medium">
                        From {formatINR(p.price)} / {p.unit?.replace('per ', '')}
                      </p>
                      <p className="text-[11px] text-white/50 mt-1 line-clamp-2">
                        {p.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/5">
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="text-xs text-white/40 hover:text-red-400 transition flex items-center gap-1"
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>

                    <button
                      onClick={() => handleAddToCart(p)}
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#C9A15A] to-[#E2C285] text-[#061411] font-semibold text-xs transition flex items-center gap-1.5 hover:brightness-110 shadow"
                    >
                      <ShoppingBag size={13} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
