import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth/auth";
import companyReducer from "./slice/company/companySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
  },
});

export type Rootstate = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
