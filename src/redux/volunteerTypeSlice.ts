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
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
    }

    const initialState: VolunteerTypeState = {
        volunteerTypes: [],
        selectedVolunteerType: undefined,
        loading: false,
        error: null,
        status: 'idle', 
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
                state.status = 'loading';
            })
            builder.addCase(fetchVolunteerTypes.fulfilled, (state, action: PayloadAction<VolunteerType[]>) => {
                state.loading = false;
                state.volunteerTypes = action.payload;
                state.status = 'succeeded';
            })
            builder.addCase(fetchVolunteerTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch volunteers';
                state.status = 'succeeded';
            })

            // Fetch VolunteerType by ID
            builder.addCase(fetchVolunteerTypeById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = 'loading';
            })
            builder.addCase(fetchVolunteerTypeById.fulfilled, (state, action: PayloadAction<VolunteerType>) => {
                state.loading = false;
                state.selectedVolunteerType = action.payload;
                state.status = 'succeeded';
            })
            builder.addCase(fetchVolunteerTypeById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch volunteer';
                state.status = 'succeeded';
            })

            // Create VolunteerType
            builder.addCase(createNewVolunteerType.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = 'loading';
            })
            builder.addCase(createNewVolunteerType.fulfilled, (state, action: PayloadAction<VolunteerType>) => {
                state.loading = false;
                state.volunteerTypes.push(action.payload);
                state.status = 'succeeded';
            })
            builder.addCase(createNewVolunteerType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create volunteer';
                state.status = 'succeeded';
            })

            // Update VolunteerType
            builder.addCase(updateExistingVolunteerType.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = 'loading';
            })
            builder.addCase(updateExistingVolunteerType.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedVolunteerType = action.payload;
                state.status = 'succeeded';
            })
            builder.addCase(updateExistingVolunteerType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Unknown error occurred';
                state.status = 'succeeded';
            });


            // Delete VolunteerType
            builder.addCase(deleteExistingVolunteerType.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = 'loading';
            })
            builder.addCase(deleteExistingVolunteerType.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.volunteerTypes = state.volunteerTypes.filter((v) => v.volunteerTypeId !== action.payload);
                state.status = 'succeeded';
            })
            builder.addCase(deleteExistingVolunteerType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete volunteer';
                state.status = 'succeeded';
            })

        },
    });

    export default volunteerTypeSlice.reducer;
