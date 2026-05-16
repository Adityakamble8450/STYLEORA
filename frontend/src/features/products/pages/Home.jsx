import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { clearAuthState } from '../../auth/state/auth.slice'
import { clearAuthSession } from '../../auth/services/auth.session'
import Useproduct from '../hook/Useproduct'

const carouselImages = [
  {
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80',
    title: 'Style That Speaks You',
    caption: 'Explore premium fashion for every occasion. Handpicked styles, just for you.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80',
    title: 'Fresh Styles For Every Day',
    caption: 'Modern silhouettes, soft neutrals, and premium looks designed for daily wear.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1600&q=80',
    title: 'New Collection, Better Mood',
    caption: 'Seasonal edits curated with texture, polish, and an elevated storefront feel.',
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
  {
    title: 'Gift Cards',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=900&q=80',
  },
]

const serviceHighlights = [
  { title: 'Free Shipping', subtitle: 'On orders above ₹999' },
  { title: 'Easy Returns', subtitle: 'Within 7 days' },
  { title: 'Secure Payments', subtitle: '100% secure payments' },
  { title: '24/7 Support', subtitle: "We're here to help" },
  { title: 'Best Quality', subtitle: 'Satisfaction guaranteed' },
]

const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0))

const formatCategoryLabel = (count) => `${count} item${count === 1 ? '' : 's'} live`

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
      setActiveSlide((current) => (current + 1) % carouselImages.length)
    }, 4000)

    return () => window.clearInterval(intervalId)
  }, [])

  const featuredProducts = useMemo(() => products.slice(0, 6), [products])
  const highlightProduct = featuredProducts[0]
  const totalValue = products.reduce((sum, product) => sum + Number(product.price?.amount || 0), 0)
  const totalImages = products.reduce((sum, product) => sum + (product.images?.length || 0), 0)

  const handleLogout = () => {
    clearAuthSession()
    dispatch(clearAuthState())
    navigate('/login', { replace: true })
  }

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(247,241,233,1)_25%,_rgba(241,231,220,1)_75%,_rgba(235,224,211,1)_100%)] text-stone-900">
      <div className="mx-auto max-w-[1500px] px-4 pb-16 pt-0 sm:px-6 lg:px-8">
        <div className="border-b border-stone-200/70 py-3 text-[13px] text-stone-700">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-6">
              <span>Free Shipping on Orders Above ₹999</span>
              <span>Easy Returns & Exchanges</span>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <span>Download App</span>
              <span>Sell on Stylore Maki</span>
            </div>
          </div>
        </div>

        <header className="sticky top-0 z-30 bg-[rgba(247,241,233,0.82)] backdrop-blur-xl">
          <div className="flex flex-col gap-5 py-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-10">
              <div>
                <p className="font-serif text-[2.25rem] leading-none tracking-[0.06em] text-stone-950">STYLORE</p>
                <p className="text-xs uppercase tracking-[0.38em] text-stone-500">Maki</p>
              </div>

              <nav className="hidden items-center gap-8 text-[1.02rem] xl:flex">
                <a className="border-b-2 border-amber-700 pb-1 font-medium text-stone-950" href="#home">Home</a>
                <a className="text-stone-700 transition hover:text-stone-950" href="#categories">Men</a>
                <a className="text-stone-700 transition hover:text-stone-950" href="#categories">Women</a>
                <a className="text-stone-700 transition hover:text-stone-950" href="#categories">Kids</a>
                <a className="text-stone-700 transition hover:text-stone-950" href="#products">New Arrivals</a>
                <a className="text-stone-700 transition hover:text-stone-950" href="#products">Collections</a>
                <a className="text-stone-700 transition hover:text-stone-950" href="#products">Offers</a>
              </nav>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex h-14 min-w-[280px] items-center justify-between rounded-2xl border border-stone-200 bg-white/85 px-5 shadow-[0_10px_30px_rgba(70,39,10,0.05)] sm:min-w-[360px]">
                <span className="text-sm text-stone-400">Search for products...</span>
                <svg className="h-5 w-5 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </div>

              <div className="flex items-center gap-4">
                <button className="grid h-11 w-11 place-items-center rounded-full border border-stone-200 bg-white/80 text-stone-700 shadow-sm transition hover:text-stone-950">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="m12 20-1.4-1.26C5.4 14.09 2 10.97 2 7.12 2 4.5 4.06 2.5 6.64 2.5c1.46 0 2.87.68 3.76 1.75.89-1.07 2.3-1.75 3.76-1.75C16.94 2.5 19 4.5 19 7.12c0 3.85-3.4 6.97-8.6 11.62z" />
                  </svg>
                </button>
                <button className="relative grid h-11 w-11 place-items-center rounded-full border border-stone-200 bg-white/80 text-stone-700 shadow-sm transition hover:text-stone-950">
                  <span className="absolute right-2 top-1 grid h-4 w-4 place-items-center rounded-full bg-amber-700 text-[10px] text-white">2</span>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6 7h15l-1.5 9h-11z" />
                    <path d="M6 7 5 4H2" />
                    <circle cx="9" cy="20" r="1" />
                    <circle cx="18" cy="20" r="1" />
                  </svg>
                </button>

                {user ? (
                  <div className="flex items-center gap-3 rounded-full border border-stone-200 bg-white/85 px-4 py-2 shadow-sm">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-stone-100 text-stone-700">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c1.8-3.4 5-5 8-5s6.2 1.6 8 5" />
                      </svg>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs text-stone-500">Hi, User</p>
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
          </div>
        </header>

        <main id="home" className="pt-5">
          <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(110deg,_#ede1cf_0%,_#f6eee4_28%,_#e8d9c7_100%)] shadow-[0_24px_70px_rgba(88,54,18,0.12)]">
            <div className="grid min-h-[540px] items-stretch lg:grid-cols-[0.95fr_1.05fr]">
              <div className="flex flex-col justify-center px-8 py-10 sm:px-12 lg:px-16">
                <span className="inline-flex w-fit rounded-full bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-800">
                  New Collection
                </span>
                <h1 className="mt-5 max-w-xl font-serif text-[3.3rem] leading-[0.94] text-stone-950 sm:text-[4.6rem]">
                  {carouselImages[activeSlide].title.split(' ').slice(0, 2).join(' ')}{' '}
                  <span className="text-amber-700">
                    {carouselImages[activeSlide].title.split(' ').slice(2).join(' ')}
                  </span>
                </h1>
                <p className="mt-5 max-w-lg text-lg leading-8 text-stone-700">
                  {carouselImages[activeSlide].caption}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="#products"
                    className="inline-flex h-14 items-center justify-center rounded-2xl bg-stone-950 px-10 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(20,20,20,0.18)] transition hover:bg-stone-800"
                  >
                    Shop Now
                  </a>
                  <a
                    href="#categories"
                    className="inline-flex h-14 items-center justify-center rounded-2xl border border-stone-300 bg-white/30 px-10 text-sm font-semibold text-stone-900 transition hover:bg-white/55"
                  >
                    Explore Collections
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="h-11 w-11 rounded-full border-2 border-white bg-[linear-gradient(145deg,_#c6a27a,_#6d4b30)]"
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-stone-700">20K+ Happy Customers</p>
                </div>
              </div>

              <div className="relative min-h-[420px]">
                <img
                  src={carouselImages[activeSlide].image}
                  alt={carouselImages[activeSlide].title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(237,225,207,0.08)_0%,_rgba(237,225,207,0)_35%,_rgba(70,39,10,0.06)_100%)]" />

                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide((current) => (current - 1 + carouselImages.length) % carouselImages.length)
                  }
                  className="absolute left-5 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/72 text-stone-900 shadow-lg backdrop-blur transition hover:bg-white"
                  aria-label="Previous slide"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSlide((current) => (current + 1) % carouselImages.length)}
                  className="absolute right-5 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/72 text-stone-900 shadow-lg backdrop-blur transition hover:bg-white"
                  aria-label="Next slide"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>

                <div className="absolute bottom-6 left-1/2 w-[calc(100%-2.5rem)] -translate-x-1/2 rounded-[1.4rem] border border-white/55 bg-white/82 p-4 shadow-[0_18px_55px_rgba(70,39,10,0.12)] backdrop-blur lg:w-[76%]">
                  <div className="grid gap-4 text-sm text-stone-700 md:grid-cols-3">
                    <div className="rounded-xl border border-stone-100 bg-white/60 px-4 py-3">
                      <p className="font-semibold text-stone-900">Premium Quality</p>
                      <p className="mt-1">Top-notch materials</p>
                    </div>
                    <div className="rounded-xl border border-stone-100 bg-white/60 px-4 py-3">
                      <p className="font-semibold text-stone-900">Secure Payments</p>
                      <p className="mt-1">100% safe & secure</p>
                    </div>
                    <div className="rounded-xl border border-stone-100 bg-white/60 px-4 py-3">
                      <p className="font-semibold text-stone-900">Easy Returns</p>
                      <p className="mt-1">Hassle-free returns</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[1.8rem] border border-white/70 bg-white/65 px-5 py-5 shadow-[0_18px_50px_rgba(70,39,10,0.06)] backdrop-blur sm:px-8">
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
              {serviceHighlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-stone-100 bg-white/60 px-4 py-4">
                  <p className="font-semibold text-stone-900">{item.title}</p>
                  <p className="mt-1 text-sm text-stone-600">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="categories" className="pt-12">
            <div className="text-center">
              <h2 className="font-serif text-4xl text-stone-950 sm:text-5xl">Shop by Category</h2>
              <p className="mt-3 text-base text-stone-600">
                Find the perfect style for you and your loved ones.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {categoryCards.map((card) => (
                <article
                  key={card.title}
                  className="group relative overflow-hidden rounded-[1.6rem] shadow-[0_18px_40px_rgba(70,39,10,0.12)]"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-[300px] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/72 via-stone-900/18 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <h3 className="text-4xl font-semibold tracking-tight">{card.title}</h3>
                    <p className="mt-2 text-sm text-white/85">Explore Now</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-5 xl:grid-cols-2">
            <div className="relative overflow-hidden rounded-[1.8rem] bg-[linear-gradient(110deg,_#efe3d2_0%,_#f8f1e8_55%,_#eadac5_100%)] px-8 py-8 shadow-[0_20px_45px_rgba(70,39,10,0.08)]">
              <div className="max-w-sm">
                <p className="text-lg text-stone-700">Summer Sale</p>
                <h3 className="mt-3 font-serif text-5xl leading-tight text-stone-950">Up to 50% Off</h3>
                <p className="mt-3 text-base text-stone-700">On selected styles</p>
              </div>
              <div className="mt-8 h-56 overflow-hidden rounded-[1.4rem]">
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80"
                  alt="Summer sale"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.8rem] bg-[linear-gradient(110deg,_#f6eee4_0%,_#efe2d2_50%,_#e7d5c0_100%)] px-8 py-8 shadow-[0_20px_45px_rgba(70,39,10,0.08)]">
              <div className="max-w-sm">
                <p className="text-lg text-stone-700">New Arrivals</p>
                <h3 className="mt-3 font-serif text-5xl leading-tight text-stone-950">Fresh Styles</h3>
                <p className="mt-3 text-base text-stone-700">Just for you</p>
              </div>
              <div className="mt-8 h-56 overflow-hidden rounded-[1.4rem]">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
                  alt="New arrivals"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </section>

          <section id="products" className="pt-14">
            <div className="flex flex-col gap-4 border-b border-stone-200/80 pb-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">Scroll Products</p>
                <h2 className="mt-2 font-serif text-4xl text-stone-950 sm:text-5xl">All Products For Your Users</h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
                  This section appears after the hero and category experience, so shoppers discover the brand mood first and then browse the real product catalog as they scroll.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-full border border-stone-200 bg-white/80 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm">
                  {formatCategoryLabel(products.length)}
                </div>
                <div className="rounded-full border border-stone-200 bg-white/80 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm">
                  {totalImages} gallery photos
                </div>
                <div className="rounded-full border border-stone-200 bg-white/80 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm">
                  {formatCurrency(totalValue)} total value
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

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
            ) : products.length ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product, index) => (
                  <article
                    key={product._id}
                    className="group reveal-card overflow-hidden rounded-[1.8rem] border border-white/80 bg-white/75 shadow-[0_18px_42px_rgba(70,39,10,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(70,39,10,0.12)]"
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
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-serif text-3xl leading-tight text-stone-950">{product.title}</h3>
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                            New arrival pick
                          </p>
                        </div>
                        <p className="rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">
                          {formatCurrency(product.price?.amount, product.price?.currency)}
                        </p>
                      </div>

                      <p className="mt-4 line-clamp-3 text-sm leading-7 text-stone-700">{product.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-[1.8rem] border border-dashed border-stone-300 bg-white/70 px-6 py-14 text-center">
                <h3 className="font-serif text-3xl text-stone-950">No products yet</h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-700">
                  Once products are added, they will appear here right after the hero and category sections.
                </p>
              </div>
            )}

            {highlightProduct ? (
              <div className="mt-12 grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
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
                      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Images</p>
                      <p className="mt-2 text-2xl font-semibold text-stone-950">{highlightProduct.images?.length || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.8rem] shadow-[0_20px_45px_rgba(70,39,10,0.08)]">
                  <img
                    src={highlightProduct.images?.[0]?.url || carouselImages[0].image}
                    alt={highlightProduct.title}
                    className="h-[420px] w-full object-cover"
                  />
                </div>
              </div>
            ) : null}
          </section>
        </main>
      </div>
    </section>
  )
}

export default Home
