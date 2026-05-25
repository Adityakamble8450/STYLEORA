import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  ChevronRight, CreditCard, Minus, Plus, ShoppingBag,
  Trash2, Truck, Undo2, ShieldCheck, Tag, ArrowLeft, Heart
} from 'lucide-react'
import StorefrontHeader from '../components/StorefrontHeader'
import Footer from '../../../componants/Footer'
import UseCart from '../hook/UseCart'
import Useproduct from '../hook/Useproduct'
import { useToast } from '../../../componants/Toast'

const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(amount || 0))

const serviceCards = [
  { title: 'Free Shipping', subtitle: 'On orders above ₹999', Icon: Truck },
  { title: 'Easy Returns', subtitle: 'Within 7 days', Icon: Undo2 },
  { title: 'Secure Payments', subtitle: '100% safe & secure', Icon: ShieldCheck },
  { title: '24/7 Support', subtitle: "We're here to help", Icon: CreditCard },
]

/* ─── Skeleton ─── */
const CartSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 rounded-2xl border border-stone-100 bg-white p-5">
        <div className="skeleton h-24 w-24 rounded-xl shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="skeleton h-4 w-1/2 rounded-full" />
          <div className="skeleton h-4 w-1/3 rounded-full" />
          <div className="skeleton h-4 w-1/4 rounded-full" />
        </div>
        <div className="skeleton h-10 w-28 rounded-xl" />
      </div>
    ))}
  </div>
)

