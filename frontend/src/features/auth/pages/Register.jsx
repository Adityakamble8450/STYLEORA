import React, { useState } from 'react'
import useAuth from '../hook/Useauth'
import { useNavigate } from 'react-router'
import { getGoogleAuthUrl } from '../services/user.api'

const InputIcon = ({ children }) => (
  <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-stone-500 transition-colors duration-200">
    {children}
  </span>
)

const TextInput = ({ icon, rightIcon, className = '', error, isValid, ...props }) => (
  <label className="group relative block">
    <InputIcon>{icon}</InputIcon>
    <input
      {...props}
      className={`h-13 w-full rounded-2xl border bg-white/90 pl-12 pr-12 text-sm text-stone-900 outline-none transition duration-200 placeholder:text-stone-500 focus:bg-white ${
        error
          ? 'border-red-300 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.08)]'
          : isValid && props.value
            ? 'border-green-300 focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.08)]'
            : 'border-stone-200/80 focus:border-amber-600 focus:shadow-[0_0_0_4px_rgba(180,119,36,0.08)]'
      } ${className}`}
    />
    {error && (
      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-lg text-red-500">x</span>
    )}
    {isValid && props.value && !error && (
      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-lg text-green-500">+</span>
    )}
    {rightIcon && !error && !(isValid && props.value) ? (
      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-500">
        {rightIcon}
      </span>
    ) : null}
  </label>
)

const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = () => {
    let strength = 0
    if (!password) return { level: 0, label: '', color: '' }

    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    const levels = [
      { level: 0, label: '', color: '' },
      { level: 1, label: 'Weak', color: 'bg-red-500' },
      { level: 2, label: 'Fair', color: 'bg-orange-500' },
      { level: 3, label: 'Good', color: 'bg-yellow-500' },
      { level: 4, label: 'Strong', color: 'bg-lime-500' },
      { level: 5, label: 'Very Strong', color: 'bg-green-500' },
    ]

    return levels[Math.min(strength, 5)]
  }

  const strength = getStrength()

  if (!password) return null

  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex flex-1 gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= strength.level ? strength.color : 'bg-stone-200'
            }`}
          />
        ))}
      </div>
      <span
        className={`text-xs font-semibold ${
          strength.level === 5
            ? 'text-green-600'
            : strength.level === 4
              ? 'text-lime-600'
              : strength.level === 3
                ? 'text-yellow-700'
                : strength.level === 2
                  ? 'text-orange-600'
                  : 'text-red-600'
        }`}
      >
        {strength.label}
      </span>
    </div>
  )
}

const GoogleButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex h-13 w-full items-center justify-center gap-3 rounded-2xl border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-800 shadow-sm transition duration-200 hover:border-stone-300 hover:bg-stone-50"
  >
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.68-.06-1.33-.17-1.96H12v3.7h5.39a4.6 4.6 0 0 1-1.99 3.02v2.5h3.22c1.88-1.73 2.98-4.28 2.98-7.26Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.61-2.44l-3.22-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.08v2.58A9.98 9.98 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.9A5.98 5.98 0 0 1 6.1 12c0-.66.11-1.31.31-1.9V7.52H3.08A9.98 9.98 0 0 0 2 12c0 1.61.39 3.13 1.08 4.48l3.33-2.58Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.98c1.47 0 2.8.5 3.84 1.5l2.88-2.88C16.96 2.96 14.7 2 12 2A9.98 9.98 0 0 0 3.08 7.52L6.41 10.1C7.2 7.74 9.4 5.98 12 5.98Z"
      />
    </svg>
    Continue with Google
  </button>
)

const RoleCard = ({ active, title, description, icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative flex items-center gap-4 rounded-3xl border p-5 text-left transition duration-200 ${
      active
        ? 'border-amber-700 bg-gradient-to-br from-amber-50 to-white shadow-[0_12px_30px_rgba(180,119,36,0.12)]'
        : 'border-stone-200/90 bg-white/80 hover:border-amber-300 hover:bg-white'
    }`}
  >
    <span
      className={`absolute left-4 top-4 h-5 w-5 rounded-full border ${
        active ? 'border-amber-700' : 'border-stone-300'
      }`}
    >
      {active ? (
        <span className="absolute left-1 top-1 h-2.5 w-2.5 rounded-full bg-amber-700" />
      ) : null}
    </span>
    <span className="mt-3 flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-amber-700">
      {icon}
    </span>
    <span>
      <span className="block text-xl font-semibold text-stone-900">{title}</span>
      <span className="mt-1 block text-sm leading-6 text-stone-700">{description}</span>
    </span>
  </button>
)

