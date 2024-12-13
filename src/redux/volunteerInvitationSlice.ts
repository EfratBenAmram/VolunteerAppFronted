import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    getVolunteerInvitations,
    getVolunteerInvitationById,
    createVolunteerInvitation,
    updateVolunteerInvitation,
    deleteVolunteerInvitation,
} from '../services/volunteerInvitationService';
import { VolunteerInvitation } from '../models/invitation';

interface VolunteerInvitationState {
    volunteerInvitation: VolunteerInvitation[];
    selectedVolunteerInvitation: VolunteerInvitation | undefined;
    loading: boolean;
    error: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: VolunteerInvitationState = {
    volunteerInvitation: [],
    selectedVolunteerInvitation: undefined,
    loading: false,
    error: null,
    status: 'idle', 
};

// Async Thunks
export const fetchVolunteerInvitations = createAsyncThunk('volunteerInvitation/fetchVolunteerInvitations', async () => {
    const volunteerInvitation = await getVolunteerInvitations();
    return volunteerInvitation;
});

export const fetchVolunteerInvitationById = createAsyncThunk('volunteerInvitation/fetchVolunteerInvitationById', async (id: number) => {
    const volunteerInvitation = await getVolunteerInvitationById(id);
    return volunteerInvitation;
});

export const createNewVolunteerInvitation = createAsyncThunk('volunteerInvitation/createVolunteerInvitation', async (volunteerInvitation: VolunteerInvitation) => {
    return await createVolunteerInvitation(volunteerInvitation);
});

export const updateExistingVolunteerInvitation = createAsyncThunk('volunteerInvitation/updateVolunteerInvitation', async ({ id, volunteerInvitation }: { id: number; volunteerInvitation: VolunteerInvitation }) => {
    return await updateVolunteerInvitation(id, volunteerInvitation);
});

export const deleteExistingVolunteerInvitation = createAsyncThunk('volunteerInvitation/deleteVolunteerInvitation', async (volunteerTypeId: number) => {
    await deleteVolunteerInvitation(volunteerTypeId);
    return volunteerTypeId;
});

// Slice
const volunteerTypeSlice = createSlice({
    name: 'volunteerInvitation',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        // Fetch VolunteerInvitations
        builder.addCase(fetchVolunteerInvitations.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.status = 'loading';
        })
        builder.addCase(fetchVolunteerInvitations.fulfilled, (state, action: PayloadAction<VolunteerInvitation[]>) => {
            state.loading = false;
            state.volunteerInvitation = action.payload;
            state.status = 'succeeded';
        })
        builder.addCase(fetchVolunteerInvitations.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch volunteers';
            state.status = 'failed';
        })

        // Fetch VolunteerInvitation by ID
        builder.addCase(fetchVolunteerInvitationById.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.status = 'loading';
        })
        builder.addCase(fetchVolunteerInvitationById.fulfilled, (state, action: PayloadAction<VolunteerInvitation>) => {
            state.loading = false;
            state.selectedVolunteerInvitation = action.payload;
            state.status = 'succeeded';
        })
        builder.addCase(fetchVolunteerInvitationById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch volunteer';
            state.status = 'failed';
        })

        // Create VolunteerInvitation
        builder.addCase(createNewVolunteerInvitation.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.status = 'loading';
        })
        builder.addCase(createNewVolunteerInvitation.fulfilled, (state, action: PayloadAction<VolunteerInvitation>) => {
            state.loading = false;
            state.volunteerInvitation.push(action.payload);
            state.status = 'succeeded';
        })
        builder.addCase(createNewVolunteerInvitation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to create volunteer';
            state.status = 'failed';
        })

        // Update VolunteerInvitation
        builder.addCase(updateExistingVolunteerInvitation.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.status = 'loading';
        })
        builder.addCase(updateExistingVolunteerInvitation.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.volunteerInvitation.findIndex((v) => v.invitationId === action.payload.invitationId);
            if (index !== -1) {
                state.volunteerInvitation[index] = action.payload;
            }        
            state.status = 'succeeded';
        })
        builder.addCase(updateExistingVolunteerInvitation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Unknown error occurred';
            state.status = 'failed';
        });


        // Delete VolunteerInvitation
        builder.addCase(deleteExistingVolunteerInvitation.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.status = 'loading';
        })
        builder.addCase(deleteExistingVolunteerInvitation.fulfilled, (state, action: PayloadAction<number>) => {
            state.loading = false;
            state.volunteerInvitation = state.volunteerInvitation.filter((v) => v.invitationId !== action.payload);
            state.status = 'succeeded';
        })
        builder.addCase(deleteExistingVolunteerInvitation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete volunteer';
            state.status = 'failed';
        })

    },
});

export default volunteerTypeSlice.reducer;
