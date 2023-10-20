type RedirectState = { from: string }
const isRedirectState = (state: unknown): state is RedirectState =>
  typeof state === 'object' && state !== null && 'from' in state && typeof state.from === 'string'

export default isRedirectState
