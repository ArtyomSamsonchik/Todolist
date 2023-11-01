export const BASIC_ERROR_MESSAGE = 'Something went wrong! Try again in a few minutes'
export const NO_INTERNET_ERROR_MESSAGE = 'Cannot perform request! Check your internet connection.'

export const PATH = {
  ROOT: '/',
  TODOLIST: 'todolist',
  LOGIN: 'login',
  ERROR: '404',
} as const

export type PathKeys = Lowercase<keyof typeof PATH>
export type PathRoutes = (typeof PATH)[Uppercase<PathKeys>]
