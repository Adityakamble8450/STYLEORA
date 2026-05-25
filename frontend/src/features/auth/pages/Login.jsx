import React, { useState } from 'react'
import useAuth from '../hook/Useauth'
import { Navigate, Link, useNavigate } from 'react-router'
import { getGoogleAuthUrl } from '../services/user.api'
import { useSelector } from 'react-redux'
import { getDefaultRouteForUser } from '../services/auth.redirect'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

/* ─── Shared Input ─── */
const TextInput = ({ icon: Icon, rightContent, error, className = '', ...props }) => (
  <div className="relative">
    {Icon && (
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
        <Icon size={17} />
      </span>
    )}
    <input
      {...props}
      className={`input-luxury h-13 ${Icon ? 'pl-11' : 'pl-4'} ${rightContent ? 'pr-12' : 'pr-4'} ${
        error
          ? '!border-red-300 focus:!border-red-400 focus:!shadow-[0_0_0_4px_rgba(239,68,68,0.08)]'
          : ''
      } ${className}`}
    />
    {rightContent && (
      <span className="absolute right-4 top-1/2 -translate-y-1/2">{rightContent}</span>
    )}
    {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
  </div>
)

/* ─── Google Button ─── */
const GoogleButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-13 w-full items-center justify-center gap-3 rounded-2xl border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 hover:shadow-md"
  >
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.23c0-.68-.06-1.33-.17-1.96H12v3.7h5.39a4.6 4.6 0 0 1-1.99 3.02v2.5h3.22c1.88-1.73 2.98-4.28 2.98-7.26Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.61-2.44l-3.22-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.08v2.58A9.98 9.98 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.41 13.9A5.98 5.98 0 0 1 6.1 12c0-.66.11-1.31.31-1.9V7.52H3.08A9.98 9.98 0 0 0 2 12c0 1.61.39 3.13 1.08 4.48l3.33-2.58Z" />
      <path fill="#EA4335" d="M12 5.98c1.47 0 2.8.5 3.84 1.5l2.88-2.88C16.96 2.96 14.7 2 12 2A9.98 9.98 0 0 0 3.08 7.52L6.41 10.1C7.2 7.74 9.4 5.98 12 5.98Z" />
    </svg>
    Continue with Google
  </button>
)

