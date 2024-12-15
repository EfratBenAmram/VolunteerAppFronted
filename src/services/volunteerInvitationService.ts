import axios from 'axios';
import { VolunteerInvitation } from '../models/invitation';

axios.defaults.baseURL = 'http://localhost:8080/api/';
const axiosInstance = axios.create({
    withCredentials: true,
  });
  
export const getVolunteerInvitations = async (): Promise<VolunteerInvitation[]> => {
    const response = await axiosInstance.get('volunteerInvitation/volunteerInvitation');
    return response.data;
};

export const getVolunteerInvitationById = async (id: number): Promise<VolunteerInvitation> => {
    const response = await axiosInstance.get(`volunteerInvitation/volunteerInvitationById/${id}`);
    return response.data;
};

export const createVolunteerInvitation = async (volunteerInvitation: VolunteerInvitation): Promise<VolunteerInvitation> => {
    const response = await axiosInstance.post('volunteerInvitation/addVolunteerInvitation', volunteerInvitation);
    return response.data;
};

export const updateVolunteerInvitation = async (id: number, volunteerInvitation: VolunteerInvitation): Promise<VolunteerInvitation> => {
    const response = await axiosInstance.put(`volunteerInvitation/updateVolunteerInvitation/${id}`, volunteerInvitation);
    return response.data;
};

export const deleteVolunteerInvitation = async (volunteerInvitationId: number): Promise<void> => {
    await axiosInstance.delete(`volunteerInvitation/deleteVolunteerInvitations/${volunteerInvitationId}`);
};
