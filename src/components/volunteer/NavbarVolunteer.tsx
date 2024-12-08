import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Typography, Container, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { logoutVolunteer } from "../../features/volunteerSlice";
import { getVolunteerWithImage } from '../../services/volunteerService';

const NavbarVolunteer: React.FC = () => {
    const { selectedVolunteer } = useSelector((state: RootState) => state.volunteers);
    const dispatch = useDispatch();
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isImageClicked, setIsImageClicked] = useState(false);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                if (!selectedVolunteer?.volunteerId) return; 
                const response = await getVolunteerWithImage(selectedVolunteer.volunteerId);
                console.log('Response data:', response);
                if (response.image) {
                    setImageSrc('data:image/jpeg;base64,' + response.image);
                } else {
                    console.error("תמונה לא נמצאה במידע שהתקבל");
                }
            } catch (error) {
                console.error("שגיאה בשליפת התמונה:", error);
            }
        };

        fetchImage();
    }, [selectedVolunteer?.volunteerId]);

    const handleLogout = () => {
        dispatch(logoutVolunteer());
        window.location.href = '/';
    };

    const handleImageClick = () => {
        setIsImageClicked(true);
    };

    const handleClosePopup = () => {
        setIsImageClicked(false);
    };

    if (!selectedVolunteer) return null;

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Container sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <Button component={Link} to="volunteer-invitation" color="inherit">
                                volunteer-invitation
                            </Button>
                            <Button component={Link} to="volunteer-details" color="inherit">
                                volunteer-details
                            </Button>
                            <Button component={Link} to="volunteer-request" color="inherit">
                                Volunteer-request
                            </Button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            {imageSrc && (
                                <Box sx={{ position: 'relative' }}>
                                    <img
                                        src={imageSrc}
                                        alt="Volunteer"
                                        style={{ maxWidth: "20%", borderRadius: "50%", cursor: "pointer" }}
                                        onClick={handleImageClick}
                                    />
                                    {isImageClicked && (
                                        <Paper
                                            sx={{
                                                position: 'absolute',
                                                top: '110%',
                                                right: 0,
                                                padding: 2,
                                                backgroundColor: '#fff',
                                                boxShadow: 3,
                                                borderRadius: 2
                                            }}
                                        >
                                            <Typography variant="h6">{selectedVolunteer.name}</Typography>
                                            <Button
                                                variant="outlined"
                                                onClick={handleLogout}
                                                sx={{ marginTop: 1 }}
                                            >
                                                Logout
                                            </Button>
                                            <Button
                                                sx={{ mt: 1 }}
                                                onClick={handleClosePopup}
                                            >
                                                close
                                            </Button>
                                        </Paper>
                                    )}
                                </Box>
                            )}
                        </div>
                    </Container>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default NavbarVolunteer;
