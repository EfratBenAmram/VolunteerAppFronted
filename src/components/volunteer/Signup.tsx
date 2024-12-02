import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupNewVolunteer } from '../../features/volunteerSlice';
import { RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../store/store';
import { TextField, Button, Checkbox, FormControl, InputLabel, Select, MenuItem, FormHelperText, Box, CircularProgress, Grid, Typography } from '@mui/material';

const SignupV: React.FC = () => {
    const [role, setRole] = useState('');
    const [gender, setGender] = useState('');
    const [birth, setBirth] = useState('');
    const [amountVolunteers, setAmountVolunteers] = useState(0);
    const [region, setRegion] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [experience, setExperience] = useState(false);

    const [errors, setErrors] = useState({
        birth: '',
        amountVolunteers: '',
        region: '',
        image: ''
    });

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const selectedVolunteer = useSelector((state: RootState) => state.volunteers.selectedVolunteer);

    const validateBirth = () => {
        const age = new Date().getFullYear() - new Date(birth).getFullYear();
        if (age < 10 || age > 80) {
            setErrors(prevErrors => ({
                ...prevErrors,
                birth: 'Age must be between 10 and 80 years old.'
            }));
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, birth: '' }));
        return true;
    };

    const validateAmountVolunteers = () => {
        if (amountVolunteers <= 0) {
            setErrors(prevErrors => ({
                ...prevErrors,
                amountVolunteers: 'Amount of volunteers must be greater than 0.'
            }));
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, amountVolunteers: '' }));
        return true;
    };

    const validateRegion = () => {
        if (!['NORTH', 'SOUTH', 'CENTER', 'JERUSALEM', 'GENERAL'].includes(region)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                region: 'Please select a valid region.'
            }));
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, region: '' }));
        return true;
    };

    const validateImage = () => {
        if (image && image.type.split('/')[0] !== 'image') {
            setErrors(prevErrors => ({
                ...prevErrors,
                image: 'Only one valid image is allowed.'
            }));
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, image: '' }));
        return true;
    };

    const handleSubmit = async () => {
        const isBirthValid = validateBirth();
        const isAmountVolunteersValid = validateAmountVolunteers();
        const isRegionValid = validateRegion();
        const isImageValid = validateImage();

        if (isBirthValid && isAmountVolunteersValid && isRegionValid && isImageValid) {
            const volunteerData = {
                gender,
                birth,
                experience,
                amountVolunteers,
                region,
                role,
                name: selectedVolunteer?.name,
                email: selectedVolunteer?.email,
                password: selectedVolunteer?.password,
                phone: selectedVolunteer?.phone,
            };

            try {
                const result = await dispatch(
                    signupNewVolunteer({ volunteerData, image })
                );

                if (result.meta.requestStatus === 'fulfilled') {
                    navigate('/volunteer-details');
                } else {
                    console.error('Signup failed:', result.payload?.errorMessage || 'Unknown error');
                }
            } catch (error) {
                console.error('Signup error:', error);
            }
        } else {
            console.log('Form is invalid.');
        }
    };

    return (
        <Box sx={{ padding: 3, backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>Volunteer Registration</Typography>
            <form className="formS">

                <TextField
                    label="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    fullWidth
                    required
                    sx={{
                        marginBottom: 2,
                        borderRadius: 2,
                        '& .MuiInputBase-root': { backgroundColor: '#fff', borderRadius: '8px' }
                    }}
                />

                <FormControl fullWidth required sx={{ marginBottom: 2, borderRadius: 2 }}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        sx={{
                            '& .MuiSelect-icon': { color: '#3f51b5' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#3f51b5' }
                        }}
                    >
                        <MenuItem value="">Select Gender</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                    </Select>
                    {errors.region && <FormHelperText error>{errors.region}</FormHelperText>}
                </FormControl>

                <TextField
                    label="Date of Birth"
                    type="date"
                    value={birth}
                    onChange={(e) => setBirth(e.target.value)}
                    onBlur={validateBirth}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={{
                        marginBottom: 2,
                        '& .MuiInputBase-root': { backgroundColor: '#fff', borderRadius: '8px' }
                    }}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 10)).toISOString().split('T')[0]}
                />
                {errors.birth && <FormHelperText error>{errors.birth}</FormHelperText>}

                <FormControl fullWidth required sx={{ marginBottom: 2 }}>
                    <label>
                        <Checkbox
                            checked={experience}
                            onChange={(e) => setExperience(e.target.checked)}
                        />
                        Previous volunteering experience
                    </label>
                </FormControl>

                <TextField
                    label="Number of Volunteers"
                    type="number"
                    value={amountVolunteers}
                    onChange={(e) => setAmountVolunteers(Number(e.target.value))}
                    onBlur={validateAmountVolunteers}
                    fullWidth
                    required
                    sx={{
                        marginBottom: 2,
                        '& .MuiInputBase-root': { backgroundColor: '#fff', borderRadius: '8px' }
                    }}
                />
                {errors.amountVolunteers && <FormHelperText error>{errors.amountVolunteers}</FormHelperText>}

                <FormControl fullWidth required sx={{ marginBottom: 2 }}>
                    <InputLabel>Region</InputLabel>
                    <Select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        onBlur={validateRegion}
                        sx={{
                            '& .MuiSelect-icon': { color: '#3f51b5' },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#3f51b5' }
                        }}
                    >
                        <MenuItem value="">Select Region</MenuItem>
                        <MenuItem value="NORTH">North</MenuItem>
                        <MenuItem value="SOUTH">South</MenuItem>
                        <MenuItem value="CENTER">Center</MenuItem>
                        <MenuItem value="JERUSALEM">Jerusalem</MenuItem>
                        <MenuItem value="GENERAL">General</MenuItem>
                    </Select>
                    {errors.region && <FormHelperText error>{errors.region}</FormHelperText>}
                </FormControl>

                <TextField
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.length === 1 ? e.target.files[0] : null)}
                    fullWidth
                    sx={{
                        marginBottom: 2,
                        '& .MuiInputBase-root': { backgroundColor: '#fff', borderRadius: '8px' }
                    }}
                    onBlur={validateImage}
                />
                {errors.image && <FormHelperText error>{errors.image}</FormHelperText>}

                <Grid container justifyContent="center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{
                            padding: '14px',
                            fontSize: '1.1rem',
                            borderRadius: '25px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            marginTop: 2,
                            width: '50%',
                            '&:hover': { backgroundColor: '#1976d2' }
                        }}
                    >
                        {<CircularProgress size={24} />}
                        Register as Volunteer
                    </Button>
                </Grid>
            </form>
        </Box>
    );
};

export default SignupV;
