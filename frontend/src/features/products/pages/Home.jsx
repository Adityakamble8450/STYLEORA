import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { ArrowRight, Heart, ShoppingBag, Star, Truck, RefreshCw, Shield, Headphones, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useSelector } from 'react-redux'
import Useproduct from '../hook/Useproduct'
import UseCart from '../hook/UseCart'
import StorefrontHeader from '../components/StorefrontHeader'
import Footer from '../../../componants/Footer'
import { useToast } from '../../../componants/Toast'

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1559697242-cacab5d5b62c?q=80&w=1400&auto=format&fit=crop',
    title: 'The New Season\nEdit is Here',
    caption: 'Curated silhouettes, premium fabrics, and fashion that speaks before you do.',
    tag: 'SS 2025 Collection',
    cta: 'Shop Collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=80',
    title: 'Variant-Ready\nLuxury Catalog',
    caption: 'Switch color, style, and material options — every choice beautifully presented.',
    tag: 'Explore Variants',
    cta: 'Browse Products',
  },
  {
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=80',
    title: 'Premium Seller\nPresentation',
    caption: 'Give your storefront the polished identity it deserves with Stylore Maki.',
    tag: 'For Sellers',
    cta: 'Start Selling',
  },
]

const benefitCards = [
  { title: 'Free Shipping', subtitle: 'On orders above ₹999', Icon: Truck },
  { title: 'Easy Returns', subtitle: 'Hassle-free within 7 days', Icon: RefreshCw },
  { title: 'Secure Payments', subtitle: '100% safe & encrypted', Icon: Shield },
  { title: '24/7 Support', subtitle: 'Always here to help you', Icon: Headphones },
]

const categoryCards = [
  {
    title: 'Men',
    subtitle: 'Tailored precision',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Women',
    subtitle: 'Effortless elegance',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Kids',
    subtitle: 'Playful & premium',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Accessories',
    subtitle: 'Define your look',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80',
  },
]

const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(amount || 0))

const ProductSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white">
    <div className="skeleton h-72 rounded-none" />
    <div className="space-y-3 p-4">
      <div className="skeleton h-4 w-3/4 rounded-full" />
      <div className="skeleton h-4 w-1/2 rounded-full" />
      <div className="skeleton h-4 w-1/3 rounded-full" />
    </div>
  </div>
)

