import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
// import GoogleMaps from './GoogleMaps';
const VolunteerDetails: React.FC = () => {
    const selectedVolunteer = useSelector(
        (state: RootState) => state.volunteers.selectedVolunteer
    );
    
    if (!selectedVolunteer) {
        return <p className="error-message">לא נבחר מתנדב להצגה</p>;
    }

    const {
        name,
        email,
        phone,
        role,
        gender,
        birth,
        experience,
        region,
        volunteerRequests,
        volunteerReview,
    } = selectedVolunteer;



    const renderHearts = (likes: number) => {
        const hearts = [];
        for (let i = 0; i < 5; i++) {
            hearts.push(
                <span key={i} className={i < likes ? 'heart-filled' : 'heart-empty'}>❤</span>
            );
        }
        return hearts;
    };
    // const handleSelectedLocation = (location: { description: string; latitude: number; longitude: number }) => {
    //     console.log('Location selected:', location);
    //     console.log('Description:', location.description);
    //     console.log('Latitude:', location.latitude);
    //     console.log('Longitude:', location.longitude);
    //   };
      
    return (
        <>
                <style>
                    {`
                    .volunteer-details-container {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                        padding: 1rem;
                        font-family: Arial, sans-serif;
                    }

                    .volunteer-details-container h2 {
                        margin-bottom: 0.5rem;
                    }

                    .volunteer-details-container p,
                    .volunteer-details-container ul {
                        margin: 0;
                        padding: 0;
                        list-style: none;
                    }

                    .volunteer-details-container ul {
                        padding-left: 1.5rem;
                    }

                    .heart-filled {
                        color: red;
                    }

                    .heart-empty {
                        color: lightgray;
                    }
                `}
                </style>
                <div className="volunteer-details-container">
                    {/* פרטי המתנדב */}
                    <h2>פרטי מתנדב</h2>
                    <p>שם: {name}</p>
                    <p>אימייל: {email}</p>
                    <p>טלפון: {phone}</p>
                    <p>תפקיד: {role}</p>
                    <p>מין: {gender}</p>
                    <p>תאריך לידה: {birth}</p>
                    <p>ניסיון: {experience ? 'כן' : 'לא'}</p>
                    <p>אזור: {region}</p>

                    {/* בקשות התנדבות */}
                    <h2>בקשות התנדבות</h2>
                    {volunteerRequests && volunteerRequests.length > 0 ? (
                        <ul>
                            {volunteerRequests.map((request, index) => (
                                <li key={index}>
                                    <p>בקשה {index + 1}:</p>
                                    <p>תיאור: {request.comments}</p>
                                    <p>מיקום: {request.positionX}</p>
                                    <p>מיקום: {request.positionY}</p>
                                    <p>זמן פנוי: {request.availableTime}</p>
                                    <p>תאריך: {new Date(request.localDate).toLocaleDateString()}</p>
                                    <p>סוגי התנדבות: {request.volunteerTypes?.map((type) => type.name).join(', ') || 'לא זמין'}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>אין בקשות התנדבות</p>
                    )}

                    {/* תגובות */}
                    <h2>תגובות</h2>
                    {volunteerReview && volunteerReview.length > 0 ? (
                        <ul>
                            {volunteerReview.map((review) => (
                                <li key={review.reviewId}>
                                    <p>ארגון: {review.organization.name}</p>
                                    <p>תגובה: {review.comment}</p>
                                    <div>{renderHearts(review.likes)}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>אין תגובות</p>
                    )}
                </div>
            <div style={{ padding: '20px' }}>
      {/* <GoogleMaps 
        label="Enter a location" 
        func={handleSelectedLocation} 
      /> */}
    </div>

        </>
    );

};

export default VolunteerDetails;
