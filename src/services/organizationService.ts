import axios from 'axios';
import { Organization, OrganizationLogin } from "../models/organizations";

axios.defaults.baseURL = 'http://localhost:8080/api/';

export const getOrganizations = async (): Promise<Organization[]> => {
    const response = await axios.get('organization/organization');
    return response.data;
};

export const getOrganizationById = async (id: number): Promise<Organization> => {
    const response = await axios.get(`organization/organizationById/${id}`);
    return response.data;
};

export const createOrganization = async (organization: Organization): Promise<Organization> => {
    const response = await axios.post('organization/addOrganizations', organization);
    return response.data;
};

export const updateOrganization = async (id: number, organization: Organization): Promise<Organization> => {
    const response = await axios.put(`organization/updateOrganizations/${id}`, organization);
    return response.data;
};

export const deleteOrganization = async (organizationId: number): Promise<void> => {
    await axios.delete(`organization/deleteOrganizations/${organizationId}`);
};

export const loginOrganization = async (organization: OrganizationLogin): Promise<Organization> => {
    const response = await axios.post('organization/login', organization);
    return response.data;
};

export const signupOrganizationImage = async (formData: FormData): Promise<Organization> => {
    const response = await axios.post('organization/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getOrganizationWithImage = async (id: number): Promise<any> => {
    const response = await axios.get(`organization/getDto/${id}`);
    return response.data;
};
