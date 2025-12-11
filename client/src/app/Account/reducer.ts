import { createSlice } from "@reduxjs/toolkit"; //Redux Toolkit for state management

//define User and AccountState interfaces
interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatar: string;
  role: "USER" | "PRO" | "ADMIN";
  createdAt: string;
}

//define the account state structure
interface AccountState {
  currentUser: User | null;
}

//initial state for the account slice, nobody is logged in initially
const initialState: AccountState = {
  currentUser: null,
};

//create the account slice with reducers
const accountSlice = createSlice({
  name: "account",
  initialState, 
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

//export actions and reducer
export const { setCurrentUser } = accountSlice.actions;
export default accountSlice.reducer;