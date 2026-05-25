import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router'
import {
  Heart, Share2, Star, ShoppingBag, Truck, RefreshCw,
  Shield, ChevronRight, ZoomIn, Minus, Plus
} from 'lucide-react'
import Useproduct from '../hook/Useproduct'
import UseCart from '../hook/UseCart'
import StorefrontHeader from '../components/StorefrontHeader'
import Footer from '../../../componants/Footer'
import { useToast } from '../../../componants/Toast'
import { findMatchingVariant, getDisplayProduct, getVariantGroups } from '../services/product.normalize'

const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(amount || 0))

const getVariantPreviewImage = (variant, product) =>
  variant?.images?.[0]?.url || product?.images?.[0]?.url || 'https://placehold.co/320x420/e7dfd2/6b5b4d?text=No+Image'

const deliveryInfo = [
  { Icon: Truck, text: 'Free delivery on orders above ₹999' },
  { Icon: RefreshCw, text: 'Easy returns within 7 days' },
  { Icon: Shield, text: '100% authentic & quality guaranteed' },
]

/* ─── Skeleton ─── */
const DetailsSkeleton = () => (
  <div className="min-h-screen page-bg">
    <div className="container-luxury pt-6 pb-16">
      <div className="skeleton h-5 w-64 rounded-full mb-8" />
      <div className="grid gap-8 xl:grid-cols-2">
        <div className="skeleton h-[560px] rounded-2xl" />
        <div className="space-y-5">
          <div className="skeleton h-6 w-32 rounded-full" />
          <div className="skeleton h-10 w-4/5 rounded-xl" />
          <div className="skeleton h-8 w-40 rounded-xl" />
          <div className="skeleton h-32 w-full rounded-xl" />
          <div className="skeleton h-14 w-full rounded-xl" />
          <div className="skeleton h-14 w-full rounded-xl" />
        </div>
      </div>
    </div>
  </div>
)

