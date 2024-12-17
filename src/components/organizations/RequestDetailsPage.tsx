import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { Button, Typography, Box, Paper, Grid, Divider, Snackbar, Alert, CircularProgress } from "@mui/material";
import VolunteerInvitationForm from "./VolunteerInvitationForm";
import { VolunteerInvitation } from "../../models/invitation";
import { createNewVolunteerInvitation, fetchVolunteerInvitations } from "../../redux/volunteerInvitationSlice";
import { fetchVolunteers } from "../../redux/volunteerSlice";
import axios from "axios";

const RequestDetailsPage: React.FC = () => {
  const selectedOrganization = useSelector(
    (state: RootState) => state.organization.selectedOrganization
  );
  const { requestId } = useParams<{ requestId: string }>();
  const volunteers = useSelector((state: RootState) => state.volunteers.volunteers);
  const selectedVolunteer = volunteers.find((volunteer) =>
    volunteer.volunteerRequests.some((request) => request.requestId === Number(requestId))
  );
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async (invitation: Omit<VolunteerInvitation, "invitationId">) => {
    if (!requestDetails?.invitationInd) {
      try {
        await dispatch(
          createNewVolunteerInvitation({
            ...invitation,
            volunteerRequest: {
              ...requestDetails,
              volunteer: {
                volunteerId: requestDetails.volunteer,
              },
            },
          })
        ).unwrap();

        const axiosInstance = axios.create({ withCredentials: true });

        const emailPayload = {
          email: "efrat.benamram1@gmail.com",
          subject: "You have received a volunteering invitation",
          messageBody: `
          <div>
            <p>Hello ${selectedVolunteer?.name},</p>
            <p>You have received a new volunteering invitation for the following details:</p>
            <ul>
              <li><strong>Date:</strong> ${new Date(requestDetails.availableDate).toLocaleDateString()}</li>
              <li><strong>Time:</strong> ${requestDetails.availableTime}</li>
              <li><strong>Volunteer Types:</strong> ${requestDetails.volunteerTypes?.map((type) => type.name).join(", ") || "Unavailable"}</li>
              <li><strong>Comments:</strong> ${requestDetails.comments || "No comments"}</li>
            </ul>
          </div>
        `,
          logoPath: selectedOrganization?.imageOrg,
          logoLink: "http://localhost:5173/volunteer/volunteer-invitation",
          sendTime: new Date().toISOString(),
        };

        await axiosInstance.post('http://localhost:8080/api/sendEmail', emailPayload);

        dispatch(fetchVolunteers());
        dispatch(fetchVolunteerInvitations());

        handleClose();
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error sending invitation:", error);
        alert("Error sending the invitation.");
      }
    } else {
      alert("This request is already taken.");
    }
  };

  if (!selectedVolunteer) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        No request found with the given information.
      </Typography>
    );
  }

  const requestDetails = selectedVolunteer.volunteerRequests.find(
    (request) => request.requestId === Number(requestId)
  );

  const updateDateWithTime = (date: string, availableTime: string): string => {
    const updatedDate = new Date(date);
    if (availableTime === "MORNING") {
      updatedDate.setHours(11, 0, 0);
    } else if (availableTime === "AFTERNOON") {
      updatedDate.setHours(16, 0, 0);
    } else if (availableTime === "EVENING") {
      updatedDate.setHours(19, 0, 0);
    } else {
      updatedDate.setHours(0, 0, 0);
    }
    return updatedDate.toISOString().slice(0, 16);
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <Paper elevation={4} sx={{ padding: 4, borderRadius: 3, backgroundColor: "#f9f9f9" }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ color: "#1565c0" }}>
          Request Details
        </Typography>
        <Divider sx={{ marginBottom: 3 }} />
        {requestDetails && (
          <Grid container spacing={2} sx={{ marginBottom: 4 }}>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Date:</strong> {new Date(requestDetails.availableDate).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Time:</strong> {requestDetails.availableTime}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Volunteer Types:</strong>{" "}
                {requestDetails.volunteerTypes?.map((type) => type.name).join(", ") || "Unavailable"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Comments:</strong> {requestDetails.comments || "No comments"}
              </Typography>
            </Grid>
          </Grid>
        )}

        <Typography variant="h5" gutterBottom align="center" sx={{ color: "#1565c0" }}>
          Volunteer Details
        </Typography>
        <Divider sx={{ marginBottom: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Name:</strong> {selectedVolunteer.name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Email:</strong> {selectedVolunteer.email}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Phone:</strong> {selectedVolunteer.phone}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Age:</strong>{" "}
              {new Date().getFullYear() - new Date(selectedVolunteer.birth).getFullYear()}
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom align="center" sx={{ marginTop: 4, color: "#1565c0" }}>
          Volunteer Reviews
        </Typography>
        <Divider sx={{ marginBottom: 3 }} />
        {selectedVolunteer.volunteerReview.length > 0 ? (
          selectedVolunteer.volunteerReview.map((review) => (
            <Paper key={review.reviewId} elevation={2} sx={{ marginBottom: 3, padding: 2 }}>
              <Typography variant="body1">
                <strong>Organization:</strong> {review.organization.name}
              </Typography>
              <Typography variant="body1">
                <strong>Comments:</strong> {review.comment}
              </Typography>
              <Box>
                <strong>Likes:</strong>{" "}
                {Array.from({ length: review.likes }).map((_, index) => (
                  <span key={index} style={{ color: "red" }}>❤️</span>
                ))}
              </Box>
            </Paper>
          ))
        ) : (
          <Typography>No reviews for this volunteer.</Typography>
        )}

        <VolunteerInvitationForm
          open={open}
          onClose={handleClose}
          onSubmit={handleSubmit}
          volunteerId={selectedVolunteer?.volunteerId}
          defaultDate={updateDateWithTime(requestDetails?.availableDate, requestDetails?.availableTime)}
          defaultVolunteerType={requestDetails?.volunteerTypes?.[0]?.volunteerTypeId || 0}
        />
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          Your invitation has been successfully sent. Additional details will be sent via email.
        </Alert>
      </Snackbar>
      
    </Box>
  );
};

export default RequestDetailsPage;
