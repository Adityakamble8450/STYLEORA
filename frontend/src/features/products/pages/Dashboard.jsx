import { useEffect } from 'react'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import Useproduct from '../hook/Useproduct'

const formatCurrency = (amount, currency = 'INR') => {
  const numericAmount = Number(amount || 0)

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(numericAmount)
}

const formatDate = (value) => {
  if (!value) return 'Just now'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

const Dashboard = () => {
  const { handleGetProducts, loading, error, products } = Useproduct()
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    handleGetProducts().catch(() => {})
  }, [handleGetProducts])

  const totalValue = products.reduce((sum, product) => sum + Number(product.price?.amount || 0), 0)
  const totalImages = products.reduce((sum, product) => sum + (product.images?.length || 0), 0)
  const latestProduct = products[0]

  return (
    <section className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(221,170,109,0.24),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(194,132,55,0.2),_transparent_22%),linear-gradient(135deg,_#f8f4ee_0%,_#f3ede4_48%,_#ede4d7_100%)]">
      <div className="grid min-h-screen xl:grid-cols-[1.18fr_0.82fr]">
        <div className="bg-white/72 px-5 py-6 backdrop-blur-xl sm:px-8 sm:py-8 lg:px-12 lg:py-10 xl:px-16">
          <div className="flex flex-col gap-6 border-b border-stone-200/80 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700/80">
                Seller Dashboard
              </p>
              <h1 className="mt-3 font-serif text-3xl tracking-tight text-stone-950 sm:text-4xl">
                See everything you&apos;ve posted in one polished space
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-800 sm:text-base">
                Track your live catalog, review recent listings, and keep your storefront feeling curated.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <div className="rounded-[1.5rem] border border-amber-100 bg-amber-50/80 px-5 py-4 text-stone-900 shadow-inner shadow-amber-100/70">
                <p className="text-xs uppercase tracking-[0.28em] text-amber-700">Seller</p>
                <p className="mt-2 text-lg font-semibold">{user?.name || user?.fullname || 'Your store'}</p>
              </div>
              <Link
                to="/products/create"
                className="inline-flex h-13 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 px-6 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(180,119,36,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(180,119,36,0.38)]"
              >
                Add new product
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-[0_16px_40px_rgba(80,48,12,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-600">Live Listings</p>
              <p className="mt-4 font-serif text-4xl text-stone-950">{products.length}</p>
              <p className="mt-2 text-sm leading-6 text-stone-800">Products currently visible in your seller catalog.</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-[0_16px_40px_rgba(80,48,12,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-600">Catalog Value</p>
              <p className="mt-4 font-serif text-4xl text-stone-950">{formatCurrency(totalValue)}</p>
              <p className="mt-2 text-sm leading-6 text-stone-800">Combined value of all products you&apos;ve posted so far.</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-[0_16px_40px_rgba(80,48,12,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-600">Gallery Assets</p>
              <p className="mt-4 font-serif text-4xl text-stone-950">{totalImages}</p>
              <p className="mt-2 text-sm leading-6 text-stone-800">Total product images uploaded across your listings.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.9rem] border border-white/70 bg-white/88 p-5 shadow-[0_20px_50px_rgba(84,48,11,0.08)] sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-600">Your Products</p>
                  <h2 className="mt-2 font-serif text-2xl text-stone-950">Posted items</h2>
                </div>
                <span className="rounded-full bg-stone-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-700">
                  {loading ? 'Refreshing' : `${products.length} total`}
                </span>
              </div>

              {error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-[1.6rem] border border-stone-200/70 bg-white shadow-[0_16px_30px_rgba(52,27,8,0.06)]"
                    >
                      <div className="h-52 animate-pulse bg-stone-200" />
                      <div className="space-y-3 p-5">
                        <div className="h-4 w-2/3 animate-pulse rounded-full bg-stone-200" />
                        <div className="h-4 w-full animate-pulse rounded-full bg-stone-200" />
                        <div className="h-4 w-1/2 animate-pulse rounded-full bg-stone-200" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length ? (
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {products.map((product) => (
                    <article
                      key={product._id}
                      className="group overflow-hidden rounded-[1.6rem] border border-white/70 bg-[#fffaf5] shadow-[0_16px_32px_rgba(63,34,9,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(63,34,9,0.12)]"
                    >
                      <div className="relative overflow-hidden">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.title}
                            className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-56 items-center justify-center bg-[linear-gradient(145deg,_#f3cf99_0%,_#d48834_100%)] text-white">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em]">No image</p>
                          </div>
                        )}

                        <div className="absolute left-4 top-4 rounded-full bg-white/88 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 shadow-sm backdrop-blur">
                          {product.images?.length || 0} photo{product.images?.length === 1 ? '' : 's'}
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-serif text-2xl text-stone-950">{product.title}</h3>
                            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-600">
                              Posted {formatDate(product.createdAt)}
                            </p>
                          </div>
                          <p className="text-lg font-semibold text-amber-700">
                            {formatCurrency(product.price?.amount, product.price?.currency)}
                          </p>
                        </div>

                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-stone-800">
                          {product.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-6 flex min-h-80 flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-stone-300 bg-white/70 px-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-700 shadow-inner shadow-amber-100">
                    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                    </svg>
                  </div>
                  <h3 className="mt-5 font-serif text-3xl text-stone-950">Your shelf is still empty</h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-stone-800">
                    Start with your hero product and build a storefront that feels intentional from the very first listing.
                  </p>
                  <Link
                    to="/products/create"
                    className="mt-6 inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 shadow-sm transition duration-200 hover:border-stone-300 hover:bg-stone-50"
                  >
                    Create your first product
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="bg-gradient-to-br from-amber-50/40 to-orange-50/30 px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-[1.9rem] border border-white/15 bg-white/12 p-6 shadow-[0_24px_60px_rgba(50,28,7,0.18)] backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-200/30 to-amber-50/10" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">Spotlight</p>
                <h2 className="mt-3 font-serif text-3xl text-stone-950">
                  {latestProduct?.title || 'Your next bestseller can live here'}
                </h2>
                <p className="mt-3 text-sm leading-6 text-stone-800">
                  {latestProduct?.description || 'Once you publish a product, this space can highlight your freshest listing and keep your store feeling alive.'}
                </p>

                <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-white/40 bg-[#fff9f2]/95 p-4 shadow-[0_16px_30px_rgba(61,37,11,0.14)]">
                  {latestProduct?.images?.[0]?.url ? (
                    <img
                      src={latestProduct.images[0].url}
                      alt={latestProduct.title}
                      className="h-64 w-full rounded-[1.2rem] object-cover"
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center rounded-[1.2rem] bg-[linear-gradient(145deg,_#f3cf99_0%,_#d48834_100%)] px-6 text-center text-white">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">Showcase</p>
                        <p className="mt-3 text-lg font-semibold">Fresh product previews appear here</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-stone-600">Latest Price</p>
                      <p className="mt-2 text-3xl font-semibold text-stone-950">
                        {latestProduct ? formatCurrency(latestProduct.price?.amount, latestProduct.price?.currency) : formatCurrency(0)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/95 px-4 py-3 text-right shadow-[0_16px_30px_rgba(52,27,8,0.1)]">
                      <p className="text-xs uppercase tracking-[0.22em] text-stone-600">Published</p>
                      <p className="mt-1 text-sm font-semibold text-stone-900">
                        {latestProduct ? formatDate(latestProduct.createdAt) : 'Waiting'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-white/70 bg-white/90 p-6 shadow-[0_18px_40px_rgba(63,34,9,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-600">Seller Notes</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-stone-200/80 bg-white p-4">
                  <p className="text-sm font-semibold text-stone-900">Lead with your strongest cover image</p>
                  <p className="mt-1 text-sm leading-6 text-stone-800">
                    Your first image does the heavy lifting, so make it bright, clean, and instantly recognizable.
                  </p>
                </div>
                <div className="rounded-2xl border border-stone-200/80 bg-white p-4">
                  <p className="text-sm font-semibold text-stone-900">Keep descriptions tactile</p>
                  <p className="mt-1 text-sm leading-6 text-stone-800">
                    Buyers respond faster when they can picture the finish, texture, and use case in a sentence or two.
                  </p>
                </div>
                <div className="rounded-2xl border border-stone-200/80 bg-white p-4">
                  <p className="text-sm font-semibold text-stone-900">Refresh the catalog regularly</p>
                  <p className="mt-1 text-sm leading-6 text-stone-800">
                    New listings keep the storefront feeling active and give returning shoppers something new to discover.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Dashboard
