import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Volunteer, VolunteerRequests } from "../../models/volunteers";

const VolunteerRequestDetailsPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const volunteers: Volunteer[] = useSelector((state: RootState) => state.volunteers.volunteers);

  const requestDetails = volunteers
    .flatMap((vol) =>
      vol.volunteerRequests.filter(
        (req: VolunteerRequests) => req.requestId === Number(requestId)
      )
    )[0];

  if (!requestDetails) return <p>לא נמצאה הבקשה.</p>;

  const { comments, availableDate, positionX, positionY, volunteer } = requestDetails;
//get volunteer by id................................................................
  return (
    <div>
      <h2>פרטי בקשה</h2>
      <p><strong>תאריך זמינות:</strong> {new Date(availableDate).toLocaleDateString()}</p>
      <p><strong>מיקום:</strong> {`X: ${positionX}, Y: ${positionY}`}</p>
      <p><strong>הערות:</strong></p>
      {comments && comments.length > 0 ? comments : "לא קיימות תגובות"}
    </div>
  );
};

export default VolunteerRequestDetailsPage;
