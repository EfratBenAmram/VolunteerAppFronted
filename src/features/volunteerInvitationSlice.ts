import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    getVolunteerInvitations,
    getVolunteerInvitationById,
    createVolunteerInvitation,
    updateVolunteerInvitation,
    deleteVolunteerInvitation,
} from '../services/volunteerTypeService';
import { VolunteerInvitation } from '../models/volunteers';

interface VolunteerInvitationState {
    volunteerInvitation: VolunteerInvitation[];
    selectedVolunteerInvitation: VolunteerInvitation;
    loading: boolean;
    error: string | null;
}

const initialState: VolunteerInvitationState = {
    volunteerInvitation: [],
    selectedVolunteerInvitation: {  volunteerTypeId: 0,
        name: "",
        minAge: 0,
        maxAge: 0,
        topicVolume: 'ELDERLY_CARE',
      },
    loading: false,
    error: null,
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
        })
        builder.addCase(fetchVolunteerInvitations.fulfilled, (state, action: PayloadAction<VolunteerInvitation[]>) => {
            state.loading = false;
            state.volunteerInvitation = action.payload;
        })
        builder.addCase(fetchVolunteerInvitations.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch volunteers';
        })

        // Fetch VolunteerInvitation by ID
        builder.addCase(fetchVolunteerInvitationById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchVolunteerInvitationById.fulfilled, (state, action: PayloadAction<VolunteerInvitation>) => {
            state.loading = false;
            state.selectedVolunteerInvitation = action.payload;
        })
        builder.addCase(fetchVolunteerInvitationById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch volunteer';
        })

        // Create VolunteerInvitation
        builder.addCase(createNewVolunteerInvitation.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(createNewVolunteerInvitation.fulfilled, (state, action: PayloadAction<VolunteerInvitation>) => {
            state.loading = false;
            state.volunteerInvitation.push(action.payload);
        })
        builder.addCase(createNewVolunteerInvitation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to create volunteer';
        })

        // Update VolunteerInvitation
        builder.addCase(updateExistingVolunteerInvitation.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(updateExistingVolunteerInvitation.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedVolunteerInvitation = action.payload;
        })
        builder.addCase(updateExistingVolunteerInvitation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Unknown error occurred';
        });


        // Delete VolunteerInvitation
        builder.addCase(deleteExistingVolunteerInvitation.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(deleteExistingVolunteerInvitation.fulfilled, (state, action: PayloadAction<number>) => {
            state.loading = false;
            state.volunteerInvitation = state.volunteerInvitation.filter((v) => v.volunteerTypeId !== action.payload);
        })
        builder.addCase(deleteExistingVolunteerInvitation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete volunteer';
        })

    },
});

export default volunteerTypeSlice.reducer;
