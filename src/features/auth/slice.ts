import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {BaseType} from "@/features/api/types";

export interface AuthState {
    isAuthenticated: boolean;
    rol: BaseType | undefined;
}

const initialState: AuthState = {
    isAuthenticated: false,
    rol: undefined
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        setRol: (state, action: PayloadAction<BaseType>) => {
            state.rol = action.payload;
        }
    },
});

export const {setAuthenticated, setRol} = authSlice.actions;
export default authSlice.reducer;
