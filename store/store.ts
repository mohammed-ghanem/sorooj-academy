// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./app/appSlice";
import { contactApi } from "./contact/contactApi";
import { staticPagesApi } from "./staticPages/staticPagesApi";
import { studyTermsApi } from "./studyTerms/studyTermsApi";
import { subjectsApi } from "./subjects/subjectsApi";
import { lessonsApi } from "./lessons/lessonsApi";
import { studentHomeApi } from "./studentHome/studentHomeApi";
import { facultyMembersApi } from "./facultyMembers/facultyMembersApi";

import { authApi } from "./auth/authApi";



export const store = configureStore({
  reducer: {
    app: appReducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [staticPagesApi.reducerPath]: staticPagesApi.reducer,
    [studyTermsApi.reducerPath]: studyTermsApi.reducer,
    [subjectsApi.reducerPath]: subjectsApi.reducer,
    [lessonsApi.reducerPath]: lessonsApi.reducer,
    [studentHomeApi.reducerPath]: studentHomeApi.reducer,
    [facultyMembersApi.reducerPath]: facultyMembersApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      contactApi.middleware,
      staticPagesApi.middleware,
      studyTermsApi.middleware,
      subjectsApi.middleware,
      lessonsApi.middleware,
      studentHomeApi.middleware,
      facultyMembersApi.middleware,
      authApi.middleware,
    ),
   
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;