import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import '../../assets/styles/Form.css'
import { saveVolunteerData } from '../../features/volunteerSlice'
import { saveOrganizationData } from '../../features/organizationSlice'
import { AppDispatch } from '../../store/store';

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

    const navigate = useNavigate(); 
    const dispatch = useDispatch<AppDispatch>();

    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const phoneRegex = /^(0[2-9]{1}[0-9]{1}[ -]?[0-9]{3}[ -]?[0-9]{4})$/;

    const validateUsername = () => {
        if (!usernameRegex.test(username)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                username: 'Username must be 3-16 characters, alphanumeric or underscores only.'
            }));
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, username: '' }));
        return true;
    };

    const validateEmail = () => {
        if (!emailRegex.test(email)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                email: 'Please enter a valid email address.'
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
                password: 'Password must be at least 8 characters, with upper, lower, digit, and special char.'
            }));
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, password: '' }));
        return true;
    };

    const validateConfirmPassword = () => {
        if (password !== confirmPassword) {
            setErrors(prevErrors => ({
                ...prevErrors,
                confirmPassword: 'Passwords do not match.'
            }));
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, confirmPassword: '' }));
        return true;
    };

    const validatePhone = () => {
        if (!phoneRegex.test(phone)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                phone: 'Use 10 digits (e.g., 0501234567) or +972 format (e.g., +972501234567). No dots or dashes.'
            }));
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, phone: '' }));
        return true;
    };

    const volunteerData = {
        volunteerId: 0,
        name: username,
        email,
        password,
        phone,
        role: '',
        gender: '',
        birth: '',
        experience: false,
        amountVolunteers: 0,
        region: 'NORTH',
        organizationId: 0,
    };
    const organizationData  = {
        organizationId: 0,
        name: username,
        email,
        password,
        phone,
        orgGoals: '',
        recommendationPhones: '',
        topicVolunteers: '',
        region: 'CENTER',
    }
    const handleSubmit = (role: 'volunteer' | 'organization') => {
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isPhoneValid = validatePhone();
        if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isPhoneValid) {
            if (role === 'volunteer') {
                dispatch(saveVolunteerData(volunteerData));
                navigate('/signup_volunteer');
            }
            else {
                dispatch(saveOrganizationData(organizationData));
                navigate('/signup_organization');
            }
        }
    };

    return (
        <form className="form">
            <h2>Sign Up</h2>
            <div className="form-group">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={validateUsername}
                    placeholder="Username"
                    className={errors.username ? 'error' : ''}
                    required
                />
                {errors.username && (
                    <div className="error-icon" title={errors.username}></div>
                )}
            </div>
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
            <div className="form-group">
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={validateConfirmPassword}
                    placeholder="Confirm Password"
                    className={errors.confirmPassword ? 'error' : ''}
                    required
                />
                {errors.confirmPassword && (
                    <div className="error-icon" title={errors.confirmPassword}></div>
                )}
            </div>
            <div className="form-group">
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={validatePhone}
                    placeholder="Phone Number"
                    className={errors.phone ? 'error' : ''}
                    required
                />
                {errors.phone && (
                    <div className="error-icon" title={errors.phone}></div>
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
                    Sign Up as Volunteer
                </button>
                <button
                    type="button"
                    className="button organization"
                    onClick={() => handleSubmit('organization')}
                >
                    Sign Up as Organization
                </button>
            </div>
        </form>
    );
};

export default SignupForm;
