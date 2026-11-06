import { useOutletContext } from 'react-router-dom'

export function usePageQuery() {
  const context = useOutletContext()
  return context?.query ?? ''
}
