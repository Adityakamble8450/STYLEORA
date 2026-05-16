import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import { setToken, setUser } from '../state/auth.slice'
import { saveAuthSession } from '../services/auth.session'
import { getDefaultRouteForUser } from '../services/auth.redirect'

const parseUserFromQuery = (searchParams) => {
  const rawUser = searchParams.get('user')

  if (rawUser) {
    try {
      return JSON.parse(rawUser)
    } catch {
      return null
    }
  }

  const userId = searchParams.get('userId')
  const email = searchParams.get('email')
  const fullname = searchParams.get('fullname')
  const role = searchParams.get('role')
  const profilePicture = searchParams.get('profilePicture')

  if (!userId && !email && !fullname) {
    return null
  }

  return {
    id: userId,
    email,
    fullname,
    role,
    profilePicture,
  }
}

const AuthSuccess = () => {
  const [status, setStatus] = useState('Completing Google sign-in...')
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const token = searchParams.get('token')
    const user = parseUserFromQuery(searchParams)

    if (!token) {
      setStatus('Google sign-in did not return a valid token.')
      const timeoutId = window.setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1800)

      return () => window.clearTimeout(timeoutId)
    }

    dispatch(setToken(token))
    if (user) {
      dispatch(setUser(user))
    }

    saveAuthSession({ token, user })
    setStatus('Sign-in complete. Redirecting to your dashboard...')

    const timeoutId = window.setTimeout(() => {
      navigate(getDefaultRouteForUser(user), { replace: true })
    }, 900)

    return () => window.clearTimeout(timeoutId)
  }, [dispatch, location.search, navigate])

  return (
    <section className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(221,170,109,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(194,132,55,0.18),_transparent_24%),linear-gradient(135deg,_#f8f4ee_0%,_#f3ede4_45%,_#ede4d7_100%)] px-4">
      <div className="max-w-md rounded-[1.75rem] border border-white/70 bg-white/85 p-8 text-center shadow-[0_20px_80px_rgba(92,58,20,0.16)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-700 shadow-inner shadow-amber-100">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="mt-5 font-serif text-3xl text-stone-900">Google sign-in</h1>
        <p className="mt-3 text-sm leading-6 text-stone-500">{status}</p>
      </div>
    </section>
  )
}

export default AuthSuccess
