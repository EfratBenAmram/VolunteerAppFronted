import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import HomePage from './components/HomePage';
import AuthForms from './components/auth/AuthForms';
import SignupV from './components/auth/SignupV';
import SignupO from './components/auth/SignupO';
import VolunteerDetails from './components/volunteer/VolunteerDetails';
import ProtectedRouteVolunteer from './components/volunteer/ProtectedRouteVolunteer';
import ProtectedRouteOrganization from './components/organizations/ProrectedRouteOrganizatio';
import NavbarVolunteer from './components/volunteer/NavbarVolunteer';
import VolunteerRequestForm from './components/volunteer/VolunteerRequestForm';
import VolunteerInvitationDetails from './components/volunteer/VolunteerInvitationDetails';
import NavbarOrganization from './components/organizations/NavbarOrganization';
import VolunteerRequestsPage from './components/organizations/VolunteerRequestsPage';
import VolunteerRequestDetailsPage from './components/organizations/VolunteerRequestDetailsPage';
import { Box } from '@mui/material';

// import VolunteerList from './components/volunteerTry/Volunteer1';
// import VolunteerForm from './components/volunteerTry/Volunteer2';
// import VolunteerDetails from './components/volunteerTry/Volunteer3';
// import LoginSignupPopup from './components/volunteer/LoginSignupPopup';

const App: React.FC = () => {
    return (
        <>
            <Provider store={store}>
                <PersistGate loading={<div>Loading...</div>} persistor={persistor}>

                    {/* <LoginSignupPopup />
            <h1>Volunteer Matching Platform</h1>
            <VolunteerList />
            <VolunteerForm />
            <VolunteerDetails /> 
            <HostagesTicker/>*/}

                    <Routes>
                        <Route path="/volunteer" element={<ProtectedRouteVolunteer><Box sx={{ height: '100vh', width: '100%' }}><NavbarVolunteer /><Outlet /></Box></ProtectedRouteVolunteer>} >
                            <Route path="volunteer-details" element={<VolunteerDetails />} />
                            <Route path="volunteer-request" element={<VolunteerRequestForm />} />
                            <Route path="volunteer-invitation" element={<VolunteerInvitationDetails />} />
                        </Route>
                        
                        <Route path="/organization" element={<ProtectedRouteOrganization><Box sx={{ height: '100vh', width: '100%' }}><NavbarOrganization /><Outlet /></Box></ProtectedRouteOrganization>} >
                            <Route path="volunteers-request" element={<VolunteerRequestsPage />} />
                            <Route path="request/:requestId" element={<VolunteerRequestDetailsPage />} />
                         </Route>

                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<AuthForms isLogin={true} />} />
                        <Route path="/signup" element={<AuthForms isLogin={false} />} />
                        <Route path="/signup_volunteer" element={<SignupV />} />
                        <Route path="/signup_organization" element={<SignupO />} />
                    </Routes>
                </PersistGate>
            </Provider >
        </>
    );
};

export default App;


