const stripApiSuffix = (value = '') =>
  value
    .trim()
    .replace(/\/api\/auth\/?$/i, '')
    .replace(/\/api\/products\/?$/i, '')
    .replace(/\/api\/?$/i, '')
    .replace(/\/$/, '')

const resolveApiOrigin = () => {
  const configuredOrigin =
    import.meta.env.VITE_API_ORIGIN ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:5000'

  return stripApiSuffix(configuredOrigin)
}

export const getApiBaseUrl = (service) => `${resolveApiOrigin()}/api/${service}`
