import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface AuthState {
    isAuthenticated: boolean;
    roles: string[];
    isAdministrator: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    roles: [],
    isAdministrator: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        setRol: (state, action: PayloadAction<string[]>) => {
            state.roles = action.payload;
            state.isAdministrator = action.payload.includes('Administrator');
        }
    },
});

export const {setAuthenticated, setRol} = authSlice.actions;
export default authSlice.reducer;
