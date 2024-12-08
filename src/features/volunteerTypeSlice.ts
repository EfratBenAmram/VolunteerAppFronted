import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    getVolunteerTypes,
    getVolunteerTypeById,
    createVolunteerType,
    updateVolunteerType,
    deleteVolunteerType,
} from '../services/volunteerTypeService';
import { VolunteerType } from '../models/volunteers';

interface VolunteerTypeState {
    volunteerTypes: VolunteerType[];
    selectedVolunteerType: VolunteerType| undefined ;
    loading: boolean;
    error: string | null;
}

const initialState: VolunteerTypeState = {
    volunteerTypes: [],
    selectedVolunteerType: undefined,
    loading: false,
    error: null,
};

// Async Thunks
export const fetchVolunteerTypes = createAsyncThunk('volunteerTypes/fetchVolunteerTypes', async () => {
    const volunteerTypes = await getVolunteerTypes();
    return volunteerTypes;
});

export const fetchVolunteerTypeById = createAsyncThunk('volunteerTypes/fetchVolunteerTypeById', async (id: number) => {
    const volunteerTypes = await getVolunteerTypeById(id);
    return volunteerTypes;
});

export const createNewVolunteerType = createAsyncThunk('volunteerTypes/createVolunteerType', async (volunteerTypes: VolunteerType) => {
    return await createVolunteerType(volunteerTypes);
});

export const updateExistingVolunteerType = createAsyncThunk('volunteerTypes/updateVolunteerType', async ({ id, volunteerTypes }: { id: number; volunteerTypes: VolunteerType }) => {
    return await updateVolunteerType(id, volunteerTypes);
});

export const deleteExistingVolunteerType = createAsyncThunk('volunteerTypes/deleteVolunteerType', async (volunteerTypeId: number) => {
    await deleteVolunteerType(volunteerTypeId);
    return volunteerTypeId;
});

// Slice
const volunteerTypeSlice = createSlice({
    name: 'volunteerTypes',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        // Fetch VolunteerTypes
        builder.addCase(fetchVolunteerTypes.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchVolunteerTypes.fulfilled, (state, action: PayloadAction<VolunteerType[]>) => {
            state.loading = false;
            state.volunteerTypes = action.payload;
        })
        builder.addCase(fetchVolunteerTypes.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch volunteers';
        })

        // Fetch VolunteerType by ID
        builder.addCase(fetchVolunteerTypeById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchVolunteerTypeById.fulfilled, (state, action: PayloadAction<VolunteerType>) => {
            state.loading = false;
            state.selectedVolunteerType = action.payload;
        })
        builder.addCase(fetchVolunteerTypeById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch volunteer';
        })

        // Create VolunteerType
        builder.addCase(createNewVolunteerType.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(createNewVolunteerType.fulfilled, (state, action: PayloadAction<VolunteerType>) => {
            state.loading = false;
            state.volunteerTypes.push(action.payload);
        })
        builder.addCase(createNewVolunteerType.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to create volunteer';
        })

        // Update VolunteerType
        builder.addCase(updateExistingVolunteerType.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(updateExistingVolunteerType.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedVolunteerType = action.payload;
        })
        builder.addCase(updateExistingVolunteerType.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Unknown error occurred';
        });


        // Delete VolunteerType
        builder.addCase(deleteExistingVolunteerType.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(deleteExistingVolunteerType.fulfilled, (state, action: PayloadAction<number>) => {
            state.loading = false;
            state.volunteerTypes = state.volunteerTypes.filter((v) => v.volunteerTypeId !== action.payload);
        })
        builder.addCase(deleteExistingVolunteerType.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete volunteer';
        })

    },
});

export default volunteerTypeSlice.reducer;
