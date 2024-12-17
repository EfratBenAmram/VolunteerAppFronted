import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Card, CardContent, CardMedia, Typography, Box, Grid } from '@mui/material';

const AdminPage: React.FC = () => {
    const { waitings } = useSelector((state: RootState) => state.organization);

    if (!waitings || waitings.length === 0) {
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
                {waitings.map((organization) => (
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
                            <CardMedia
                                component="img"
                                height="140"
                                image={organization.imageOrg || '/path/to/default-image.jpg'}
                                alt={organization.name}
                            />
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
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

};

export default AdminPage;
