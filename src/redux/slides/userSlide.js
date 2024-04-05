import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email: '',
  avatar: '',
  phone: '',
  address: '',
  access_token: '',
  id: ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      console.log(action)
      const { name, email, access_token, avatar, phone, address, _id} = action.payload
      state.name = name;
      state.email = email;
      state.avatar = avatar;
      state.phone = phone;
      state.address = address;
      state.access_token = access_token;
      state.id = _id
    },
    resetUser: (state) => {
      state.name = '';
      state.email = '';
      state.avatar = '';
      state.phone = '';
      state.address = '';
      state.access_token = '';
      state.id = ''
    }
  },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlice.actions

export default userSlice.reducer