import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email: '',
  avatar: '',
  phone: '',
  role_id: '',
  access_token: '',
  id: ''
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    updateAccount: (state, action) => {
      const { name, email, access_token, avatar, phone, role_id, _id} = action.payload
      state.name = name;
      state.email = email;
      state.avatar = avatar;
      state.phone = phone;
      state.role_id = role_id;
      state.access_token = access_token;
      state.id = _id
    },
    resetAccount: (state) => {
      state.name = '';
      state.email = '';
      state.avatar = '';
      state.phone = '';
      state.role_id = '';
      state.access_token = '';
      state.id = ''
    }
  },
})

// Action creators are generated for each case reducer function
export const { updateAccount, resetAccount } = accountSlice.actions

export default accountSlice.reducer