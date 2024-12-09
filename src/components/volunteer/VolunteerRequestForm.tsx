import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVolunteerTypes } from '../../features/volunteerTypeSlice';
import { RootState } from '../../store/store';
import { VolunteerRequests, VolunteerType } from '../../models/volunteers';
import { AppDispatch } from '../../store/store';
import axios from 'axios';

const VolunteerRequestForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const volunteerTypes = useSelector((state: RootState) => state.volunteerTypes.volunteerTypes);
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
        if (selectedVolunteer) {
            dispatch(fetchVolunteerTypes());
        }
    }, [dispatch, selectedVolunteer]);

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
            const response = await createVolunteerType(volunteerRequest);
            alert('הבקשה נשלחה בהצלחה!');
        } catch (error) {
            console.error('שגיאה בשליחת הבקשה:', error);
            alert('אירעה שגיאה. נסה שוב מאוחר יותר.');
        }
    };

    const createVolunteerType = async (volunteerRequest: VolunteerRequests): Promise<VolunteerRequests> => {
        const response = await axios.post('volunteerRequest/addVolunteerRequest', volunteerRequest);
        return response.data;
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Available Time</label>
                <select
                    value={availableTime}
                    onChange={(e) => {
                        setAvailableTime(e.target.value);
                        setErrors((prev) => ({ ...prev, availableTime: '' })); // Clear error
                    }}
                >
                    <option value="">בחר זמן פנוי</option>
                    <option value="MORNING">Morning</option>
                    <option value="AFTERNOON">Afternoon</option>
                    <option value="EVENING">Evening</option>
                    <option value="ALL">all</option>
                </select>
                {errors['availableTime'] && <p className="error">{errors['availableTime']}</p>}
            </div>

            <div>
                <label>בחר תאריך (היום ועד שבוע קדימה):</label>
                <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setErrors((prev) => ({ ...prev, selectedDate: '' }));
                    }}
                    min={minDate}
                    max={maxDate}
                />
                {errors['selectedDate'] && <p className="error">{errors['selectedDate']}</p>}
                {selectedDate && <p>התאריך שנבחר: {selectedDate}</p>}
            </div>

            <div>
                <label>בחר סוגי התנדבויות:</label>
                {filteredTypes.map((type) => (
                    <div key={type.volunteerTypeId}>
                        <input
                            type="checkbox"
                            id={`type-${type.volunteerTypeId}`}
                            onChange={() => handleCheckboxChange(type)}
                        />
                        <label htmlFor={`type-${type.volunteerTypeId}`}>
                            {type.name} (גיל: {type.minAge}-{type.maxAge})
                        </label>
                    </div>
                ))}
                {selectedTypes.length === 0 && <p>אם לא נבחרו סוגים, כל הסוגים יישלחו.</p>}
            </div>

            <div>
                <label>הערות:</label>
                <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                />
            </div>

            <button type="submit">שלח בקשה</button>
        </form>
    );
};

export default VolunteerRequestForm;
