// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./app/appSlice";
import { privacyPolicyApi } from "./settings/privacyPolicyApi";
import { contactApi } from "./contact/contactApi";
import { staticPagesApi } from "./staticPages/staticPagesApi";

import { authApi } from "./auth/authApi";



export const store = configureStore({
  reducer: {
    app: appReducer,
    [privacyPolicyApi.reducerPath]: privacyPolicyApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [staticPagesApi.reducerPath]: staticPagesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      privacyPolicyApi.middleware,
      contactApi.middleware,
      staticPagesApi.middleware,
      authApi.middleware,
    ),
   
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;