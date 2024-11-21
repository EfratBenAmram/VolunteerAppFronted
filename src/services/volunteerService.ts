import axios from 'axios';
import { Volunteer } from "../models/volunteers";

axios.defaults.baseURL = 'http://localhost:8080/api/volunteer';

export const getVolunteers = async (): Promise<Volunteer[]> => {
    const response = await axios.get('/volunteer');
    return response.data;
};

export const getVolunteerById = async (id: number): Promise<Volunteer> => {
    const response = await axios.get(`/volunteerById/${id}`);
    return response.data;
};

export const createVolunteer = async (volunteer: Volunteer): Promise<Volunteer> => {
    const response = await axios.post('/addVolunteers', volunteer);
    return response.data;
};

export const updateVolunteer = async (id: number, volunteer: Volunteer): Promise<Volunteer> => {
    const response = await axios.put(`/updateVolunteers/${id}`, volunteer);
    return response.data;
};

export const deleteVolunteer = async (volunteerId: number): Promise<void> => {
    await axios.delete(`/deleteVolunteers/${volunteerId}`);
};

export const loginVolunteer = async (volunteer: Volunteer): Promise<Volunteer> => {
    const response = await axios.post('/login', volunteer);
    return response.data;
};


export const signupVolunteerImage = async (formData: FormData): Promise<Volunteer> => {
    const response = await axios.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};