const PremiumFashionPortrait = ({ role, fullname }) => {
  const isSeller = role === 'seller'

  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      <div className="absolute -left-10 top-12 h-28 w-28 rounded-full bg-white/12 blur-2xl" />
      <div className="absolute -right-6 top-24 h-36 w-36 rounded-full bg-amber-200/20 blur-3xl" />

      <div className="relative rounded-[2rem] border border-white/15 bg-white/8 p-5 shadow-[0_24px_60px_rgba(50,28,7,0.18)] backdrop-blur-md">
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-orange-300/30 to-amber-50/10" />

        <div className="relative space-y-4">
          <div className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-[#fff9f2]/95 p-4 text-stone-900 shadow-[0_16px_30px_rgba(61,37,11,0.14)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700/80">
                New Profile
              </p>
              <p className="mt-2 text-lg font-semibold">
                {fullname.trim() || 'Your Signature Style'}
              </p>
              <p className="mt-1 text-sm text-stone-700">
                {isSeller ? 'Launching a boutique storefront' : 'Curating a premium wishlist'}
              </p>
            </div>
            <div className="rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
              {role}
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#4f2d11]/55 p-4 text-white shadow-[0_18px_32px_rgba(30,16,3,0.2)]">
            <div className="rounded-[1.5rem] bg-[linear-gradient(180deg,_rgba(255,243,224,0.92)_0%,_rgba(252,215,163,0.92)_100%)] p-4">
              <svg viewBox="0 0 320 360" className="h-[360px] w-full">
                <ellipse cx="160" cy="332" rx="84" ry="18" fill="rgba(124,68,22,0.18)" />
                <circle cx="160" cy="80" r="34" fill="#7b4720" />
                <path d="M124 110c10-15 22-22 36-22s26 7 36 22v16h-72z" fill="#603818" />
                <rect x="116" y="110" width="88" height="122" rx="36" fill="#fbefdf" />
                <path d="M110 146c14-18 32-27 50-27 18 0 36 9 50 27v22h-100z" fill="#efe2d0" />
                <path d="M118 154c8-16 26-24 42-24 16 0 34 8 42 24l14 34c5 13-4 28-19 31l-37 7-37-7c-15-3-24-18-19-31z" fill={isSeller ? '#1f2b39' : '#8f5627'} />
                <path d="M124 220h72l-8 76c-2 17-16 30-33 30h-14c-17 0-31-13-33-30z" fill={isSeller ? '#dcbf98' : '#f4e4cc'} />
                <path d="M130 226h60v96h-60z" fill={isSeller ? '#e8d0b1' : '#fbf3e7'} />
                <path d="M114 222l-28 92h28l24-74z" fill="#f0d8b8" />
                <path d="M206 222l28 92h-28l-24-74z" fill="#f0d8b8" />
                <path d="M138 310l-6 22h30l4-22z" fill="#ffffff" />
                <path d="M182 310l6 22h-30l-4-22z" fill="#d9b68a" />
                <path d="M84 306h48v16H76z" fill="#8b4d16" />
                <path d="M188 306h56v16h-48z" fill="#8b4d16" />
                <path d="M148 146h24" stroke="rgba(255,255,255,0.48)" strokeWidth="3" strokeLinecap="round" />
                <path d="M118 194h84" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
              </svg>
            </div>

            <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-white/95 p-4 text-stone-900 shadow-[0_16px_30px_rgba(52,27,8,0.14)]">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Status</p>
              <p className="mt-3 text-2xl font-semibold">
                {isSeller ? 'Boutique Ready' : 'Wardrobe Ready'}
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                A polished, premium profile experience designed to feel elevated from the first click.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s+\-()]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10
  return phoneRegex
}

const validatePassword = (password) => password.length >= 8

const initialFormData = {
  fullname: '',
  email: '',
  contact: '',
  password: '',
  confirmPassword: '',
  role: 'buyer',
  agreeToTerms: false,
}