const ProductCard = ({ product, onAddToCart, addingId, wishlist, onToggleWishlist }) => {
  const isAdding = addingId === product._id
  const isWished = wishlist.has(product._id)

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-[0_4px_20px_rgba(70,39,10,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(70,39,10,0.12)]">
      {/* Image */}
      <div className="img-zoom relative bg-[#f2ebe1]">
        <Link to={`/details/${product._id}`} tabIndex={-1} aria-label={`View ${product.title}`}>
          <img
            src={product.images?.[0]?.url || 'https://placehold.co/600x720/e7dfd2/6b5b4d?text=Product'}
            alt={product.title}
            className="h-72 w-full object-cover"
            loading="lazy"
          />
        </Link>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          <span className="badge-gold text-[0.6rem]">New</span>
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => onToggleWishlist(product._id)}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-all duration-200 ${
            isWished
              ? 'bg-red-50 text-red-500 scale-110'
              : 'bg-white/90 text-stone-500 hover:bg-red-50 hover:text-red-500'
          }`}
          aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={isWished ? 'currentColor' : 'none'} />
        </button>

        {/* Quick add - slides up on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="flex w-full items-center justify-center gap-2 bg-[#1a1411]/92 backdrop-blur-sm py-3.5 text-sm font-semibold text-white transition hover:bg-[#1a1411]"
          >
            {isAdding ? (
              <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <ShoppingBag size={16} />
            )}
            {isAdding ? 'Adding...' : 'Quick Add to Cart'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <Link
          to={`/details/${product._id}`}
          className="text-base font-semibold text-stone-900 hover:text-amber-700 transition-colors duration-200 line-clamp-1 block"
        >
          {product.title}
        </Link>

        <div className="mt-1.5 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
          ))}
          <span className="ml-1 text-xs text-stone-400">(4.8)</span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div>
            <p className="text-lg font-semibold text-stone-900">
              {formatCurrency(product.price?.amount, product.price?.currency)}
            </p>
            <p className="text-xs text-stone-400 line-through">
              {formatCurrency(Number(product.price?.amount || 0) * 1.2, product.price?.currency)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all duration-200 shrink-0"
            aria-label={`Add ${product.title} to cart`}
          >
            {isAdding
              ? <span className="animate-spin h-4 w-4 border-2 border-amber-700/30 border-t-amber-700 rounded-full" />
              : <ShoppingBag size={16} />
            }
          </button>
        </div>
      </div>
    </article>
  )
}

const Home = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { handleGetAllProducts, products, loading, error } = Useproduct()
  const { handleAddToCart } = UseCart()
  const [searchParams] = useSearchParams()
  const [addingId, setAddingId] = useState(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [wishlist, setWishlist] = useState(new Set())
  const addToast = useToast()
  const searchTerm = searchParams.get('q') || ''

  useEffect(() => {
    handleGetAllProducts().catch(() => {})
  }, [handleGetAllProducts])

  /* ── Auto-advance hero slides ── */
  useEffect(() => {
    const id = setInterval(() => setActiveSlide((c) => (c + 1) % heroSlides.length), 5000)
    return () => clearInterval(id)
  }, [])

  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredProducts = useMemo(() => {
    if (!normalizedSearch) return products
    return products.filter((p) => {
      const title = String(p?.title ?? '').toLowerCase()
      const desc = String(p?.description ?? '').toLowerCase()
      return title.includes(normalizedSearch) || desc.includes(normalizedSearch)
    })
  }, [normalizedSearch, products])

  const displayedProducts = useMemo(() => {
    if (normalizedSearch) return filteredProducts
    return products.slice(0, 8)
  }, [filteredProducts, normalizedSearch, products])

  const handleAddProductToCart = async (product) => {
    if (!user) { navigate('/login'); return }
    try {
      setAddingId(product._id)
      await handleAddToCart({ productId: product._id, quantity: 1 })
      addToast(`${product.title} added to cart!`, 'success')
    } catch (err) {
      addToast(err?.message || 'Could not add to cart.', 'error')
    } finally {
      setAddingId(null)
    }
  }

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
        addToast('Removed from wishlist', 'info')
      } else {
        next.add(productId)
        addToast('Added to wishlist!', 'success')
      }
      return next
    })
  }

  const slide = heroSlides[activeSlide]

  return (
    <div className="min-h-screen page-bg">
      <StorefrontHeader />

      <main>
        {/* ════════════════ HERO ════════════════ */}
        <section className="relative overflow-hidden" aria-label="Hero banner">
          {/* Background image */}
          <div key={activeSlide} className="animate-hero absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1411]/80 via-[#1a1411]/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="container-luxury relative py-24 sm:py-32 lg:py-40 xl:py-48">
            <div className="max-w-2xl">
              <div key={`tag-${activeSlide}`} className="animate-fade-in-up">
                <span className="badge-gold mb-6 inline-block">{slide.tag}</span>
              </div>

              <h1
                key={`title-${activeSlide}`}
                className="animate-fade-in-up stagger-1 font-serif text-5xl leading-[1.02] text-white sm:text-6xl lg:text-7xl xl:text-[5rem]"
                style={{ whiteSpace: 'pre-line' }}
              >
                {slide.title}
              </h1>

              <p
                key={`caption-${activeSlide}`}
                className="animate-fade-in-up stagger-2 mt-6 max-w-lg text-base leading-7 text-white/80 sm:text-lg"
              >
                {slide.caption}
              </p>

              <div className="animate-fade-in-up stagger-3 mt-8 flex flex-wrap gap-4">
                <a href="#catalog" className="btn-gold">
                  {slide.cta} <ArrowRight size={16} />
                </a>
                <Link to="/wishlist" className="btn-outline border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 hover:text-white backdrop-blur-sm">
                  View Wishlist <Heart size={16} />
                </Link>
              </div>

              {/* Slide dots */}
              <div className="animate-fade-in-up stagger-4 mt-10 flex items-center gap-2">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveSlide(i)}
                    className={`h-2 rounded-full transition-all duration-400 ${i === activeSlide ? 'w-8 bg-amber-400' : 'w-2 bg-white/35'}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
                <div className="ml-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSlide((c) => (c - 1 + heroSlides.length) % heroSlides.length)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/70 hover:bg-white/10 transition"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSlide((c) => (c + 1) % heroSlides.length)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/70 hover:bg-white/10 transition"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ BENEFIT BAR ════════════════ */}
        <section className="bg-white border-y border-stone-100" aria-label="Service benefits">
          <div className="container-luxury py-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {benefitCards.map(({ title, subtitle, Icon }, i) => (
                <div
                  key={title}
                  className={`animate-fade-in-up stagger-${i + 1} flex items-center gap-4 rounded-2xl border border-stone-100 bg-stone-50/60 px-5 py-5 transition hover:bg-amber-50/40 hover:border-amber-100`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{title}</p>
                    <p className="mt-0.5 text-xs text-stone-500">{subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ CATEGORIES ════════════════ */}
        <section id="categories" className="container-luxury py-16 lg:py-20" aria-label="Shop by category">
          <div className="text-center mb-12">
            <p className="label-overline mb-3">Explore</p>
            <h2 className="section-heading">Shop by Category</h2>
            <p className="mt-4 text-stone-500 max-w-md mx-auto">
              Find the perfect style for every occasion across our curated collections.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {categoryCards.map((card, i) => (
              <a
                key={card.title}
                href="#catalog"
                className={`animate-fade-in-up stagger-${i + 1} group relative overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(70,39,10,0.1)]`}
                aria-label={`Shop ${card.title}`}
              >
                <div className="img-zoom">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-80 w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-amber-600/0 group-hover:bg-amber-600/8 transition-colors duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-serif text-3xl font-semibold">{card.title}</h3>
                  <p className="mt-1 text-sm text-white/75">{card.subtitle}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Shop now <ArrowRight size={12} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ════════════════ PRODUCT CATALOG ════════════════ */}
        <section id="catalog" className="container-luxury pb-20" aria-label="Product catalog">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
            <div>
              <p className="label-overline mb-2">
                {normalizedSearch ? 'Search Results' : 'Featured Products'}
              </p>
              <h2 className="section-heading">
                {normalizedSearch ? `"${searchTerm}"` : 'You May Also Like'}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-stone-500">
                {normalizedSearch
                  ? `${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''}`
                  : `${products.length} products`}
              </span>
              <Link
                to="/cart"
                className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors"
              >
                View Cart <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Loading skeleton */}
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : normalizedSearch && displayedProducts.length === 0 ? (
            /* Empty search state */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/70 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-4">
                <Search size={28} />
              </div>
              <h3 className="font-serif text-2xl text-stone-900">No results for &ldquo;{searchTerm}&rdquo;</h3>
              <p className="mt-2 text-sm text-stone-500">Try a different keyword or browse our collections.</p>
              <a href="#categories" className="btn-gold mt-6 rounded-xl py-3 text-sm">
                Browse Categories
              </a>
            </div>
          ) : (
            /* Product grid */
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayedProducts.map((product, i) => (
                <div key={product._id} className={`animate-fade-in-up stagger-${Math.min(i % 4 + 1, 4)}`}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddProductToCart}
                    addingId={addingId}
                    wishlist={wishlist}
                    onToggleWishlist={toggleWishlist}
                  />
                </div>
              ))}
            </div>
          )}

          {/* View all CTA */}
          {!normalizedSearch && products.length > 8 && !loading && (
            <div className="mt-12 text-center">
              <a href="#catalog" className="btn-outline px-10 py-3.5 rounded-2xl">
                View All {products.length} Products <ArrowRight size={16} />
              </a>
            </div>
          )}
        </section>

        {/* ════════════════ BRAND BANNER ════════════════ */}
        <section className="bg-[#1a1411] py-16 lg:py-20" aria-label="Brand statement">
          <div className="container-luxury text-center">
            <p className="label-overline text-amber-400/80 mb-4">The Stylore Promise</p>
            <h2 className="font-serif text-4xl text-white leading-tight lg:text-5xl max-w-3xl mx-auto">
              Fashion begins the moment you dress with intention
            </h2>
            <p className="mt-5 text-white/55 text-base max-w-lg mx-auto leading-7">
              Every piece in our catalog is curated for quality, character, and the kind of style that doesn't shout — it commands.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href="#catalog" className="btn-gold rounded-2xl px-8 py-4">
                Start Shopping <ArrowRight size={16} />
              </a>
              <Link to="/register" className="btn-outline border-white/20 bg-white/8 text-white hover:bg-white/15 hover:border-white/30 hover:text-white backdrop-blur-sm rounded-2xl px-8 py-4">
                Join Stylore
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
