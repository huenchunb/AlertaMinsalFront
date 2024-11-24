import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  isAuthenticated: boolean;
  roles: string[];
  isAdministrator: boolean;
  isJefatura: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  roles: [],
  isAdministrator: false,
  isJefatura: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRol: (state, action: PayloadAction<string[]>) => {
      state.roles = action.payload;
      state.isAdministrator = action.payload.includes("Administrator");
      state.isJefatura = action.payload.includes("Jefatura");
      state.isAuthenticated = true;
    },
  },
});

export const { setRol } = authSlice.actions;
export default authSlice.reducer;
