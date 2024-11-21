import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import AuthForms from './components/auth/AuthForms';
import SignupV from './components/volunteer/Signup';
import SignupO from './components/organizations/Signup';
import { useDispatch } from 'react-redux';
import { loadVolunteerFromCookie } from './features/volunteerSlice';
import VolunteerDetails from './components/volunteer/VolunteerDetails';
import ProtectedRoute from './components/ProtectedRoute';

// import VolunteerList from './components/volunteerTry/Volunteer1';
// import VolunteerForm from './components/volunteerTry/Volunteer2';
// import VolunteerDetails from './components/volunteerTry/Volunteer3';
// import LoginSignupPopup from './components/volunteer/LoginSignupPopup';

const App: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadVolunteerFromCookie());
    }, [dispatch]);

    return (
        <>
            {/* <LoginSignupPopup />
            <h1>Volunteer Matching Platform</h1>
            <VolunteerList />
            <VolunteerForm />
            <VolunteerDetails /> */}
            <Routes>
                <Route
                    path="/volunteer-details"
                    element={
                        <ProtectedRoute>
                            <VolunteerDetails />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<AuthForms isLogin={true} />} />
                <Route path="/signup" element={<AuthForms isLogin={false} />} />
                <Route path="/signup_volunteer" element={<SignupV />} />
                <Route path="/signup_organization" element={<SignupO />} />
            </Routes>
        </>
    );
};

export default App;
