import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface ProtectedRouteProps {
    children: JSX.Element;
    userType: 'organization' | 'volunteer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
    const isConect = useSelector((state: RootState) =>
        userType === 'organization' ? state.organization.isConect : state.volunteers.isConect
    );

    return isConect ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
