import React, { useEffect, useState } from "react";
import { Volunteer, VolunteerRequests } from "../../models/volunteers";
import { getVolunteerWithImage } from "../../services/volunteerService";
import imagePath from '../../assets/images/image.jpg';

interface VolunteerRequestCardProps {
  volunteer: Volunteer;
  request: VolunteerRequests;
}

const VolunteerRequestCard: React.FC<VolunteerRequestCardProps> = ({
  volunteer,
  request,
}) => {
  const { name, amountVolunteers, region } = volunteer;
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!volunteer?.volunteerId) return;
      if (volunteer.imageVol) {
        try {
          const response = await getVolunteerWithImage(volunteer.volunteerId);
          if (response.image) {
            setImageSrc('data:image/jpeg;base64,' + response.image);
          }
        } catch (error) {
          console.error("שגיאה בשליפת התמונה:", error);
        }
      } else {
        setImageSrc(imagePath);
      }
    };
    fetchImage();
  }, []);

  const getTimeUntilAvailability = () => {
    const availableDate = new Date(request.availableDate).getTime();
    const currentDate = Date.now();
    const difference = availableDate - currentDate;
    const hours = Math.floor(difference / (1000 * 60 * 60));

    return hours > 0 ? `${hours} שעות` : "מיידי";
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        borderRadius: "10px",
        margin: "10px",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
      }}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Volunteer"
          style={{ width: "80px", height: "80px", borderRadius: "50%" }}
        />)}

      < div style={{ marginLeft: "20px" }}>
        <p><strong>שם מתנדב:</strong> {name}</p>
        <p><strong>כמות מתנדבים:</strong> {amountVolunteers}</p>
        <p><strong>זמין בעוד:</strong> {getTimeUntilAvailability()}</p>
        <p><strong>מיקום:</strong> {region}</p>
      </div>
    </div >
  );
};

export default VolunteerRequestCard;
