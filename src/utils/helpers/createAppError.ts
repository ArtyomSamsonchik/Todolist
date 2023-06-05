export const createAppError = (message: string, scope: 'global' | 'validation' = 'global') => ({
  scope,
  message,
})
