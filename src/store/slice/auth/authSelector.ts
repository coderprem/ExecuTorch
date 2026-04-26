import { RootState } from "../../store";

export const isLoggedIn = (state: RootState) => state.auth.isLoggedIn;

export const getTheme = (state: RootState) => state.auth.theme;