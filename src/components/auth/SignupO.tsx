import React, { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress, Grid, Card, CardContent, InputAdornment } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { Helmet } from 'react-helmet';

const theme = createTheme({
    palette: { primary: { main: '#4CAF50' }, secondary: { main: '#FF4081' } },
});

const SignupO: React.FC = () => {
    const [purpose, setPurpose] = useState('');
    const [referencePhones, setReferencePhones] = useState(['', '', '']);
    const [recommendationLetters, setRecommendationLetters] = useState([null, null, null]);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>, index: number, value: any) => {
        setter((prev: any) => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setTimeout(() => { setIsLoading(false); alert('Organization registration successful!'); }, 2000);
    };

    return (
        <>
            <Helmet>
                <title>Organization Registration</title>
                <meta name="description" content="Register your organization to participate in volunteering activities." />
            </Helmet>
            <ThemeProvider theme={theme}>
                <Box sx={{ backgroundColor: '#e8f5e9', width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 3 }}>
                    <Card sx={{ width: '100%', maxWidth: 600, borderRadius: 3, boxShadow: 10, padding: 3, backgroundColor: '#fff', '@media (max-width: 1000px)': { width: '90%' } }}>
                        <CardContent>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', color: '#4CAF50', marginBottom: 3 }}>
                                Organization Registration
                            </Typography>
                            <form>
                                <TextField label="Organization Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} fullWidth required multiline rows={4} sx={fieldStyle} />
                                <Typography sx={{ width: '100%', textAlign: 'center', color: '#4CAF50', marginBottom: 2 }}>
                                    Please provide 3 reference phone numbers for your organization.
                                </Typography>
                                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                                    {referencePhones.map((phone, index) => (
                                        <Grid item xs={12} sm={6} key={index}>
                                            <TextField
                                                label={`Reference Phone ${index + 1}`}
                                                value={phone}
                                                onChange={(e) => handleInputChange(setReferencePhones, index, e.target.value)}
                                                fullWidth required type="tel"
                                                inputProps={{ pattern: "^0[2-9]\\d{7}$" }}
                                                InputProps={{ startAdornment: <InputAdornment position="start">📞</InputAdornment> }}
                                                sx={fieldStyle}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>

                                <Typography sx={{ width: '100%', textAlign: 'center', color: '#4CAF50', marginBottom: 2 }}>
                                    Please upload 3 recommendation letters in PDF format.
                                </Typography>
                                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                                    {recommendationLetters.map((_, index) => (
                                        <Grid item xs={12} sm={6} key={index}>
                                            <label htmlFor={`file-upload-${index}`}>
                                                <Box
                                                    component="span"
                                                    sx={fileFieldStyle}
                                                >
                                                    <CloudUploadIcon sx={{ marginRight: 1 }} />
                                                    {recommendationLetters[index] ? recommendationLetters[index].name : 'choose file pdf'}
                                                </Box>
                                            </label>
                                            <input
                                                id={`file-upload-${index}`}
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => handleInputChange(setRecommendationLetters, index, e.target.files ? e.target.files[0] : null)}
                                                hidden
                                                style={fileInputStyle}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>


                                <Box sx={{ textAlign: 'center', marginTop: 3 }}>
                                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isLoading} sx={buttonStyle}>
                                        {isLoading ? <CircularProgress size={24} color="secondary" /> : 'Register Organization'}
                                    </Button>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                </Box>
            </ThemeProvider>
        </>
    );
};

const fieldStyle = { marginBottom: 2, backgroundColor: '#fff', borderRadius: 2, '& .MuiOutlinedInput-root': { borderColor: '#4CAF50' }, '&:hover .MuiOutlinedInput-root': { borderColor: '#FF4081' }, transition: 'all 0.3s ease' };
const fileFieldStyle = {
    marginBottom: 2,
    backgroundColor: '#fff',
    borderRadius: 2,
    '& .MuiOutlinedInput-root': {
        borderColor: '#4CAF50',
    },
    '&:hover .MuiOutlinedInput-root': {
        borderColor: '#FF4081',
    },
    transition: 'all 0.3s ease',
    padding: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    height: '56px',  // Adjusted to match height of text fields
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    '&:hover': {
        backgroundColor: '#e8f5e9',
    },
};

const fileInputStyle = {
    display: 'none',
};

const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '12px 24px',
    fontWeight: 'bold',
    textTransform: 'none',
    borderRadius: 4,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    '&:hover': {
        backgroundColor: '#388E3C',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    },
    transition: 'all 0.3s ease',
};

export default SignupO;
