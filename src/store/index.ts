import {configureStore} from '@reduxjs/toolkit';
import authReducer from '@/features/auth/slice';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {api} from '@/features/api';
import {combineReducers} from 'redux';
import {encryptTransform} from 'redux-persist-transform-encrypt';
import configReducer from '@/features/config/slice';

const encryptor = encryptTransform({
    secretKey: 'mi_clave_secreta_segura',
});

const rootReducer = combineReducers({
    auth: authReducer,
    config: configReducer,
    [api.reducerPath]: api.reducer,
});

const persistConfig = {
    key: 'root',
    storage,
    transforms: [encryptor],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            }
        }).concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
