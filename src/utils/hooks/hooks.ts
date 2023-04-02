import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../app/store'
import { useState } from 'react'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useWithLoadingState = (initIsLoading = false) => {
  const [isLoading, setIsLoading] = useState(initIsLoading)

  type CallBack<T extends any[], R> = (...args: T) => R | Promise<R>

  const resolveCallback = <TParams extends any[], TResult>(cb: CallBack<TParams, TResult>) => {
    return async (...args: TParams) => {
      setIsLoading(true)
      const result = await cb(...args)
      setIsLoading(false)

      return result
    }
  }

  return [isLoading, resolveCallback] as const
}
