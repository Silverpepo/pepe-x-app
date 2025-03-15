import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function useSearchQueries() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      // Convert the ReadonlyURLSearchParams to a format URLSearchParams constructor can accept
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams],
  )

  return { pathname, searchParams, createQueryString }
}