const ProductDetails = () => {
  const navigate = useNavigate()
  const { productId } = useParams()
  const { user } = useSelector((state) => state.auth)
  const { handleGetprodcutById, error, loading, products } = Useproduct()
  const { handleAddToCart } = UseCart()
  const addToast = useToast()
  const [product, setProduct] = useState(null)
  const [selectedAttributes, setSelectedAttributes] = useState({})
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(0)
  const [wishlist, setWishlist] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    handleGetprodcutById(productId).catch(() => {})
  }, [handleGetprodcutById, productId])

  useEffect(() => {
    if (products?.length) setProduct(products[0])
  }, [products])

  const variantGroups = useMemo(() => getVariantGroups(product?.variants || []), [product?.variants])
  const activeVariant = useMemo(
    () => findMatchingVariant(product?.variants || [], selectedAttributes),
    [product?.variants, selectedAttributes],
  )
  const displayProduct = useMemo(
    () => (product ? getDisplayProduct(product, activeVariant) : null),
    [product, activeVariant],
  )

  const galleryImages = displayProduct?.displayImages?.length
    ? displayProduct.displayImages
    : [{ url: 'https://placehold.co/900x1200/e7dfd2/6b5b4d?text=No+Image' }]

  useEffect(() => {
    setSelectedGalleryImage(0)
  }, [activeVariant?._id, product?._id])

  const handleAttributeSelect = (key, value) => {
    setSelectedAttributes((cur) => ({ ...cur, [key]: cur[key] === value ? undefined : value }))
  }

  const handleVariantSelect = (variant) => {
    setSelectedAttributes(variant?.attributes || {})
  }

  const handleAddProductToCart = async (buyNow = false) => {
    if (!user) { navigate('/login'); return }
    try {
      setAddingToCart(true)
      await handleAddToCart({ productId: product._id, variantId: activeVariant?._id, quantity })
      addToast(`${product.title} added to cart!`, 'success')
      if (buyNow) navigate('/checkout')
    } catch (err) {
      addToast(err?.message || 'Could not add to cart.', 'error')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product?.title, url: window.location.href }).catch(() => {})
    } else {
      await navigator.clipboard.writeText(window.location.href).catch(() => {})
      addToast('Link copied to clipboard!', 'info')
    }
  }

  if (loading && !product) return <><StorefrontHeader /><DetailsSkeleton /></>

  if (!product) {
    return (
      <div className="min-h-screen page-bg">
        <StorefrontHeader />
        <div className="container-luxury py-20">
          <div className="mx-auto max-w-xl rounded-2xl border border-stone-200 bg-white p-12 text-center shadow-[0_8px_40px_rgba(70,39,10,0.08)]">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-400">
              <ShoppingBag size={28} />
            </div>
            <h1 className="font-serif text-3xl text-stone-900">Product Not Available</h1>
            <p className="mt-3 text-stone-500">{error || 'Unable to load this product right now.'}</p>
            <Link to="/" className="btn-gold mt-8 inline-flex rounded-2xl px-8 py-3.5">
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen page-bg">
      <StorefrontHeader />

      <main className="container-luxury pb-16 pt-6">
        {/* ── Breadcrumb ── */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-stone-500" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-amber-700 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span>Products</span>
          <ChevronRight size={14} />
          <span className="font-medium text-stone-800 line-clamp-1 max-w-[200px]">{product.title}</span>
        </nav>

        {/* ── Main Grid ── */}
        <div className="grid gap-8 xl:grid-cols-2 2xl:gap-12">

          {/* ── Gallery ── */}
          <div className="flex flex-col gap-4 xl:flex-row xl:gap-4">
            {/* Thumbnails */}
            <div className="order-2 flex gap-2 overflow-x-auto pb-1 xl:order-1 xl:flex-col xl:overflow-visible xl:w-[80px] xl:shrink-0">
              {galleryImages.map((img, i) => (
                <button
                  key={`${img.url}-${i}`}
                  type="button"
                  onClick={() => setSelectedGalleryImage(i)}
                  className={`shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                    selectedGalleryImage === i
                      ? 'border-amber-500 shadow-[0_0_0_2px_rgba(184,125,42,0.2)]'
                      : 'border-transparent hover:border-stone-300'
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img
                    src={img.url}
                    alt={`Preview ${i + 1}`}
                    className="h-20 w-16 object-cover xl:h-[76px] xl:w-[68px]"
                  />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="order-1 flex-1 xl:order-2 relative group">
              <div className={`overflow-hidden rounded-2xl bg-[#f2ebe1] shadow-[0_8px_40px_rgba(70,39,10,0.08)] cursor-zoom-in transition-all duration-300 ${zoomed ? 'cursor-zoom-out' : ''}`}>
                <img
                  src={galleryImages[selectedGalleryImage]?.url}
                  alt={displayProduct?.title}
                  className={`w-full object-cover transition-transform duration-700 ${zoomed ? 'scale-150' : 'scale-100 group-hover:scale-[1.03]'} h-[380px] sm:h-[480px] md:h-[560px] xl:h-[620px]`}
                  onClick={() => setZoomed((z) => !z)}
                />
              </div>

              {/* Action buttons on image */}
              <div className="absolute right-4 top-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setWishlist((w) => !w)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all duration-200 ${
                    wishlist ? 'bg-red-50 text-red-500' : 'bg-white/90 text-stone-600 hover:bg-red-50 hover:text-red-500'
                  }`}
                  aria-label={wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart size={18} fill={wishlist ? 'currentColor' : 'none'} />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-600 shadow-md hover:bg-stone-50 transition"
                  aria-label="Share product"
                >
                  <Share2 size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomed((z) => !z)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-600 shadow-md hover:bg-stone-50 transition"
                  aria-label="Zoom image"
                >
                  <ZoomIn size={17} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Product Info ── */}
          <aside className="rounded-2xl border border-stone-100 bg-white/90 p-6 shadow-[0_8px_32px_rgba(70,39,10,0.06)] xl:sticky xl:top-24 xl:self-start sm:p-8">
            <p className="label-overline mb-3">Stylore Maki</p>
            <h1 className="font-serif text-3xl leading-tight text-stone-950 sm:text-4xl 2xl:text-[2.5rem]">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-stone-700">4.8</span>
              <span className="text-sm text-stone-400">· Premium quality</span>
            </div>

            {/* Price */}
            <div className="mt-5 flex flex-wrap items-end gap-3">
              <p className="font-serif text-3xl font-semibold text-stone-950 sm:text-4xl">
                {formatCurrency(displayProduct.displayPrice?.amount, displayProduct.displayPrice?.currency)}
              </p>
              <p className="pb-1 text-lg text-stone-400 line-through">
                {formatCurrency(Number(displayProduct.displayPrice?.amount || 0) * 1.2, displayProduct.displayPrice?.currency)}
              </p>
              <span className="badge-gold pb-1">20% off</span>
              {activeVariant?.stock >= 0 && (
                <span className={`pb-1 text-sm font-medium ${activeVariant.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {activeVariant.stock > 0 ? `${activeVariant.stock} left in stock` : 'Out of stock'}
                </span>
              )}
            </div>

            <p className="text-xs text-stone-400 mt-1">Inclusive of all taxes</p>

            {/* Description */}
            <p className="mt-5 text-base leading-7 text-stone-600 border-t border-stone-100 pt-5">
              {product.description}
            </p>

            {/* Variants image carousel */}
            {product.variants?.length ? (
              <div className="mt-6 border-t border-stone-100 pt-6">
                <p className="text-sm font-semibold text-stone-900 mb-3">
                  Variant:
                  <span className="font-medium text-amber-700 ml-1.5">
                    {activeVariant?.label || 'Original product'}
                  </span>
                </p>
                <div className="flex gap-2.5 overflow-x-auto pb-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      type="button"
                      onClick={() => handleVariantSelect(variant)}
                      className={`shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                        activeVariant?._id === variant._id
                          ? 'border-amber-500 shadow-[0_0_0_2px_rgba(184,125,42,0.15)]'
                          : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <img
                        src={getVariantPreviewImage(variant, product)}
                        alt={variant.label}
                        className="h-20 w-[68px] object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Attribute selectors */}
            {!!Object.keys(variantGroups).length && (
              <div className="mt-6 space-y-5 border-t border-stone-100 pt-6">
                {Object.entries(variantGroups).map(([key, values]) => (
                  <div key={key}>
                    <p className="text-sm font-semibold text-stone-900 mb-2.5">
                      {key}:
                      <span className="font-medium text-amber-700 ml-1.5">
                        {selectedAttributes[key] || 'Select'}
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {values.map((value) => {
                        const isSelected = selectedAttributes[key] === value
                        return (
                          <button
                            key={`${key}-${value}`}
                            type="button"
                            onClick={() => handleAttributeSelect(key, value)}
                            className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                              isSelected
                                ? 'border-stone-900 bg-stone-900 text-white shadow-md'
                                : 'border-stone-200 bg-white text-stone-700 hover:border-amber-400 hover:text-amber-700'
                            }`}
                          >
                            {value}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6 flex items-center gap-4 border-t border-stone-100 pt-6">
              <p className="text-sm font-semibold text-stone-900">Quantity</p>
              <div className="flex h-11 items-center rounded-xl border border-stone-200 bg-stone-50">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-full w-11 items-center justify-center text-stone-600 hover:text-amber-700 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-stone-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-full w-11 items-center justify-center text-stone-600 hover:text-amber-700 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleAddProductToCart(false)}
                disabled={addingToCart}
                className="btn-outline rounded-xl py-4 text-sm disabled:opacity-60"
              >
                {addingToCart ? (
                  <span className="animate-spin h-4 w-4 border-2 border-stone-300 border-t-stone-700 rounded-full" />
                ) : <ShoppingBag size={16} />}
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                type="button"
                onClick={() => handleAddProductToCart(true)}
                disabled={addingToCart}
                className="btn-gold rounded-xl py-4 text-sm disabled:opacity-60"
              >
                Buy Now
              </button>
            </div>

            {/* Delivery info */}
            <div className="mt-6 space-y-3 border-t border-stone-100 pt-6">
              {deliveryInfo.map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-stone-600">
                  <Icon size={15} className="text-amber-600 shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ProductDetails
