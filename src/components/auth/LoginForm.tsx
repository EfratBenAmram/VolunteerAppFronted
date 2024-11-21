import React, { useState } from 'react';
import '../../assets/styles/Form.css'
import { loginExistingVolunteers } from '../../features/volunteerSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AnyAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { loginExistingOrganization } from '../../features/organizationSlice';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '', });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const validateEmail = () => {
        if (!emailRegex.test(email)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                email: 'Please enter a valid email address.',
            }));
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, email: '' }));
        return true;
    };

    const validatePassword = () => {
        if (!passwordRegex.test(password)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                password: 'Password must be at least 8 characters, with upper, lower, digit, and special char.',
            }));
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, password: '' }));
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
        image:'',
    };
    const organizationData  = {
        organizationId: 0,
        name: '',
        email,
        password,
        phone: '',
        orgGoals: '',
        recommendationPhones: '',
        topicVolunteers: [],
        region: 'CENTER',
    }
    
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const handleSubmit = async (role: 'volunteer' | 'organization') => {
        if (role === 'volunteer') {
            try {
                const result = await dispatch(loginExistingVolunteers({ volunteerData })) as AnyAction;
                if (result.meta.requestStatus === 'fulfilled') {
                    navigate('/volunteer-details');
                } else {
                    console.error('Login failed:', result.payload?.errorMessage || 'Unknown error');
                }
            } catch (error) {
                console.error('Login error:', error);
            }
        }
        if (role === 'organization') {
            try {
                const result = await dispatch(loginExistingOrganization({ organizationData })) as AnyAction;
                if (result.meta.requestStatus === 'fulfilled') {
                    navigate('/organization-details');
                } else {
                    console.error('Login failed:', result.payload?.errorMessage || 'Unknown error');
                }
            } catch (error) {
                console.error('Login error:', error);
            }
        }
    };


    return (
        <form className="form">
            <h2>Login</h2>
            <div className="form-group">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={validateEmail}
                    placeholder="Email"
                    className={errors.email ? 'error' : ''}
                    required
                />
                {errors.email && (
                    <div className="error-icon" title={errors.email}></div>
                )}
            </div>
            <div className="form-group">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={validatePassword}
                    placeholder="Password"
                    className={errors.password ? 'error' : ''}
                    required
                />
                {errors.password && (
                    <div className="error-icon" title={errors.password}></div>
                )}
            </div>
            <div className="remember-me">
                <label>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(prev => !prev)}
                    />
                    <span> Remember me</span>
                </label>
            </div>
            <div className="button-container">
                <button
                    type="button"
                    className="button volunteer"
                    onClick={() => handleSubmit('volunteer')}
                >
                    Login as Volunteer
                </button>
                <button
                    type="button"
                    className="button organization"
                    onClick={() => handleSubmit('organization')}
                >
                    Login as Organization
                </button>
            </div>
        </form>
    );

};

export default LoginForm;
