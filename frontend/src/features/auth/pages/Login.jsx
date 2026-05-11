import React, { useState } from 'react'
import useAuth from '../hook/Useauth'
import { useNavigate } from 'react-router'


const InputIcon = ({ children }) => (
  <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-stone-400">
    {children}
  </span>
)

const TextInput = ({ icon, rightIcon, className = '', ...props }) => (
  <label className="group relative block">
    <InputIcon>{icon}</InputIcon>
    <input
      {...props}
      className={`h-13 w-full rounded-2xl border border-stone-200/80 bg-white/90 pl-12 pr-12 text-sm text-stone-800 outline-none transition duration-200 placeholder:text-stone-400 focus:border-amber-600 focus:bg-white focus:shadow-[0_0_0_4px_rgba(180,119,36,0.08)] ${className}`}
    />
    {rightIcon ? (
      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-400">
        {rightIcon}
      </span>
    ) : null}
  </label>
)

const GoogleButton = () => (
  <button
    type="button"
    className="inline-flex h-13 w-full items-center justify-center gap-3 rounded-2xl border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 shadow-sm transition duration-200 hover:border-stone-300 hover:bg-stone-50"
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

const FashionLoginArt = () => {
  return (
    <div className="relative mx-auto mt-10 w-full max-w-[430px]">
      <div className="absolute -left-10 top-10 h-28 w-28 rounded-full bg-white/12 blur-2xl" />
      <div className="absolute -right-6 top-24 h-32 w-32 rounded-full bg-amber-200/20 blur-2xl" />

      <div className="relative rounded-[2rem] border border-white/15 bg-white/8 p-5 shadow-[0_24px_60px_rgba(50,28,7,0.18)] backdrop-blur-md">
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-rose-200/30 to-amber-50/10" />

        <div className="relative grid gap-4">
          <div className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-[#fff9f2]/95 p-4 text-stone-900 shadow-[0_16px_30px_rgba(61,37,11,0.14)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700/80">
                Welcome Back
              </p>
              <p className="mt-2 text-lg font-semibold">
                Your Styleora Journey Awaits
              </p>
              <p className="mt-1 text-sm text-stone-500">
                Access your curated collections instantly
              </p>
            </div>
            <div className="relative h-18 w-18 overflow-hidden rounded-[1.4rem] bg-[linear-gradient(145deg,_#f3cf99_0%,_#d48834_100%)]">
              <div className="absolute left-1/2 top-3 h-5 w-5 -translate-x-1/2 rounded-full bg-[#fff6ea]" />
              <div className="absolute bottom-0 left-1/2 h-10 w-12 -translate-x-1/2 rounded-t-[1.8rem] bg-[#fff0d7]" />
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/95 p-4 text-stone-900 shadow-[0_16px_30px_rgba(52,27,8,0.14)]">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Quick Access</p>
            <p className="mt-3 text-2xl font-semibold">
              Login Securely
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Your credentials are protected with industry-standard encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const initialFormData = {
  email: '',
  password: '',
}

const Login = () => {
  const [formData, setFormData] = useState(initialFormData)
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const navigate = useNavigate()
  const { handleLogin, loading, error } = useAuth()

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')

    if (!formData.email || !formData.password) {
      setSubmitError('Please fill in all fields.')
      return
    }

    try {
      await handleLogin({
        email: formData.email,
        password: formData.password,
      })
      setFormData(initialFormData)
      navigate('/')
    } catch (requestError) {
      setSubmitError(requestError.message || 'Login failed. Please try again.')
    }
  }

  return (
    <section className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(221,170,109,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(194,132,55,0.18),_transparent_24%),linear-gradient(135deg,_#f8f4ee_0%,_#f3ede4_45%,_#ede4d7_100%)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 shadow-[0_20px_80px_rgba(92,58,20,0.16)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_transparent_55%)]" />

          <div className="relative grid min-h-[600px] lg:grid-cols-[1.08fr_0.92fr]">
            <div className="p-5 sm:p-8 lg:p-9 xl:p-10">
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

                <p className="pt-1.5 text-sm text-stone-500">
                  Don't have an account?{' '}
                  <a
                    href="/register"
                    className="font-semibold text-amber-700 transition hover:text-amber-800"
                  >
                    Sign up
                  </a>
                </p>
              </div>

              <div className="mt-7 max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700/80">
                  Welcome back to STYLEORA
                </p>
                <h1 className="mt-3 font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl">
                  Login to your account
                </h1>
                <p className="mt-3 max-w-lg text-sm leading-6 text-stone-500 sm:text-base">
                  Access your curated collections, orders, and personalized recommendations
                  on Styleora's premium marketplace.
                </p>
              </div>

              <div className="mt-7">
                <GoogleButton />
                <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-stone-400">
                  <span className="h-px flex-1 bg-stone-200" />
                  Or continue with email
                  <span className="h-px flex-1 bg-stone-200" />
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <TextInput
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 6h16v12H4z" />
                      <path d="m4 7 8 6 8-6" />
                    </svg>
                  }
                />

                <TextInput
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
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
                      className="cursor-pointer text-stone-400 transition hover:text-amber-700"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  }
                />

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-stone-300 text-amber-700 focus:ring-amber-600"
                    />
                    <span className="text-sm text-stone-600">Remember me</span>
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-sm font-medium text-amber-700 transition hover:text-amber-800"
                  >
                    Forgot password?
                  </a>
                </div>

                {submitError && (
                  <div className="rounded-xl border border-red-200 bg-red-50/50 p-3 text-sm text-red-700">
                    {submitError}
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50/50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="h-13 w-full rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(180,119,36,0.24)] transition duration-200 hover:shadow-[0_16px_40px_rgba(180,119,36,0.32)] active:shadow-[0_8px_20px_rgba(180,119,36,0.16)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>

                <p className="text-center text-sm text-stone-600">
                  By logging in, you agree to our{' '}
                  <a href="/terms" className="font-medium text-amber-700 hover:text-amber-800">
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="font-medium text-amber-700 hover:text-amber-800">
                    Privacy Policy
                  </a>
                </p>
              </form>
            </div>

            <div className="hidden bg-gradient-to-br from-amber-50/40 to-orange-50/30 lg:flex lg:items-center lg:justify-center">
              <FashionLoginArt />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
