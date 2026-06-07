export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiUrl

  const apiFetch = async (path, options = {}) => {
    const token = localStorage.getItem('token')

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${baseURL}${path}`, {
      ...options,
      headers,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `Error ${res.status}`)
    }

    return res.json()
  }

  return { apiFetch }
}