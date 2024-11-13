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
        setRol: (state, action: PayloadAction<string[]>) => {
            state.roles = action.payload;
            state.isAdministrator = action.payload.includes('Administrator');
            state.isAuthenticated = true;
        }
    },
});

export const {setRol} = authSlice.actions;
export default authSlice.reducer;
