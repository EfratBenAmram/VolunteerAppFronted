import React, { useState } from 'react';
import { VolunteerInvitation } from '../../../models/invitation';
import { Card, CardContent, Typography, CardActions, Button, Box, Chip } from '@mui/material';
import ReviewDialog from './ReviewDialog';

interface InvitationCardProps {
  invitation: VolunteerInvitation;
}

const InvitationCard: React.FC<InvitationCardProps> = ({ invitation }) => {
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [currentInvitation, setCurrentInvitation] = useState<VolunteerInvitation | null>(null);

  const handleOpenReviewDialog = (invitation: VolunteerInvitation) => {
    setCurrentInvitation(invitation);
    setOpenReviewDialog(true);
  };
  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ margin: 2, padding: 2, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 3 }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h5" color="primary" gutterBottom>
          Volunteer: {invitation.volunteer.name}
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Date: {new Date(invitation.invitationDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Activity: {invitation.activityDetails}
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Requirements: {invitation.requirements}
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Address: {invitation.address}
        </Typography>
        <Box mt={2}>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Status:
          </Typography>
          <Chip
            label={invitation.status}
            color={getStatusColor(invitation.status)}
            sx={{ fontWeight: 'bold', fontSize: '1rem' }}
          />
        </Box>
      </CardContent>

      {invitation.status === 'COMPLETED' && !invitation.reviewInd && (
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenReviewDialog(invitation)}
            fullWidth
            sx={{ fontSize: '1rem' }}
          >
            כתוב ביקורת
          </Button>
        </CardActions>
      )}
      {currentInvitation && (
        <ReviewDialog
          open={openReviewDialog}
          invitation={currentInvitation}
          onClose={handleCloseReviewDialog}
        />
      )}
    </Card>
  );
};

export default InvitationCard;