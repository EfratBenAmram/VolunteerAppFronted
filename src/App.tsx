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
import VolunteerRequestForm from './components/volunteer/VolunteerRequestForm';
import VolunteerInvitationDetails from './components/volunteer/VolunteerInvitationDetails';
import VolunteerRequestsPage from './components/organizations/VolunteerRequestsPage';
import { Box } from '@mui/material';
import OrganizationInvitationDetails from './components/organizations/Invitation/OrganizationInvitationDetails';
import NavbarUser from './components/NavbarUser';
import ProtectedRoute from './components/ProtectedRouteProps';
import RequestDetailsPage from './components/organizations/RequestDetailsPage';
import ThankYou from './components/volunteer/ThankYou';
import AboutPage from './components/AboutPage';
import CheckOrganization from './components/auth/CheckOrganization';
import AdminPage from './components/organizations/AdminPage';

const App: React.FC = () => {
    return (
        <>
            <Provider store={store}>
                <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
                    <Routes>
                        <Route
                            path="/volunteer"
                            element={
                                <ProtectedRoute userType="volunteer">
                                    <Box sx={{ paddingTop: '90px', height: '100vh', width: '100%' }}>
                                        <NavbarUser userType="volunteer" />
                                        <Outlet />
                                    </Box>
                                </ProtectedRoute>
                            }
                        >
                            <Route path="about" element={<AboutPage />} />
                            <Route path="volunteer-details" element={<VolunteerDetails />} />
                            <Route path="volunteer-request" element={<VolunteerRequestForm />} />
                            <Route path="volunteer-invitation" element={<VolunteerInvitationDetails />} />
                            <Route path="finish-request" element={<ThankYou />} />
                        </Route>

                        <Route
                            path="/organization"
                            element={
                                <ProtectedRoute userType="organization">
                                    <Box sx={{ paddingTop: '90px', height: '100vh', width: '100%' }}>
                                        <NavbarUser userType="organization" />
                                        <Outlet />
                                    </Box>
                                </ProtectedRoute>
                            }
                        >
                            <Route path="about" element={<AboutPage />} />
                            <Route path="volunteers-request" element={<VolunteerRequestsPage />} />
                            <Route path="request/:requestId" element={<RequestDetailsPage />} />
                            <Route path="organization-invitation" element={<OrganizationInvitationDetails />} />
                            <Route path="admin-page" element={<AdminPage />} />
                        </Route>

                        <Route path="/" element={<Box sx={{ height: '100vh', width: '100%' }}><HomePage /></Box>} />
                        <Route path="/login" element={<AuthForms isLogin={true} />} />
                        <Route path="/signup" element={<AuthForms isLogin={false} />} />
                        <Route path="/signup_volunteer" element={<SignupV />} />
                        <Route path="/signup_organization" element={<Box sx={{ height: '100vh', width: '100%' }}><SignupO /></Box>} />
                        <Route path="/check_organization" element={<CheckOrganization />} />
                    </Routes>

                </PersistGate>
            </Provider >
        </>
    );
};
export default App