const initialFieldErrors = {
  fullname: '',
  email: '',
  contact: '',
  password: '',
  confirmPassword: '',
}

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialFormData)
  const [fieldErrors, setFieldErrors] = useState(initialFieldErrors)
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { handleRegister, loading, error } = useAuth()

  const handleGoogleRegister = () => {
    window.location.assign(getGoogleAuthUrl())
  }

  const validateField = (name, value) => {
    let errorMsg = ''

    switch (name) {
      case 'fullname':
        if (!value.trim()) errorMsg = 'Full name is required'
        else if (value.trim().split(' ').length < 2) errorMsg = 'Please enter your full name'
        break
      case 'email':
        if (!value.trim()) errorMsg = 'Email is required'
        else if (!validateEmail(value)) errorMsg = 'Please enter a valid email'
        break
      case 'contact':
        if (!value.trim()) errorMsg = 'Contact number is required'
        else if (!validatePhone(value)) errorMsg = 'Please enter a valid phone number'
        break
      case 'password':
        if (!value) errorMsg = 'Password is required'
        else if (!validatePassword(value)) errorMsg = 'Password must be at least 8 characters'
        break
      case 'confirmPassword':
        if (!value) errorMsg = 'Please confirm your password'
        else if (value !== formData.password) errorMsg = 'Passwords do not match'
        break
      default:
        break
    }

    return errorMsg
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (touched[name]) {
      const currentValue = type === 'checkbox' ? checked : value
      const fieldError = validateField(name, currentValue)
      setFieldErrors((current) => ({
        ...current,
        [name]: fieldError,
      }))
    }
  }

  const handleBlur = (event) => {
    const { name, value } = event.target
    setTouched((current) => ({
      ...current,
      [name]: true,
    }))

    const fieldError = validateField(name, value)
    setFieldErrors((current) => ({
      ...current,
      [name]: fieldError,
    }))
  }

  const updateRole = (role) => {
    setFormData((current) => ({
      ...current,
      role,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    setSuccessMessage('')

    const newErrors = {}
    Object.keys(initialFieldErrors).forEach((field) => {
      const fieldError = validateField(field, formData[field])
      if (fieldError) newErrors[field] = fieldError
    })

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors)
      setTouched({
        fullname: true,
        email: true,
        contact: true,
        password: true,
        confirmPassword: true,
      })
      setSubmitError('Please fix the errors above before submitting.')
      return
    }

    if (!formData.agreeToTerms) {
      setSubmitError('Please accept the Terms & Conditions and Privacy Policy.')
      return
    }

    try {
      await handleRegister({
        email: formData.email,
        contact: formData.contact,
        fullname: formData.fullname,
        password: formData.password,
        role: formData.role,
      })

      setSuccessMessage('Account created successfully! Redirecting...')
      setFormData(initialFormData)
      setFieldErrors(initialFieldErrors)
      setTouched({})
      setTimeout(() => navigate('/'), 2000)
    } catch (requestError) {
      setSubmitError(requestError.message || 'Failed to create account. Please try again.')
    }
  }

  return (
    <section className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(221,170,109,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(194,132,55,0.18),_transparent_24%),linear-gradient(135deg,_#f8f4ee_0%,_#f3ede4_45%,_#ede4d7_100%)]">
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <div className="bg-white/72 p-5 backdrop-blur-xl sm:p-8 lg:p-10 xl:p-12">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700 shadow-inner shadow-amber-100">
              <svg
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M19 8v6" />
                <path d="M22 11h-6" />
              </svg>
            </div>

            <p className="pt-1.5 text-sm text-stone-700">
              Already have an account?{' '}
              <a
                href="/login"
                className="font-semibold text-amber-700 transition hover:text-amber-800"
              >
                Login
              </a>
            </p>
          </div>

          <div className="mt-7 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700/80">
              Welcome to STYLEORA
            </p>
            <h1 className="mt-3 font-serif text-3xl tracking-tight text-stone-950 sm:text-4xl">
              Create your account
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-stone-700 sm:text-base">
              Join Styleora and start your fashion journey with a polished marketplace
              experience tailored for buyers and sellers.
            </p>
          </div>

          <div className="mt-7 max-w-xl">
            <GoogleButton onClick={handleGoogleRegister} />
            <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-stone-500">
              <span className="h-px flex-1 bg-stone-300" />
              Or continue with email
              <span className="h-px flex-1 bg-stone-300" />
            </div>
          </div>

          <form className="max-w-xl space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <TextInput
                  name="fullname"
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.fullname && fieldErrors.fullname}
                  isValid={touched.fullname && !fieldErrors.fullname && formData.fullname}
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 21a8 8 0 0 0-16 0" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  }
                />
                {touched.fullname && fieldErrors.fullname && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.fullname}</p>
                )}
              </div>
              <div>
                <TextInput
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && fieldErrors.email}
                  isValid={touched.email && !fieldErrors.email && formData.email}
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 6h16v12H4z" />
                      <path d="m4 7 8 6 8-6" />
                    </svg>
                  }
                />
                {touched.email && fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                )}
              </div>
            </div>

            <div>
              <TextInput
                name="contact"
                type="tel"
                placeholder="Contact Number"
                value={formData.contact}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.contact && fieldErrors.contact}
                isValid={touched.contact && !fieldErrors.contact && formData.contact}
                icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.35 1.78.68 2.62a2 2 0 0 1-.45 2.11L8.06 9.94a16 16 0 0 0 6 6l1.49-1.28a2 2 0 0 1 2.11-.45c.84.33 1.72.56 2.62.68A2 2 0 0 1 22 16.92Z" />
                  </svg>
                }
              />
              {touched.contact && fieldErrors.contact && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.contact}</p>
              )}
            </div>

            <div>
              <TextInput
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && fieldErrors.password}
                isValid={touched.password && !fieldErrors.password && formData.password}
                icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V8a4 4 0 1 1 8 0v3" />
                  </svg>
                }
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="cursor-pointer text-stone-500 transition hover:text-amber-700"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                }
              />
              {touched.password && fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
              )}
              <PasswordStrengthIndicator password={formData.password} />
            </div>

            <div>
              <TextInput
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && fieldErrors.confirmPassword}
                isValid={touched.confirmPassword && !fieldErrors.confirmPassword && formData.confirmPassword}
                icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V8a4 4 0 1 1 8 0v3" />
                  </svg>
                }
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="cursor-pointer text-stone-500 transition hover:text-amber-700"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                }
              />
              {touched.confirmPassword && fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <div className="pt-2">
              <p className="mb-3 text-base font-medium text-stone-800">Choose your role</p>
              <div className="grid gap-4 md:grid-cols-2">
                <RoleCard
                  active={formData.role === 'buyer'}
                  title="Buyer"
                  description="Shop your favorite products"
                  onClick={() => updateRole('buyer')}
                  icon={
                    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M6 7h12l-1 13H7L6 7Z" />
                      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
                    </svg>
                  }
                />
                <RoleCard
                  active={formData.role === 'seller'}
                  title="Seller"
                  description="Sell your products to customers"
                  onClick={() => updateRole('seller')}
                  icon={
                    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 10h16" />
                      <path d="M5 10V7l2-3h10l2 3v3" />
                      <path d="M6 10v10h12V10" />
                      <path d="M10 20v-5h4v5" />
                    </svg>
                  }
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 pt-1 text-sm leading-6 text-stone-700 transition hover:text-stone-800">
              <input
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-amber-700"
              />
              <span>
                I agree to the{' '}
                <a href="/terms" className="font-medium text-amber-700 transition hover:text-amber-800">
                  Terms &amp; Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="font-medium text-amber-700 transition hover:text-amber-800">
                  Privacy Policy
                </a>
              </span>
            </label>

            {submitError && (
              <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4m0 4v.01" stroke="white" strokeWidth="2" fill="none" />
                </svg>
                <span>{submitError}</span>
              </div>
            )}

            {successMessage && (
              <div className="flex items-start gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 15.17L6.413 11.58a1 1 0 00-1.413 1.413l4.413 4.414a1 1 0 001.414 0l7.071-7.071a1 1 0 00-1.414-1.414L10 15.17z" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !formData.agreeToTerms}
              className="mt-2 inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 px-6 text-base font-semibold text-white shadow-[0_14px_35px_rgba(180,119,36,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(180,119,36,0.38)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading && (
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" opacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 0 20" />
                </svg>
              )}
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            </button>
          </form>
        </div>

        <div className="hidden bg-gradient-to-br from-amber-50/40 to-orange-50/30 lg:flex lg:items-center lg:justify-center lg:p-10">
          <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[linear-gradient(160deg,_rgba(89,55,16,0.96)_0%,_rgba(160,102,34,0.92)_52%,_rgba(233,190,123,0.88)_100%)] px-9 py-10 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.26),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(255,245,228,0.2),_transparent_28%)]" />
            <div className="relative">
              <p className="text-sm uppercase tracking-[0.45em] text-white/70">STYLEORA</p>
              <h2 className="mt-6 max-w-sm font-serif text-4xl leading-tight">
                Fashion begins the moment you create your space.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-6 text-white/85">
                Build your presence, discover curated trends, and step into a premium
                shopping experience designed to feel elegant from the first click.
              </p>
            </div>

            <div className="relative mt-10">
              <PremiumFashionPortrait role={formData.role} fullname={formData.fullname} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register
