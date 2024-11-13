import {GetDefaultsResponseDto} from "@/features/api/types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface ConfigState {
    values: GetDefaultsResponseDto
}

const initialState: ConfigState = {
    values: {
        establecimientos: [],
        comunas: [],
        estamentos: [],
        mutualidades: [],
    }
};

const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setValues: (state, action: PayloadAction<GetDefaultsResponseDto>) => {
            state.values = action.payload;
        }
    },
});

export const {setValues} = configSlice.actions;
export default configSlice.reducer;