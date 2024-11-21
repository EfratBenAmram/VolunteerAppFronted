import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../store/store";
import { fetchVolunteers, deleteExistingVolunteer } from '../../features/volunteerSlice';

const VolunteerList: React.FC = () => {
    const dispatch = useDispatch();
    const { volunteers, error } = useSelector((state: RootState) => state.volunteers);

    useEffect(() => {
        dispatch(fetchVolunteers());
    }, [dispatch]);


    const handleDelete = (volunteerId: number) => {
        dispatch(deleteExistingVolunteer(volunteerId));
    };

    return (
        <div>
            <h2>Volunteer List</h2>
            {error && <p>{error}</p>}
            <ul>
                {volunteers.map((volunteer: { volunteerId: number; name: string }) => (
                    <li key={volunteer.volunteerId}>
                        {volunteer.name}
                        <button onClick={() => handleDelete(volunteer.volunteerId)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VolunteerList;
