import React, { useEffect, useState } from "react";
import { Volunteer, VolunteerRequests } from "../../models/volunteers";
import { getVolunteerWithImage } from "../../services/volunteerService";
import imagePath from '../../assets/images/image.jpg';
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";

interface VolunteerRequestCardProps {
  volunteer: Volunteer;
  request: VolunteerRequests;
}

const VolunteerRequestCard: React.FC<VolunteerRequestCardProps> = ({
  volunteer,
  request,
}) => {
  const { name, amountVolunteers, city } = volunteer;
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
    <Card sx={{ display: 'flex', marginBottom: 2, boxShadow: 3 }}>
      {imageSrc && (
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          image={imageSrc}
          alt="Volunteer"
        />
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h6">
            שם מתנדב: {name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            כמות מתנדבים: {amountVolunteers}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            זמין בעוד: {getTimeUntilAvailability()}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            מיקום: {city}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default VolunteerRequestCard;