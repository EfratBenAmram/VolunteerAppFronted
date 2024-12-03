import { Organization } from "./organizations";

export interface VolunteerLogin {
  email: string;
  password: string;
}

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
  volunteerRequests: VolunteerRequests[];
  volunteerReview: VolunteerReview[];
}

export interface VolunteerRequests {
  requestId: number;
  volunteer: Volunteer;
  comments: string;
  localDate: Date;
  availableTime: Date;
  volunteerRequestTypes: string;
  volunteerTypes: VolunteerType[];
}

export interface VolunteerReview {
  reviewId: number;
  organization: Organization;
  volunteer: Volunteer;
  comment: String;
  likes: number;
}

export interface VolunteerType {
  volunteerTypeId: number;
  name: string;
  minAge: number;
  maxAge: number;
  topicVolume: string;
}