const Cart = () => {
  const navigate = useNavigate()
  const { cart, loading, handleGetCart, handleUpdateCartItemQuantity, handleRemoveCartItem, handleClearCart, handleAddToCart } = UseCart()
  const { handleGetAllProducts, products } = Useproduct()
  const addToast = useToast()
  const [busyItemId, setBusyItemId] = useState(null)
  const [clearing, setClearing] = useState(false)
  const [addingSuggestionId, setAddingSuggestionId] = useState(null)
  const [couponOpen, setCouponOpen] = useState(false)
  const [couponCode, setCouponCode] = useState('')

  useEffect(() => {
    handleGetCart().catch(() => {})
    handleGetAllProducts().catch(() => {})
  }, [handleGetAllProducts, handleGetCart])

  const cartItems = cart.items || []
  const subtotal = Number(cart.totalAmount || 0)
  const discount = Math.round(subtotal * 0.15)
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99
  const total = Math.max(subtotal - discount + shipping, 0)
  const freeShippingThreshold = 999
  const amountToFreeShipping = Math.max(freeShippingThreshold - subtotal, 0)
  const freeShippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100)

  const suggestionProducts = useMemo(() => {
    const cartIds = new Set(cartItems.map((i) => i.product?._id || i.product))
    return products.filter((p) => !cartIds.has(p._id)).slice(0, 4)
  }, [cartItems, products])

  const handleQuantityChange = async (itemId, currentQty, nextQty) => {
    if (nextQty < 1 || nextQty === currentQty) return
    try {
      setBusyItemId(itemId)
      await handleUpdateCartItemQuantity(itemId, { quantity: nextQty })
    } catch {
      addToast('Could not update quantity.', 'error')
    } finally { setBusyItemId(null) }
  }

  const handleRemoveItem = async (itemId, title) => {
    try {
      setBusyItemId(itemId)
      await handleRemoveCartItem(itemId)
      addToast(`${title || 'Item'} removed from cart.`, 'info')
    } catch {
      addToast('Could not remove item.', 'error')
    } finally { setBusyItemId(null) }
  }

  const handleClearItems = async () => {
    try {
      setClearing(true)
      await handleClearCart()
      addToast('Cart cleared.', 'info')
    } catch {
      addToast('Could not clear cart.', 'error')
    } finally { setClearing(false) }
  }

  const handleAddSuggestion = async (productId, title) => {
    try {
      setAddingSuggestionId(productId)
      await handleAddToCart({ productId, quantity: 1 })
      addToast(`${title} added to cart!`, 'success')
    } catch {
      addToast('Could not add to cart.', 'error')
    } finally { setAddingSuggestionId(null) }
  }

  return (
    <div className="min-h-screen page-bg">
      <StorefrontHeader />

      <main className="container-luxury pb-20 pt-8">
        {/* ── Page Header ── */}
        <div className="mb-8">
          <Link to="/" className="mb-4 flex items-center gap-2 text-sm text-stone-500 hover:text-amber-700 transition-colors w-fit">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="label-overline mb-2">Your Selection</p>
              <h1 className="font-serif text-4xl text-stone-950 sm:text-5xl">
                Shopping Cart
                <span className="ml-3 font-sans text-2xl text-stone-400 font-normal">({cart.totalItems || 0})</span>
              </h1>
            </div>
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={handleClearItems}
                disabled={clearing}
                className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/60 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition disabled:opacity-50 h-fit"
              >
                <Trash2 size={15} />
                {clearing ? 'Clearing...' : 'Clear All'}
              </button>
            )}
          </div>
        </div>

        {/* ── Free Shipping Progress ── */}
        {cartItems.length > 0 && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                <Truck size={15} />
                {amountToFreeShipping > 0
                  ? `Add ${formatCurrency(amountToFreeShipping)} more for free shipping!`
                  : '🎉 You qualify for FREE shipping!'}
              </div>
              <span className="text-xs text-emerald-600 font-semibold">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-emerald-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Main Layout ── */}
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">

          {/* Cart Items */}
          <section>
            <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-[0_4px_24px_rgba(70,39,10,0.06)]">
              {loading && !cartItems.length ? (
                <div className="p-6"><CartSkeleton /></div>
              ) : cartItems.length ? (
                <div>
                  {cartItems.map((item, idx) => {
                    const product = item.product || {}
                    const itemPrice = Number(item.price?.amount || product.price?.amount || 0)
                    const itemCurrency = item.price?.currency || product.price?.currency || 'INR'
                    const originalPrice = Math.round(itemPrice * 1.18)
                    const isBusy = busyItemId === item._id

                    return (
                      <article
                        key={item._id}
                        className={`flex flex-col gap-4 border-b border-stone-100 p-5 transition-all sm:flex-row sm:items-center sm:gap-5 lg:px-7 ${isBusy ? 'opacity-60' : 'opacity-100'} ${idx === cartItems.length - 1 ? 'border-b-0' : ''}`}
                      >
                        {/* Image */}
                        <Link to={`/details/${product._id}`} className="shrink-0">
                          <img
                            src={product.images?.[0]?.url || 'https://placehold.co/300x360/e7dfd2/6b5b4d?text=Product'}
                            alt={product.title}
                            className="h-28 w-24 rounded-xl object-cover shadow-sm"
                          />
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/details/${product._id}`}
                            className="text-base font-semibold text-stone-900 hover:text-amber-700 transition-colors line-clamp-2"
                          >
                            {product.title}
                          </Link>
                          <p className="mt-1 text-xs text-stone-400">
                            {item.variantId ? 'Selected variant' : 'Standard · Premium quality'}
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-lg font-semibold text-stone-900">
                              {formatCurrency(itemPrice * item.quantity, itemCurrency)}
                            </span>
                            <span className="text-sm text-stone-400 line-through">
                              {formatCurrency(originalPrice * item.quantity, itemCurrency)}
                            </span>
                            <span className="badge-gold text-[0.6rem]">-18%</span>
                          </div>

                          <p className="mt-1 text-xs text-stone-400">
                            {formatCurrency(itemPrice, itemCurrency)} each
                          </p>
                        </div>

                        {/* Quantity + Remove */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex h-10 items-center rounded-xl border border-stone-200 bg-stone-50">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item._id, item.quantity, item.quantity - 1)}
                              disabled={isBusy || item.quantity <= 1}
                              className="flex h-full w-10 items-center justify-center text-stone-500 hover:text-amber-700 disabled:opacity-40 transition-colors"
                            >
                              <Minus size={15} />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-stone-900">
                              {isBusy ? '...' : item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item._id, item.quantity, item.quantity + 1)}
                              disabled={isBusy}
                              className="flex h-full w-10 items-center justify-center text-stone-500 hover:text-amber-700 disabled:opacity-40 transition-colors"
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item._id, product.title)}
                            disabled={isBusy}
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-stone-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-40 transition-all"
                            aria-label="Remove item"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </article>
                    )
                  })}
                </div>
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-5">
                    <ShoppingBag size={32} />
                  </div>
                  <h2 className="font-serif text-3xl text-stone-900">Your cart is empty</h2>
                  <p className="mt-3 text-stone-500 max-w-xs">
                    Explore our curated collections and add something beautiful to your cart.
                  </p>
                  <Link to="/" className="btn-gold mt-8 rounded-2xl px-8 py-3.5">
                    <ShoppingBag size={16} /> Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Order Summary */}
          <aside className="space-y-4 xl:pt-0">
            <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-[0_4px_24px_rgba(70,39,10,0.06)]">
              <h2 className="font-serif text-2xl text-stone-950">Order Summary</h2>

              <div className="mt-5 space-y-3 text-sm text-stone-700">
                {[
                  { label: `Subtotal (${cart.totalItems || 0} items)`, value: formatCurrency(subtotal), colored: false },
                  { label: 'Discount (15%)', value: `-${formatCurrency(discount)}`, colored: true },
                  { label: 'Shipping', value: shipping === 0 ? 'FREE' : formatCurrency(shipping), colored: shipping === 0 },
                ].map(({ label, value, colored }) => (
                  <div key={label} className="flex justify-between items-center py-1.5 border-b border-stone-50">
                    <span className="text-stone-600">{label}</span>
                    <span className={`font-semibold ${colored ? 'text-emerald-600' : 'text-stone-900'}`}>{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-end justify-between rounded-xl bg-amber-50/60 border border-amber-100 px-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-stone-800">Total Amount</p>
                  <p className="text-xs text-stone-500 mt-0.5">Inclusive of all taxes</p>
                </div>
                <p className="font-serif text-3xl font-semibold text-stone-950">{formatCurrency(total)}</p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                disabled={!cartItems.length}
                className="btn-gold mt-5 w-full rounded-xl py-4 text-sm disabled:opacity-40"
              >
                <ShoppingBag size={16} /> Proceed to Checkout
              </button>
              <Link to="/" className="btn-outline mt-3 w-full rounded-xl py-3.5 text-sm">
                Continue Shopping
              </Link>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-stone-400">
                <ShieldCheck size={13} /> Secure & encrypted payments
              </div>
            </div>

            {/* Coupon */}
            <div className="rounded-2xl border border-stone-100 bg-white overflow-hidden shadow-[0_4px_24px_rgba(70,39,10,0.06)]">
              <button
                type="button"
                onClick={() => setCouponOpen((o) => !o)}
                className="flex w-full items-center justify-between px-5 py-4 text-sm font-semibold text-stone-900 hover:bg-stone-50 transition"
              >
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-amber-600" />
                  Have a coupon code?
                </div>
                <ChevronRight size={16} className={`transition-transform ${couponOpen ? 'rotate-90' : ''}`} />
              </button>
              {couponOpen && (
                <div className="border-t border-stone-100 px-5 pb-5 pt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="input-luxury flex-1 h-11 text-sm"
                    />
                    <button type="button" className="btn-gold rounded-xl px-5 py-0 text-sm h-11">
                      Apply
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-stone-400">Try: STYLORE15 for 15% extra off</p>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Service bar */}
        <section className="mt-12 grid gap-3 rounded-2xl border border-stone-100 bg-white p-5 shadow-[0_4px_20px_rgba(70,39,10,0.05)] sm:grid-cols-2 lg:grid-cols-4">
          {serviceCards.map(({ Icon, title, subtitle }) => (
            <div key={title} className="flex items-center gap-4 rounded-xl px-4 py-4 hover:bg-amber-50/30 transition">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-700">
                <Icon size={19} />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900">{title}</p>
                <p className="text-xs text-stone-500">{subtitle}</p>
              </div>
            </div>
          ))}
        </section>

        {/* You may also like */}
        {suggestionProducts.length > 0 && (
          <section className="mt-14">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-3xl text-stone-950">You May Also Like</h2>
              <Link to="/" className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors">
                View All <ChevronRight size={15} />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {suggestionProducts.map((product) => (
                <article key={product._id} className="group overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-[0_4px_20px_rgba(70,39,10,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(70,39,10,0.1)]">
                  <Link to={`/details/${product._id}`} className="img-zoom block bg-[#f2ebe1]">
                    <img
                      src={product.images?.[0]?.url || 'https://placehold.co/420x480/e7dfd2/6b5b4d?text=Product'}
                      alt={product.title}
                      className="h-60 w-full object-cover"
                      loading="lazy"
                    />
                  </Link>
                  <div className="p-4">
                    <Link to={`/details/${product._id}`} className="text-sm font-semibold text-stone-900 hover:text-amber-700 transition-colors line-clamp-1 block">
                      {product.title}
                    </Link>
                    <p className="mt-1.5 font-semibold text-stone-900">
                      {formatCurrency(product.price?.amount, product.price?.currency)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAddSuggestion(product._id, product.title)}
                      disabled={addingSuggestionId === product._id}
                      className="mt-3 flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all disabled:opacity-50"
                    >
                      <ShoppingBag size={13} />
                      {addingSuggestionId === product._id ? 'Adding...' : 'Add to Cart'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Cart
