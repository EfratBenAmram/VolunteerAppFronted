export interface Organization {
    organizationId: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    orgGoals: string;
    recommendationPhones: string;
    topicVolunteers: string[];
    region: string;
}
