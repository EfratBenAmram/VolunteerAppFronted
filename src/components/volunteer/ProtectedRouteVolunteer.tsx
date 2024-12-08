import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRouteVolunteer: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isConect } = useSelector((state: RootState) => state.volunteers);

    return isConect ? children : <Navigate to="/" />;
};

export default ProtectedRouteVolunteer;
