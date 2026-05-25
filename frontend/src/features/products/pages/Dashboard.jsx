import { useEffect } from 'react'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import Useproduct from '../hook/Useproduct'
import StorefrontHeader from '../components/StorefrontHeader'
import Footer from '../../../componants/Footer'
import { Package, DollarSign, ImageIcon, Plus, Star, Calendar, TrendingUp } from 'lucide-react'

const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0))

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

  const totalValue = products.reduce((sum, p) => sum + Number(p.price?.amount || 0), 0)
  const totalImages = products.reduce((sum, p) => sum + (p.images?.length || 0), 0)
  const latestProduct = products[0]

  return (
    <div className="page-bg min-h-screen flex flex-col">
      <StorefrontHeader />

      {/* ── Sticky Admin Header Bar ───────────────────────────────── */}
      <div className="sticky top-0 z-40 border-b border-[#e8ddd0] bg-[#faf7f2]/95 backdrop-blur-md shadow-[0_2px_16px_rgba(107,66,38,0.07)]">
        <div className="container-luxury flex h-16 items-center justify-between gap-4">
          {/* Branding */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#b87d2a] to-[#6b4226] shadow-md">
              <Star className="h-4 w-4 text-white fill-white" />
            </span>
            <span
              className="font-serif text-lg tracking-widest text-[#1a1411] group-hover:text-[#b87d2a] transition-colors"
              style={{ letterSpacing: '0.18em' }}
            >
              STYLORE MAKI
            </span>
          </Link>

          {/* Seller Badge + CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#e8ddd0] bg-[#f0e9df]/70 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#b87d2a] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b4226]">
                {user?.name || user?.fullname || 'Seller'}
              </span>
            </div>
            <Link
              to="/products/create"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#b87d2a] via-[#d4983a] to-[#b87d2a] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_6px_20px_rgba(184,125,42,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(184,125,42,0.42)]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Product</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Page Hero ─────────────────────────────────────────────── */}
      <div className="border-b border-[#e8ddd0] bg-gradient-to-r from-[#faf7f2] via-[#f5ede0] to-[#faf7f2] py-10 px-4">
        <div className="container-luxury">
          <p className="label-overline text-[#b87d2a]">Seller Dashboard</p>
          <h1 className="section-heading mt-3 max-w-2xl text-[#1a1411]">
            See everything you&apos;ve posted,<br className="hidden sm:block" /> in one polished space
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#6b4226]/80">
            Track your live catalog, review recent listings, and keep your storefront feeling curated.
          </p>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────────── */}
      <main className="flex-1 py-10 px-4">
        <div className="container-luxury space-y-8">

          {/* ── Stats Row ─────────────────────────────────────────── */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Live Listings */}
            <div className="relative overflow-hidden rounded-2xl border border-[#e8ddd0] bg-white p-6 shadow-[0_4px_24px_rgba(107,66,38,0.07)] border-l-4 border-l-[#b87d2a]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="label-overline text-[#6b4226]/70">Live Listings</p>
                  <p className="mt-3 font-serif text-5xl font-light text-[#1a1411]">{products.length}</p>
                  <p className="mt-2 text-xs text-[#6b4226]/60 leading-5">Products visible in your seller catalog</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0e9df]">
                  <Package className="h-5 w-5 text-[#b87d2a]" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">Active</span>
              </div>
            </div>

            {/* Catalog Value */}
            <div className="relative overflow-hidden rounded-2xl border border-[#e8ddd0] bg-white p-6 shadow-[0_4px_24px_rgba(107,66,38,0.07)] border-l-4 border-l-[#d4983a]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="label-overline text-[#6b4226]/70">Catalog Value</p>
                  <p className="mt-3 font-serif text-4xl font-light text-[#1a1411] leading-tight">
                    {formatCurrency(totalValue)}
                  </p>
                  <p className="mt-2 text-xs text-[#6b4226]/60 leading-5">Combined value of all listings</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0e9df]">
                  <DollarSign className="h-5 w-5 text-[#b87d2a]" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[#b87d2a]">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">Total inventory</span>
              </div>
            </div>

            {/* Gallery Assets */}
            <div className="relative overflow-hidden rounded-2xl border border-[#e8ddd0] bg-white p-6 shadow-[0_4px_24px_rgba(107,66,38,0.07)] border-l-4 border-l-[#6b4226]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="label-overline text-[#6b4226]/70">Gallery Assets</p>
                  <p className="mt-3 font-serif text-5xl font-light text-[#1a1411]">{totalImages}</p>
                  <p className="mt-2 text-xs text-[#6b4226]/60 leading-5">Total images uploaded across listings</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0e9df]">
                  <ImageIcon className="h-5 w-5 text-[#b87d2a]" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[#b87d2a]">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">Visual gallery</span>
              </div>
            </div>
          </div>

          {/* ── Two-Column Layout ─────────────────────────────────── */}
          <div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">

            {/* ── MAIN: Products Grid ─────────────────────────────── */}
            <div>
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="label-overline text-[#b87d2a]">Your Products</p>
                  <h2 className="mt-1 font-serif text-2xl text-[#1a1411]">Posted Items</h2>
                </div>
                <span className="rounded-full border border-[#e8ddd0] bg-[#f0e9df]/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#6b4226]">
                  {loading ? 'Loading…' : `${products.length} total`}
                </span>
              </div>

              {/* Error */}
              {error && !loading && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50/80 px-5 py-4 text-sm text-red-700 leading-6">
                  <strong className="font-semibold">Something went wrong:</strong> {error}
                </div>
              )}

              {/* Loading Skeletons */}
              {loading ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-2xl border border-[#e8ddd0] bg-white shadow-[0_4px_20px_rgba(107,66,38,0.06)]"
                    >
                      <div className="skeleton h-52 w-full" />
                      <div className="space-y-3 p-5">
                        <div className="skeleton h-4 w-2/3 rounded-full" />
                        <div className="skeleton h-4 w-full rounded-full" />
                        <div className="skeleton h-4 w-1/2 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length ? (
                /* Product Cards Grid */
                <div className="grid gap-5 sm:grid-cols-2">
                  {products.map((product) => (
                    <Link
                      key={product._id}
                      to={`/seller/productdetails/${product._id}`}
                      className="group overflow-hidden rounded-2xl border border-[#e8ddd0] bg-white shadow-[0_4px_20px_rgba(107,66,38,0.06)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(107,66,38,0.13)]"
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.title}
                            className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="flex h-52 items-center justify-center bg-gradient-to-br from-[#f3cf99] to-[#d48834]">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/90">No Image</p>
                          </div>
                        )}
                        {/* Photo count badge */}
                        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#b87d2a] shadow-sm backdrop-blur-sm">
                          <ImageIcon className="h-3 w-3" />
                          {product.images?.length || 0} photo{product.images?.length === 1 ? '' : 's'}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-serif text-xl text-[#1a1411] leading-snug truncate">
                              {product.title}
                            </h3>
                            <div className="mt-1.5 flex items-center gap-1.5 text-[#6b4226]/60">
                              <Calendar className="h-3 w-3 flex-shrink-0" />
                              <p className="text-xs font-medium">{formatDate(product.createdAt)}</p>
                            </div>
                          </div>
                          <p className="flex-shrink-0 text-base font-bold text-[#b87d2a]">
                            {formatCurrency(product.price?.amount, product.price?.currency)}
                          </p>
                        </div>
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#6b4226]/70">
                          {product.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e8ddd0] bg-white/60 px-6 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f0e9df] shadow-inner">
                    <Package className="h-7 w-7 text-[#b87d2a]" />
                  </div>
                  <h3 className="mt-5 font-serif text-3xl text-[#1a1411]">Your shelf is still empty</h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-[#6b4226]/70">
                    Start with your hero product and build a storefront that feels intentional from the very first listing.
                  </p>
                  <Link
                    to="/products/create"
                    className="btn-gold mt-7 inline-flex items-center gap-2 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Create your first product
                  </Link>
                </div>
              )}
            </div>

            {/* ── SIDEBAR ─────────────────────────────────────────── */}
            <div className="space-y-6">

              {/* Spotlight Card */}
              <div className="relative overflow-hidden rounded-2xl border border-[#b87d2a]/20 shadow-[0_8px_40px_rgba(107,66,38,0.15)]">
                {/* Glassmorphism amber gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#b87d2a] via-[#d4983a] to-[#6b4226] opacity-90" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_60%)]" />

                <div className="relative p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-3.5 w-3.5 text-white/80 fill-white/80" />
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/80">Spotlight</p>
                  </div>

                  <h2 className="font-serif text-2xl text-white leading-snug">
                    {latestProduct?.title || 'Your next bestseller'}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/70 line-clamp-2">
                    {latestProduct?.description || 'Once you publish a product, this space highlights your freshest listing.'}
                  </p>

                  {/* Product Image */}
                  <div className="mt-5 overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
                    {latestProduct?.images?.[0]?.url ? (
                      <img
                        src={latestProduct.images[0].url}
                        alt={latestProduct.title}
                        className="h-56 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-56 items-center justify-center bg-white/10 px-6 text-center">
                        <div>
                          <ImageIcon className="mx-auto h-8 w-8 text-white/40" />
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                            Awaiting your first product
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price + Date Row */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/15 backdrop-blur-sm px-4 py-3 border border-white/20">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/60">Latest Price</p>
                      <p className="mt-1.5 font-serif text-xl text-white">
                        {latestProduct
                          ? formatCurrency(latestProduct.price?.amount, latestProduct.price?.currency)
                          : '—'}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/15 backdrop-blur-sm px-4 py-3 border border-white/20">
                      <div className="flex items-center gap-1 text-white/60">
                        <Calendar className="h-3 w-3" />
                        <p className="text-xs uppercase tracking-[0.2em]">Published</p>
                      </div>
                      <p className="mt-1.5 text-sm font-semibold text-white">
                        {latestProduct ? formatDate(latestProduct.createdAt) : 'Waiting…'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller Tips */}
              <div className="rounded-2xl border border-[#e8ddd0] bg-white p-6 shadow-[0_4px_20px_rgba(107,66,38,0.06)]">
                <p className="label-overline text-[#6b4226]/60">Seller Tips</p>
                <div className="mt-4 space-y-3">
                  {[
                    {
                      title: 'Lead with your strongest cover image',
                      body: 'Your first image does the heavy lifting — make it bright, clean, and instantly recognizable.',
                    },
                    {
                      title: 'Keep descriptions tactile',
                      body: 'Buyers respond faster when they can picture the finish, texture, and use case in a sentence or two.',
                    },
                    {
                      title: 'Refresh the catalog regularly',
                      body: 'New listings keep your storefront feeling active and give returning shoppers something to discover.',
                    },
                  ].map((tip, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-[#e8ddd0] bg-[#faf7f2] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#b87d2a] text-white">
                          <span className="text-[10px] font-bold">{i + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1a1411]">{tip.title}</p>
                          <p className="mt-1 text-xs leading-5 text-[#6b4226]/70">{tip.body}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard
