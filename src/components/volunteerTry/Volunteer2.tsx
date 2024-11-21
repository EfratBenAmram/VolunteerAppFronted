import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createNewVolunteer, updateExistingVolunteer } from '../../features/volunteerSlice';
import { Volunteer } from "../../models/volunteers";

const VolunteerForm: React.FC<{ existingVolunteer?: Volunteer }> = ({ existingVolunteer }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState(existingVolunteer?.name || '');
    const [email, setEmail] = useState(existingVolunteer?.email || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const volunteer: Volunteer = { id: existingVolunteer?.id || 0, name, email, username: existingVolunteer?.username || '' };
        if (existingVolunteer) {
            dispatch(updateExistingVolunteer({ id: existingVolunteer.id!, volunteer }));
        } else {
            dispatch(createNewVolunteer(volunteer));
        }

        setName('');
        setEmail('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <label>Email:</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit">{existingVolunteer ? 'Update Volunteer' : 'Add Volunteer'}</button>
        </form>
    );
};

export default VolunteerForm;
