import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupNewVolunteer } from '../../features/volunteerSlice';
import { RootState } from '../../store/store';
import '../../assets/styles/Signup.css';
import { useNavigate } from 'react-router-dom';
import { AnyAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';

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
                ) as AnyAction;

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


    return (<form className="formS">
        <h2>Volunteer Registration</h2>

        <div className="form-group">
            <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Role"
                required
            />
        </div>

        <div className="form-group">
            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
            </select>
        </div>

        <div className="form-group">
            <input
                type="date"
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 10)).toISOString().split('T')[0]}
                onBlur={validateBirth}
                required
            />
            {errors.birth && <div className="error-icon" title={errors.birth}></div>}
        </div>

        <div className="form-group">
            <div className="checkbox-wrapper-21">
                <label>
                    <input
                        type="checkbox"
                        checked={experience}
                        onChange={(e) => setExperience(e.target.checked)}
                    />
                    Previous volunteering experience
                </label>
            </div>
        </div>

        <div className="form-group">
            <label htmlFor="amountVolunteers">Enter the number of volunteers:</label>
            <input
                type="number"
                id="amountVolunteers"
                value={amountVolunteers}
                onChange={(e) => setAmountVolunteers(Number(e.target.value))}
                onBlur={validateAmountVolunteers}
                placeholder="Number of Volunteers"
                required
            />
            {errors.amountVolunteers && <div className="error-icon" title={errors.amountVolunteers}></div>}
        </div>

        <div className="form-group">
            <select value={region} onChange={(e) => setRegion(e.target.value)} onBlur={validateRegion} required>
                <option value="">Select Region</option>
                <option value="NORTH">North</option>
                <option value="SOUTH">South</option>
                <option value="CENTER">Center</option>
                <option value="JERUSALEM">Jerusalem</option>
                <option value="GENERAL">General</option>
            </select>
            {errors.region && <div className="error-icon" title={errors.region}></div>}
        </div>

        <div className="form-group">
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.length === 1 ? e.target.files[0] : null)}
                onBlur={validateImage}
            />
            {errors.image && <div className="error-icon" title={errors.image}></div>}
        </div>


        <div className="button-container">
            <button
                type="button"
                className="button register-button"
                onClick={handleSubmit}
            >
                Register as Volunteer
            </button>
        </div>

    </form >
    );
};

export default SignupV;
