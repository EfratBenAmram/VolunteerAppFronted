import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    getOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    signupOrganizationImage,
    loginOrganization,
    signupOrganization,
} from '../services/organizationService';
import { Organization, OrganizationSignup } from '../models/organizations';
import { UserLogin } from '../models/volunteers';

interface OrganizationState {
    organizations: Organization[];
    selectedOrganization: Organization | undefined;
    loggedInUser: Organization | undefined;
    isConect: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: OrganizationState = {
    organizations: [],
    selectedOrganization: undefined,
    loggedInUser: undefined,
    isConect: false,
    loading: false,
    error: null,
};

// Async Thunks
export const fetchOrganization = createAsyncThunk('organizations/fetchOrganization', async () => {
    const organizations = await getOrganizations();
    return organizations;
});

export const fetchOrganizationById = createAsyncThunk('organizations/fetchOrganizationById', async (id: number) => {
    const organization = await getOrganizationById(id);
    return organization;
});

export const createNewOrganization = createAsyncThunk('organizations/createOrganization', async (organization: Organization) => {
    return await createOrganization(organization);
});

export const updateExistingOrganization = createAsyncThunk('organizations/updateOrganization', async ({ id, organization }: { id: number; organization: Organization }) => {
    return await updateOrganization(id, organization);
});

export const deleteExistingOrganization = createAsyncThunk('organizations/deleteOrganization', async (organizationId: number) => {
    await deleteOrganization(organizationId);
    return organizationId;
});
export const signupNewOrganization = createAsyncThunk(
    'organizations/signupNewOrganization',
    async (
        { organizationData, image }: { organizationData: OrganizationSignup; image?: File | undefined },
        thunkAPI
    ) => {
        try {
            const formData = new FormData();
            if (!image) {
                return await signupOrganization(organizationData);
            }
            formData.append(
                'organization',
                new Blob([JSON.stringify(organizationData)], { type: 'application/json' })
            );
            formData.append('image', image);

            const response = await signupOrganizationImage(formData);
            return response;
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            return thunkAPI.rejectWithValue({
                errorMessage: err.response?.data?.message || 'An unexpected error occurred',
            });
        }
    }
);


export const setGoogleUser = createAsyncThunk('users/setGoogleUser', async (googleUser: Organization) => {
    console.log(googleUser);
    return googleUser;
});


export const loginExistingOrganization = createAsyncThunk(
    'organizations/loginExistingOrganization',
    async ({ email, password }: UserLogin, thunkAPI) => {
        try {
            const response = await loginOrganization({ email, password });
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
const organizationSlice = createSlice({
    name: 'organizations',
    initialState,
    reducers: {
        saveOrganizationData: (state, action: PayloadAction<Organization | undefined>) => {
            state.selectedOrganization = action.payload;
            state.isConect = false;
        },
        logoutOrganization: (state) => {
            state.selectedOrganization = undefined;
            state.isConect = false;
        },
    },
    extraReducers: (builder) => {
        // Fetch Organization
        builder.addCase(fetchOrganization.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchOrganization.fulfilled, (state, action: PayloadAction<Organization[]>) => {
            state.loading = false;
            state.organizations = action.payload;
        })
        builder.addCase(fetchOrganization.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch organizations';
        })

        // Fetch Organization by ID
        builder.addCase(fetchOrganizationById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchOrganizationById.fulfilled, (state, action: PayloadAction<Organization>) => {
            state.loading = false;
            state.selectedOrganization = action.payload;
        })
        builder.addCase(fetchOrganizationById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch organization';
        })

        // Create Organization
        builder.addCase(createNewOrganization.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(createNewOrganization.fulfilled, (state, action: PayloadAction<Organization>) => {
            state.loading = false;
            state.organizations.push(action.payload);
        })
        builder.addCase(createNewOrganization.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to create organization';
        })

        // Update Organization
        builder.addCase(updateExistingOrganization.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(updateExistingOrganization.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedOrganization = action.payload;
        })
        builder.addCase(updateExistingOrganization.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Unknown error occurred';
        });


        // Delete Organization
        builder.addCase(deleteExistingOrganization.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(deleteExistingOrganization.fulfilled, (state, action: PayloadAction<number>) => {
            state.loading = false;
            state.organizations = state.organizations.filter((v) => v.organizationId !== action.payload);
        })
        builder.addCase(deleteExistingOrganization.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete organization';
        })

        // Signup Organization
        builder.addCase(signupNewOrganization.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(signupNewOrganization.fulfilled, (state, action) => {
            state.loading = false;
            state.organizations.push(action.payload);
            state.selectedOrganization = action.payload;
            state.isConect = true;
        })
        builder.addCase(signupNewOrganization.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Unknown error occurred';
        });


        // login Organization
        builder.addCase(loginExistingOrganization.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(loginExistingOrganization.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedOrganization = action.payload;
            state.isConect = true;
        })
        builder.addCase(loginExistingOrganization.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Unknown error occurred';
        });

        builder.addCase(setGoogleUser.fulfilled, (state, action: PayloadAction<Organization>) => {
            state.loggedInUser = action.payload;
        });

    },
});

export default organizationSlice.reducer;
export const { saveOrganizationData, logoutOrganization } = organizationSlice.actions;
