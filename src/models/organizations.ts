export interface Organization {
    organizationId: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    orgGoals: string;
    recommendationPhones: string;
    region: string;
}

export interface OrganizationLogin {
    email: string;
    password: string;
}
