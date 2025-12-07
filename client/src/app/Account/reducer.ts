import { createSlice } from "@reduxjs/toolkit";

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

interface AccountState {
  currentUser: User | null;
}

const initialState: AccountState = {
  currentUser: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentUser } = accountSlice.actions;
export default accountSlice.reducer;