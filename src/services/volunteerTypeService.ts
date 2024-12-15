import axios from 'axios';
import { VolunteerType } from "../models/volunteers";

axios.defaults.baseURL = 'http://localhost:8080/api/';
const axiosInstance = axios.create({
    withCredentials: true,
  });
  
export const getVolunteerTypes = async (): Promise<VolunteerType[]> => {
    const response = await axiosInstance.get('volunteerType/volunteerType');
    return response.data;
};

export const getVolunteerTypeById = async (id: number): Promise<VolunteerType> => {
    const response = await axiosInstance.get(`volunteerType/volunteerTypeById/${id}`);
    return response.data;
};

export const createVolunteerType = async (volunteerType: VolunteerType): Promise<VolunteerType> => {
    const response = await axiosInstance.post('volunteerType/addVolunteerTypes', volunteerType);
    return response.data;
};

export const updateVolunteerType = async (id: number, volunteerType: VolunteerType): Promise<VolunteerType> => {
    const response = await axiosInstance.put(`volunteerType/updateVolunteerTypes/${id}`, volunteerType);
    return response.data;
};

export const deleteVolunteerType = async (volunteerTypeId: number): Promise<void> => {
    await axiosInstance.delete(`volunteerType/deleteVolunteerTypes/${volunteerTypeId}`);
};


