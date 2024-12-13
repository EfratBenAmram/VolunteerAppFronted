import { Organization } from "./organizations";

export interface UserLogin {
  name: string;
  password: string;
}
export interface VolunteerSignup {
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
}
export interface Volunteer {
  volunteerId: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  gender: string;
  birth: string;
  experience: boolean;
  amountVolunteers: number;
  region: string;
  imageVol: string | undefined;
  volunteerRequests: VolunteerRequests[];
  volunteerReview: VolunteerReview[];
}

export interface VolunteerRequests {
  requestId: number;
  volunteer: Volunteer;
  comments: string;
  localDate: Date;
  availableTime: string;
  availableDate: Date;
  volunteerTypes?: VolunteerType[] | undefined;
  positionX: number;
  positionY: number;
  invitationInd: false;
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
}