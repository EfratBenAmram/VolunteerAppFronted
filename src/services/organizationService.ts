import axios from 'axios';
import { Organization, OrganizationLogin } from "../models/organizations";

axios.defaults.baseURL = 'http://localhost:8080/api/';
const axiosInstance = axios.create({
    withCredentials: true,
  });
  
export const getOrganizations = async (): Promise<Organization[]> => {
    const response = await axiosInstance.get('organization/organization');
    return response.data;
};

export const getOrganizationById = async (id: number): Promise<Organization> => {
    const response = await axiosInstance.get(`organization/organizationById/${id}`);
    return response.data;
};

export const createOrganization = async (organization: Organization): Promise<Organization> => {
    const response = await axiosInstance.post('organization/addOrganizations', organization);
    return response.data;
};

export const updateOrganization = async (id: number, organization: Organization): Promise<Organization> => {
    const response = await axiosInstance.put(`organization/updateOrganizations/${id}`, organization);
    return response.data;
};

export const deleteOrganization = async (organizationId: number): Promise<void> => {
    await axiosInstance.delete(`organization/deleteOrganizations/${organizationId}`);
};

export const loginOrganization = async (organization: OrganizationLogin): Promise<Organization> => {
    const response = await axiosInstance.post('organization/signin', organization);
    return response.data;
};

export const signupOrganizationImage = async (formData: FormData): Promise<Organization> => {
    const response = await axiosInstance.post('organization/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getOrganizationWithImage = async (id: number): Promise<any> => {
    const response = await axiosInstance.get(`organization/getDto/${id}`);
    return response.data;
};

export const signupOrganization = async (formData: FormData): Promise<Organization> => {
    const response = await axiosInstance.post('organization/signup', formData);
    return response.data;
};

export const uploadFiles = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('file', file);
    });

    try {
        const response = await axiosInstance.post('http://localhost:8080/api/uploadFiles', formData);
        return response.data.filePaths;
    } catch (error) {
        console.error('File upload error:', error);
        throw error;
    }
};
