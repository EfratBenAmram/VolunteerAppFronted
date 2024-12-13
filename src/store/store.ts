import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import volunteerSlice from '../redux/volunteerSlice';
import organizationSlice from '../redux/organizationSlice';
import volunteerTypeSlice from '../redux/volunteerTypeSlice';
import volunteerInvitationsSlice from '../redux/volunteerInvitationSlice';

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
