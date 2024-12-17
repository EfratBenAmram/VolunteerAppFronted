import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import { fetchVolunteerInvitations } from '../../../redux/volunteerInvitationSlice';
import { VolunteerInvitation } from '../../../models/invitation';
import { AppDispatch } from '../../../store/store';
import { Typography, Box, Grid, ToggleButton, ToggleButtonGroup, CircularProgress, Alert, Paper, Button } from '@mui/material';
import axios from 'axios';
import InvitationCard from './InvitationCard';

const OrganizationInvitationDetails: React.FC = () => {
    const axiosInstance = axios.create({ withCredentials: true });
    const dispatch = useDispatch<AppDispatch>();
    const selectedOrganization = useSelector(
        (state: RootState) => state.organization.selectedOrganization
    );
    const { volunteerInvitation, loading, error, status } = useSelector(
        (state: RootState) => state.volunteerInvitations
    );

    const [viewMode, setViewMode] = useState<'STATUS' | 'ALPHABETICAL'>('STATUS');
    const [updatedInvitations, setUpdatedInvitations] = useState<VolunteerInvitation[]>([]);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchVolunteerInvitations());
        }
    }, [dispatch, status]);

    useEffect(() => {
        const fetchVolunteerDetailsForInvitations = async () => {
            if (matchingInvitations.length > 0) {
                const updatedInvitations = await Promise.all(
                    matchingInvitations.map(async (inv) => {
                        if (typeof inv.volunteer === 'number') {
                            try {
                                const data = await fetchVolunteerDetails(inv.volunteer);
                                return { ...inv, volunteer: data };
                            } catch (error) {
                                console.error("Error fetching volunteer details:", error);
                                return inv;
                            }
                        }
                        return inv;
                    })
                );
                setUpdatedInvitations(updatedInvitations);
            }
        };

        fetchVolunteerDetailsForInvitations();
    }, [volunteerInvitation]);

    const fetchVolunteerDetails = async (volunteerId: number) => {
        try {
            const response = await axiosInstance.get(`http://localhost:8080/api/volunteer/volunteerById/${volunteerId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching volunteer details:", error);
        }
    };

    const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newViewMode: 'STATUS' | 'ALPHABETICAL') => {
        if (newViewMode !== null) {
            setViewMode(newViewMode);
        }
    };

    if (!selectedOrganization) {
        return <Typography>Please select an organization to view invitations.</Typography>;
    }

    const matchingInvitations = volunteerInvitation.filter(
        (invitation: VolunteerInvitation) =>
            typeof invitation.organization === 'object'
                ? invitation.organization.organizationId === selectedOrganization.organizationId
                : invitation.organization === selectedOrganization.organizationId
    );

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>Error: {error}</Typography>;
    }

    if (!matchingInvitations.length) {
        return <Typography>No invitation found for this organization.</Typography>;
    }

    const groupedInvitations = {
        PENDING: updatedInvitations.filter((inv) => inv.status === 'PENDING'),
        ACCEPTED: updatedInvitations.filter((inv) => inv.status === 'ACCEPTED'),
        COMPLETED: updatedInvitations.filter((inv) => inv.status === 'COMPLETED'),
        REJECTED: updatedInvitations.filter((inv) => inv.status === 'REJECTED'),
    };

    const alphabeticalInvitations = [...updatedInvitations].sort((a, b) => {
        const nameA = a.volunteer.name.toLowerCase();
        const nameB = b.volunteer.name.toLowerCase();
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    });

    const alphabeticalGroups = alphabeticalInvitations.reduce((groups: Record<string, VolunteerInvitation[]>, inv) => {
        const firstLetter = inv.volunteer.name[0].toUpperCase();
        if (!groups[firstLetter]) groups[firstLetter] = [];
        groups[firstLetter].push(inv);
        return groups;
    }, {});

    return (
        <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
                הזמנות מתנדבים
            </Typography>

            <Paper sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2, padding: 1, backgroundColor: '#f5f5f5', borderRadius: 1, boxShadow: 3 }}>
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={handleViewModeChange}
                    aria-label="view mode"
                    sx={{ backgroundColor: '#ffffff', borderRadius: 1, boxShadow: 1 }}
                >
                    <ToggleButton value="STATUS" aria-label="status" sx={{ textTransform: 'none', padding: '10px 20px' }}>
                        לפי סטטוס
                    </ToggleButton>
                    <ToggleButton value="ALPHABETICAL" aria-label="alphabetical" sx={{ textTransform: 'none', padding: '10px 20px' }}>
                        לפי אלפבית
                    </ToggleButton>
                </ToggleButtonGroup>
            </Paper>

            {viewMode === 'STATUS' ? (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2, gap: 1 }}>
                        {Object.keys(groupedInvitations).map((status) => (
                            <Button
                                key={status}
                                onClick={() =>
                                    document.getElementById(`status-${status}`)?.scrollIntoView({ behavior: 'smooth' })
                                }
                                variant="outlined"
                            >
                                {status}
                            </Button>
                        ))}
                    </Box>
                    {Object.entries(groupedInvitations).map(([status, invitations]) => (
                        invitations.length > 0 && (
                            <Box key={status} id={`status-${status}`} sx={{ marginBottom: 4 }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: 2 }}>
                                    {status === 'PENDING' && 'Pending Invitations'}
                                    {status === 'ACCEPTED' && 'Accepted Invitations'}
                                    {status === 'COMPLETED' && 'Completed Invitations'}
                                    {status === 'REJECTED' && 'Rejected Invitations'}
                                </Typography>

                                <Grid container spacing={2}>
                                    {invitations.map((invitation) => (
                                        <Grid item xs={12} sm={3} md={3.6} key={invitation.invitationId}>
                                            <InvitationCard invitation={invitation} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )
                    ))}
                </>
            ) : (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2, gap: 1 }}>
                        {Object.keys(alphabeticalGroups).map((letter) => (
                            <Button
                                key={letter}
                                onClick={() =>
                                    document.getElementById(`alpha-${letter}`)?.scrollIntoView({ behavior: 'smooth' })
                                }
                                variant="outlined"
                            >
                                {letter}
                            </Button>
                        ))}
                    </Box>
                    {Object.entries(alphabeticalGroups).map(([letter, invitations]) => (
                        <Box key={letter} id={`alpha-${letter}`} sx={{ marginBottom: 4 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: 2 }}>
                                {letter}
                            </Typography>

                            <Grid container spacing={2}>
                                {invitations.map((invitation) => (
                                    <Grid item xs={12} sm={6} md={4} key={invitation.invitationId}>
                                        <InvitationCard invitation={invitation} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    ))}
                </>
            )}
        </Box>
    );
};

export default OrganizationInvitationDetails;