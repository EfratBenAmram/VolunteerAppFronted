import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { saveVolunteerData } from '../../features/volunteerSlice';
import { saveOrganizationData } from '../../features/organizationSlice';
import { TextField, Button, Checkbox, FormControlLabel, Box, Typography, CircularProgress } from '@mui/material';

const validate = (value: string, regex: RegExp, errorMessage: string) =>
    regex.test(value) ? '' : errorMessage;

const SignupForm: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        rememberMe: false,
    });

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleSubmit = (role: 'volunteer' | 'organization') => {
        const validationErrors = {
            username: validate(formData.username, /^[a-zA-Z0-9_]{3,16}$/, 'Username must be 3-16 characters, alphanumeric or underscores only.'),
            email: validate(formData.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address.'),
            password: validate(formData.password, /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{4,}$/, 'Password must be at least 4 characters, with letter and digit.'),
            confirmPassword: formData.password !== formData.confirmPassword ? 'Passwords do not match.' : '',
            phone: validate(formData.phone, /^(0[2-9]{1}[0-9]{1}[ -]?[0-9]{3}[ -]?[0-9]{4})$/, 'Use 10 digits (e.g., 0501234567) or +972 format (e.g., +972501234567). No dots or dashes.'),
        };

        setErrors(validationErrors);

        if (Object.values(validationErrors).every((err) => !err)) {
            setLoading(true);
            try {
                const data =  { ...formData};
                dispatch(role === 'volunteer' ? saveVolunteerData(data) : saveOrganizationData(data));
                navigate(role === 'volunteer' ? '/signup_volunteer' : '/signup_organization');
            } catch (error) {
                console.error('Sign Up failed:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'd3d3d3', textAlign: 'center' }}>Sign Up</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 6, width: '100%' }}>
                {['username', 'email', 'password', 'confirmPassword', 'phone'].map((field) => (
                    <TextField
                        key={field}
                        fullWidth
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        variant="outlined"
                        type={field === 'password' || field === 'confirmPassword' ? 'password' : 'text'} 
                        value={formData[field as keyof typeof formData]}
                        onChange={handleChange(field)}
                        error={!!errors[field as keyof typeof errors]}
                        helperText={errors[field as keyof typeof errors]}
                        sx={{ marginBottom: 2, '& .MuiInputLabel-root': { color: '#4e9af1' } }}
                    />
                ))}
                <FormControlLabel
                    control={<Checkbox checked={formData.rememberMe} onChange={() => setFormData({ ...formData, rememberMe: !formData.rememberMe })} color="primary" />}
                    label="Remember me"
                    sx={{ marginBottom: 3, color: '#4e9af1' }}
                />
                <Box sx={{ width: '100%' }}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => handleSubmit('volunteer')}
                        sx={{ marginBottom: 2, padding: '14px', fontSize: '1.1rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Sign Up as Volunteer'}
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleSubmit('organization')}
                        sx={{ padding: '14px', fontSize: '1.1rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Sign Up as Organization'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default SignupForm;
