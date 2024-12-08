import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupNewVolunteer } from '../../features/volunteerSlice';
import { RootState, AppDispatch } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Checkbox, FormControl, InputLabel, Select, MenuItem, CircularProgress, Box, Typography, Card, CardContent, InputAdornment, FormHelperText } from '@mui/material';
import { Person, DateRange, PhotoCamera, Group } from '@mui/icons-material';

const SignupV: React.FC = () => {
    const [formData, setFormData] = useState({
        role: '', gender: '', birth: '', amountVolunteers: 0, region: '', image: null as File | null, experience: false
    });
    const [errors, setErrors] = useState({ birth: '', amountVolunteers: '', image: '' });
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const selectedVolunteer = useSelector((state: RootState) => state.volunteers.selectedVolunteer);

    const validate = () => {
        const age = new Date().getFullYear() - new Date(formData.birth).getFullYear();
        const birthDate = new Date(formData.birth);
        const isValid =
            age >= 10 &&
            age <= 80 &&
            formData.amountVolunteers > 0 &&
            !isNaN(formData.amountVolunteers) &&
            formData.amountVolunteers % 1 === 0 &&
            (!formData.image || formData.image.type.split('/')[0] === 'image') &&
            birthDate <= new Date();

        setErrors({
            birth: age < 10 || age > 80 || birthDate > new Date() ? 'Age must be between 10 and 80, and birth date must be in the past.' : '',
            amountVolunteers: formData.amountVolunteers <= 0 || isNaN(formData.amountVolunteers) || formData.amountVolunteers % 1 !== 0 ? 'Amount of volunteers must be a positive integer greater than 0.' : '',
            image: formData.image && formData.image.type.split('/')[0] !== 'image' ? 'Only image files are allowed.' : ''
        });

        return isValid;
    };

    const handleSubmit = async () => {
        if (validate()) {
            setIsLoading(true);
            try {
                const volunteerData = { ...formData, name: selectedVolunteer?.name, email: selectedVolunteer?.email, password: selectedVolunteer?.password, phone: selectedVolunteer?.phone };
                const result = await dispatch(signupNewVolunteer({ volunteerData, image: formData.image }));
                if (result.meta.requestStatus === 'fulfilled') navigate('/volunteer');
            } catch (error) {
                console.error('Signup error:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => e.target.files && setFormData({ ...formData, image: e.target.files[0] });

    const fieldProps = [
        { label: 'Role', name: 'role', type: 'text', adornment: <Person /> },
        { label: 'Date of Birth', name: 'birth', type: 'date', adornment: <DateRange />, min: new Date(new Date().setFullYear(new Date().getFullYear() - 80)).toISOString().split("T")[0], max: new Date(new Date().setFullYear(new Date().getFullYear() - 10)).toISOString().split("T")[0] },
        { label: 'Number of Volunteers', name: 'amountVolunteers', type: 'number', adornment: <Group /> }
    ];

    return (
        <Box sx={{ backgroundColor: '#e8f5e9', width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
            <Card sx={{ width: '100%', maxWidth: 600, borderRadius: 3, boxShadow: 10, padding: 3, backgroundColor: '#ffffff' }}>
                <CardContent>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', color: '#4CAF50', marginBottom: 4 }}>Volunteer Registration</Typography>
                    <form>
                        {fieldProps.map(({ label, name, type, adornment, min, max }) => (
                            <TextField
                                key={name}
                                label={label}
                                name={name}
                                type={type}
                                value={formData[name as keyof typeof formData]}
                                onChange={handleChange}
                                fullWidth
                                required
                                sx={fieldStyle}
                                InputProps={{ startAdornment: <InputAdornment position="start">{adornment}</InputAdornment> }}
                                error={!!errors[name as keyof typeof errors]}
                                helperText={errors[name as keyof typeof errors]}
                                inputProps={{
                                    min,
                                    max
                                }}                        
                            />
                        ))}
                        <FormControl fullWidth required sx={fieldStyle}>
                            <InputLabel>Gender</InputLabel>
                            <Select name="gender" value={formData.gender} onChange={handleChange} error={!!errors.gender}>
                                <MenuItem value="">Select Gender</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Male">Male</MenuItem>
                            </Select>
                            <FormHelperText>{errors.gender}</FormHelperText>
                        </FormControl>
                        <FormControl fullWidth sx={fieldStyle}>
                            <InputLabel>Region</InputLabel>
                            <Select name="region" value={formData.region} onChange={handleChange} error={!!errors.region}>
                                <MenuItem value="">Select Region</MenuItem>
                                <MenuItem value="NORTH">North</MenuItem>
                                <MenuItem value="SOUTH">South</MenuItem>
                                <MenuItem value="CENTER">Center</MenuItem>
                                <MenuItem value="JERUSALEM">Jerusalem</MenuItem>
                                <MenuItem value="GENERAL">General</MenuItem>
                            </Select>
                            <FormHelperText>{errors.region}</FormHelperText>
                        </FormControl>
                        <TextField
                            label="Profile Picture"
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            fullWidth
                            inputProps={{ accept: 'image/*' }}
                            sx={fieldStyle}
                            InputProps={{ startAdornment: <InputAdornment position="start"><PhotoCamera /></InputAdornment> }}
                            error={!!errors.image}
                            helperText={errors.image}
                        />
                        <FormControl fullWidth sx={fieldStyle}>
                            <label><Checkbox checked={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.checked })} /> Previous volunteering experience</label>
                        </FormControl>

                        <Box sx={{ textAlign: 'center' }}>
                            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} disabled={isLoading} sx={buttonStyle}>
                                {isLoading ? <CircularProgress size={24} color="secondary" /> : 'Register'}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

const fieldStyle = { marginBottom: 3, backgroundColor: '#fff', borderRadius: 2 };
const buttonStyle = { width: '100%', padding: '12px', borderRadius: 3, fontWeight: 'bold', boxShadow: 3, '&:hover': { backgroundColor: '#388E3C', boxShadow: 6 } };

export default SignupV;
