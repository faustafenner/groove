import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./Account/reducer";

const store = configureStore({
  reducer: {
    accountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;