/* ─── Fashion Illustration ─── */
const FashionPanel = () => (
  <div className="relative hidden h-full flex-col bg-[linear-gradient(160deg,_#2d1a0a_0%,_#6b3a15_50%,_#c08830_100%)] lg:flex overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.12),_transparent_40%),radial-gradient(circle_at_80%_80%,_rgba(255,220,150,0.12),_transparent_40%)]" />

    {/* Content */}
    <div className="relative flex flex-col h-full justify-between p-10 xl:p-14">
      <div>
        <div className="font-serif text-3xl tracking-[0.1em] text-white/90">STYLORE</div>
        <div className="text-xs uppercase tracking-[0.38em] text-white/45 mt-0.5">Maki</div>
      </div>

      <div>
        <p className="label-overline text-amber-300/80 mb-5">Welcome Back</p>
        <h2 className="font-serif text-4xl xl:text-5xl leading-[1.1] text-white max-w-xs">
          Dress with intention. Shop with confidence.
        </h2>
        <p className="mt-5 text-sm leading-7 text-white/60 max-w-sm">
          Discover curated fashion, premium quality, and a marketplace designed for those who demand more from their wardrobe.
        </p>

        {/* Feature pills */}
        <div className="mt-8 flex flex-wrap gap-2.5">
          {['Premium Brands', 'Secure Payments', 'Easy Returns', 'Exclusive Drops'].map((t) => (
            <span key={t} className="rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-xs font-medium text-white/70">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Decorative image */}
      <div className="absolute -right-8 top-1/2 -translate-y-1/2 h-[500px] w-[280px] opacity-20">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#2d1a0a]/80 z-10" />
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80"
          alt="Fashion"
          className="h-full w-full object-cover rounded-2xl"
        />
      </div>

      {/* Bottom testimonial */}
      <div className="relative z-10 rounded-2xl border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
        <p className="text-sm italic text-white/65 leading-6">
          "Stylore Maki gave my wardrobe a complete identity. The quality is unmatched."
        </p>
        <p className="mt-3 text-xs font-semibold text-amber-300/80">— Priya K., Mumbai</p>
      </div>
    </div>
  </div>
)

const initialFormData = { email: '', password: '' }

const Login = () => {
  const [formData, setFormData] = useState(initialFormData)
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const navigate = useNavigate()
  const { handleLogin, loading, error } = useAuth()
  const user = useSelector((state) => state.auth.user)

  if (user) return <Navigate to={getDefaultRouteForUser(user)} replace />

  const handleGoogleLogin = () => window.location.assign(getGoogleAuthUrl())

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((c) => ({ ...c, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    if (!formData.email || !formData.password) {
      setSubmitError('Please fill in all fields.')
      return
    }
    try {
      const data = await handleLogin({ email: formData.email, password: formData.password })
      setFormData(initialFormData)
      navigate(getDefaultRouteForUser(data.user), { replace: true })
    } catch (err) {
      setSubmitError(err.message || 'Login failed. Please try again.')
    }
  }

  return (
    <section className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,_#faf7f2_0%,_#f5ede0_50%,_#ede4d5_100%)]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Form side */}
        <div className="flex flex-col bg-white/80 backdrop-blur-xl">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-5 sm:px-10">
            <Link to="/" className="group">
              <div className="font-serif text-2xl tracking-[0.1em] text-stone-950 group-hover:text-amber-800 transition-colors">
                STYLORE
              </div>
              <div className="text-[0.6rem] uppercase tracking-[0.38em] text-stone-400">Maki</div>
            </Link>
            <p className="text-sm text-stone-600">
              No account?{' '}
              <Link to="/register" className="font-semibold text-amber-700 hover:text-amber-800 transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          {/* Form area */}
          <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 xl:px-16">
            <div className="mx-auto w-full max-w-md">
              <p className="label-overline mb-3">Welcome back</p>
              <h1 className="font-serif text-4xl text-stone-950 sm:text-5xl">Login</h1>
              <p className="mt-3 text-sm text-stone-500 leading-6 max-w-sm">
                Access your curated collections, orders, and a premium shopping experience.
              </p>

              {/* Google */}
              <div className="mt-8">
                <GoogleButton onClick={handleGoogleLogin} />
                <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-stone-400">
                  <span className="h-px flex-1 bg-stone-200" />
                  or continue with email
                  <span className="h-px flex-1 bg-stone-200" />
                </div>
              </div>

              {/* Form */}
              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <TextInput
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  icon={Mail}
                  autoComplete="email"
                  aria-label="Email address"
                />
                <TextInput
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  icon={Lock}
                  autoComplete="current-password"
                  aria-label="Password"
                  rightContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-stone-400 hover:text-amber-700 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  }
                />

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-stone-300 accent-amber-700"
                      aria-label="Remember me"
                    />
                    <span className="text-sm text-stone-600">Remember me</span>
                  </label>
                  <a href="/forgot-password" className="text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors">
                    Forgot password?
                  </a>
                </div>

                {(submitError || error) && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                    <span className="shrink-0">⚠</span>
                    {submitError || error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold h-13 w-full rounded-2xl text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                  ) : <ArrowRight size={16} />}
                  {loading ? 'Signing in...' : 'Login to Stylore'}
                </button>

                <p className="text-center text-xs text-stone-400 pt-2 leading-5">
                  By logging in you agree to our{' '}
                  <a href="/terms" className="text-amber-700 hover:underline">Terms</a>{' '}
                  &amp;{' '}
                  <a href="/privacy" className="text-amber-700 hover:underline">Privacy Policy</a>
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Fashion panel */}
        <FashionPanel />
      </div>
    </section>
  )
}

export default Login
