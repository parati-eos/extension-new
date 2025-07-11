import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CreditState {
  amount: number
  loading: boolean
  error: string | null
}

const initialState: CreditState = {
  amount: 0,
  loading: false,
  error: null
}

const creditSlice = createSlice({
  name: 'credit',
  initialState,
  reducers: {
    setCredit: (state, action: PayloadAction<number>) => {
      state.amount = action.payload
      state.error = null
    },
    addCredit: (state, action: PayloadAction<number>) => {
      state.amount += action.payload
      state.error = null
    },
    subtractCredit: (state, action: PayloadAction<number>) => {
      state.amount -= action.payload
      state.error = null
    },
    resetCredit: (state) => {
      state.amount = 0
      state.error = null
    },
    setCreditLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setCreditError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.loading = false
    }
  }
})

export const { 
  setCredit, 
  addCredit, 
  subtractCredit, 
  resetCredit, 
  setCreditLoading, 
  setCreditError 
} = creditSlice.actions

export default creditSlice.reducer
