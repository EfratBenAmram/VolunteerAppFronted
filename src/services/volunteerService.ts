import axios from 'axios';
import { Volunteer, VolunteerLogin } from "../models/volunteers";

axios.defaults.baseURL = 'http://localhost:8080/api/';

export const getVolunteers = async (): Promise<Volunteer[]> => {
    const response = await axios.get('volunteer/volunteer');
    return response.data;
};

export const getVolunteerById = async (id: number): Promise<Volunteer> => {
    const response = await axios.get(`volunteer/volunteerById/${id}`);
    return response.data;
};

export const createVolunteer = async (volunteer: Volunteer): Promise<Volunteer> => {
    const response = await axios.post('volunteer/addVolunteers', volunteer);
    return response.data;
};

export const updateVolunteer = async (id: number, volunteer: Volunteer): Promise<Volunteer> => {
    const response = await axios.put(`volunteer/updateVolunteers/${id}`, volunteer);
    return response.data;
};

export const deleteVolunteer = async (volunteerId: number): Promise<void> => {
    await axios.delete(`volunteer/deleteVolunteers/${volunteerId}`);
};

export const loginVolunteer = async (volunteer: VolunteerLogin): Promise<Volunteer> => {
    const response = await axios.post('volunteer/login', volunteer);
    return response.data;
};


export const signupVolunteerImage = async (formData: FormData): Promise<Volunteer> => {
    const response = await axios.post('volunteer/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getVolunteerWithImage = async (id: number): Promise<any> => {
    const response = await axios.get(`volunteer/getDto/${id}`);
    return response.data;
};
