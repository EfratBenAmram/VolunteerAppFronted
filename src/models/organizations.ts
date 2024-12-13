export interface OrganizationSignup {
    name: string;
    email: string;
    phone: string;
    password: string;
    orgGoals: string;
    region: string;
}

export interface OrganizationMailSignup {
    recommendationPhones: string[];
    recommendationPdf: string[];
}

export interface OrganizationLogin {
    name: string;
    password: string;
}

export interface Organization {
    organizationId: number;
    name: string;
    email: string;
    phone: string;
    orgGoals: string;
    region: string;
    imageOrg: string;
}