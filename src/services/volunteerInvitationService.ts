import axios from 'axios';
import { VolunteerInvitation } from '../models/invitation';

axios.defaults.baseURL = 'http://localhost:8080/api/';

export const getVolunteerInvitations = async (): Promise<VolunteerInvitation[]> => {
    const response = await axios.get('volunteerInvitation/volunteerInvitation');
    return response.data;
};

export const getVolunteerInvitationById = async (id: number): Promise<VolunteerInvitation> => {
    const response = await axios.get(`volunteerInvitation/volunteerInvitationById/${id}`);
    return response.data;
};

export const createVolunteerInvitation = async (volunteerInvitation: VolunteerInvitation): Promise<VolunteerInvitation> => {
    const response = await axios.post('volunteerInvitation/addVolunteerInvitation', volunteerInvitation);
    return response.data;
};

export const updateVolunteerInvitation = async (id: number, volunteerInvitation: VolunteerInvitation): Promise<VolunteerInvitation> => {
    const response = await axios.put(`volunteerInvitation/updateVolunteerInvitation/${id}`, volunteerInvitation);
    return response.data;
};

export const deleteVolunteerInvitation = async (volunteerInvitationId: number): Promise<void> => {
    await axios.delete(`volunteerInvitation/deleteVolunteerInvitations/${volunteerInvitationId}`);
};
