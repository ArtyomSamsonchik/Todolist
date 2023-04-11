const PATH = {
  TODOLIST: 'todolist',
  LOGIN: 'login',
  ERROR: '404',
} as const

export type PathKeys = Lowercase<keyof typeof PATH>
export type PathRoutes = (typeof PATH)[Uppercase<PathKeys>]

export default PATH
