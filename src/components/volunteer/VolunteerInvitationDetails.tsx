import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchVolunteerInvitations, updateExistingVolunteerInvitation } from '../../redux/volunteerInvitationSlice';
import { VolunteerInvitation } from '../../models/invitation';
import { AppDispatch } from '../../store/store';
import { Button, Typography, Card, CardContent, CardActions, Box, Grid, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import MapComponent from './MapComponent';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

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

    const handleStatusChange = async (invitation: VolunteerInvitation, newStatus: string) => {
        const { volunteerRequests, volunteerReview, ...cleanedVolunteer } = selectedVolunteer || {};
        const axiosInstance = axios.create({ withCredentials: true });

        if (newStatus === 'ACCEPTED' || newStatus === 'REJECTED') {
            const emailPayload = {
                email: invitation.organization.email,
                subject: `Volunteer ${selectedVolunteer?.name} ${newStatus === "ACCEPTED" ? 'Accepted' : 'Rejected'} Your Offer`,
                messageBody: `
                    <p><strong>Details of Volunteer Response</strong></p>
                    <p><strong>Status:</strong> ${newStatus}</p>
                    <p><strong>Name:</strong> ${selectedVolunteer?.name}</p>
                    <p><strong>Activity Details:</strong> ${invitation.activityDetails}</p>
                    <p><strong>Location:</strong> ${invitation.address}</p>
                    <p><strong>Organization:</strong> ${invitation.organization.name}</p>
                `,
                logoPath: invitation.organization.imageOrg,
                logoLink: 'http://localhost:5173/organization/organization-invitation'
            };

            await axiosInstance.post('http://localhost:8080/api/sendEmail', emailPayload);
            console.log(`${newStatus} response email successfully sent`);
        }

        if (newStatus === 'ACCEPTED') {
            try {
                await axiosInstance.put(`http://localhost:8080/api/volunteerRequest/updateVolunteerRequest/${invitation.volunteerRequest.requestId}`, {
                    ...invitation.volunteerRequest,
                    invitationInd: true,
                    volunteer: { volunteerId: selectedVolunteer?.volunteerId }
                });

                const invitationDate = new Date(invitation.invitationDate);
                const sendTime = new Date(invitationDate.getTime() - 3 * 60 * 60 * 1000).toISOString();

                const emailPayload = {
                    email: selectedVolunteer?.email,
                    subject: 'Reminder: Volunteer Activity Scheduled for Today',
                    messageBody: `
                        <p><strong>Hi! 🌟
                        Here are the details of your upcoming volunteer activity:</strong></p>
                        <p><strong>Date:</strong> ${invitationDate.toLocaleDateString()}</p>
                        <p><strong>Time:</strong> ${invitationDate.toLocaleTimeString()}</p>
                        <p><strong>Organization:</strong> ${invitation.organization.name}</p>
                        <p><strong>Activity Details:</strong> ${invitation.activityDetails}</p>
                        <p><strong>Location:</strong> ${invitation.address}</p>
                    `,
                    logoPath: invitation.organization.imageOrg,
                    logoLink: 'http://localhost:5173/volunteer/volunteer-invitation',
                    sendTime
                };

                await axiosInstance.post('http://localhost:8080/api/schedule', emailPayload);


                const otherInvitations = volunteerInvitation.filter(
                    (inv) =>
                        inv.volunteerRequest.requestId === invitation.volunteerRequest.requestId &&
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
        return <Typography variant="h6" color="textSecondary">Please select a volunteer to view invitations.</Typography>;
    }

    const matchingInvitations = volunteerInvitation.filter(
        (invitation: VolunteerInvitation) =>
            typeof invitation.volunteer === 'object'
                ? invitation.volunteer.volunteerId === selectedVolunteer.volunteerId
                : invitation.volunteer === selectedVolunteer.volunteerId
    );

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">Error: {error}</Alert>;
    }

    if (!matchingInvitations.length) {
        return <Typography variant="h6" color="textSecondary">No invitations found for this volunteer.</Typography>;
    }

    const groupedInvitations = {
        PENDING: matchingInvitations.filter((inv) => inv.status === 'PENDING'),
        ACCEPTED: matchingInvitations.filter((inv) => inv.status === 'ACCEPTED'),
        COMPLETED: matchingInvitations.filter((inv) => inv.status === 'COMPLETED'),
    };

    return (
        <Box padding={4}>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ textAlign: 'center', color: '#00d1b2', fontWeight: 'bold' }}
            >
                הזמנות להתנדבות
            </Typography>

            <Grid container spacing={4}>
                {Object.entries(groupedInvitations).map(([status, invitations]) => (
                    invitations.length > 0 && (
                        <Grid item xs={12} key={status}>
                            <Typography variant="h6" color="black" gutterBottom sx={{ textAlign: 'center', }}>
                                {status === 'PENDING' && 'הזמינו אותך להתנדב'}
                                {status === 'ACCEPTED' && 'התנדביות שמחכות רק לך'}
                                {status === 'COMPLETED' && '😊התנדבויות שהתנדבת😊'}
                            </Typography>

                            {invitations.map((invitation, index) => (
                                <Card
                                    key={`${status}-${index}`}
                                    variant="outlined"
                                    sx={{ marginBottom: 2, maxWidth: 1000, margin: "auto" }}
                                >
                                    <CardContent>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={8}>
                                                <Typography variant="h6">Organization: {invitation.organization.name}</Typography>
                                                <Typography>Date: {new Date(invitation.invitationDate).toLocaleDateString()}</Typography>
                                                <Typography>Activity Details: {invitation.activityDetails}</Typography>
                                                <Typography>Requirements: {invitation.requirements}</Typography>
                                                <Typography>Address: {invitation.address}</Typography>
                                                <Typography>Status: {invitation.status}</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                                                    {/* טלפון */}
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <PhoneIcon color="primary" sx={{ fontSize: 36 }} />
                                                        <Typography variant="body1">{invitation.organization.phone || 'No Phone'}</Typography>
                                                    </Box>

                                                    {/* אימייל */}
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <a
                                                            href={`mailto:${invitation.organization.email}?subject=Volunteer Invitation&body=Hi,%0ALooking forward to collaborating!`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                                                        >
                                                            <EmailIcon color="secondary" sx={{ fontSize: 36 }} />
                                                            <Typography variant="body1" sx={{ color: 'inherit' }}>
                                                                {invitation.organization.email}
                                                            </Typography>
                                                        </a>

                                                    </Box>
                                                </Box>

                                            </Grid>
                                            <Grid item xs={4}>
                                                <Box sx={{ height: 200, width: "100%" }}>
                                                    <MapComponent address={invitation.address} />
                                                </Box>
                                            </Grid>
                                        </Grid>

                                    </CardContent>
                                    <CardActions>

                                        {status === "PENDING" && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => handleStatusChange(invitation, "ACCEPTED")}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handleStatusChange(invitation, "REJECTED")}
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}

                                        {status === "ACCEPTED" && (
                                            <Button
                                                variant="contained"
                                                color="warning"
                                                onClick={() => handleStatusChange(invitation, "COMPLETED")}
                                            >
                                                Mark as Completed
                                            </Button>
                                        )}
                                    </CardActions>
                                </Card>
                            ))}

                        </Grid>
                    )
                ))}
            </Grid>
        </Box >
    );
};

export default VolunteerInvitationDetails;
