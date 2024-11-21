import React from 'react';
import { Link } from 'react-router-dom';
import SignOut from './auth/SignOut';
import Cookies from 'js-cookie';

const HomePage: React.FC = () => {
    const role = Cookies.get('role');
    return (
        <>
            <div>
                {role ? (
                    <SignOut />
                ) : (
                    <p>Please log in to see your details.</p>
                )}
            </div>
            <div>
                <Link to="/login">
                    <button>Login</button>
                </Link>
                <Link to="/signup">
                    <button>Sign Up</button>
                </Link>
            </div>
        </>
    );
};

export default HomePage;
