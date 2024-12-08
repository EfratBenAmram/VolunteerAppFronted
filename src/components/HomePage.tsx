import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const selectedVolunteer = useSelector((state: RootState) => state.volunteers.selectedVolunteer);
    useEffect(() => {
        if (selectedVolunteer) {
            navigate('/volunteer'); 
        }
    }, [selectedVolunteer, navigate]);

    const selectedOrganization = useSelector((state: RootState) => state.organization.selectedOrganization);
      useEffect(() => {
      if (selectedOrganization) {
        navigate('/organization');
      }
    }, [navigate, selectedOrganization]);
  
    return (
        <>
            <div>
                <button onClick={() => navigate('/login')}>Login</button>
                <button onClick={() => navigate('/signup')}>Sign Up</button>
            </div>
        </>
    );
};

export default HomePage;
