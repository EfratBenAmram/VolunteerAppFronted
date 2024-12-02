import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { saveVolunteerData } from '../../features/volunteerSlice';
import { saveOrganizationData } from '../../features/organizationSlice';
import { TextField, Button, Checkbox, FormControlLabel, Box, Typography, CircularProgress } from '@mui/material';
import { keyframes } from '@mui/system';

// Animation for background sliding effect (similar to LoginForm)
const slideIn = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`;

const SignupForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const phoneRegex = /^(0[2-9]{1}[0-9]{1}[ -]?[0-9]{3}[ -]?[0-9]{4})$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;

    const validateUsername = () => {
        if (!usernameRegex.test(username)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                username: 'Username must be 3-16 characters, alphanumeric or underscores only.'
            }));
            return false;
        }
        setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
        return true;
    };

    const validateEmail = () => {
        if (!emailRegex.test(email)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: 'Please enter a valid email address.'
            }));
            return false;
        }
        setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
        return true;
    };

    const validatePassword = () => {
        if (!passwordRegex.test(password)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                password: 'Password must be at least 8 characters, with upper, lower, digit, and special char.'
            }));
            return false;
        }
        setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
        return true;
    };

    const validateConfirmPassword = () => {
        if (password !== confirmPassword) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                confirmPassword: 'Passwords do not match.'
            }));
            return false;
        }
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: '' }));
        return true;
    };

    const validatePhone = () => {
        if (!phoneRegex.test(phone)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                phone: 'Use 10 digits (e.g., 0501234567) or +972 format (e.g., +972501234567). No dots or dashes.'
            }));
            return false;
        }
        setErrors((prevErrors) => ({ ...prevErrors, phone: '' }));
        return true;
    };

    const volunteerData = {
        volunteerId: 0, 
        name: username,
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
        name: username,
        email,
        password,
        phone: '',
        orgGoals: '',
        recommendationPhones: '',
        topicVolunteers: [],
        region: 'CENTER',
    };

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = (role: 'volunteer' | 'organization') => {
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isPhoneValid = validatePhone();

        if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isPhoneValid) {
            setLoading(true);
            try {
                if (role === 'volunteer') {
                    dispatch(saveVolunteerData(volunteerData));
                    navigate('/signup_volunteer');
                } else {
                    dispatch(saveOrganizationData(organizationData));
                    navigate('/signup_organization');
                }
            } catch (error) {
                console.error('Sign Up failed:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'd3d3d3', textAlign: 'center' }}>
                Sign Up
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
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={validateUsername}
                    error={!!errors.username}
                    helperText={errors.username}
                    sx={{
                        marginBottom: 2,
                        '& .MuiInputLabel-root': {
                            color: '#4e9af1',
                        },
                    }}
                />
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
                <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={validateConfirmPassword}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    sx={{
                        marginBottom: 2,
                        '& .MuiInputLabel-root': {
                            color: '#4e9af1',
                        },
                    }}
                />
                <TextField
                    fullWidth
                    label="Phone Number"
                    type="tel"
                    variant="outlined"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={validatePhone}
                    error={!!errors.phone}
                    helperText={errors.phone}
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
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Sign Up as Volunteer'}
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleSubmit('organization')}
                        sx={{
                            padding: '14px',
                            fontSize: '1.1rem',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}
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
