import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupNewOrganization } from '../../features/organizationSlice';
import { RootState, AppDispatch } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, CircularProgress, Grid, Card, CardContent, InputAdornment, FormControl, MenuItem, Select, InputLabel, FormHelperText } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { Helmet } from 'react-helmet';

const theme = createTheme({
    palette: { primary: { main: '#4CAF50' }, secondary: { main: '#FF4081' } },
});

const SignupO: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const selectedOrganization = useSelector((state: RootState) => state.organization.selectedOrganization);

    const [formData, setFormData] = useState({
        orgGoals: '',
        referencePhones: ['', '', ''],
        // recommendationLetters: [null, null, null],
        image: null, 
        region: '',
    });
    
    const [errors, setErrors] = useState({
        orgGoals: '',
        referencePhones: ['', '', ''],
        recommendationLetters: ['', '', ''],
        image: '',
        region: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: string, index: number, value: any) => {
        setFormData(prev => {
            const updated = { ...prev };
            if (field === 'referencePhones') updated[field][index] = value;
            else if (field === 'recommendationLetters') {
                updated[field] = updated[field] || [];
                updated[field][index] = value;
            } else updated[field] = value;
            return updated;
        });
    };

    const validateField = (field: string, value: any, index: number = -1) => {
        let error = '';
        if (field === 'orgGoals' && !value.trim()) error = 'Purpose is required.';
        else if (field === 'referencePhones') {
            if (!value.trim()) error = 'Phone number is required.';
            else if (!/^0[2-9]\d{8}$/.test(value)) error = 'Invalid phone number format.';
        } else if (field === 'recommendationLetters' && !value) error = 'File is required.';
        else if (field === 'image' && value && !['image/jpeg', 'image/png'].includes(value.type)) error = 'Only JPEG and PNG files are allowed.';
        setErrors(prev => {
            const updated = { ...prev };
            if (index !== -1) updated[field][index] = error;
            else updated[field] = error;
            return updated;
        });
        return !error;
    };

    const handleSubmit = async () => {
        const valid = Object.keys(formData).every(field => {
            if (Array.isArray(formData[field])) {
                return formData[field].every((value, index) => validateField(field, value, index));
            } else {
                return validateField(field, formData[field]);
            }
        });

        if (!valid) return;

        setIsLoading(true);
        try {
            const organizationData = { ...formData, name: selectedOrganization?.name, email: selectedOrganization?.email, password: selectedOrganization?.password, phone: selectedOrganization?.phone };
            const result = await dispatch(signupNewOrganization({ organizationData, image: formData.image }));
            if (result.meta.requestStatus === 'fulfilled') navigate('/organization');
        } catch (error) {
            console.error('Signup error:', error);
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <>
            <Helmet>
                <title>Organization Registration</title>
                <meta name="description" content="Register your organization to participate in volunteering activities." />
            </Helmet>
            <ThemeProvider theme={theme}>
                <Box sx={{ backgroundColor: '#e8f5e9', width: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 3 }}>
                    <Card sx={{ width: '100%', maxWidth: 600, borderRadius: 3, boxShadow: 10, padding: 3, backgroundColor: '#fff' }}>
                        <CardContent>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', color: '#4CAF50', marginBottom: 3 }}>
                                Organization Registration
                            </Typography>
                            <form>
                                <TextField
                                    label="Organization Purpose"
                                    value={formData.orgGoals}
                                    onChange={(e) => handleInputChange('orgGoals', -1, e.target.value)}
                                    onBlur={() => validateField('orgGoals', formData.orgGoals)}
                                    fullWidth required multiline rows={4}
                                    error={!!errors.orgGoals} helperText={errors.orgGoals}
                                    sx={fieldStyle}
                                />
                                 <FormControl fullWidth sx={fieldStyle}>
                            <InputLabel>Region</InputLabel>
                            <Select name="region" value={formData.region} onChange={(e) => handleInputChange('region', -1, e.target.value)} error={!!errors.region}>
                                <MenuItem value="">Select Region</MenuItem>
                                <MenuItem value="NORTH">North</MenuItem>
                                <MenuItem value="SOUTH">South</MenuItem>
                                <MenuItem value="CENTER">Center</MenuItem>
                                <MenuItem value="JERUSALEM">Jerusalem</MenuItem>
                                <MenuItem value="GENERAL">General</MenuItem>
                            </Select>
                            <FormHelperText>{errors.region}</FormHelperText>
                        </FormControl>
                                <Typography sx={{ width: '100%', textAlign: 'center', color: '#4CAF50', marginBottom: 2 }}>
                                    Please provide 3 reference phone numbers for your organization.
                                </Typography>
                                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                                    {formData.referencePhones.map((phone, index) => (
                                        <Grid item xs={12} sm={6} key={index}>
                                            <TextField
                                                label={`Reference Phone ${index + 1}`}
                                                value={phone}
                                                onChange={(e) => handleInputChange('referencePhones', index, e.target.value)}
                                                onBlur={() => validateField('referencePhones', phone, index)}
                                                fullWidth required type="tel"
                                                inputProps={{ pattern: "^0[2-9]\\d{8}$" }}
                                                InputProps={{ startAdornment: <InputAdornment position="start">📞</InputAdornment> }}
                                                error={!!errors.referencePhones[index]} helperText={errors.referencePhones[index]}
                                                sx={fieldStyle}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>

                                <Typography sx={{ width: '100%', textAlign: 'center', color: '#4CAF50', marginBottom: 2 }}>
                                    Please upload 3 recommendation letters in PDF format.
                                </Typography>
                                {/* <Grid container spacing={2} sx={{ marginTop: 2 }}>
                                    {formData.recommendationLetters.map((file, index) => (
                                        <Grid item xs={12} sm={6} key={index}>
                                            <label htmlFor={`file-upload-${index}`}>
                                                <Box component="span" sx={fileFieldStyle}>
                                                    <CloudUploadIcon sx={{ marginRight: 1 }} />
                                                    {file ? file.name : 'Choose file PDF'}
                                                </Box>
                                            </label>
                                            <input
                                                id={`file-upload-${index}`}
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => handleInputChange('recommendationLetters', index, e.target.files ? e.target.files[0] : null)}
                                                onBlur={() => validateField('recommendationLetters', file, index)}
                                                hidden
                                            />
                                            {errors.recommendationLetters[index] && (
                                                <Typography color="error" variant="body2">
                                                    {errors.recommendationLetters[index]}
                                                </Typography>
                                            )}
                                        </Grid>
                                    ))}
                                </Grid> */}

                                <Typography sx={{ width: '100%', textAlign: 'center', color: '#4CAF50', marginBottom: 2 }}>
                                    Optionally upload your organization's image (JPEG/PNG).
                                </Typography>
                                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                                    <Grid item xs={12} sm={6}>
                                        <label htmlFor="image-upload">
                                            <Box component="span" sx={fileFieldStyle}>
                                                <CloudUploadIcon sx={{ marginRight: 1 }} />
                                                {formData.image ? formData.image.name : 'Choose image image'}
                                            </Box>
                                        </label>
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/jpeg, image/png"
                                            onChange={(e) => handleInputChange('image', -1, e.target.files ? e.target.files[0] : null)}
                                            onBlur={() => validateField('image', formData.image)}
                                            hidden
                                        />
                                        {errors.image && (
                                            <Typography color="error" variant="body2">
                                                {errors.image}
                                            </Typography>
                                        )}
                                    </Grid>
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
    transition: 'all 0.3s ease',
    padding: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    height: '56px',
    textAlign: 'center',
    width: '100%',
};
const buttonStyle = { width: '100%', padding: 2, fontSize: 16, fontWeight: 'bold', color: '#fff', borderRadius: 3, backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#388E3C' } };

export default SignupO;
