import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userPlan: 'free',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserPlan: (state, action) => {
      state.userPlan = action.payload
    },
  },
})

export const { setUserPlan } = userSlice.actions

export default userSlice.reducer
