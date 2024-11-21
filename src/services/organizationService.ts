import axios from 'axios';
import { Organization } from "../models/organizations";

axios.defaults.baseURL = 'http://localhost:8080/api/organization';

export const getOrganizations = async (): Promise<Organization[]> => {
    const response = await axios.get('/organization');
    return response.data;
};

export const getOrganizationById = async (id: number): Promise<Organization> => {
    const response = await axios.get(`/organizationById/${id}`);
    return response.data;
};

export const createOrganization = async (organization: Organization): Promise<Organization> => {
    const response = await axios.post('/addOrganizations', organization);
    return response.data;
};

export const updateOrganization = async (id: number, organization: Organization): Promise<Organization> => {
    const response = await axios.put(`/updateOrganizations/${id}`, organization);
    return response.data;
};

export const deleteOrganization = async (organizationId: number): Promise<void> => {
    await axios.delete(`/deleteOrganizations/${organizationId}`);
};

export const loginOrganization = async (organization: Organization): Promise<Organization> => {
    const response = await axios.post('/login', organization);
    return response.data;
};

export const signupOrganizationImage = async (formData: FormData): Promise<Organization> => {
    const response = await axios.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};


