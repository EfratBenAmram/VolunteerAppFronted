import { Box, Typography, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { RootState, AppDispatch } from '../../store/store';
import { conectOrganization } from '../../redux/organizationSlice';

const CheckOrganization = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { isConect } = useSelector((state: RootState) => state.organization);
    const { connect } = useSelector((state: RootState) => state.organization.selectedOrganization);
    
    useEffect(() => {
        if (connect) {  
            dispatch(conectOrganization());
            navigate('/organization');
        }
    }, [connect, navigate, dispatch]);

    if (isConect) {
        return null;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #ffeb3d, #ffe082)',
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    padding: 6,
                    textAlign: 'center',
                    maxWidth: 400,
                    width: '90%',
                    backgroundColor: '#fff',
                    borderRadius: 4,
                }}
            >
                <Typography variant="h6" sx={{ mt: 2, color: '#555' }}>
                    Your request has been successfully sent
                    waiting for our check
                </Typography>
            </Paper>
        </Box>
    );
};

export default CheckOrganization;