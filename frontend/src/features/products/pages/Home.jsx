import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { clearAuthState } from '../../auth/state/auth.slice'
import { clearAuthSession } from '../../auth/services/auth.session'
import Useproduct from '../hook/Useproduct'

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80',
    title: 'Collections That Convert',
    caption: 'Build a storefront where original products and live variants feel polished from the first click.',
  },
  {
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80',
    title: 'Variant-Ready Catalog',
    caption: 'Let shoppers switch color or style options and instantly see the matching product image.',
  },
  {
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1600&q=80',
    title: 'Premium Seller Presentation',
    caption: 'Give your product team a cleaner home page with stronger product cards and better catalog context.',
  },
]

const categoryCards = [
  {
    title: 'Men',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Kids',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80',
  },
]

const serviceHighlights = [
  { title: 'Free Shipping', subtitle: 'On orders above ₹999' },
  { title: 'Easy Returns', subtitle: 'Within 7 days' },
  { title: 'Secure Payments', subtitle: 'Protected checkout flow' },
  { title: 'Variant Switching', subtitle: 'Original fallback included' },
]

const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0))

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const { handleGetAllProducts, products, loading, error } = Useproduct()
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    handleGetAllProducts().catch(() => {})
  }, [handleGetAllProducts])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length)
    }, 4000)

    return () => window.clearInterval(intervalId)
  }, [])

  const featuredProducts = useMemo(() => products.slice(0, 6), [products])
  const highlightProduct = featuredProducts[0]
  const totalValue = products.reduce((sum, product) => sum + Number(product.price?.amount || 0), 0)
  const totalVariants = products.reduce((sum, product) => sum + (product.variants?.length || 0), 0)
  const productsWithVariants = products.filter((product) => (product.variants?.length || 0) > 0).length

  const handleLogout = () => {
    clearAuthSession()
    dispatch(clearAuthState())
    navigate('/login', { replace: true })
  }

  return (
    <section className="min-h-screen w-full bg-[linear-gradient(180deg,_#f9f5ee_0%,_#f3ecdf_46%,_#eee4d5_100%)] text-stone-900">
      <div className="border-b border-stone-200/70 bg-white/65 px-4 py-3 text-[13px] text-stone-700 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-6">
            <span>Free Shipping on Orders Above ₹999</span>
            <span>Easy Returns & Exchanges</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span>Variant-aware product pages</span>
            <span>Seller-ready catalog UI</span>
          </div>
        </div>
      </div>

      <div className="w-full px-0 py-0">
        <header className="sticky top-0 z-30 mx-auto w-full max-w-none border-b border-white/70 bg-white/78 px-4 py-5 shadow-[0_18px_48px_rgba(70,39,10,0.08)] backdrop-blur sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-10">
              <div>
                <p className="font-serif text-[2.2rem] leading-none tracking-[0.06em] text-stone-950">STYLORE</p>
                <p className="text-xs uppercase tracking-[0.38em] text-stone-500">Maki</p>
              </div>

              <nav className="hidden items-center gap-7 text-[1rem] xl:flex">
                <a className="font-medium text-stone-950" href="#home">Home</a>
                <a className="text-stone-700 transition hover:text-stone-950" href="#categories">Categories</a>
                <a className="text-stone-700 transition hover:text-stone-950" href="#products">Products</a>
                <a className="text-stone-700 transition hover:text-stone-950" href="#featured">Featured</a>
              </nav>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex h-13 min-w-[260px] items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-5 shadow-sm sm:min-w-[340px]">
                <span className="text-sm text-stone-400">Search for products...</span>
                <svg className="h-5 w-5 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </div>

              {user ? (
                <div className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-4 py-2 shadow-sm">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-stone-100 text-stone-700">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c1.8-3.4 5-5 8-5s6.2 1.6 8 5" />
                    </svg>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs text-stone-500">Hi</p>
                    <p className="text-sm font-medium text-stone-900">{user.fullname || 'Styleora User'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-stone-700 transition hover:bg-stone-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </header>

        <main id="home" className="pt-0">
          <section className="overflow-hidden bg-[linear-gradient(115deg,_#ecdfcd_0%,_#f8f1e6_46%,_#e7d5c0_100%)] shadow-[0_25px_70px_rgba(88,54,18,0.12)]">
            <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-[1600px] items-stretch lg:grid-cols-[0.98fr_1.02fr]">
              <div className="flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-16">
                <span className="inline-flex w-fit rounded-full bg-white/65 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-800">
                  Product Team Ready
                </span>
                <h1 className="mt-5 max-w-xl font-serif text-[3.3rem] leading-[0.96] text-stone-950 sm:text-[4.6rem]">
                  {heroSlides[activeSlide].title}
                </h1>
                <p className="mt-5 max-w-lg text-lg leading-8 text-stone-700">
                  {heroSlides[activeSlide].caption}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="#products"
                    className="inline-flex h-14 items-center justify-center rounded-2xl bg-stone-950 px-10 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(20,20,20,0.18)] transition hover:bg-stone-800"
                  >
                    Shop products
                  </a>
                  {user?.role === 'seller' ? (
                    <Link
                      to="/seller/dashboard"
                      className="inline-flex h-14 items-center justify-center rounded-2xl border border-stone-300 bg-white/40 px-10 text-sm font-semibold text-stone-900 transition hover:bg-white/60"
                    >
                      Open seller dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/register"
                      className="inline-flex h-14 items-center justify-center rounded-2xl border border-stone-300 bg-white/40 px-10 text-sm font-semibold text-stone-900 transition hover:bg-white/60"
                    >
                      Become a seller
                    </Link>
                  )}
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/70 bg-white/55 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Products</p>
                    <p className="mt-2 text-2xl font-semibold text-stone-950">{products.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/70 bg-white/55 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Variants</p>
                    <p className="mt-2 text-2xl font-semibold text-stone-950">{totalVariants}</p>
                  </div>
                  <div className="rounded-2xl border border-white/70 bg-white/55 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Catalog Value</p>
                    <p className="mt-2 text-2xl font-semibold text-stone-950">{formatCurrency(totalValue)}</p>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[420px]">
                <img src={heroSlides[activeSlide].image} alt={heroSlides[activeSlide].title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(237,225,207,0.08)_0%,_rgba(237,225,207,0)_35%,_rgba(70,39,10,0.06)_100%)]" />
                <div className="absolute bottom-6 left-6 right-6 rounded-[1.4rem] border border-white/55 bg-white/82 p-4 shadow-[0_18px_55px_rgba(70,39,10,0.12)] backdrop-blur">
                  <div className="grid gap-4 text-sm text-stone-700 md:grid-cols-3">
                    <div className="rounded-xl border border-stone-100 bg-white/60 px-4 py-3">
                      <p className="font-semibold text-stone-900">Original fallback</p>
                      <p className="mt-1">Missing variant images still resolve cleanly.</p>
                    </div>
                    <div className="rounded-xl border border-stone-100 bg-white/60 px-4 py-3">
                      <p className="font-semibold text-stone-900">Seller controls</p>
                      <p className="mt-1">Add and preview product variants from one screen.</p>
                    </div>
                    <div className="rounded-xl border border-stone-100 bg-white/60 px-4 py-3">
                      <p className="font-semibold text-stone-900">Buyer clarity</p>
                      <p className="mt-1">Click blue or brown and the image switches with it.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto mt-6 max-w-[1600px] px-4 sm:px-6 lg:px-10">
            <div className="rounded-[1.8rem] border border-white/70 bg-white/65 px-5 py-5 shadow-[0_18px_50px_rgba(70,39,10,0.06)] backdrop-blur sm:px-8">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {serviceHighlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-stone-100 bg-white/60 px-4 py-4">
                  <p className="font-semibold text-stone-900">{item.title}</p>
                  <p className="mt-1 text-sm text-stone-600">{item.subtitle}</p>
                </div>
              ))}
              </div>
            </div>
          </section>

          <section id="categories" className="mx-auto max-w-[1600px] px-4 pt-12 sm:px-6 lg:px-10">
            <div className="text-center">
              <h2 className="font-serif text-4xl text-stone-950 sm:text-5xl">Shop by Category</h2>
              <p className="mt-3 text-base text-stone-600">
                Browse the catalog mood first, then move into detailed product and variant views.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {categoryCards.map((card) => (
                <article
                  key={card.title}
                  className="group relative overflow-hidden rounded-[1.6rem] shadow-[0_18px_40px_rgba(70,39,10,0.12)]"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-[320px] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/72 via-stone-900/18 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <h3 className="text-4xl font-semibold tracking-tight">{card.title}</h3>
                    <p className="mt-2 text-sm text-white/85">Explore now</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="products" className="mx-auto max-w-[1600px] px-4 pt-14 sm:px-6 lg:px-10">
            <div className="flex flex-col gap-4 border-b border-stone-200/80 pb-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">Live Catalog</p>
                <h2 className="mt-2 font-serif text-4xl text-stone-950 sm:text-5xl">Products your users can browse</h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
                  Cards now reflect whether a product is still on the original setup or already has live variant options behind it.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-full border border-stone-200 bg-white/80 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm">
                  {products.length} product{products.length === 1 ? '' : 's'}
                </div>
                <div className="rounded-full border border-stone-200 bg-white/80 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm">
                  {totalVariants} variants live
                </div>
                <div className="rounded-full border border-stone-200 bg-white/80 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm">
                  {productsWithVariants} product{productsWithVariants === 1 ? '' : 's'} with switching
                </div>
              </div>
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {loading ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="overflow-hidden rounded-[1.6rem] border border-stone-200/70 bg-white/75">
                    <div className="h-72 animate-pulse bg-stone-200" />
                    <div className="space-y-3 p-5">
                      <div className="h-4 w-2/3 animate-pulse rounded-full bg-stone-200" />
                      <div className="h-4 w-full animate-pulse rounded-full bg-stone-200" />
                      <div className="h-4 w-1/2 animate-pulse rounded-full bg-stone-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredProducts.length ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {featuredProducts.map((product, index) => (
                  <Link
                    to={`/details/${product._id}`}
                    key={product._id}
                    className="group overflow-hidden rounded-[1.8rem] border border-white/80 bg-white/75 shadow-[0_18px_42px_rgba(70,39,10,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(70,39,10,0.12)]"
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <div className="relative overflow-hidden">
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.title}
                          className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-72 items-center justify-center bg-[linear-gradient(145deg,_#f3cf99_0%,_#d48834_100%)] text-white">
                          <p className="text-sm font-semibold uppercase tracking-[0.24em]">No image</p>
                        </div>
                      )}

                      <div className="absolute left-4 top-4 rounded-full bg-white/88 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 shadow-sm backdrop-blur">
                        {product.images?.length || 0} photo{product.images?.length === 1 ? '' : 's'}
                      </div>
                      <div className="absolute right-4 top-4 rounded-full bg-stone-950/88 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm backdrop-blur">
                        {(product.variants?.length || 0) > 0
                          ? `${product.variants.length} variant${product.variants.length === 1 ? '' : 's'}`
                          : 'Original'}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-serif text-3xl leading-tight text-stone-950">{product.title}</h3>
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                            {(product.variants?.length || 0) > 0 ? 'Variant ready product' : 'Original catalog item'}
                          </p>
                        </div>
                        <p className="rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">
                          {formatCurrency(product.price?.amount, product.price?.currency)}
                        </p>
                      </div>

                      <p className="mt-4 line-clamp-3 text-sm leading-7 text-stone-700">{product.description}</p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {(product.variants || []).slice(0, 3).map((variant) => (
                          <span key={variant._id} className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700">
                            {variant.label}
                          </span>
                        ))}
                        {(product.variants?.length || 0) === 0 ? (
                          <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                            Default original
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-[1.8rem] border border-dashed border-stone-300 bg-white/70 px-6 py-14 text-center">
                <h3 className="font-serif text-3xl text-stone-950">No products yet</h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-700">
                  Once products are added, they will appear here with original-product fallback and variant badges.
                </p>
              </div>
            )}
          </section>

          {highlightProduct ? (
            <section id="featured" className="mx-auto mt-12 grid max-w-[1600px] gap-5 px-4 sm:px-6 lg:px-10 xl:grid-cols-[0.82fr_1.18fr]">
              <div className="rounded-[1.8rem] border border-white/75 bg-white/75 p-6 shadow-[0_20px_45px_rgba(70,39,10,0.08)]">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">Featured Product</p>
                <h3 className="mt-3 font-serif text-4xl text-stone-950">{highlightProduct.title}</h3>
                <p className="mt-4 text-base leading-7 text-stone-600">{highlightProduct.description}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-stone-200 bg-white px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Price</p>
                    <p className="mt-2 text-2xl font-semibold text-stone-950">
                      {formatCurrency(highlightProduct.price?.amount, highlightProduct.price?.currency)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Variants</p>
                    <p className="mt-2 text-2xl font-semibold text-stone-950">{highlightProduct.variants?.length || 0}</p>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Images</p>
                    <p className="mt-2 text-2xl font-semibold text-stone-950">{highlightProduct.images?.length || 0}</p>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Experience</p>
                    <p className="mt-2 text-sm font-semibold text-stone-950">
                      {(highlightProduct.variants?.length || 0) > 0 ? 'Switches into live variant views' : 'Uses original product view'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.8rem] shadow-[0_20px_45px_rgba(70,39,10,0.08)]">
                <img
                  src={highlightProduct.images?.[0]?.url || heroSlides[0].image}
                  alt={highlightProduct.title}
                  className="h-[420px] w-full object-cover"
                />
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </section>
  )
}

export default Home
