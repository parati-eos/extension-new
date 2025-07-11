import { useSelector, useDispatch } from 'react-redux'
import { setCredit, addCredit, subtractCredit, resetCredit } from '../redux/slices/creditSlice'
import type { RootState, AppDispatch } from '../store'
export const useCredit = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { amount, loading, error } = useSelector((state: RootState) => state.credit)

  const updateCredit = (newAmount: number) => {
    dispatch(setCredit(newAmount))
  }

  const increaseCredit = (amount: number) => {
    dispatch(addCredit(amount))
  }

  const decreaseCredit = (amount: number) => {
    dispatch(subtractCredit(amount))
  }

  const clearCredit = () => {
    dispatch(resetCredit())
  }

  return {
    credits: amount,
    loading,
    error,
    updateCredit,
    increaseCredit,
    decreaseCredit,
    clearCredit
  }
}