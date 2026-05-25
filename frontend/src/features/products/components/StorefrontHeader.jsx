import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import {
  Heart, Search, ShoppingBag, User, Menu, X, ChevronDown,
  LayoutDashboard, Package, LogOut, Settings, ShoppingCart
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthState } from '../../auth/state/auth.slice'
import { clearAuthSession } from '../../auth/services/auth.session'
import { clearCartState } from '../state/cart.slice'
import UseCart from '../hook/UseCart'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Men', to: '/' },
  { label: 'Women', to: '/' },
  { label: 'Kids', to: '/' },
  { label: 'New Arrivals', to: '/' },
  { label: 'Collections', to: '/' },
  { label: 'Offers', to: '/' },
]

const announcementItems = [
  '✦  Free Shipping on Orders Above ₹999',
  '✦  Easy Returns & Exchanges Within 7 Days',
  '✦  New Season Edit — Shop Now',
  '✦  Sell on Stylore Maki & Reach Thousands',
  '✦  100% Secure Payments  ✦  24/7 Support',
]

const StorefrontHeader = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { cart, initialized, handleGetCart } = UseCart()
  const [isCartMenuOpen, setCartMenuOpen] = useState(false)
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setUserMenuOpen] = useState(false)
  const [isScrolled, setScrolled] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const cartRef = useRef(null)
  const userRef = useRef(null)
  const searchTerm = searchParams.get('q') || ''

  /* ── Fetch cart ─────────────────────────────────────── */
  useEffect(() => {
    if (user && !initialized) handleGetCart().catch(() => {})
  }, [handleGetCart, initialized, user])

  /* ── Scroll detection ───────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Close menus on outside click ───────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) setCartMenuOpen(false)
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* ── Lock body scroll when mobile menu is open ──────── */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  /* ── Close mobile menu on route change ──────────────── */
  useEffect(() => {
    setMobileMenuOpen(false)
    setCartMenuOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    clearAuthSession()
    dispatch(clearAuthState())
    dispatch(clearCartState())
    setMobileMenuOpen(false)
    navigate('/login', { replace: true })
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    const nextParams = new URLSearchParams(searchParams)
    value.trim() ? nextParams.set('q', value.trim()) : nextParams.delete('q')
    if (location.pathname !== '/') {
      navigate(`/?${nextParams.toString()}`, { replace: true })
      return
    }
    setSearchParams(nextParams, { replace: true })
  }

  const isActive = (path) => location.pathname === path

  const sellerLinks = user?.role === 'seller'
    ? [
        { label: 'Seller Dashboard', to: '/seller/dashboard', Icon: LayoutDashboard },
        { label: 'Add Product', to: '/products/create', Icon: Package },
      ]
    : []

  const userMenuLinks = [
    { label: 'My Profile', to: '/profile', Icon: User },
    { label: 'My Orders', to: '/orders', Icon: Package },
    { label: 'Wishlist', to: '/wishlist', Icon: Heart },
    ...sellerLinks,
    { label: 'Settings', to: '/profile', Icon: Settings },
  ]

  return (
    <>
      {/* ── Announcement bar ── */}
      <div className="bg-[#1a1411] overflow-hidden py-2.5">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...announcementItems, ...announcementItems].map((item, i) => (
            <span key={i} className="text-xs text-white/65 font-medium px-8 tracking-wide">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main Header ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(70,39,10,0.1)] border-b border-stone-200/60'
            : 'bg-white/88 backdrop-blur-md border-b border-stone-200/50'
        }`}
      >
        <div className="container-luxury">
          <div className="flex items-center gap-4 py-4 xl:py-3">

            {/* ── Logo ── */}
            <Link to="/" className="flex-shrink-0 group">
              <div className="font-serif text-[1.9rem] leading-none tracking-[0.1em] text-stone-950 group-hover:text-amber-800 transition-colors duration-200">
                STYLORE
              </div>
              <div className="text-[0.6rem] uppercase tracking-[0.38em] text-stone-500">Maki</div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden items-center gap-1 pl-6 xl:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`relative px-3 py-2 text-[0.875rem] font-medium transition-colors duration-200 rounded-lg ${
                    isActive(link.to) && link.label === 'Home'
                      ? 'text-amber-700 bg-amber-50'
                      : 'text-stone-700 hover:text-amber-700 hover:bg-stone-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── Spacer ── */}
            <div className="flex-1" />

            {/* ── Search ── */}
            <div
              className={`hidden items-center gap-2.5 rounded-xl border px-4 py-2.5 transition-all duration-200 sm:flex ${
                searchFocused
                  ? 'border-amber-400 bg-white shadow-[0_0_0_3px_rgba(184,125,42,0.1)] min-w-[280px]'
                  : 'border-stone-200 bg-stone-50 hover:border-stone-300 min-w-[200px] xl:min-w-[260px]'
              }`}
            >
              <Search size={16} className="text-stone-400 shrink-0" />
              <input
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search products..."
                className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
                aria-label="Search products"
              />
            </div>

            {/* ── Desktop Actions ── */}
            <div className="hidden items-center gap-1 xl:flex">

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 hover:text-amber-700 transition-all duration-200"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>

              {/* Cart */}
              <div className="relative" ref={cartRef}>
                <button
                  type="button"
                  onClick={() => setCartMenuOpen((o) => !o)}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 hover:text-amber-700 transition-all duration-200"
                  aria-label="Open cart"
                  aria-expanded={isCartMenuOpen}
                >
                  <ShoppingBag size={20} />
                  {user && cart.totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-bold text-white shadow-[0_2px_8px_rgba(184,125,42,0.4)] ring-2 ring-white">
                      {cart.totalItems}
                    </span>
                  )}
                </button>

                {/* Cart Popover */}
                {isCartMenuOpen && (
                  <div className="cart-popover absolute right-0 top-full z-50 mt-3 w-[340px] rounded-2xl border border-stone-200/80 bg-white/97 p-5 shadow-[0_32px_80px_rgba(15,10,5,0.14)]">
                    <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                      <div>
                        <p className="label-overline text-stone-500">Your Cart</p>
                        <p className="mt-1 text-base font-semibold text-stone-900 font-serif">
                          {cart.totalItems || 0} item{cart.totalItems !== 1 ? 's' : ''}
                        </p>
                      </div>
                      {cart.totalAmount > 0 && (
                        <span className="text-lg font-semibold text-amber-700 font-serif">
                          ₹{Number(cart.totalAmount).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="max-h-[280px] overflow-auto py-3 space-y-3 custom-scroll">
                      {cart.items?.length ? (
                        cart.items.slice(0, 4).map((item) => {
                          const product = item.product || {}
                          const price = item.price?.amount || product.price?.amount || 0
                          return (
                            <div key={item._id} className="flex items-center gap-3 rounded-xl bg-stone-50 p-3">
                              <img
                                src={product.images?.[0]?.url || 'https://placehold.co/80x90/e7dfd2/6b5b4d?text=Img'}
                                alt={product.title}
                                className="h-16 w-14 rounded-lg object-cover shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-stone-900 line-clamp-1">{product.title || 'Product'}</p>
                                <p className="mt-0.5 text-xs text-stone-500">Qty {item.quantity}</p>
                                <p className="mt-1 text-sm font-semibold text-stone-900">
                                  ₹{Number(price * item.quantity).toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="py-6 text-center">
                          <ShoppingCart size={32} className="mx-auto text-stone-300 mb-2" />
                          <p className="text-sm text-stone-500">Your cart is empty</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 space-y-2 border-t border-stone-100">
                      <Link
                        to="/cart"
                        onClick={() => setCartMenuOpen(false)}
                        className="btn-gold w-full rounded-xl py-3 text-sm"
                      >
                        <ShoppingBag size={16} /> View Cart & Checkout
                      </Link>
                      <Link
                        to="/"
                        onClick={() => setCartMenuOpen(false)}
                        className="btn-outline w-full rounded-xl py-3 text-sm"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User */}
              <div className="relative ml-1" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-medium text-stone-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-all duration-200"
                  aria-expanded={isUserMenuOpen}
                  aria-label="User menu"
                >
                  <User size={16} />
                  <span className="max-w-[80px] truncate">
                    {user ? user.fullname?.split(' ')[0] || 'Account' : 'Login'}
                  </span>
                  <ChevronDown size={13} className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="animate-slide-down absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-stone-200/80 bg-white p-2 shadow-[0_24px_60px_rgba(15,10,5,0.12)]">
                    {user ? (
                      <>
                        <div className="px-3 py-2 mb-1">
                          <p className="text-xs text-stone-500">Signed in as</p>
                          <p className="text-sm font-semibold text-stone-900 truncate">{user.fullname}</p>
                          <span className="badge-gold mt-1">{user.role}</span>
                        </div>
                        <div className="border-t border-stone-100 pt-1">
                          {userMenuLinks.map(({ label, to, Icon }) => (
                            <Link
                              key={label}
                              to={to}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-700 transition-colors"
                            >
                              <Icon size={15} />
                              {label}
                            </Link>
                          ))}
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-stone-100"
                          >
                            <LogOut size={15} />
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-2 space-y-1.5">
                        <Link
                          to="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="btn-gold w-full rounded-xl py-2.5 text-sm"
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setUserMenuOpen(false)}
                          className="btn-outline w-full rounded-xl py-2.5 text-sm"
                        >
                          Create Account
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Mobile Actions ── */}
            <div className="flex items-center gap-1 xl:hidden">
              <Link
                to="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 transition"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {user && cart.totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {cart.totalItems}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 transition"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="mobile-menu-backdrop fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="mobile-menu-panel fixed inset-y-0 left-0 z-[70] flex w-[min(340px,90vw)] flex-col bg-white shadow-[4px_0_40px_rgba(0,0,0,0.18)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-stone-100">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <div className="font-serif text-2xl tracking-[0.1em] text-stone-950">STYLORE</div>
                <div className="text-[0.6rem] uppercase tracking-[0.38em] text-stone-400">Maki</div>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 transition"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 py-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
                <Search size={16} className="text-stone-400 shrink-0" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search products..."
                  className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-auto px-5 py-4">
              <p className="label-overline text-stone-400 mb-3">Shop</p>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 mb-1 text-sm font-medium transition-all ${
                    isActive(link.to) && link.label === 'Home'
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-amber-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {user && (
                <div className="mt-5">
                  <p className="label-overline text-stone-400 mb-3">Account</p>
                  {userMenuLinks.map(({ label, to, Icon }) => (
                    <Link
                      key={label}
                      to={to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3.5 mb-1 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-amber-700 transition-all"
                    >
                      <Icon size={16} />
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </nav>

            {/* Footer Actions */}
            <div className="px-5 py-5 border-t border-stone-100 space-y-3">
              {user ? (
                <div>
                  <div className="flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-600 text-white font-semibold text-sm shrink-0">
                      {user.fullname?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone-900 truncate">{user.fullname}</p>
                      <span className="badge-gold">{user.role}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-gold w-full rounded-xl py-3 text-sm"
                  >
                    Login to Your Account
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-outline w-full rounded-xl py-3 text-sm"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default StorefrontHeader
