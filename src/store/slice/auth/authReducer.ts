import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { themeMode } from "../../../theme/theme";

interface AuthState {
  isLoggedIn: boolean;
  theme: themeMode
}

const initialState: AuthState = {
  isLoggedIn: false,
  theme: 'light'
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setTheme: (state, action: PayloadAction<themeMode>) => {
      state.theme = action.payload;
    },
  },
});

export const { setIsLoggedIn, setTheme } = authSlice.actions;

export default authSlice.reducer;