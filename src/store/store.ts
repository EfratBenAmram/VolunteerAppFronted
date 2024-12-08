import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import volunteerSlice from '../features/volunteerSlice';
import organizationSlice from '../features/organizationSlice';
import volunteerTypeSlice from '../features/volunteerTypeSlice';
import volunteerInvitationsSlice from '../features/volunteerInvitationSlice';

const rootReducer = combineReducers({
    volunteers: volunteerSlice,
    organization: organizationSlice,
    volunteerTypes: volunteerTypeSlice,
    volunteerInvitations: volunteerInvitationsSlice,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['volunteers', 'organization'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
