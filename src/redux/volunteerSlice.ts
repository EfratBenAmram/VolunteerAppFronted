import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    getVolunteers,
    getVolunteerById,
    createVolunteer,
    updateVolunteer,
    deleteVolunteer,
    signupVolunteerImage,
    loginVolunteer,
    signupVolunteer,
} from '../services/volunteerService';
import { Volunteer, UserLogin, VolunteerSignup } from '../models/volunteers';

interface VolunteerState {
    map(arg0: (volunteer: Volunteer) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
    flatMap(arg0: (vol: any) => any): unknown;
    volunteers: Volunteer[];
    selectedVolunteer: Volunteer | undefined;
    isConect: boolean;
    loading: boolean;
    error: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: VolunteerState = {
    volunteers: [],
    selectedVolunteer: undefined,
    isConect: false,
    loading: false,
    error: null,
    status: 'idle', 
};

// Async Thunks
export const fetchVolunteers = createAsyncThunk('volunteers/fetchVolunteers', async () => {
    const volunteers = await getVolunteers();
    return volunteers;
});

export const fetchVolunteerById = createAsyncThunk('volunteers/fetchVolunteerById', async (id: number) => {
    const volunteer = await getVolunteerById(id);
    return volunteer;
});

export const createNewVolunteer = createAsyncThunk('volunteers/createVolunteer', async (volunteer: Volunteer) => {
    return await createVolunteer(volunteer);
});

export const updateExistingVolunteer = createAsyncThunk('volunteers/updateVolunteer', async ({ id, volunteer }: { id: number; volunteer: Volunteer }) => {
    return await updateVolunteer(id, volunteer);
});

export const deleteExistingVolunteer = createAsyncThunk('volunteers/deleteVolunteer', async (volunteerId: number) => {
    await deleteVolunteer(volunteerId);
    return volunteerId;
});

export const signupNewVolunteer = createAsyncThunk(
    'volunteers/signupNewVolunteer',
    async (
        { volunteerData, image }: { volunteerData: VolunteerSignup; image?: File | undefined },
        thunkAPI
    ) => {
        try {
            const formData = new FormData();
            if (!image) {
                return await signupVolunteer(volunteerData);
            }
            formData.append(
                'volunteer',
                new Blob([JSON.stringify(volunteerData)], { type: 'application/json' })
            );
            formData.append('image', image);
            const response = await signupVolunteerImage(formData);
            return response;
        } catch (error) {
            const err = error as { status?: string };
            return thunkAPI.rejectWithValue({
                status: err.status,
            });
        }
    }
);

export const loginExistingVolunteers = createAsyncThunk(
    'volunteers/loginExistingVolunteers',
    async ({ name, password }: UserLogin, thunkAPI) => {
        try {
            const response = await loginVolunteer({ name, password });
            return response;
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            return thunkAPI.rejectWithValue({
                errorMessage: err.response?.data?.message || 'An unexpected error occurred',
            });
        }
    }
);

export const addVolunteerRequest = (newRequest: any) => ({
    type: 'ADD_VOLUNTEER_REQUEST',
    payload: newRequest
});

// Slice
const volunteerSlice = createSlice({
    name: 'volunteers',
    initialState,
    reducers: {
        saveVolunteerData: (state, action: PayloadAction<Volunteer | undefined>) => {
            state.selectedVolunteer = action.payload;
            state.isConect = false;
            state.status = 'loading';
        },
        logoutVolunteer: (state) => {
            state.selectedVolunteer = undefined;
            state.isConect = false;
            state.status = 'succeeded';
        },
        setSelectedVolunteer: (state, action) => {
            state.selectedVolunteer = action.payload;
            state.status = 'failed';
        },
    },
    extraReducers: (builder) => {
        // Fetch Volunteers
        builder.addCase(fetchVolunteers.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.status = 'loading';
        })
        builder.addCase(fetchVolunteers.fulfilled, (state, action: PayloadAction<Volunteer[]>) => {
            state.loading = false;
            state.volunteers = action.payload;
            state.status = 'succeeded';
        })
        builder.addCase(fetchVolunteers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch volunteers';
            state.status = 'failed';
        })

        // Fetch Volunteer by ID
        builder.addCase(fetchVolunteerById.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.status = 'loading';
        })
        builder.addCase(fetchVolunteerById.fulfilled, (state, action: PayloadAction<Volunteer>) => {
            state.loading = false;
            state.selectedVolunteer = action.payload;
            state.status = 'succeeded';
        })
        builder.addCase(fetchVolunteerById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch volunteer';
            state.status = 'failed';
        })

        // Create Volunteer
        builder.addCase(createNewVolunteer.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.status = 'loading';
        })
        builder.addCase(createNewVolunteer.fulfilled, (state, action: PayloadAction<Volunteer>) => {
            state.loading = false;
            state.volunteers.push(action.payload);
            state.status = 'succeeded';
        })
        builder.addCase(createNewVolunteer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to create volunteer';
            state.status = 'failed';
        })

        // Update Volunteer
        builder.addCase(updateExistingVolunteer.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.status = 'loading';
        })
        builder.addCase(updateExistingVolunteer.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedVolunteer = action.payload;
            state.status = 'succeeded';
        })
        builder.addCase(updateExistingVolunteer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Unknown error occurred';
            state.status = 'failed';
        });


        // Delete Volunteer
        builder.addCase(deleteExistingVolunteer.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.status = 'loading';
        })
        builder.addCase(deleteExistingVolunteer.fulfilled, (state, action: PayloadAction<number>) => {
            state.loading = false;
            state.volunteers = state.volunteers.filter((v) => v.volunteerId !== action.payload);
            state.status = 'succeeded';
        })
        builder.addCase(deleteExistingVolunteer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete volunteer';
            state.status = 'failed';
        })

        // Signup Volunteers
        builder.addCase(signupNewVolunteer.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.status = 'loading';
        })
        builder.addCase(signupNewVolunteer.fulfilled, (state, action) => {
            state.loading = false;
            state.volunteers.push(action.payload);
            state.selectedVolunteer = action.payload;
            state.isConect = true;
            state.status = 'succeeded';
        })
        builder.addCase(signupNewVolunteer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Unknown error occurred';
            state.status = 'failed';
        });


        // login Volunteers
        builder.addCase(loginExistingVolunteers.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.status = 'loading';
        })
        builder.addCase(loginExistingVolunteers.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedVolunteer = action.payload;
            state.isConect = true;
            state.status = 'succeeded';
        })
        builder.addCase(loginExistingVolunteers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Unknown error occurred';
            state.status = 'failed';
        });

    },
});

export default volunteerSlice.reducer;
export const { saveVolunteerData, logoutVolunteer, setSelectedVolunteer } = volunteerSlice.actions;