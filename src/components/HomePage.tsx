import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { Accordion, AccordionSummary, AccordionDetails, Button, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const selectedVolunteer = useSelector((state: RootState) => state.volunteers.selectedVolunteer);
    const selectedOrganization = useSelector((state: RootState) => state.organization.selectedOrganization);

    useEffect(() => {
        if (selectedVolunteer) navigate('/volunteer');
    }, [selectedVolunteer, navigate]);

    useEffect(() => {
        if (selectedOrganization) navigate('/organization');
    }, [navigate, selectedOrganization]);

    const quotes = [
        { id: 0, text: 'הרבי מפיאשצנה', quote: 'הדבר הכי גדול בעולם זה לעשות טובה למשהו אחר' },
        { id: 1, text: 'רבי משה מקוברין', quote: 'יום שאיני עושה בו טובה ליהודי אינו נחשב בעיני ליום' },
        { id: 2, text: 'הרב דסלר', quote: 'נתינה מולידה אהבה' },
        { id: 3, text: 'רבי ישראל סלנטר', quote: 'הגשמיות של השני זה העולם הבא שלי' },
        { id: 4, text: 'הבעל שם טוב', quote: 'אדם חי שבעים שנה ולו כדאי שיטייב ליהודי פעם אחת בלבד' }
    ];

    const [currentQuote, setCurrentQuote] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % quotes.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        // <Box>
        //     {/* כפתורי הכניסה */}
        //     <Box sx={{ position: 'fixed', top: 10, left: 10, zIndex: 10 }}>
        //         <Button variant="contained" color="primary" onClick={() => navigate('/login')} sx={{ m: 1 }}>
        //             Login
        //         </Button>
        //         <Button variant="contained" color="secondary" onClick={() => navigate('/signup')} sx={{ m: 1 }}>
        //             Sign Up
        //         </Button>
        //     </Box>

        //     {/* הלוגו בצד ימין למעלה */}
        //     <Box sx={{ position: 'fixed', top: 10, right: 10, zIndex: 10 }}>
        //         <img src="src\assets\images\logo.png" alt="Logo" style={{ height: 130 }} />
        //     </Box>

        //     {/* סרטון מלא מסך */}
        //     <video
        //         autoPlay
        //         loop
        //         muted
        //         playsInline
        //         src="src/assets/images/Why be a Volunteer.mp4"
        //         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        //     />

        //     {/* ציטוטים מתחלפים */}
        //     <Box
        //         sx={{
        //             mt: 10,
        //             position: 'relative',
        //             padding: 4,
        //             maxWidth: '700px',
        //             margin: 'auto',
        //             background: 'rgba(255, 255, 255, 0.9)',
        //             borderRadius: 4,
        //             boxShadow: 4,
        //             textAlign: 'center',
        //             lineHeight: 1.6
        //         }}
        //     >
        //         <Typography variant="h2" fontWeight="bold" sx={{ fontSize: '64px', color: '#555' }}>
        //             &ldquo;
        //         </Typography>
        //         <Typography sx={{ mt: 2, fontSize: '24px', fontWeight: 600 }}>
        //             {quotes[currentQuote].quote}
        //         </Typography>

        //         <Typography sx={{ mt: 1, fontSize: '20px', fontWeight: 500, color: '#444' }}>
        //             {quotes[currentQuote].text}
        //         </Typography>
        //     </Box>

        //     {/* Accordion של שאלות ותשובות */}
        //     <Box sx={{ mt: 2, padding: 40 }}>
        //         {Array.from({ length: 5 }).map((_, idx) => (
        //             <Accordion key={idx} sx={{ bgcolor: 'rgba(255,255,255,0.95)', mt: 1 }}>
        //                 <AccordionSummary
        //                     expandIcon={<ExpandMoreIcon />}
        //                     sx={{
        //                         backgroundColor: '#f0f4f8',
        //                         fontWeight: 'bold',
        //                         padding: '20px',
        //                     }}
        //                 >
        //                     <Typography>שאלה {idx + 1}</Typography>
        //                 </AccordionSummary>
        //                 <AccordionDetails sx={{ padding: '20px' }}>
        //                     <Typography sx={{ fontSize: 18 }}>
        //                         תשובה מסודרת ומלאה על האתר והתנדבות. ניתן להרחיב מידע מלא על כל תהליך עבודה.
        //                     </Typography>
        //                 </AccordionDetails>
        //             </Accordion>
        //         ))}
        //     </Box>


        //     {/* Footer */}
        //     <Box sx={{ bgcolor: 'black', color: 'white', p: 2, mt: 5, textAlign: 'center' }}>
        //         <Typography>© כל הזכויות שמורות - אתר התנדבות 2024</Typography>
        //     </Box>
        // </Box>
        <Box>

            {/* כפתורי הכניסה */}
            <Box sx={{ position: 'fixed', top: 10, left: 10, zIndex: 10 }}>
                <Button variant="contained" color="primary" onClick={() => navigate('/login')} sx={{ m: 1 }}>
                    Login
                </Button>
                <Button variant="contained" color="secondary" onClick={() => navigate('/signup')} sx={{ m: 1 }}>
                    Sign Up
                </Button>
            </Box>

            {/* הלוגו בצד ימין למעלה */}
            <Box sx={{ position: 'fixed', top: 10, right: 10, zIndex: 10 }}>
                <img src="src/assets/images/logo.png" alt="Logo" style={{ height: 130 }} />
            </Box>

            {/* סרטון מלא מסך */}
            <video
                autoPlay
                loop
                muted
                playsInline
                src="src/assets/images/Why be a Volunteer.mp4"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box sx={{ mt: 10 }} />

            {/* ציטוטים מתחלפים */}
            <Box
                sx={{
                    mt: 5,
                    position: 'relative',
                    padding: 4,
                    maxWidth: '60%',
                    margin: 'auto',
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 4,
                    boxShadow: 4,
                    textAlign: 'center',
                    lineHeight: 1.6
                }}
            >
                <Typography
                    variant="h1"
                    fontWeight="bold"
                    sx={{ fontSize: '150px', color: '#555', fontFamily: '"Times New Roman", Times, serif' }}
                >
                    &ldquo;
                </Typography>

                <Typography sx={{ fontSize: '24px', fontWeight: 600, fontStyle: 'italic' }}>
                    {quotes[currentQuote].quote}
                </Typography>

                <Typography sx={{ mt: 1, fontSize: '20px', fontWeight: 500, color: '#444' }}>
                    {quotes[currentQuote].text}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                    {quotes.map((_, index) => (
                        <span
                            key={index}
                            className={`quote-dot ${index === currentQuote ? 'active' : ''}`}
                            style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                margin: '0 5px',
                                backgroundColor: index === currentQuote ? '#1976D2' : '#B0BEC5',
                                display: 'inline-block'
                            }}
                        />
                    ))}
                </Box>
            </Box>
            <Box sx={{ mt: 5 }} />

            {/* Accordion של שאלות ותשובות */}
            <Box sx={{ mt: 2, paddingLeft: '20%', paddingRight: '20%', paddingTop: 5, paddingBottom: 5 }}>
                {[
                    {
                        question: 'איך אני יכול להירשם כמתנדב?',
                        answer: 'כדי להירשם כמתנדב, יש ללחוץ על כפתור "Sign Up", למלא את הטפסים ולספק מידע בסיסי כמו שם, גיל, אזור מגורים ותחומי עניין.'
                    },
                    {
                        question: 'מה זה תפקידי מתנדבות לפי תחומי עניין?',
                        answer: 'האתר מאפשר לתאם מתנדבים לפי תחומי עניין, כגון חינוך, בריאות, רפואה, פעילויות חברתיות ועוד.'
                    },
                    {
                        question: 'איך ניתן לתאם פעילויות עם ארגון מסוים?',
                        answer: 'ארגון יכול ליצור בקשות ספציפיות ולהתאים מתנדבים בהתאם לתאריכים ולתחומי העניין של המתנדבים.'
                    },
                    {
                        question: 'מה התהליך של קבלת משוב אחרי התנדבות?',
                        answer: 'לאחר כל התנדבות, ניתן לספק משוב על חווית העבודה והתקשורת. זה עוזר לשפר את תהליכי ההתנדבות והפידבק לכל הצדדים.'
                    },
                    {
                        question: 'מה לעשות אם יש בעיות או שאלות נוספות?',
                        answer: 'ניתן ליצור קשר עם התמיכה של האתר דרך הכפתור המתאים בממשק או לשלוח הודעה ישירות לארגון.'
                    }
                ].map((item, idx) => (
                    <Accordion key={idx} sx={{ bgcolor: 'rgba(255,255,255,0.95)', mt: 2 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                backgroundColor: '#f0f4f8',
                                fontWeight: 'bold',
                                padding: '20px',
                                fontSize: '18px',
                            }}
                        >
                            <Typography>{item.question}</Typography>
                        </AccordionSummary>

                        <AccordionDetails sx={{ padding: '20px' }}>
                            <Typography sx={{ fontSize: 18 }}>
                                {item.answer}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>


            {/* Footer */}
            <Box sx={{ bgcolor: 'black', color: 'white', p: 2, mt: 5, textAlign: 'center' }}>
                <Typography>© כל הזכויות שמורות - אתר התנדבות 2024</Typography>
            </Box>
        </Box>

    );
};

export default HomePage;
