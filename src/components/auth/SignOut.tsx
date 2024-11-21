import React from 'react';
import { useDispatch } from 'react-redux';
import { removeUserCookie } from '../../services/cookieService';
import { saveVolunteerData } from '../../features/volunteerSlice'

const SignOut: React.FC = () => {
    const dispatch = useDispatch();

    const handleSignOut = () => {
        // הסרת המשתמש מ-Cookies
        removeUserCookie();

        // איפוס המצב ב-Redux
        dispatch(saveVolunteerData(undefined));

        window.location.href = '/';
    };

    return (
        <button onClick={handleSignOut} style={{ padding: '10px', fontSize: '16px' }}>
            Sign Out
        </button>
    );
};

export default SignOut;
