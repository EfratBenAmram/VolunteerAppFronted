import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { loginExistingVolunteers } from '../../features/volunteerSlice';
import { loginExistingOrganization } from '../../features/organizationSlice';
import { TextField, Button, Checkbox, FormControlLabel, Box, Typography, CircularProgress } from '@mui/material';
import { AnyAction } from '@reduxjs/toolkit';
import { keyframes } from '@mui/system';

const slideIn = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`;

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{4,}$/;

    const validateEmail = () => {
        if (!emailRegex.test(email)) {
            setErrors((prevErrors) => ({ ...prevErrors, email: 'Please enter a valid email address.' }));
            return false;
        }
        setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
        return true;
    };

    const validatePassword = () => {
        if (!passwordRegex.test(password)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                password: "Password must include at least one letter, one number, and be at least 4 characters long.",
            }));
            return false;
        }
        setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
        return true;
    };

    const volunteerData = {
        volunteerId: 0,
        name: '',
        email,
        password,
        phone: '',
        role: '',
        gender: '',
        birth: '',
        experience: false,
        amountVolunteers: 0,
        region: 'NORTH',
        volunteerReuest: [],
        volunteerReview: [],
    };

    const organizationData = {
        organizationId: 0,
        name: '',
        email,
        password,
        phone: '',
        orgGoals: '',
        recommendationPhones: null,
        topicVolunteers: [],
        region: 'CENTER',
    };


    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = async (role: 'volunteer' | 'organization') => {
        if (!validateEmail() || !validatePassword()) return;

        setLoading(true);
        try {
            let result;
            if (role === 'volunteer') {
                result = await dispatch(loginExistingVolunteers({ volunteerData })) as AnyAction;
            } else if (role === 'organization') {
                result = await dispatch(loginExistingOrganization({ organizationData })) as AnyAction;
            }

            if (result && result.meta.requestStatus === 'fulfilled') {
                navigate(role === 'volunteer' ? '/volunteer-details' : '/organization-details');
            } else {
                console.error('Login failed:', result?.payload?.errorMessage || 'Unknown error');
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'd3d3d3', textAlign: 'center' }}>
                Welcome Back!
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 6,
                    width: '100%',
                }}
            >
                <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={validateEmail}
                    error={!!errors.email}  
                    helperText={errors.email} 
                    sx={{
                        marginBottom: 2,
                        '& .MuiInputLabel-root': {
                            color: '#4e9af1',
                        },
                    }}
                />

                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={validatePassword}
                    error={!!errors.password}  
                    helperText={errors.password}  
                    sx={{
                        marginBottom: 2,
                        '& .MuiInputLabel-root': {
                            color: '#4e9af1',
                        },
                    }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={rememberMe}
                            onChange={() => setRememberMe((prev) => !prev)}
                            color="primary"
                        />
                    }
                    label="Remember me"
                    sx={{
                        marginBottom: 3,
                        color: '#4e9af1',
                    }}
                />
                <Box sx={{ width: '100%' }}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => handleSubmit('volunteer')}
                        sx={{
                            marginBottom: 2,
                            padding: '14px',
                            fontSize: '1.1rem',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            '&:hover': {
                                backgroundColor: '#3579f2',
                                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                            },
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Login as Volunteer'}
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleSubmit('organization')}
                        sx={{
                            padding: '14px',
                            fontSize: '1.1rem',
                            borderColor: '#ff8e53',
                            color: '#ff8e53',
                            '&:hover': {
                                borderColor: '#ff6a00',
                                color: '#ff6a00',
                            },
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Login as Organization'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default LoginForm;
