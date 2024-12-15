import axios from 'axios';
import { Volunteer, UserLogin } from "../models/volunteers";

axios.defaults.baseURL = 'http://localhost:8080/api/';
const axiosInstance = axios.create({
    withCredentials: true,
  });
  
export const getVolunteers = async (): Promise<Volunteer[]> => {
    const response = await axiosInstance.get('volunteer/volunteer');
    return response.data;
};

export const getVolunteerById = async (id: number): Promise<Volunteer> => {
    const response = await axiosInstance.get(`volunteer/volunteerById/${id}`);
    return response.data;
};

export const createVolunteer = async (volunteer: Volunteer): Promise<Volunteer> => {
    const response = await axiosInstance.post('volunteer/addVolunteers', volunteer);
    return response.data;
};

export const updateVolunteer = async (id: number, volunteer: Volunteer): Promise<Volunteer> => {
    const response = await axiosInstance.put(`volunteer/updateVolunteers/${id}`, volunteer);
    return response.data;
};

export const deleteVolunteer = async (volunteerId: number): Promise<void> => {
    await axiosInstance.delete(`volunteer/deleteVolunteers/${volunteerId}`);
};

export const loginVolunteer = async (volunteer: UserLogin): Promise<Volunteer> => {
    const response = await axiosInstance.post('http://localhost:8080/api/volunteer/signin', volunteer);
    return response.data;
};

export const signupVolunteer = async (formData: FormData): Promise<Volunteer> => {
    try {
        const response = await axiosInstance.post('volunteer/signup', formData);
        return response.data;
    } catch (error) {
        console.error('Signup Volunteer Error:', error);
        throw error; 
    }
};


export const signupVolunteerImage = async (formData: FormData): Promise<Volunteer> => {
    const response = await axiosInstance.post('volunteer/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getVolunteerWithImage = async (id: number): Promise<any> => {
    const response = await axiosInstance.get(`volunteer/getDto/${id}`);
    return response.data;
};
