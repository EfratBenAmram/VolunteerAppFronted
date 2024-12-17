import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import { VolunteerInvitation } from '../../../models/invitation';

interface ReviewDialogProps {
  open: boolean;
  invitation: VolunteerInvitation;
  onClose: () => void;
}
const ReviewDialog: React.FC<ReviewDialogProps> = ({ open, invitation, onClose }) => {
  const [reviewText, setReviewText] = useState('');
  const [hearts, setHearts] = useState(0);

  const axiosInstance = axios.create({
    withCredentials: true,
  });

  const handleHeartClick = (index: number) => {
    setHearts(index + 1);
  };

  const handleSubmitReview = async () => {
    const payload = {
      reviewId: 0,
      organization: { organizationId: invitation.organization.organizationId },
      volunteer: { volunteerId: invitation.volunteer.volunteerId },
      comment: reviewText,
      likes: hearts,
    };

    try {
      await axiosInstance.post(
        'http://localhost:8080/api/volunteerReview/addVolunteerReview',
        payload
      );
      await axiosInstance.put(
        `http://localhost:8080/api/volunteerInvitation/updateVolunteerInvitation/${invitation.invitationId}`,
        { ...invitation, reviewInd: true, volunteer: invitation.volunteer }
      );
    } catch (error) {
      console.error('Error submitting review:', error);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Write a Review</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Your Review"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '10px',
          }}
        >
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
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmitReview} color="primary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ReviewDialog