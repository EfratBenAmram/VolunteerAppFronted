import { Organization } from "./organizations";

export interface Volunteer {
  volunteerId: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  gender: string;
  birth: string;
  experience: boolean;
  amountVolunteers: number;
  region: string;
  volunteerReuest: VolunteerRequest;
  volunteerReview: VolunteerReview;
}

export interface VolunteerRequest {
    requestId: number;
    volunteer: Volunteer;
    comments: string;
    localDate: Date;
    availableTime: Date;
    volunteerRequestTypes: string;
}

export interface VolunteerReview {
  requestId: number;
  organization: Organization;
  volunteer: Volunteer;
  comment: String;
  likes: number;
}