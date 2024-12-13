import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchVolunteerInvitations } from '../../redux/volunteerInvitationSlice';
import { VolunteerInvitation } from '../../models/invitation';
import { AppDispatch } from '../../store/store';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';

const OrganizationInvitationDetails: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const selectedOrganization = useSelector(
        (state: RootState) => state.organization.selectedOrganization
    );
    const { volunteerInvitation, loading, error, status } = useSelector(
        (state: RootState) => state.volunteerInvitations
    );  
    const [hearts, setHearts] = useState(0);
    const [openReviewDialog, setOpenReviewDialog] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [currentInvitation, setCurrentInvitation] = useState<VolunteerInvitation | null>(null);
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
                        if (typeof inv.volunteer === "number") {
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
            const response = await axios.get(`http://localhost:8080/api/volunteer/volunteerById/${volunteerId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching volunteer details:", error);
        }
    };

    const handleOpenReviewDialog = (invitation: VolunteerInvitation) => {
        setCurrentInvitation(invitation);
        setHearts(0);
        setReviewText('');
        setOpenReviewDialog(true);
    };

    const handleHeartClick = (index: number) => {
        setHearts(index + 1);
    };

    const handleCloseReviewDialog = () => {
        setOpenReviewDialog(false);
        setReviewText('');
    };

    const handleSubmitReview = async () => {
        if (currentInvitation && selectedOrganization) {
            const payload = {
                reviewId: 0,
                organization: { organizationId: selectedOrganization.organizationId },
                volunteer: { volunteerId:  currentInvitation.volunteer.volunteerId },
                comment: reviewText,
                likes: hearts,
            };
            try {
                await axios.post('http://localhost:8080/api/volunteerReview/addVolunteerReview', payload);
                await axios.put(`http://localhost:8080/api/volunteerInvitation/updateVolunteerInvitation/${currentInvitation.invitationId}`, {...currentInvitation, reviewInd: true, volunteer: currentInvitation.volunteer})
            } catch (error) {
                console.error('Error submitting review:', error);
            }
        }

        handleCloseReviewDialog();
    };

    
    if (!selectedOrganization) {
        return <p>Please select an organization to view invitations.</p>;
    }

    const matchingInvitations = volunteerInvitation.filter(
        (invitation: VolunteerInvitation) =>
            typeof invitation.organization === 'object'
                ? invitation.organization.organizationId === selectedOrganization.organizationId
                : invitation.organization === selectedOrganization.organizationId
    );

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!matchingInvitations.length) {
        return <p>No invitation found for this organization.</p>;
    }

    const groupedInvitations = {
        PENDING: updatedInvitations.filter((inv) => inv.status === 'PENDING'),
        ACCEPTED: updatedInvitations.filter((inv) => inv.status === 'ACCEPTED'),
        COMPLETED: updatedInvitations.filter((inv) => inv.status === 'COMPLETED'),
    };
    
    return (
        <div className="invitation-details">
            <h2>Organization Invitations</h2>

            {Object.entries(groupedInvitations).map(([status, invitations]) => (
                invitations.length > 0 && (
                    <div key={status} className="status-group">
                        <h3>
                            {status === 'PENDING' && 'Pending Invitations'}
                            {status === 'ACCEPTED' && 'Accepted Invitations'}
                            {status === 'COMPLETED' && 'Completed Invitations'}
                        </h3>
                        {invitations.map((invitation, index) => (
                            <div key={`${invitation.invitationId}-${index}`} className="invitation-card">
                            <p>Volunteer: {invitation.volunteer.name}</p>
                                <p>Date: {new Date(invitation.invitationDate).toLocaleDateString()}</p>
                                <p>Activity Details: {invitation.activityDetails}</p>
                                <p>Requirements: {invitation.requirements}</p>
                                <p>Address: {invitation.address}</p>
                                <p>Status: {invitation.status}</p>

                                {status === 'COMPLETED' &&  !invitation.reviewInd && (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleOpenReviewDialog(invitation)}
                                    >
                                        Write a Review
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                )
            ))}

            <Dialog open={openReviewDialog} onClose={handleCloseReviewDialog}>
                <DialogTitle>Write a Review</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="review"
                        label="Your Review"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        {[...Array(5)].map((_, index) => (
                            <FavoriteIcon
                                key={index}
                                onClick={() => handleHeartClick(index)}
                                style={{
                                    cursor: 'pointer',
                                    color: index < hearts ? 'red' : 'gray',
                                    fontSize: '30px',
                                }}
                            />
                        ))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReviewDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmitReview} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

};

export default OrganizationInvitationDetails;
