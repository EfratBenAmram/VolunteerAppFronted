import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchVolunteerInvitations, updateExistingVolunteerInvitation } from '../../redux/volunteerInvitationSlice';
import { VolunteerInvitation } from '../../models/invitation';
import { AppDispatch } from '../../store/store';
import { Button } from '@mui/material';
import axios from 'axios';

const VolunteerInvitationDetails: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const selectedVolunteer = useSelector((state: RootState) => state.volunteers.selectedVolunteer);

    const { volunteerInvitation, loading, error, status } = useSelector(
        (state: RootState) => state.volunteerInvitations
    );

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchVolunteerInvitations());
        }
    }, [dispatch, status]);

    // const handleStatusChange = async (invitation: VolunteerInvitation, newStatus: string) => {
    //     const { volunteerRequests, volunteerReview, ...cleanedVolunteer } = selectedVolunteer || {};
    //     if (newStatus === 'REJECTED') {
    //         const requestDetails = (await axios.get(`http://localhost:8080/api/volunteerRequest/volunteerRequestById/${invitation.volunteerRequest}`)).data;
    //         await axios.put(`http://localhost:8080/api/volunteerRequest/updateVolunteerRequest/${invitation.volunteerRequest}`, { ...requestDetails, invitationInd: false, volunteer: { volunteerId: selectedVolunteer?.volunteerId } })
    //     }
    //     dispatch(updateExistingVolunteerInvitation({
    //         id: invitation.invitationId,
    //         volunteerInvitation: {
    //             ...invitation,
    //             status: newStatus,
    //             volunteer: cleanedVolunteer,
    //         },
    //     }));
    // };

    const handleStatusChange = async (invitation: VolunteerInvitation, newStatus: string) => {
        const { volunteerRequests, volunteerReview, ...cleanedVolunteer } = selectedVolunteer || {};
    
        if (newStatus === 'ACCEPTED') {
            try {
                // מקבל את פרטי הבקשה
                const requestDetails = (await axios.get(`http://localhost:8080/api/volunteerRequest/volunteerRequestById/${invitation.volunteerRequest}`)).data;
    
                // מעדכן את ה-API של בקשה זו
                await axios.put(`http://localhost:8080/api/volunteerRequest/updateVolunteerRequest/${invitation.volunteerRequest}`, {
                    ...requestDetails,
                    invitationInd: true,
                    volunteer: { volunteerId: selectedVolunteer?.volunteerId }
                });
    
                // מוצא הזמנות נוספות עם אותו volunteerRequest ומשנה את הסטטוס שלהן ל-REJECTED
                const otherInvitations = volunteerInvitation.filter(
                    (inv) =>
                        inv.volunteerRequest === invitation.volunteerRequest &&
                        inv.invitationId !== invitation.invitationId
                );
    
                for (const otherInvitation of otherInvitations) {
                    dispatch(updateExistingVolunteerInvitation({
                        id: otherInvitation.invitationId,
                        volunteerInvitation: {
                            ...otherInvitation,
                            status: 'REJECTED',
                            volunteer: cleanedVolunteer,
                        },
                    }));
                }
    
            } catch (error) {
                console.error("Failed to handle ACCEPTED status change:", error);
            }
        }
    
        // מעדכן את Redux עם הסטטוס החדש
        dispatch(updateExistingVolunteerInvitation({
            id: invitation.invitationId,
            volunteerInvitation: {
                ...invitation,
                status: newStatus,
                volunteer: cleanedVolunteer,
            },
        }));
    };
    

    useEffect(() => {
        const today = new Date();
        volunteerInvitation.forEach((invitation: VolunteerInvitation) => {
            const invitationDate = new Date(invitation.invitationDate);

            if (invitationDate < today && invitation.status === 'ACCEPTED') {
                const { volunteerRequests, volunteerReview, ...cleanedVolunteer } = selectedVolunteer || {};
                dispatch(updateExistingVolunteerInvitation({
                    id: invitation.invitationId,
                    volunteerInvitation: { ...invitation, status: 'COMPLETED', volunteer: cleanedVolunteer },
                }));
            }
            else if (invitationDate < today && invitation.status === 'PENDING') {
                const { volunteerRequests, volunteerReview, ...cleanedVolunteer } = selectedVolunteer || {};
                dispatch(updateExistingVolunteerInvitation({
                    id: invitation.invitationId,
                    volunteerInvitation: { ...invitation, status: 'REJECTED', volunteer: cleanedVolunteer },
                }));
            }
        });
    }, [volunteerInvitation, dispatch]);

    if (!selectedVolunteer) {
        return <p>Please select a volunteer to view invitations.</p>;
    }

    const matchingInvitations = volunteerInvitation.filter(
        (invitation: VolunteerInvitation) =>
            typeof invitation.volunteer === 'object'
                ? invitation.volunteer.volunteerId === selectedVolunteer.volunteerId
                : invitation.volunteer === selectedVolunteer.volunteerId
    );

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!matchingInvitations.length) {
        return <p>No invitation found for this volunteer.</p>;
    }

    const groupedInvitations = {
        PENDING: matchingInvitations.filter((inv) => inv.status === 'PENDING'),
        ACCEPTED: matchingInvitations.filter((inv) => inv.status === 'ACCEPTED'),
        // REJECTED: matchingInvitations.filter((inv) => inv.status === 'REJECTED'),
        COMPLETED: matchingInvitations.filter((inv) => inv.status === 'COMPLETED'),
    };

    return (
        <div className="invitation-details">
            <h2>Volunteer Invitations</h2>

            {Object.entries(groupedInvitations).map(([status, invitations]) => (
                invitations.length > 0 && (
                    <div key={status} className="status-group">
                        <h3>
                            {status === 'PENDING' && 'הזמינו אותך להתנדב'}
                            {status === 'ACCEPTED' && 'התנדביות שמחכות רק לך'}
                            {status === 'REJECTED' && 'התנדבויות שדחית☹️'}
                            {status === 'COMPLETED' && 'התנדבויות שהתנדבת😊'}
                        </h3>
                        {invitations.map((invitation, index) => (
                            <div key={`${status}-${index}`} className="invitation-card">
                                <p>Organization: {invitation.organization.name}</p>
                                <p>Date: {new Date(invitation.invitationDate).toLocaleDateString()}</p>
                                <p>Activity Details: {invitation.activityDetails}</p>
                                <p>Requirements: {invitation.requirements}</p>
                                <p>Address: {invitation.address}</p>
                                <p>Status: {invitation.status}</p>

                                {/* כפתורים לפי הסטטוס */}
                                {status === 'PENDING' && (
                                    <>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => handleStatusChange(invitation, 'ACCEPTED')}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleStatusChange(invitation, 'REJECTED')}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}

                                {status === 'ACCEPTED' && (
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={() => handleStatusChange(invitation, 'COMPLETED')}
                                    >
                                        Mark as Completed
                                    </Button>
                                )}
                            </div>
                        ))}

                    </div>
                )
            ))}
        </div>
    );
};

export default VolunteerInvitationDetails;
