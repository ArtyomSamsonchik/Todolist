import { AppError } from '../../app/store'

const isAppError = (e: unknown): e is AppError => {
  return (
    typeof e === 'object' &&
    e !== null &&
    'scope' in e &&
    (e.scope === 'validation' || e.scope === 'global') &&
    'message' in e
  )
}

export default isAppError
