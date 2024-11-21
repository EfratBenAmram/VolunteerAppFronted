import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store' 

const VolunteerDetails: React.FC = () => {
    const navigate = useNavigate();
    const { selectedVolunteer, isConect } = useSelector((state: RootState) => state.volunteers);

    if (!isConect) {
        navigate('/');
        return null;
    }

    return (
        <div>
            <h2>Volunteer Details</h2>
            {selectedVolunteer ? (
                <ul>
                    <li><strong>Name:</strong> {selectedVolunteer.name}</li>
                    <li><strong>Email:</strong> {selectedVolunteer.email}</li>
                    <li><strong>Phone:</strong> {selectedVolunteer.phone}</li>
                    <li><strong>Region:</strong> {selectedVolunteer.region}</li>
                    <li><strong>Experience:</strong> {selectedVolunteer.experience ? 'Yes' : 'No'}</li>
                    <li><strong>Birth:</strong> {selectedVolunteer.birth}</li>
                </ul>
            ) : (
                <p>No details available.</p>
            )}
        </div>
    );
};

export default VolunteerDetails;
