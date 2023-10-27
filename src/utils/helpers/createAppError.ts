import { AppError } from '../../app/store'

type CreateAppError = {
  (message: string, scope?: 'global'): AppError
  (message: string, scope: 'validation', fields: Record<string, string>): AppError
}

// TODO: add overload description with JSDoc
const createAppError: CreateAppError = (
  message,
  scope = 'global',
  fields?: Record<string, string>
) => {
  const error = { scope, message } as AppError
  if (fields && error.scope === 'validation') error.fields = fields

  return error
}

// Older function overload implementation. It's working. Just for example

// function createAppError(message: string, scope?: 'global'): AppError
// function createAppError(
//   message: string,
//   scope: 'validation',
//   fields: Record<string, string>
// ): AppError
// function createAppError(
//   message: string,
//   scope: 'global' | 'validation' = 'global',
//   fields?: Record<string, string>
// ): AppError {
//   const error = { scope, message } as AppError
//   if (fields && error.scope === 'validation') error.fields = fields
//
//   return error
// }

export { createAppError }
