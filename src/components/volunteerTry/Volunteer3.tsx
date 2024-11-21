import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVolunteerById, updateExistingVolunteer } from '../../features/volunteerSlice';
import { RootState } from "../../store/store";
import { Volunteer } from "../../models/volunteers";

const VolunteerDetails: React.FC = () => {
    const dispatch = useDispatch();
    const volunteer = useSelector((state: RootState) => state.volunteers.selectedVolunteer);
    const error = useSelector((state: RootState) => state.volunteers.error);

    const [id, setId] = useState<number | undefined>();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const handleFetchVolunteer = () => {
        if (id) {
            dispatch(fetchVolunteerById(id));
        };
    }

    useEffect(() => {
        if (volunteer) {
            setName(volunteer.name);
            setEmail(volunteer.email);
        }
    }, [volunteer]);

    const handleUpdateVolunteer = (e: React.FormEvent) => {
        e.preventDefault();
        if (volunteer && id) {
            const updatedVolunteer: Volunteer = { ...volunteer, name, email };
            dispatch(updateExistingVolunteer({ id, volunteer: updatedVolunteer }));
        }
    };

    return (
        <div>
            <h2>Volunteer Details</h2>
            {error && <p>{error}</p>}
            <div>
                <input
                    type="number"
                    placeholder="Enter Volunteer ID"
                    onChange={(e) => setId(Number(e.target.value))}
                />
                <button onClick={handleFetchVolunteer}>Fetch Volunteer</button>
            </div>
            {volunteer && (
                <form onSubmit={handleUpdateVolunteer}>
                    <div>
                        <label>Name:</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <button type="submit">Update Volunteer</button>
                </form>
            )}
        </div>
    );
};

export default VolunteerDetails;
