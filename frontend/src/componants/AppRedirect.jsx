import { Navigate } from 'react-router'
import { useSelector } from 'react-redux'

const AppRedirect = () => {
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)

  if (!user && !token) {
    return <Navigate to="/login" replace />
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(221,170,109,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(194,132,55,0.18),_transparent_24%),linear-gradient(135deg,_#f8f4ee_0%,_#f3ede4_45%,_#ede4d7_100%)] px-5">
      <div className="max-w-2xl rounded-[2rem] border border-white/70 bg-white/82 p-8 text-center shadow-[0_20px_80px_rgba(92,58,20,0.16)] backdrop-blur-xl sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700/80">Styleora</p>
        <h1 className="mt-4 font-serif text-4xl text-stone-950">Welcome back, {user?.fullname || 'User'}</h1>
        <p className="mt-4 text-sm leading-7 text-stone-700 sm:text-base">
          Your account is active. Home is available for both buyers and sellers, while seller tools stay protected behind role-based routing.
        </p>
      </div>
    </section>
  )
}

export default AppRedirect
