import { RootState } from "../../store";

export const isLoggedIn = (state: RootState) => state.auth.isLoggedIn;