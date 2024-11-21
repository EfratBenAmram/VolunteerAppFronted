import React, { useState, useEffect } from 'react';
import '../../assets/styles/AuthForm.css';
import image1 from '../../assets/images/image1.jpg';
import image2 from '../../assets/images/image2.jpg';
import image3 from '../../assets/images/image3.jpg';
import image4 from '../../assets/images/image4.jpg';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { Link } from 'react-router-dom';

const images = [
    { src: image1, quote: 'Volunteering is the best way to give back' },
    { src: image2, quote: 'Help others, help yourself' },
    { src: image3, quote: 'Together, we make a difference' },
    { src: image4, quote: 'Be the change you want to see' },
];

interface AuthProps {
    isLogin: boolean; 
}

const AuthForms: React.FC<AuthProps> = ({ isLogin }) => {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 7000); 
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="background-wrapper" style={{ backgroundImage: `url(${images[currentImage].src})` }}>
            <div className="overlay-card">
                <div className="left-panel">
                    {isLogin ? <LoginForm /> : <SignupForm />}
                </div>
                <div className="right-panel">
                    <div className="background-images">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className={`background-image ${index === currentImage ? 'active' : ''}`}
                                style={{ backgroundImage: `url(${image.src})` }}
                            />
                        ))}
                    </div>
                    <div className="quote-container">
                        <p className="quote-text">{images[currentImage].quote}</p>

                        <div className="quote-dots">
                            {images.map((_, index) => (
                                <span key={index} className={`quote-dot ${index === currentImage ? 'active' : ''}`} />
                            ))}
                        </div>

                    </div>
                    <div className="auth-switch">
                        {isLogin ? (
                            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                        ) : (
                            <p>Already have an account? <Link to="/login">Login</Link></p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForms;
