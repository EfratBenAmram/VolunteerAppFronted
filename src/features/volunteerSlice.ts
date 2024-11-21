import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    getVolunteers,
    getVolunteerById,
    createVolunteer,
    updateVolunteer,
    deleteVolunteer,
    signupVolunteerImage,
    loginVolunteer,
} from '../services/volunteerService';
import { Volunteer } from '../models/volunteers';
import { setUserCookie, getUserFromCookie, removeUserCookie } from '../services/cookieService';

interface VolunteerState {
    volunteers: Volunteer[];
    selectedVolunteer: Volunteer | undefined;
    loggedInUser: Volunteer | undefined;
    isConect: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: VolunteerState = {
    volunteers: [],
    selectedVolunteer: undefined,
    loggedInUser: undefined,
    isConect: false,
    loading: false,
    error: null,
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
        { volunteerData, image }: { volunteerData: Volunteer; image?: File | undefined },
        thunkAPI
    ) => {
        try {
            const formData = new FormData();
            if (!image) {
                const defaultImagePath = volunteerData.gender === 'Female' ? '../../assets/images/1' : '../../assets/images/2';
                const imageResponse = await fetch(defaultImagePath);
                const imageBlob = await imageResponse.blob();
                image = new File([imageBlob], volunteerData.gender === 'Female' ? '1.jpg' : '2.jpg', { type: 'image/jpeg' });
            }
            formData.append(
                'volunteer',
                new Blob([JSON.stringify(volunteerData)], { type: 'application/json' })
            );
            formData.append('image', image);

            const response = await signupVolunteerImage(formData);
            setUserCookie(response);
            return response;
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            return thunkAPI.rejectWithValue({
                errorMessage: err.response?.data?.message || 'An unexpected error occurred',
            });
        }
    }
);


export const setGoogleUser = createAsyncThunk('users/setGoogleUser', async (googleUser: Volunteer) => {
    console.log(googleUser);
    return googleUser;
});


export const loginExistingVolunteers = createAsyncThunk(
    'volunteers/loginExistingVolunteers',
    async ({ volunteerData }: { volunteerData: Volunteer }, thunkAPI) => {
        try {
            const response = await loginVolunteer(volunteerData);
            setUserCookie(response);
            return response;
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            return thunkAPI.rejectWithValue({
                errorMessage: err.response?.data?.message || 'An unexpected error occurred',
            });
        }
    }
);

// Slice
const volunteerSlice = createSlice({
    name: 'volunteers',
    initialState,
    reducers: {
        saveVolunteerData: (state, action: PayloadAction<Volunteer | undefined>) => {
            state.selectedVolunteer = action.payload;
            state.isConect = false;
        },
        logoutVolunteer: (state) => {
            state.selectedVolunteer = undefined;
            state.isConect = false;
            removeUserCookie();
        },
        loadVolunteerFromCookie: (state) => {
            const user = getUserFromCookie();
            if (user) {
                state.selectedVolunteer = user;
                state.isConect = true;
            }
        },


    },
    extraReducers: (builder) => {
        // Fetch Volunteers
        builder.addCase(fetchVolunteers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchVolunteers.fulfilled, (state, action: PayloadAction<Volunteer[]>) => {
            state.loading = false;
            state.volunteers = action.payload;
        })
        builder.addCase(fetchVolunteers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch volunteers';
        })

        // Fetch Volunteer by ID
        builder.addCase(fetchVolunteerById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchVolunteerById.fulfilled, (state, action: PayloadAction<Volunteer>) => {
            state.loading = false;
            state.selectedVolunteer = action.payload;
        })
        builder.addCase(fetchVolunteerById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch volunteer';
        })

        // Create Volunteer
        builder.addCase(createNewVolunteer.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(createNewVolunteer.fulfilled, (state, action: PayloadAction<Volunteer>) => {
            state.loading = false;
            state.volunteers.push(action.payload);
        })
        builder.addCase(createNewVolunteer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to create volunteer';
        })

        // Update Volunteer
        builder.addCase(updateExistingVolunteer.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(updateExistingVolunteer.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedVolunteer = action.payload;
        })
        builder.addCase(updateExistingVolunteer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Unknown error occurred';
        });


        // Delete Volunteer
        builder.addCase(deleteExistingVolunteer.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(deleteExistingVolunteer.fulfilled, (state, action: PayloadAction<number>) => {
            state.loading = false;
            state.volunteers = state.volunteers.filter((v) => v.volunteerId !== action.payload);
        })
        builder.addCase(deleteExistingVolunteer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete volunteer';
        })

        // Signup Volunteers
        builder.addCase(signupNewVolunteer.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(signupNewVolunteer.fulfilled, (state, action) => {
            state.loading = false;
            state.volunteers.push(action.payload);
            state.selectedVolunteer = action.payload;
            state.isConect = true;
        })
        builder.addCase(signupNewVolunteer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Unknown error occurred';
        });


        // login Volunteers
        builder.addCase(loginExistingVolunteers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(loginExistingVolunteers.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedVolunteer = action.payload;
            state.isConect = true;
        })
        builder.addCase(loginExistingVolunteers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Unknown error occurred';
        });

        builder.addCase(setGoogleUser.fulfilled, (state, action: PayloadAction<Volunteer>) => {
            state.loggedInUser = action.payload;
        });

    },
});

export default volunteerSlice.reducer;
export const { saveVolunteerData, logoutVolunteer, loadVolunteerFromCookie } = volunteerSlice.actions;