import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { loginExistingOrganization } from '../../redux/organizationSlice';
import { loginExistingVolunteers } from '../../redux/volunteerSlice';
import { TextField, Button, Checkbox, FormControlLabel, Box, CircularProgress } from '@mui/material';

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', password: '', rememberMe: false });
    const [errors, setErrors] = useState({ name: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const regex = {
        name: /^[a-zA-Z0-9_]{3,}$/,
        password: /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{4,}$/
    };

    const validate = (field: 'name' | 'password') => {
        const isValid = regex[field].test(formData[field]);
        const errorMessages: { [key: string]: string } = {
            name: 'Name must be at least 3 characters long and contain only letters, numbers, or underscores.',
            password: 'Password must include at least one letter, one number, and be at least 4 characters long.',
        };
        setErrors((prev) => ({ ...prev, [field]: isValid ? '' : errorMessages[field] }));
        return isValid;
    };

    const handleChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (role: 'volunteer' | 'organization') => {
        if (!validate('name') || !validate('password')) return;
        setLoading(true);
        try {
            const loginData = { name: formData.name, password: formData.password };
            let result;
            if (role === 'volunteer') {
                result = await dispatch(loginExistingVolunteers(loginData));
            } else { result = await dispatch(loginExistingOrganization(loginData)); }
            if (result.meta.requestStatus === 'fulfilled') {
                navigate(role === 'volunteer' ? '/volunteer' : '/organization');
            } else {
                alert('Login failed');
                navigate('/signup');
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 6, width: '100%', }} >
            {['name', 'password'].map((field) => (
                <TextField
                    key={field}
                    fullWidth
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    type={field === 'password' ? 'password' : 'text'}
                    variant="outlined"
                    value={formData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    onBlur={() => validate(field as 'name' | 'password')}
                    error={!!errors[field]}
                    helperText={errors[field]}
                    sx={{ marginBottom: 2, '& .MuiInputLabel-root': { color: '#4e9af1' }, }}
                />
            ))}
            <FormControlLabel
                control={
                    <Checkbox
                        checked={formData.rememberMe}
                        onChange={() => handleChange('rememberMe', !formData.rememberMe)}
                        color="primary"
                    />
                }
                label="Remember me"
                sx={{ marginBottom: 3, color: '#4e9af1' }}
            />
            {['volunteer', 'organization'].map((role) => (
                <Button
                    key={role}
                    fullWidth
                    variant={role === 'volunteer' ? 'contained' : 'outlined'}
                    color={role === 'volunteer' ? 'primary' : 'secondary'}
                    onClick={() => handleSubmit(role as 'volunteer' | 'organization')}
                    disabled={loading}
                    sx={{
                        marginBottom: 2,
                        padding: '14px',
                        fontSize: '1.1rem',
                        boxShadow: role === 'volunteer' ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
                        '&:hover': {
                            backgroundColor: role === 'volunteer' ? '#3579f2' : 'transparent',
                            color: role === 'organization' ? '#ff6a00' : 'inherit',
                            borderColor: role === 'organization' ? '#ff6a00' : 'inherit',
                            boxShadow: role === 'volunteer' ? '0 8px 16px rgba(0, 0, 0, 0.3)' : 'none',
                        },
                    }}
                >
                    {loading ? <CircularProgress size={24} /> : `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                </Button>
            ))}
        </Box>
    );
};

export default LoginForm;
