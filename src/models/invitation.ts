import { Organization } from "./organizations";
import { VolunteerType, Volunteer, VolunteerRequests } from "./volunteers";

export interface VolunteerInvitation {
  invitationId: number;
  volunteer: Volunteer;
  organization: Organization;
  invitationDate: Date;
  responseTime: string | null;
  requestTime: string;
  address: string;
  activityDetails: string;
  requirements: string;
  volunteerType: VolunteerType;
  status: string;
  reviewInd: boolean;
  volunteerRequest: VolunteerRequests;
}