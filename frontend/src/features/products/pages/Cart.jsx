import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  CreditCard,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  Undo2,
} from "lucide-react";
import StorefrontHeader from "../components/StorefrontHeader";
import UseCart from "../hook/UseCart";
import Useproduct from "../hook/Useproduct";

const formatCurrency = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const serviceCards = [
  { title: "Free Shipping", subtitle: "On orders above ₹999", icon: Truck },
  { title: "Easy Returns", subtitle: "Within 7 days", icon: Undo2 },
  { title: "Secure Payments", subtitle: "100% safe & secure", icon: ShieldCheck },
  { title: "24/7 Support", subtitle: "We're here to help", icon: CreditCard },
];

const Cart = () => {
  const { cart, loading, handleGetCart, handleUpdateCartItemQuantity, handleRemoveCartItem, handleClearCart, handleAddToCart } = UseCart();
  const { handleGetAllProducts, products } = Useproduct();
  const [busyItemId, setBusyItemId] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [addingSuggestionId, setAddingSuggestionId] = useState(null);

  useEffect(() => {
    handleGetCart().catch(() => {});
    handleGetAllProducts().catch(() => {});
  }, [handleGetAllProducts, handleGetCart]);

  const cartItems = cart.items || [];
  const subtotal = Number(cart.totalAmount || 0);
  const discount = Math.round(subtotal * 0.15);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const total = Math.max(subtotal - discount + shipping, 0);

  const suggestionProducts = useMemo(() => {
    const cartProductIds = new Set(cartItems.map((item) => item.product?._id || item.product));
    return products.filter((product) => !cartProductIds.has(product._id)).slice(0, 5);
  }, [cartItems, products]);

  const handleQuantityChange = async (itemId, currentQuantity, nextQuantity) => {
    if (nextQuantity < 1 || nextQuantity === currentQuantity) {
      return;
    }

    try {
      setBusyItemId(itemId);
      await handleUpdateCartItemQuantity(itemId, { quantity: nextQuantity });
    } catch {}
    finally {
      setBusyItemId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setBusyItemId(itemId);
      await handleRemoveCartItem(itemId);
    } catch {}
    finally {
      setBusyItemId(null);
    }
  };

  const handleClearItems = async () => {
    try {
      setClearing(true);
      await handleClearCart();
    } catch {}
    finally {
      setClearing(false);
    }
  };

  const handleAddSuggestion = async (productId) => {
    try {
      setAddingSuggestionId(productId);
      await handleAddToCart({ productId, quantity: 1 });
    } catch {}
    finally {
      setAddingSuggestionId(null);
    }
  };

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,_#fbf7f1_0%,_#f7f0e5_48%,_#efe5d7_100%)] text-stone-900">
      <StorefrontHeader />

      <main className="mx-auto max-w-[1600px] px-4 pb-16 pt-8 sm:px-6 lg:px-10">
        <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
          <section>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="font-serif text-[2.35rem] text-stone-950 sm:text-[3rem]">
                  Your Cart ({cart.totalItems || 0})
                </h1>
                <p className="mt-2 text-base text-stone-600">Review your items and proceed to checkout.</p>
              </div>

              <button
                type="button"
                onClick={handleClearItems}
                className="inline-flex items-center gap-2 rounded-xl border border-[#d8bf9f] bg-white/80 px-4 py-3 text-sm font-semibold text-[#9d631d] transition hover:bg-white"
              >
                <Trash2 size={16} />
                {clearing ? "Clearing..." : "Clear Cart"}
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-white/80 bg-white/80 shadow-[0_22px_55px_rgba(70,39,10,0.06)]">
              {loading && !cartItems.length ? (
                <div className="space-y-4 p-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center gap-4 rounded-2xl border border-stone-100 p-4">
                      <div className="h-24 w-24 animate-pulse rounded-2xl bg-stone-200" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 w-1/3 animate-pulse rounded-full bg-stone-200" />
                        <div className="h-4 w-1/4 animate-pulse rounded-full bg-stone-200" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : cartItems.length ? (
                <div>
                  {cartItems.map((item) => {
                    const product = item.product || {};
                    const itemPrice = Number(item.price?.amount || product.price?.amount || 0);
                    const itemCurrency = item.price?.currency || product.price?.currency || "INR";
                    const originalPrice = Math.round(itemPrice * 1.15);
                    const discountPercent = Math.max(Math.round(((originalPrice - itemPrice) / originalPrice) * 100), 0);

                    return (
                      <article
                        key={item._id}
                        className="grid gap-4 border-b border-stone-200/70 px-5 py-5 last:border-b-0 sm:grid-cols-[auto_112px_minmax(0,1fr)_auto_auto] sm:items-center lg:px-7"
                      >
                        <div className="hidden sm:flex">
                          <div className="grid h-6 w-6 place-items-center rounded-md bg-[#a56b21] text-white">
                            <span className="text-xs">✓</span>
                          </div>
                        </div>

                        <img
                          src={product.images?.[0]?.url || "https://placehold.co/300x360/e7dfd2/6b5b4d?text=Product"}
                          alt={product.title}
                          className="h-28 w-28 rounded-[1.1rem] object-cover"
                        />

                        <div className="min-w-0">
                          <h2 className="text-[1.45rem] font-semibold leading-tight text-stone-900">{product.title}</h2>
                          <p className="mt-2 text-sm text-stone-500">{item.variantId ? "Selected variant" : "Premium product"}</p>
                          <p className="mt-1 text-sm text-stone-600">
                            Size: <span className="font-medium">{item.variantId ? "Custom" : "Standard"}</span>
                          </p>
                          <div className="mt-3 inline-flex rounded-lg bg-[#f3e7d7] px-3 py-1 text-sm font-semibold text-[#a56b21]">
                            -{discountPercent || 10}%
                          </div>
                        </div>

                        <div className="min-w-fit">
                          <p className="text-[1.65rem] font-semibold text-stone-950">{formatCurrency(itemPrice, itemCurrency)}</p>
                          <p className="mt-1 text-lg text-stone-400 line-through">{formatCurrency(originalPrice, itemCurrency)}</p>
                        </div>

                        <div className="flex h-12 items-center rounded-xl border border-stone-200 bg-white shadow-sm">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item._id, item.quantity, item.quantity - 1)}
                            className="grid h-full w-12 place-items-center text-stone-600"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="grid h-full min-w-10 place-items-center px-2 text-base font-semibold text-stone-900">
                            {busyItemId === item._id ? "..." : item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item._id, item.quantity, item.quantity + 1)}
                            className="grid h-full w-12 place-items-center text-stone-600"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item._id)}
                          className="grid h-11 w-11 place-items-center rounded-xl text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </article>
                    );
                  })}

                  <div className="flex flex-col gap-3 px-5 py-5 text-sm text-stone-700 sm:flex-row sm:items-center sm:justify-between lg:px-7">
                    <span>Select All ({cart.totalItems || 0})</span>
                    <Link to="/" className="inline-flex items-center gap-2 font-medium text-stone-700">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto grid h-18 w-18 place-items-center rounded-full bg-[#f3e6d4] text-[#a56b21]">
                    <ShoppingBag size={28} />
                  </div>
                  <h2 className="mt-6 font-serif text-4xl text-stone-950">Your cart is empty</h2>
                  <p className="mt-3 text-base text-stone-600">Add products from the storefront and they will appear here with live backend data.</p>
                  <Link
                    to="/"
                    className="mt-7 inline-flex rounded-2xl bg-[#b77928] px-7 py-4 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(183,121,40,0.28)] transition hover:bg-[#a56b21]"
                  >
                    Continue Shopping
                  </Link>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-5 xl:pt-[3.75rem]">
            <div className="rounded-[1.8rem] border border-white/80 bg-white/82 p-6 shadow-[0_22px_55px_rgba(70,39,10,0.06)]">
              <h2 className="font-serif text-[2rem] text-stone-950">Order Summary</h2>

              <div className="mt-6 space-y-4 text-[1.05rem] text-stone-700">
                <div className="flex items-center justify-between">
                  <span>Subtotal ({cart.totalItems || 0} Items)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <span className="font-semibold text-green-700">-{formatCurrency(discount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-700">{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span>
                </div>
              </div>

              <div className="mt-6 border-t border-stone-200 pt-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[1.1rem] font-semibold text-stone-900">Total</p>
                    <p className="mt-1 text-sm text-stone-500">Inclusive of all taxes</p>
                  </div>
                  <p className="text-[2.3rem] font-semibold text-stone-950">{formatCurrency(total)}</p>
                </div>

                <button
                  type="button"
                  className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#b77928] px-5 py-4 text-base font-semibold text-white shadow-[0_16px_35px_rgba(183,121,40,0.28)] transition hover:bg-[#a56b21]"
                >
                  <ShoppingBag size={18} />
                  Proceed to Checkout
                </button>

                <button
                  type="button"
                  className="mt-3 inline-flex w-full items-center justify-center gap-3 rounded-xl border border-[#cfb290] bg-white px-5 py-4 text-base font-semibold text-[#8d5717] transition hover:bg-[#fbf6ef]"
                >
                  Buy Now
                </button>

                <div className="mt-5 flex items-center justify-center gap-2 text-sm text-stone-500">
                  <ShieldCheck size={16} />
                  <span>Secure & safe payments. Easy returns.</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-[1.5rem] border border-white/80 bg-white/82 px-5 py-5 shadow-[0_18px_45px_rgba(70,39,10,0.05)]">
              <div>
                <p className="font-semibold text-stone-900">Have a coupon code?</p>
                <p className="mt-1 text-sm text-[#9d631d]">Apply code</p>
              </div>
              <ChevronRight size={20} className="text-[#9d631d]" />
            </div>
          </aside>
        </div>

        <section className="mt-10 grid gap-4 rounded-[1.8rem] border border-white/80 bg-white/76 p-5 shadow-[0_18px_45px_rgba(70,39,10,0.05)] md:grid-cols-2 xl:grid-cols-4">
          {serviceCards.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="flex items-center gap-4 rounded-2xl px-4 py-4">
                <div className="grid h-12 w-12 place-items-center rounded-full border border-[#d8bf9f] text-[#9d631d]">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="font-semibold text-stone-900">{item.title}</p>
                  <p className="text-sm text-stone-600">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-4xl text-stone-950">You may also like</h2>
              <p className="mt-2 text-base text-stone-600">Suggestions from your live catalog.</p>
            </div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#9d631d]">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {suggestionProducts.map((product) => (
              <article
                key={product._id}
                className="overflow-hidden rounded-[1.45rem] border border-white/80 bg-white/82 shadow-[0_18px_42px_rgba(70,39,10,0.08)]"
              >
                <Link to={`/details/${product._id}`} className="block overflow-hidden bg-[#eee1d1]">
                  <img
                    src={product.images?.[0]?.url || "https://placehold.co/420x480/e7dfd2/6b5b4d?text=Product"}
                    alt={product.title}
                    className="h-64 w-full object-cover transition duration-500 hover:scale-[1.03]"
                  />
                </Link>

                <div className="p-4">
                  <Link to={`/details/${product._id}`} className="text-[1.02rem] font-semibold text-stone-900">
                    {product.title}
                  </Link>
                  <p className="mt-2 text-base font-semibold text-stone-900">
                    {formatCurrency(product.price?.amount, product.price?.currency)}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleAddSuggestion(product._id)}
                    className="mt-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#d2b38e] bg-white text-[#9d631d] shadow-sm transition hover:bg-[#f7efe4]"
                  >
                    {addingSuggestionId === product._id ? "..." : <ShoppingBag size={18} />}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </section>
  );
};

export default Cart;
