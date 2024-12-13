import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Typography, Container, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { logoutOrganization } from "../../redux/organizationSlice";
import imagePath from '../../assets/images/image.jpg';
import { getOrganizationWithImage } from '../../services/organizationService';

const NavbarOrganization: React.FC = () => {
    const { selectedOrganization } = useSelector((state: RootState) => state.organization);
    const dispatch = useDispatch();
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isImageClicked, setIsImageClicked] = useState(false);

    useEffect(() => {
        const fetchImage = async () => {
            if (!selectedOrganization?.organizationId) return;

            if (selectedOrganization.imageOrg) {
                try {
                    const response = await getOrganizationWithImage(selectedOrganization.organizationId);
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
    }, [selectedOrganization?.organizationId]);

    const handleLogout = () => {
        dispatch(logoutOrganization());
        window.location.href = '/';
    };

    const handleImageClick = () => {
        setIsImageClicked(true);
    };

    const handleClosePopup = () => {
        setIsImageClicked(false);
    };

    if (!selectedOrganization) return null;

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Container sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <Button component={Link} to="volunteers-request" color="inherit">
                                organizations-request
                            </Button>
                            <Button component={Link} to="organization-invitation" color="inherit">
                                organization-invitation
                            </Button>
                            <Button component={Link} to="Organization-request" color="inherit">
                                Organization-request
                            </Button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            {imageSrc && (
                                <Box sx={{ position: 'relative' }}>
                                    <img
                                        src={imageSrc}
                                        alt="Organization"
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
                                            <Typography variant="h6">{selectedOrganization.name}</Typography>
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

export default NavbarOrganization;
