import { configureStore } from '@reduxjs/toolkit';
import volunteerSlice from '../features/volunteerSlice'; 
import organizationSlice from '../features/organizationSlice';
import volunteerTypeSlice from '../features/volunteerTypeSlice';

export const store = configureStore({
    reducer: {
        volunteers: volunteerSlice, 
        organization: organizationSlice,
        volunteerTypes: volunteerTypeSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
