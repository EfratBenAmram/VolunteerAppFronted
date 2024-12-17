import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVolunteerTypes } from '../../redux/volunteerTypeSlice';
import { RootState } from '../../store/store';
import { VolunteerRequests, VolunteerType } from '../../models/volunteers';
import { AppDispatch } from '../../store/store';
import axios from 'axios';
import { fetchVolunteerById } from '../../redux/volunteerSlice';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography, Paper } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';

const VolunteerRequestForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { volunteerTypes, status } = useSelector((state: RootState) => state.volunteerTypes);
    const selectedVolunteer = useSelector((state: RootState) => state.volunteers.selectedVolunteer);
    const [selectedTypes, setSelectedTypes] = useState<VolunteerType[]>([]);
    const [availableTime, setAvailableTime] = useState<string>('');
    const [comments, setComments] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const calculateAge = (birthDate: string) => {
        const birthYear = new Date(birthDate).getFullYear();
        const currentYear = new Date().getFullYear();
        return currentYear - birthYear;
    };

    const volunteerAge = selectedVolunteer?.birth ? calculateAge(selectedVolunteer?.birth) : 0;
    const [minDate, setMinDate] = useState<string>('');
    const [maxDate, setMaxDate] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const today = new Date();
        const weekLater = new Date(today);
        weekLater.setDate(today.getDate() + 7);
        const formatDate = (date: Date): string =>
            date.toISOString().split('T')[0];

        setMinDate(formatDate(today));
        setMaxDate(formatDate(weekLater));
    }, []);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchVolunteerTypes());
        }
    }, [dispatch, status]);

    const filteredTypes = volunteerTypes.filter(
        (type) => type.minAge <= volunteerAge && type.maxAge >= volunteerAge
    );

    const handleCheckboxChange = (type: VolunteerType) => {
        setSelectedTypes((prevSelectedTypes) =>
            prevSelectedTypes.includes(type)
                ? prevSelectedTypes.filter((t) => t.volunteerTypeId !== type.volunteerTypeId)
                : [...prevSelectedTypes, type]
        );
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!availableTime) newErrors['availableTime'] = 'נא לבחור זמן פנוי';
        if (!selectedDate) newErrors['selectedDate'] = 'נא לבחור תאריך';
        return newErrors;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const typesToSubmit =
            selectedTypes.length > 0 ? selectedTypes : filteredTypes;

        const volunteerRequest: VolunteerRequests = {
            requestId: 0,
            volunteer: {
                volunteerId: selectedVolunteer?.volunteerId || 0,
            },
            comments: comments,
            availableTime: availableTime,
            availableDate: selectedDate,
            localDate: new Date().toISOString().split('T')[0],
            volunteerTypes: typesToSubmit.map((type) => ({
                volunteerTypeId: type.volunteerTypeId,
            })),
            positionX: 0,
            positionY: 0,
        };

        try {
            await createVolunteerType(volunteerRequest);
            dispatch(fetchVolunteerById(selectedVolunteer.volunteerId));
            navigate('/volunteer/finish-request');
        } catch (error) {
            console.error('שגיאה בשליחת הבקשה:', error);
            alert('אירעה שגיאה. נסה שוב מאוחר יותר.');
        }
    };
    const axiosInstance = axios.create({
        withCredentials: true,
    });
    const createVolunteerType = async (volunteerRequest: VolunteerRequests): Promise<VolunteerRequests> => {
        const response = await axiosInstance.post('volunteerRequest/addVolunteerRequest', volunteerRequest);
        return response.data;
    };
    return (
        <>
            <Paper
                elevation={4}
                sx={{
                    padding: 4,
                    maxWidth: 1137,
                    margin: "20px auto",
                    borderRadius: "16px",
                    backgroundColor: "#f9f9f9",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{ textAlign: 'center', color: '#00d1b2', fontWeight: 'bold' }}
                >
                    שלח בקשת התנדבות
                </Typography>
                {filteredTypes.length > 0 ? (
                    <form onSubmit={handleSubmit}>
                        <FormControl
                            fullWidth
                            margin="normal"
                            error={!!errors["availableTime"]}
                        >
                            <InputLabel>בחר זמן פנוי</InputLabel>
                            <Select
                                value={availableTime}
                                onChange={(e) => {
                                    setAvailableTime(e.target.value);
                                    setErrors((prev) => ({ ...prev, availableTime: "" }));
                                }}
                            >
                                <MenuItem value="">
                                    <em>בחר זמן פנוי</em>
                                </MenuItem>
                                <MenuItem value="MORNING">בבוקר</MenuItem>
                                <MenuItem value="AFTERNOON">אחר הצהריים</MenuItem>
                                <MenuItem value="EVENING">בערב</MenuItem>
                                <MenuItem value="ALL">כל הזמן</MenuItem>
                            </Select>
                            {errors["availableTime"] && (
                                <FormHelperText>{errors["availableTime"]}</FormHelperText>
                            )}
                        </FormControl>

                        <TextField
                            fullWidth
                            margin="normal"
                            label="בחר תאריך"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setErrors((prev) => ({ ...prev, selectedDate: "" }));
                            }}
                            inputProps={{ min: minDate, max: maxDate }}
                            error={!!errors["selectedDate"]}
                            helperText={errors["selectedDate"]}
                            sx={{
                                "& .MuiInputBase-input": {
                                    textAlign: "center",
                                },
                            }}
                        />

                        <Typography variant="h6" component="h2" gutterBottom>
                            בחר סוגי התנדבויות:
                        </Typography>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                            {filteredTypes.map((type) => (
                                <FormControlLabel
                                    key={type.volunteerTypeId}
                                    control={
                                        <Checkbox
                                            onChange={() => handleCheckboxChange(type)}
                                        />
                                    }
                                    label={type.name}
                                    sx={{
                                        "& .MuiTypography-root": {
                                            fontSize: "1rem",
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                        {selectedTypes.length === 0 && filteredTypes.length > 0 && (
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ mt: 1, fontStyle: "italic" }}
                            >
                                אם לא נבחרו סוגים, כל הסוגים יישלחו.
                            </Typography>
                        )}

                        <TextField
                            fullWidth
                            margin="normal"
                            label="הערות"
                            multiline
                            rows={4}
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            sx={{
                                "& .MuiInputBase-root": {
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                },
                            }}
                        />

                        <Box textAlign="center" mt={3}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#333',
                                    },
                                }}
                            >
                                שלח בקשה
                            </Button>
                        </Box>

                    </form>
                ) : (
                    <Typography variant="h6" color="error" align="center">
                        אין התנדבות שמתאימה לגיל שלך ולכן אינך יכול להתנדב בשלב זה.
                    </Typography>
                )}
            </Paper>
        </>
    );

};

export default VolunteerRequestForm;
