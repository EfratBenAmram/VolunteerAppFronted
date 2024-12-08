import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRouteOrganization: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isConect } = useSelector((state: RootState) => state.organization);
    return isConect ? children : <Navigate to="/" />;
};

export default ProtectedRouteOrganization;
