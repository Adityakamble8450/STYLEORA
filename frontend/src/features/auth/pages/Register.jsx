import React, { useState } from 'react'

const InputIcon = ({ children }) => (
  <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-stone-400">
    {children}
  </span>
)

const TextInput = ({ icon, rightIcon, ...props }) => (
  <label className="group relative block">
    <InputIcon>{icon}</InputIcon>
    <input
      {...props}
      className="h-13 w-full rounded-2xl border border-stone-200/80 bg-white/90 pl-12 pr-12 text-sm text-stone-800 outline-none transition duration-200 placeholder:text-stone-400 focus:border-amber-600 focus:bg-white focus:shadow-[0_0_0_4px_rgba(180,119,36,0.08)]"
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
      <span className="mt-1 block text-sm leading-6 text-stone-500">{description}</span>
    </span>
  </button>
)

const Register = () => {
  const [selectedRole, setSelectedRole] = useState('buyer')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <section className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(221,170,109,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(194,132,55,0.18),_transparent_24%),linear-gradient(135deg,_#f8f4ee_0%,_#f3ede4_45%,_#ede4d7_100%)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 shadow-[0_20px_80px_rgba(92,58,20,0.16)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_transparent_55%)]" />

          <div className="relative grid min-h-[700px] lg:grid-cols-[1.08fr_0.92fr]">
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
                <h1 className="mt-3 font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl">
                  Create your account
                </h1>
                <p className="mt-3 max-w-lg text-sm leading-6 text-stone-500 sm:text-base">
                  Join Styleora and start your fashion journey with a polished marketplace
                  experience tailored for buyers and sellers.
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

              <form className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <TextInput
                    type="text"
                    placeholder="Full Name"
                    icon={
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M20 21a8 8 0 0 0-16 0" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    }
                  />
                  <TextInput
                    type="email"
                    placeholder="Email Address"
                    icon={
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M4 6h16v12H4z" />
                        <path d="m4 7 8 6 8-6" />
                      </svg>
                    }
                  />
                </div>

                <TextInput
                  type="tel"
                  placeholder="Contact Number"
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.35 1.78.68 2.62a2 2 0 0 1-.45 2.11L8.06 9.94a16 16 0 0 0 6 6l1.49-1.28a2 2 0 0 1 2.11-.45c.84.33 1.72.56 2.62.68A2 2 0 0 1 22 16.92Z" />
                    </svg>
                  }
                />

                <TextInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
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

                <TextInput
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
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
                      className="cursor-pointer text-stone-400 transition hover:text-amber-700"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  }
                />

                <div className="pt-2">
                  <p className="mb-3 text-base font-medium text-stone-700">Choose your role</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <RoleCard
                      active={selectedRole === 'buyer'}
                      title="Buyer"
                      description="Shop your favorite products"
                      onClick={() => setSelectedRole('buyer')}
                      icon={
                        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M6 7h12l-1 13H7L6 7Z" />
                          <path d="M9 9V6a3 3 0 0 1 6 0v3" />
                        </svg>
                      }
                    />
                    <RoleCard
                      active={selectedRole === 'seller'}
                      title="Seller"
                      description="Sell your products to customers"
                      onClick={() => setSelectedRole('seller')}
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

                <label className="flex items-start gap-3 pt-1 text-sm leading-6 text-stone-500">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-amber-700"
                  />
                  <span>
                    I agree to the{' '}
                    <a href="/terms" className="font-medium text-amber-700 hover:text-amber-800">
                      Terms &amp; Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="font-medium text-amber-700 hover:text-amber-800">
                      Privacy Policy
                    </a>
                  </span>
                </label>

                <button
                  type="submit"
                  className="mt-2 inline-flex h-13 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 px-6 text-base font-semibold text-white shadow-[0_14px_35px_rgba(180,119,36,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(180,119,36,0.38)]"
                >
                  Create Account
                </button>
              </form>
            </div>

            <div className="relative hidden overflow-hidden bg-[linear-gradient(160deg,_rgba(89,55,16,0.96)_0%,_rgba(160,102,34,0.92)_52%,_rgba(233,190,123,0.88)_100%)] lg:block">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.26),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(255,245,228,0.2),_transparent_28%)]" />
              <div className="relative flex h-full flex-col justify-between p-9 text-white">
                <div>
                  <p className="text-sm uppercase tracking-[0.45em] text-white/70">STYLEORA</p>
                  <h2 className="mt-6 max-w-sm font-serif text-4xl leading-tight">
                    Fashion begins the moment you create your space.
                  </h2>
                  <p className="mt-5 max-w-md text-sm leading-6 text-white/78">
                    Build your presence, discover curated trends, and step into a premium
                    shopping experience designed to feel elegant from the first click.
                  </p>
                </div>

                <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-6 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M3 7h18" />
                        <path d="M6 3h12l2 4v11a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7l2-4Z" />
                        <path d="M9 12h6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.35em] text-white/55">Marketplace</p>
                      <p className="mt-1 text-xl font-semibold">Join as buyer or seller</p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-2xl font-semibold">10k+</p>
                      <p className="mt-2 text-sm text-white/70">Curated style pieces explored</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-2xl font-semibold">24/7</p>
                      <p className="mt-2 text-sm text-white/70">Elegant shopping experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register
