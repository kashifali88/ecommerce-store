import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.currentUser = null;
    },
    loginStart: (state) => {
      ((state.loading = true), (state.error = null));
    },
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.error = null;
      state.loading = false;
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.currentUser = null;
    },
    logOutStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    logOutSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    logOutFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    deleteUserSuccess: (state) => {
      state.loading = false;
      state.currentUser = null;
    },

    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  registerStart,
  clearError,
  registerFailure,
  registerSuccess,
  loginFailure,
  loginStart,
  loginSuccess,
  logOutStart,
  logOutSuccess,
  logOutFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess
} = authSlice.actions;
export default authSlice.reducer;
