const AUTH_SESSION_KEY = 'styleora.auth.session'

export const loadAuthSession = () => {
  if (typeof window === 'undefined') {
    return { token: null, user: null }
  }

  try {
    const rawSession = window.localStorage.getItem(AUTH_SESSION_KEY)

    if (!rawSession) {
      return { token: null, user: null }
    }

    const parsedSession = JSON.parse(rawSession)

    return {
      token: parsedSession.token ?? null,
      user: parsedSession.user ?? null,
    }
  } catch {
    return { token: null, user: null }
  }
}

export const saveAuthSession = ({ token, user }) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    AUTH_SESSION_KEY,
    JSON.stringify({
      token: token ?? null,
      user: user ?? null,
    }),
  )
}

export const clearAuthSession = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_SESSION_KEY)
}
