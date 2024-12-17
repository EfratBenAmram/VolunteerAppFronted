import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Avatar,
    Box,
    Grid,
    Chip,
} from '@mui/material';
import { getOrganizationWithImage } from '../../services/organizationService';
import imagePath from '../../assets/images/image.jpg';

const VolunteerDetails: React.FC = () => {
    const selectedVolunteer = useSelector(
        (state: RootState) => state.volunteers.selectedVolunteer
    );

    if (!selectedVolunteer) {
        return (
            <Typography
                variant="h6"
                color="error"
                align="center"
                sx={{ marginTop: 3, fontWeight: 'bold' }}
            >
                לא נבחר מתנדב להצגה
            </Typography>
        );
    }

    const {
        name,
        email,
        phone,
        role,
        city,
        gender,
        birth,
        experience,
        volunteerRequests,
        volunteerReview,
    } = selectedVolunteer;

    const renderHearts = (likes: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Typography
                key={i}
                component="span"
                sx={{
                    color: i < likes ? 'red' : 'lightgray',
                    fontSize: '1.5rem',
                    marginRight: '0.2rem',
                }}
            >
                ❤
            </Typography>
        ));
    };

    const [organizationImages, setOrganizationImages] = useState<{ [key: number]: string }>({});

    const fetchImage = async (organizationId: number) => {
        try {
            const response = await getOrganizationWithImage(organizationId);
            const src = response?.image ? `data:image/jpeg;base64,${response.image}` : imagePath;
            setOrganizationImages((prev: any) => ({
                ...prev,
                [organizationId]: src
            }));
        } catch (error) {
            console.error('שגיאה בשליפת תמונה', error);
            setOrganizationImages((prev: any) => ({
                ...prev,
                [organizationId]: imagePath
            }));
        }
    };

    useEffect(() => {
        volunteerReview?.forEach(review => {
            if (!organizationImages[review.organization.organizationId]) {
                fetchImage(review.organization.organizationId);
            }
        });
    }, [volunteerReview]);

    return (
        <Box
            sx={{
                padding: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 3,
            }}
        >
            {/* כרטיס פרטי המתנדב */}
            <Card
                sx={{
                    width: '100%',
                    maxWidth: 800,
                    boxShadow: 5,
                    background: 'linear-gradient(to bottom, #ffffff, #f1f1f1)',
                    borderRadius: 3,
                }}
            >
                <CardHeader
                    avatar={
                        <Avatar
                            sx={{
                                width: 60,
                                height: 60,
                                backgroundColor: '#6a11cb',
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: 'white',
                            }}
                        >
                            {name[0]}
                        </Avatar>
                    }
                    title={
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            sx={{
                                color: '#333',
                                textShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
                            }}
                        >
                            {name}
                        </Typography>
                    }
                    subheader={
                        <Typography variant="subtitle1" color="text.secondary">
                            {role} | {city}
                        </Typography>
                    }
                />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="body1">
                                <strong>אימייל:</strong> {email}
                            </Typography>
                            <Typography variant="body1">
                                <strong>טלפון:</strong> {phone}
                            </Typography>
                            <Typography variant="body1">
                                <strong>מין:</strong> {gender}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">
                                <strong>תאריך לידה:</strong> {birth}
                            </Typography>
                            <Typography variant="body1">
                                <strong>ניסיון:</strong> {experience ? 'כן' : 'לא'}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* בקשות התנדבות */}
            <Card
                sx={{
                    width: '100%',
                    maxWidth: 800,
                    boxShadow: 4,
                    backgroundColor: '#f3f4f6',
                    borderRadius: 3,
                    padding: 2,
                    marginBottom: 2,
                }}
            >
                <CardHeader
                    title={
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: '#6a11cb' }}>
                                בקשות התנדבות
                            </Typography>
                        </Box>
                    }
                />
                <CardContent>
                    {volunteerRequests && volunteerRequests.length > 0 ? (
                        volunteerRequests.map((request, index) => (
                            <Box key={index} sx={{ padding: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: 2, marginBottom: 2 }}>
                                <Typography variant="body1" align="right">
                                    <strong>בקשה {index + 1}:</strong> {request.comments}
                                </Typography>
                                <Typography variant="body2" align="right">
                                    <strong>זמן פנוי:</strong> {request.availableTime}
                                </Typography>
                                <Typography variant="body2" align="right">
                                    <strong>תאריך:</strong> {new Date(request.localDate).toLocaleDateString()}
                                </Typography>

                                {/* סוגי התנדבות */}
                                <Box sx={{ mt: 1 }}>
                                    {request.volunteerTypes?.map((type) => (
                                        <Chip key={type.name} label={type.name} color="primary" sx={{ marginRight: 1 }} />
                                    ))}
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Typography align="right" variant="body1">
                            אין בקשות התנדבות
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {/* תגובות */}

            <Card
                sx={{
                    width: '100%',
                    maxWidth: 800,
                    boxShadow: 4,
                    backgroundColor: '#e3f2fd',
                    borderRadius: 3,
                    padding: 2,
                    marginBottom: 2,
                }}
            >
                <CardHeader
                    title={
                        <Box sx={{ textAlign: 'center' }}>

                            <Typography variant="h6" fontWeight="bold" sx={{ color: '#1976d2' }}>
                                תגובות
                            </Typography>
                        </Box>
                    }
                />
                <CardContent>
                    {volunteerReview && volunteerReview.length > 0 ? (
                        volunteerReview.map((review) => (
                            <Box
                                key={review.reviewId}
                                sx={{
                                    padding: 2,
                                    borderRadius: 2,
                                    backgroundColor: '#fff',
                                    boxShadow: 3,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                {/* תמונה של הארגון */}
                                <Avatar src={organizationImages[review.organization.organizationId]} sx={{ width: 80, height: 80 }} />
                                {/* מידע נוסף */}
                                <Box sx={{ ml: 2, flexGrow: 1 }}>
                                    <Typography variant="body1">
                                        <strong>ארגון:</strong> {review.organization.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>תגובה:</strong> {review.comment}
                                    </Typography>
                                    {/* כוכבים לדירוג */}
                                    <Box sx={{ mt: 1 }}>{renderHearts(review.likes)}</Box>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Typography align="right" sx={{ color: 'gray' }}>
                            אין תגובות
                        </Typography>
                    )}
                </CardContent>
            </Card>


        </Box>
    );
};

export default VolunteerDetails;
