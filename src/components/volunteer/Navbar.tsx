import React from 'react';
import { AppBar, Toolbar, Button, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { logoutVolunteer } from "../../features/volunteerSlice"; // פונקציית logout שאתה צריך להוסיף ל-slice שלך

const Navbar: React.FC = () => {
    const { isConect, selectedVolunteer } = useSelector((state: RootState) => state.volunteers);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutVolunteer()); 
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Container sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Button component={Link} to="/" color="inherit">
                            Home
                        </Button>
                        <Button component={Link} to="/volunteer" color="inherit">
                            Volunteer
                        </Button>
                        <Button component={Link} to="/organization" color="inherit">
                            Organization
                        </Button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {isConect && selectedVolunteer ? (
                            <>
                                <Typography variant="h6" color="inherit">
                                    Hello, {selectedVolunteer.name}
                                </Typography>
                                <Button color="inherit" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button component={Link} to="/login" color="inherit">
                                Login
                            </Button>
                        )}
                    </div>
                </Container>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
