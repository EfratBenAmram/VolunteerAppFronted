import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Typography, Container, Box, Paper, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { logoutOrganization, updateExistingOrganization } from "../redux/organizationSlice";
import { logoutVolunteer } from "../redux/volunteerSlice";
import { getOrganizationWithImage, signoutOrganization } from '../services/organizationService';
import { getVolunteerWithImage, signoutVolunteer } from '../services/volunteerService';
import imagePath from '../assets/images/image.jpg';
import { persistor } from '../store/store';

type UserType = 'organization' | 'volunteer';

interface NavbarUserProps {
    userType: UserType;
}

const NavbarUser: React.FC<NavbarUserProps> = ({ userType }) => {
    const { selectedOrganization } = useSelector((state: RootState) => state.organization);
    const { selectedVolunteer } = useSelector((state: RootState) => state.volunteers);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isImageClicked, setIsImageClicked] = useState(false);

    const user = userType === 'organization' ? selectedOrganization : selectedVolunteer;
    const userId = userType === 'organization' ? user?.organizationId : user?.volunteerId;
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const fetchImage = async () => {
            if (!userId) return;

            try {
                const response = userType === 'organization'
                    ? await getOrganizationWithImage(userId)
                    : await getVolunteerWithImage(userId);

                if (response.image) {
                    setImageSrc('data:image/jpeg;base64,' + response.image);
                } else {
                    setImageSrc(imagePath);
                }
            } catch (error) {
                console.error("שגיאה בשליפת התמונה:", error);
                setImageSrc(imagePath);
            }
        };

        fetchImage();
    }, [userId, userType]);

    const handleLogout = () => {
        if (userType === 'organization') {
            dispatch(logoutOrganization());
            signoutOrganization();
        } else {
            dispatch(logoutVolunteer());
            signoutVolunteer();
        }
        persistor.purge();
        window.location.href = '/';
    };

    const handleImageClick = () => {
        setIsImageClicked(true);
    };

    const handleClosePopup = () => {
        setIsImageClicked(false);
    };

    if (!user) return null;

    const navLinks = userType === 'organization'
        ? [
            { to: "volunteers-request", label: "בקשות מתנדבים" },
            { to: "organization-invitation", label: "הזמנות ארגון" },
            { to: "about", label: "אודות" },
            ...(selectedOrganization?.roles?.some(role => role.id === 3)
                ? [{ to: "admin-page", label: "עמוד מנהל" }]
                : []),
        ]
        : [
            { to: "volunteer-details", label: "פרטי מתנדב" },
            { to: "volunteer-invitation", label: "הזמנות התנדבות" },
            { to: "volunteer-request", label: "בקשות התנדבות" },
            { to: "about", label: "אודות" },
        ];

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    background: '#0f1115',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                    padding: '8px 0',
                    margin: 0,
                    width: '100%',
                }}
            >
                <Toolbar>
                    <Container
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        {/* לוגו או מקום ללוגו */}
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: 'Roboto, sans-serif',
                                fontWeight: 400,
                                color: '#00d1b2',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <img
                                src="/src/assets/images/logo.png"
                                alt="Logo"
                                style={{
                                    width: '60px',
                                    height: '50hv',
                                    objectFit: 'cover',
                                    marginRight: '10px',
                                }}
                            />
                            GIVE & RECEIVE
                        </Typography>

                        {/* קישורים */}
                        <Box sx={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                            {navLinks.map((link, index) => (
                                <Button
                                    key={index}
                                    component={Link}
                                    to={link.to}
                                    sx={{
                                        color: '#eaeaea',
                                        fontSize: '1rem',
                                        fontFamily: 'Roboto, sans-serif',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        position: 'relative',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            color: '#00d1b2',
                                        },
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: '-5px',
                                            left: '0',
                                            width: '0%',
                                            height: '2px',
                                            backgroundColor: '#00d1b2',
                                            transition: 'width 0.3s ease',
                                        },
                                        '&:hover::after': {
                                            width: '100%',
                                        },
                                    }}
                                >
                                    {link.label}
                                </Button>
                            ))}

                        </Box>

                        {/* תמונה + לוגאאוט */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            {imageSrc && (
                                <Box sx={{ position: 'relative' }}>
                                    <img
                                        src={imageSrc}
                                        alt={userType === 'organization' ? 'Organization' : 'Volunteer'}
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            borderRadius: "10%",
                                            border: "2px solid #00d1b2",
                                            cursor: "pointer",
                                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                                        }}
                                        onClick={handleImageClick}
                                    />
                                    {isImageClicked && (
                                        <Paper
                                            sx={{
                                                position: 'absolute',
                                                top: '110%',
                                                right: 0,
                                                padding: 2,
                                                backgroundColor: '#1c1e24',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)',
                                                borderRadius: 2,
                                                color: '#eaeaea',
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: '#00d1b2',
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {user.name}
                                            </Typography>
                                            <Divider sx={{ background: '#00d1b2', marginY: 1 }} />
                                            <Button
                                                variant="outlined"
                                                onClick={handleLogout}
                                                sx={{
                                                    color: '#00d1b2',
                                                    borderColor: '#00d1b2',
                                                    fontWeight: 600,
                                                    '&:hover': {
                                                        backgroundColor: '#00d1b2',
                                                        color: '#0f1115',
                                                    },
                                                }}
                                            >
                                                יציאה
                                            </Button>
                                            <Button
                                                sx={{
                                                    mt: 1,
                                                    color: '#aaa',
                                                    fontWeight: 500,
                                                    '&:hover': { color: '#eaeaea' },
                                                }}
                                                onClick={handleClosePopup}
                                            >
                                                סגור
                                            </Button>
                                        </Paper>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Container>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default NavbarUser;