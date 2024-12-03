import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import AuthForms from './components/auth/AuthForms';
import SignupV from './components/auth/SignupV';
import SignupO from './components/auth/SignupO';
import VolunteerDetails from './components/volunteer/VolunteerDetails';
import ProtectedRoute from './components/volunteer/ProtectedRoute';
import Navbar from './components/volunteer/Navbar';

// import VolunteerList from './components/volunteerTry/Volunteer1';
// import VolunteerForm from './components/volunteerTry/Volunteer2';
// import VolunteerDetails from './components/volunteerTry/Volunteer3';
// import LoginSignupPopup from './components/volunteer/LoginSignupPopup';

const App: React.FC = () => {


    return (
        <>
            {/* <LoginSignupPopup />
            <h1>Volunteer Matching Platform</h1>
            <VolunteerList />
            <VolunteerForm />
            <VolunteerDetails /> 
            <HostagesTicker/>*/}
            
            <Routes>
                <Route path="/volunteer-details" element={<ProtectedRoute><VolunteerDetails /></ProtectedRoute>} />
                <Route path="/volunteer" element={<ProtectedRoute><Navbar /></ProtectedRoute>} />
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
