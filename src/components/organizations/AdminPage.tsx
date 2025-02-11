import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { Card, CardContent, CardMedia, Typography, Box, Grid, Button } from '@mui/material';
import { fetchOrganization, updateExistingOrganization } from '../../redux/organizationSlice';
import axios from 'axios';
const AdminPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { organizations, selectedOrganization } = useSelector((state: RootState) => state.organization);
    const pendingOrganizations = organizations.filter(org => !org.connect);

    useEffect(() => {
        dispatch(fetchOrganization());
    }, [dispatch]);

    const handleApprove = async (organizationId: number) => {
        const organization = organizations.find(org => org.organizationId === organizationId);
        if (organization) {
            dispatch(updateExistingOrganization({
                id: organizationId,
                organization: { ...organization, connect: true },
            }));
        }
        const axiosInstance = axios.create({ withCredentials: true });

        const emailPayload = {
            email: "efrat.benamram1@gmail.com",
            subject: "נכנסת לאירגון!!!!",
            messageBody: `
                  <div>
                    <p>בקשתך אושרה בהצלחה</p>
                `,
            logoPath: selectedOrganization?.imageOrg,
            logoLink: "http://localhost:5173/login/",
        };

        await axiosInstance.post('http://localhost:8080/api/sendEmail', emailPayload);
        dispatch(fetchOrganization());
    };


    if (pendingOrganizations.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#f4f4f4',
                }}
            >
                <Typography variant="h5" sx={{ color: '#555' }}>
                    אין ארגונים ממתינים.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                padding: 4,
                backgroundColor: '#f9f9f9',
                minHeight: '100vh',
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    marginBottom: 4,
                    textAlign: 'center',
                    fontWeight: 600,
                    color: '#333',
                }}
            >
                ארגונים ממתינים לאישור
            </Typography>
            <Grid container spacing={4}>
                {pendingOrganizations.map((organization) => (
                    <Grid item xs={12} sm={6} md={4} key={organization.organizationId}>
                        <Card
                            sx={{
                                maxWidth: 345,
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {organization.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>אימייל:</strong> {organization.email}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>טלפון:</strong> {organization.phone}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>מטרות הארגון:</strong> {organization.orgGoals}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>אזור:</strong> {organization.region}
                                </Typography>
                                <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleApprove(organization.organizationId)}
                                    >
                                        אישור ארגון זה
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AdminPage;
