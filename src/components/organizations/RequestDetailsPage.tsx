import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Button } from "@mui/material";
import VolunteerInvitationForm from "./VolunteerInvitationForm";
import { VolunteerInvitation } from "../../models/invitation";
import { AppDispatch } from '../../store/store';
import { useDispatch } from 'react-redux';
import { createNewVolunteerInvitation, fetchVolunteerInvitations } from "../../redux/volunteerInvitationSlice";
import axios from "axios";
import { fetchVolunteers } from "../../redux/volunteerSlice";

const RequestDetailsPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const volunteers = useSelector((state: RootState) => state.volunteers.volunteers);
  const selectedVolunteer = volunteers.find((volunteer) =>
    volunteer.volunteerRequests.some((request) => request.requestId === Number(requestId))
  );
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (invitation: Omit<VolunteerInvitation, "invitationId">) => {
    if (!requestDetails?.invitationInd) {
      try {
        dispatch(createNewVolunteerInvitation({...invitation, volunteerRequest: requestDetails}))
        await axios.put(`http://localhost:8080/api/volunteerRequest/updateVolunteerRequest/${requestDetails?.requestId}`, { ...requestDetails, invitationInd: true, volunteer: {volunteerId: selectedVolunteer?.volunteerId} })
        dispatch(fetchVolunteers());
        dispatch(fetchVolunteerInvitations);
        handleClose();
      } catch (error) {
        console.error("Error sending invitation:", error);
        alert("שגיאה בשליחת ההזמנה");
      }
    } else {
      alert("The request is already taken");
    }
  };

  if (!selectedVolunteer) {
    return <p>לא נמצאה בקשה עם המידע המבוקש.</p>;
  }

  const requestDetails = selectedVolunteer.volunteerRequests.find(
    (request) => request.requestId === Number(requestId)
  );

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>פרטי בקשה</h2>
      {requestDetails && (
        <>
          <p><strong>תאריך:</strong> {new Date(requestDetails.availableDate).toLocaleDateString()}</p>
          <p><strong>שעה:</strong> {requestDetails.availableTime}</p>
          <p><strong>סוגי התנדבות:</strong> {requestDetails.volunteerTypes?.map(type => type.name).join(", ") || "לא זמין"}</p>
          <p><strong>הערות:</strong> {requestDetails.comments}</p>
          <p><strong>מיקום:</strong> ({requestDetails.positionX}, {requestDetails.positionY})</p>
        </>
      )}

      <h2>פרטי מתנדב</h2>
      <p><strong>שם:</strong> {selectedVolunteer.name}</p>
      <p><strong>מייל:</strong> {selectedVolunteer.email}</p>
      <p><strong>טלפון:</strong> {selectedVolunteer.phone}</p>
      <p><strong>גיל:</strong> {new Date().getFullYear() - new Date(selectedVolunteer.birth).getFullYear()}</p>

      <h2>ביקורות על המתנדב</h2>
      {selectedVolunteer.volunteerReview.length > 0 ? (
        selectedVolunteer.volunteerReview.map((review) => (
          <div key={review.reviewId} style={{ marginTop: "10px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
            <p><strong>ארגון:</strong> {review.organization.name}</p>
            <p><strong>הערות:</strong> {review.comment}</p>
            <div>
              <strong>לייקים:</strong>{" "}
              {Array.from({ length: review.likes }).map((_, index) => (
                <span key={index} style={{ color: "red" }}>❤️</span>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>אין ביקורות על מתנדב זה.</p>
      )}
      <div>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          אני מעוניין להזמין
        </Button>

        <VolunteerInvitationForm
          open={open}
          onClose={handleClose}
          onSubmit={handleSubmit}
          volunteerId={selectedVolunteer?.volunteerId}
        />
      </div>

    </div>
  );
};

export default RequestDetailsPage;
