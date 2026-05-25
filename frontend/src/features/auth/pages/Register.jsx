import React, { useState } from 'react'
import useAuth from '../hook/Useauth'
import { Navigate, Link, useNavigate } from 'react-router'
import { getGoogleAuthUrl } from '../services/user.api'
import { useSelector } from 'react-redux'
import { getDefaultRouteForUser } from '../services/auth.redirect'
import {
  Mail, Lock, Eye, EyeOff, User, Phone,
  ShoppingBag, Store, CheckCircle, ArrowRight
} from 'lucide-react'

/* ─── Shared Input ─── */
const TextInput = ({ icon: Icon, rightContent, error, label, className = '', ...props }) => (
  <div>
    {label && <label className="mb-1.5 block text-sm font-semibold text-stone-700">{label}</label>}
    <div className="relative">
      {Icon && (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
          <Icon size={17} />
        </span>
      )}
      <input
        {...props}
        className={`input-luxury h-13 ${Icon ? 'pl-11' : 'pl-4'} ${rightContent ? 'pr-12' : 'pr-4'} ${
          error ? '!border-red-300 focus:!border-red-400 focus:!shadow-[0_0_0_4px_rgba(239,68,68,0.08)]' : ''
        } ${className}`}
      />
      {rightContent && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2">{rightContent}</span>
      )}
    </div>
    {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
  </div>
)

