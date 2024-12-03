import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

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
                <p><strong>שם:</strong> {name}</p>
                <p><strong>אימייל:</strong> {email}</p>
                <p><strong>טלפון:</strong> {phone}</p>
                <p><strong>תפקיד:</strong> {role}</p>
                <p><strong>מין:</strong> {gender}</p>
                <p><strong>תאריך לידה:</strong> {birth}</p>
                <p><strong>ניסיון:</strong> {experience ? 'כן' : 'לא'}</p>
                <p><strong>אזור:</strong> {region}</p>

                {/* בקשות התנדבות */}
                <h2>בקשות התנדבות</h2>
                {volunteerRequests && volunteerRequests.length > 0 ? (
                    <ul>
                        {volunteerRequests.map((request, index) => (
                            <li key={index}>
                                <strong>בקשה {index + 1}:</strong>
                                <p><strong>תיאור:</strong> {request.comments}</p>
                                <p><strong>זמן פנוי:</strong> {request.availableTime}</p>
                                <p><strong>תאריך:</strong> {new Date(request.localDate).toLocaleDateString()}</p>
                                <p><strong>סוגי התנדבות:</strong> {request.volunteerTypes?.map((type) => type.name).join(', ') || 'לא זמין'}</p>
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
                                <p><strong>ארגון:</strong> {review.organization.name}</p>
                                <p><strong>תגובה:</strong> {review.comment}</p>
                                <div>{renderHearts(review.likes)}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>אין תגובות</p>
                )}
                
            </div>
        </>
    );
};

export default VolunteerDetails;
