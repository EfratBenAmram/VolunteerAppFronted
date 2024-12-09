import { Organization } from "./organizations";
import { VolunteerType, Volunteer } from "./volunteers";

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
}