/* ─── Password Strength ─── */
const PasswordStrength = ({ password }) => {
  const getStrength = () => {
    let s = 0
    if (!password) return { level: 0, label: '', colors: [] }
    if (password.length >= 8) s++
    if (password.length >= 12) s++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) s++
    if (/[0-9]/.test(password)) s++
    if (/[^a-zA-Z0-9]/.test(password)) s++
    const levels = [
      null,
      { label: 'Weak', color: 'bg-red-500', text: 'text-red-500' },
      { label: 'Fair', color: 'bg-orange-500', text: 'text-orange-500' },
      { label: 'Good', color: 'bg-yellow-500', text: 'text-yellow-600' },
      { label: 'Strong', color: 'bg-lime-500', text: 'text-lime-600' },
      { label: 'Very Strong', color: 'bg-emerald-500', text: 'text-emerald-600' },
    ]
    return { level: Math.min(s, 5), ...levels[Math.min(s, 5)] }
  }
  const { level, label, color, text } = getStrength()
  if (!password) return null
  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex flex-1 gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= level ? color : 'bg-stone-200'}`} />
        ))}
      </div>
      <span className={`text-xs font-semibold ${text}`}>{label}</span>
    </div>
  )
}

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

/* ─── Role Card ─── */
const RoleCard = ({ active, title, description, Icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
      active
        ? 'border-amber-600 bg-amber-50/60 shadow-[0_0_0_3px_rgba(184,125,42,0.1)]'
        : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/20'
    }`}
  >
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
        active ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-500'
      }`}
    >
      <Icon size={22} />
    </div>
    <div>
      <p className="text-sm font-semibold text-stone-900">{title}</p>
      <p className="mt-0.5 text-xs text-stone-500">{description}</p>
    </div>
    {active && (
      <div className="absolute right-4 top-4 text-amber-600">
        <CheckCircle size={18} fill="currentColor" />
      </div>
    )}
  </button>
)

/* ─── Fashion Panel (same as Login) ─── */
const FashionPanel = ({ role, fullname }) => {
  const isSeller = role === 'seller'
  return (
    <div className="relative hidden h-full flex-col bg-[linear-gradient(160deg,_#2d1a0a_0%,_#6b3a15_50%,_#c08830_100%)] lg:flex overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.12),_transparent_40%),radial-gradient(circle_at_80%_80%,_rgba(255,220,150,0.12),_transparent_40%)]" />

      <div className="relative flex flex-col h-full justify-between p-10 xl:p-14">
        <div>
          <div className="font-serif text-3xl tracking-[0.1em] text-white/90">STYLORE</div>
          <div className="text-xs uppercase tracking-[0.38em] text-white/45 mt-0.5">Maki</div>
        </div>

        <div>
          <p className="label-overline text-amber-300/80 mb-5">
            {isSeller ? 'Seller Onboarding' : 'Join the Community'}
          </p>
          <h2 className="font-serif text-4xl xl:text-5xl leading-[1.1] text-white max-w-xs">
            {isSeller
              ? 'Launch your boutique on the premium marketplace.'
              : 'Fashion begins the moment you create your space.'}
          </h2>
          <p className="mt-5 text-sm leading-7 text-white/60 max-w-sm">
            {isSeller
              ? 'Reach thousands of fashion-forward buyers with your curated catalog. Simple onboarding, powerful tools.'
              : 'Discover curated trends, premium silhouettes, and fashion pieces designed to feel considered from the first click.'}
          </p>

          {fullname && (
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/12 bg-white/8 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500 font-semibold text-white text-lg">
                {fullname.trim()[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{fullname.trim()}</p>
                <span className="text-xs text-amber-300/80 capitalize">{role}</span>
              </div>
            </div>
          )}
        </div>

        {/* Decorative */}
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 h-[500px] w-[280px] opacity-15">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80"
            alt="Fashion"
            className="h-full w-full object-cover rounded-2xl"
          />
        </div>

        <div className="relative z-10 rounded-2xl border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
          <p className="text-sm italic text-white/65 leading-6">
            "Becoming a seller on Stylore Maki was the best decision for my label."
          </p>
          <p className="mt-3 text-xs font-semibold text-amber-300/80">— Rahul S., Fashion Designer</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Validators ─── */
const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const validatePhone = (v) => /^[\d\s+\-()]+$/.test(v) && v.replace(/\D/g, '').length >= 10
const validatePassword = (v) => v.length >= 8

const initialForm = {
  fullname: '', email: '', contact: '', password: '', confirmPassword: '',
  role: 'buyer', agreeToTerms: false,
}

const initialErrors = {
  fullname: '', email: '', contact: '', password: '', confirmPassword: '',
}

const Register = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const [formData, setFormData] = useState(initialForm)
  const [fieldErrors, setFieldErrors] = useState(initialErrors)
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { handleRegister, loading } = useAuth()

  if (user) return <Navigate to={getDefaultRouteForUser(user)} replace />

  const handleGoogleRegister = () => window.location.assign(getGoogleAuthUrl())

  const validateField = (name, value) => {
    switch (name) {
      case 'fullname':
        if (!value.trim()) return 'Full name is required'
        if (value.trim().split(' ').length < 2) return 'Please enter your full name'
        return ''
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!validateEmail(value)) return 'Please enter a valid email'
        return ''
      case 'contact':
        if (!value.trim()) return 'Contact number is required'
        if (!validatePhone(value)) return 'Please enter a valid 10-digit phone number'
        return ''
      case 'password':
        if (!value) return 'Password is required'
        if (!validatePassword(value)) return 'Password must be at least 8 characters'
        return ''
      case 'confirmPassword':
        if (!value) return 'Please confirm your password'
        if (value !== formData.password) return 'Passwords do not match'
        return ''
      default: return ''
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setFormData((c) => ({ ...c, [name]: val }))
    if (touched[name]) {
      setFieldErrors((c) => ({ ...c, [name]: validateField(name, val) }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((c) => ({ ...c, [name]: true }))
    setFieldErrors((c) => ({ ...c, [name]: validateField(name, value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setSuccessMessage('')

    const newErrors = {}
    Object.keys(initialErrors).forEach((f) => {
      const err = validateField(f, formData[f])
      if (err) newErrors[f] = err
    })

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors)
      setTouched({ fullname: true, email: true, contact: true, password: true, confirmPassword: true })
      setSubmitError('Please fix the errors above before submitting.')
      return
    }

    if (!formData.agreeToTerms) {
      setSubmitError('Please accept the Terms & Conditions.')
      return
    }

    try {
      const data = await handleRegister({
        email: formData.email,
        contact: formData.contact,
        fullname: formData.fullname,
        password: formData.password,
        role: formData.role,
      })
      setSuccessMessage('Account created! Redirecting...')
      setFormData(initialForm)
      setFieldErrors(initialErrors)
      setTouched({})
      const nextRoute = data.user?.role === 'seller' ? '/seller/dashboard' : getDefaultRouteForUser(data.user)
      setTimeout(() => navigate(nextRoute, { replace: true }), 1200)
    } catch (err) {
      setSubmitError(err.message || 'Failed to create account. Please try again.')
    }
  }

  return (
    <section className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,_#faf7f2_0%,_#f5ede0_50%,_#ede4d5_100%)]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Form side */}
        <div className="flex flex-col bg-white/80 backdrop-blur-xl overflow-y-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-5 sm:px-10">
            <Link to="/" className="group">
              <div className="font-serif text-2xl tracking-[0.1em] text-stone-950 group-hover:text-amber-800 transition-colors">
                STYLORE
              </div>
              <div className="text-[0.6rem] uppercase tracking-[0.38em] text-stone-400">Maki</div>
            </Link>
            <p className="text-sm text-stone-600">
              Already a member?{' '}
              <Link to="/login" className="font-semibold text-amber-700 hover:text-amber-800 transition-colors">
                Login
              </Link>
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-1 flex-col px-6 py-8 sm:px-10 xl:px-16">
            <div className="mx-auto w-full max-w-md">
              <p className="label-overline mb-3">Create Account</p>
              <h1 className="font-serif text-4xl text-stone-950 sm:text-5xl">Join Stylore</h1>
              <p className="mt-3 text-sm text-stone-500 leading-6 max-w-sm">
                Start your fashion journey with a premium marketplace tailored for buyers and sellers.
              </p>

              {/* Google */}
              <div className="mt-6">
                <GoogleButton onClick={handleGoogleRegister} />
                <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-stone-400">
                  <span className="h-px flex-1 bg-stone-200" />
                  or with email
                  <span className="h-px flex-1 bg-stone-200" />
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput
                    label="Full Name"
                    name="fullname"
                    type="text"
                    placeholder="Jane Doe"
                    value={formData.fullname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fullname && fieldErrors.fullname}
                    icon={User}
                    autoComplete="name"
                  />
                  <TextInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="jane@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && fieldErrors.email}
                    icon={Mail}
                    autoComplete="email"
                  />
                </div>

                <TextInput
                  label="Contact Number"
                  name="contact"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.contact}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.contact && fieldErrors.contact}
                  icon={Phone}
                  autoComplete="tel"
                />

                <div>
                  <TextInput
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && fieldErrors.password}
                    icon={Lock}
                    autoComplete="new-password"
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
                  <PasswordStrength password={formData.password} />
                </div>

                <TextInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword && fieldErrors.confirmPassword}
                  icon={Lock}
                  autoComplete="new-password"
                  rightContent={
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="text-stone-400 hover:text-amber-700 transition-colors"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  }
                />

                {/* Role selection */}
                <div>
                  <p className="mb-2.5 text-sm font-semibold text-stone-700">Choose your role</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <RoleCard
                      active={formData.role === 'buyer'}
                      title="Buyer"
                      description="Shop premium fashion"
                      Icon={ShoppingBag}
                      onClick={() => setFormData((c) => ({ ...c, role: 'buyer' }))}
                    />
                    <RoleCard
                      active={formData.role === 'seller'}
                      title="Seller"
                      description="List & sell your products"
                      Icon={Store}
                      onClick={() => setFormData((c) => ({ ...c, role: 'seller' }))}
                    />
                  </div>
                </div>

                {/* Terms */}
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-stone-600 hover:text-stone-800 transition-colors">
                  <input
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-amber-700 shrink-0"
                  />
                  <span>
                    I agree to the{' '}
                    <a href="/terms" className="font-medium text-amber-700 hover:underline">Terms &amp; Conditions</a>
                    {' '}and{' '}
                    <a href="/privacy" className="font-medium text-amber-700 hover:underline">Privacy Policy</a>
                  </span>
                </label>

                {submitError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                    <span className="shrink-0">⚠</span> {submitError}
                  </div>
                )}

                {successMessage && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
                    <CheckCircle size={16} className="shrink-0" /> {successMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !formData.agreeToTerms}
                  className="btn-gold h-13 w-full rounded-2xl text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                  ) : <ArrowRight size={16} />}
                  {loading ? 'Creating Account...' : 'Create My Account'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Fashion panel */}
        <FashionPanel role={formData.role} fullname={formData.fullname} />
      </div>
    </section>
  )
}

export default Register
